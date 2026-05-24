export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/subscriptions — текущая подписка
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const subscription = await db.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ["ACTIVE", "PAUSED"] },
    },
  });

  return NextResponse.json({ data: subscription });
}

// POST /api/subscriptions — создать или сменить подписку
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { plan, action } = await req.json();

    const planPrices: Record<string, number> = {
      BASIC: 1490,
      COMFORT: 3490,
      MAX: 5990,
    };

    if (action === "cancel") {
      // Отмена подписки
      await db.subscription.updateMany({
        where: { userId: session.user.id, status: "ACTIVE" },
        data: { status: "CANCELLED", endDate: new Date() },
      });
      return NextResponse.json({ message: "Подписка отменена" });
    }

    if (action === "pause") {
      // Приостановка
      await db.subscription.updateMany({
        where: { userId: session.user.id, status: "ACTIVE" },
        data: { status: "PAUSED" },
      });
      return NextResponse.json({ message: "Подписка приостановлена" });
    }

    if (action === "resume") {
      // Возобновление
      await db.subscription.updateMany({
        where: { userId: session.user.id, status: "PAUSED" },
        data: { status: "ACTIVE" },
      });
      return NextResponse.json({ message: "Подписка возобновлена" });
    }

    // Смена тарифа
    if (!plan || !planPrices[plan]) {
      return NextResponse.json({ error: "Некорректный тариф" }, { status: 400 });
    }

    await db.subscription.updateMany({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "PAUSED"] } },
      data: { status: "CANCELLED", endDate: new Date() },
    });

    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        plan,
        status: "ACTIVE",
        price: planPrices[plan],
      },
    });

    return NextResponse.json({ data: subscription }, { status: 201 });
  } catch (error) {
    console.error("[SUBSCRIPTION POST]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
