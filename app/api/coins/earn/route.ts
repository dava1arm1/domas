export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const INTERNAL_SECRET = process.env.INTERNAL_SECRET ?? "domas-internal";

export async function POST(req: NextRequest) {
  try {
    // Validate internal secret header
    const secret = req.headers.get("x-internal-secret");
    if (secret !== INTERNAL_SECRET) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, orderId, orderTotal, type } = body as {
      userId: string;
      orderId: string;
      orderTotal: number;
      type: "order" | "review" | "welcome" | "referral";
    };

    if (!userId || !type) {
      return NextResponse.json({ error: "Недостаточно данных" }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    let amount: number;
    let description: string;
    let coinType: "EARNED_ORDER" | "EARNED_REVIEW" | "EARNED_REFERRAL" | "EARNED_WELCOME";

    switch (type) {
      case "order":
        if (!orderTotal || orderTotal <= 0) {
          return NextResponse.json({ error: "Некорректная сумма заказа" }, { status: 400 });
        }
        amount = Math.floor(orderTotal * 0.05);
        description = "Кэшбэк 5% за заказ";
        coinType = "EARNED_ORDER";
        break;
      case "welcome":
        amount = 500;
        description = "Приветственный бонус за первый заказ";
        coinType = "EARNED_WELCOME";
        break;
      case "review":
        amount = 100;
        description = "Бонус за отзыв";
        coinType = "EARNED_REVIEW";
        break;
      case "referral":
        amount = 1000;
        description = "Реферальный бонус";
        coinType = "EARNED_REFERRAL";
        break;
      default:
        return NextResponse.json({ error: "Неверный тип начисления" }, { status: 400 });
    }

    // Create the primary transaction and update balance
    await db.coinTransaction.create({
      data: {
        userId,
        amount,
        type: coinType,
        description,
        orderId: orderId || null,
        expiresAt,
      },
    });

    await db.user.update({
      where: { id: userId },
      data: { coinBalance: { increment: amount } },
    });

    let totalCredited = amount;

    // For order type: check if this is the user's first completed order and grant welcome bonus
    if (type === "order") {
      const completedOrderCount = await db.order.count({
        where: { userId, status: "DONE" },
      });

      if (completedOrderCount === 1) {
        const welcomeAmount = 500;
        const welcomeExpiresAt = new Date();
        welcomeExpiresAt.setFullYear(welcomeExpiresAt.getFullYear() + 1);

        await db.coinTransaction.create({
          data: {
            userId,
            amount: welcomeAmount,
            type: "EARNED_WELCOME",
            description: "Приветственный бонус за первый заказ",
            orderId: orderId || null,
            expiresAt: welcomeExpiresAt,
          },
        });

        await db.user.update({
          where: { id: userId },
          data: { coinBalance: { increment: welcomeAmount } },
        });

        totalCredited += welcomeAmount;
      }
    }

    // Fetch updated balance
    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      select: { coinBalance: true },
    });

    return NextResponse.json({
      credited: totalCredited,
      newBalance: updatedUser?.coinBalance ?? 0,
    });
  } catch (error) {
    console.error("[COINS_EARN]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
