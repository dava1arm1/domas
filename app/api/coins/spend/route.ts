export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const body = await req.json();
    const { orderId, coinsToSpend, orderTotal } = body as {
      orderId: string;
      coinsToSpend: number;
      orderTotal: number;
    };

    if (!orderId || !coinsToSpend || !orderTotal) {
      return NextResponse.json({ error: "Недостаточно данных" }, { status: 400 });
    }

    if (coinsToSpend <= 0) {
      return NextResponse.json(
        { error: "Количество монет должно быть больше нуля" },
        { status: 400 }
      );
    }

    // Validate max 30% of order total
    const maxAllowed = Math.floor(orderTotal * 0.3);
    if (coinsToSpend > maxAllowed) {
      return NextResponse.json(
        { error: `Нельзя использовать больше 30% от суммы заказа (максимум ${maxAllowed} монет)` },
        { status: 400 }
      );
    }

    // Verify user has enough balance
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { coinBalance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    if (coinsToSpend > user.coinBalance) {
      return NextResponse.json(
        { error: `Недостаточно монет. Баланс: ${user.coinBalance}` },
        { status: 400 }
      );
    }

    // Create spend transaction (negative amount)
    await db.coinTransaction.create({
      data: {
        userId: session.user.id,
        amount: -coinsToSpend,
        type: "SPENT_DISCOUNT",
        description: "Оплата монетами",
        orderId,
      },
    });

    // Deduct from balance
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { coinBalance: { decrement: coinsToSpend } },
      select: { coinBalance: true },
    });

    return NextResponse.json({
      spent: coinsToSpend,
      newBalance: updatedUser.coinBalance,
      discount: coinsToSpend,
    });
  } catch (error) {
    console.error("[COINS_SPEND]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
