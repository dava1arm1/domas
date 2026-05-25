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
    const body = await req.json();
    const { plan, action, address, city, landmark } = body;

    const planPrices: Record<string, number> = {
      BASIC: 1490,
      COMFORT: 3490,
      MAX: 5990,
    };

    if (action === "cancel") {
      await db.subscription.updateMany({
        where: { userId: session.user.id, status: "ACTIVE" },
        data: { status: "CANCELLED", endDate: new Date() },
      });
      return NextResponse.json({ message: "Подписка отменена" });
    }

    if (action === "pause") {
      await db.subscription.updateMany({
        where: { userId: session.user.id, status: "ACTIVE" },
        data: { status: "PAUSED" },
      });
      return NextResponse.json({ message: "Подписка приостановлена" });
    }

    if (action === "resume") {
      await db.subscription.updateMany({
        where: { userId: session.user.id, status: "PAUSED" },
        data: { status: "ACTIVE" },
      });
      return NextResponse.json({ message: "Подписка возобновлена" });
    }

    // Создание / смена тарифа
    if (!plan || !planPrices[plan]) {
      return NextResponse.json({ error: "Некорректный тариф" }, { status: 400 });
    }

    // Отменяем текущую активную подписку
    await db.subscription.updateMany({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "PAUSED"] } },
      data: { status: "CANCELLED", endDate: new Date() },
    });

    // Создаём новую подписку
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        plan,
        status: "ACTIVE",
        price: planPrices[plan],
      },
    });

    // Если передан адрес — сохраняем как основной
    if (address?.trim()) {
      // Снимаем флаг isDefault со всех существующих адресов
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
      // Создаём новый основной адрес
      await db.address.create({
        data: {
          userId: session.user.id,
          label: "Дом",
          address: address.trim(),
          city: city?.trim() ?? null,
          landmark: landmark?.trim() ?? null,
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ data: subscription }, { status: 201 });
  } catch (error) {
    console.error("[SUBSCRIPTION POST]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
