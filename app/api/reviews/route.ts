export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validations";

// POST /api/reviews — оставить отзыв на заказ
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      );
    }

    const { orderId, rating, comment } = result.data;

    // Проверяем, что заказ принадлежит пользователю и завершён
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }
    if (order.status !== "DONE") {
      return NextResponse.json(
        { error: "Можно оценивать только выполненные заказы" },
        { status: 400 }
      );
    }

    // Создаём или обновляем отзыв (upsert)
    const review = await db.review.upsert({
      where: { orderId },
      create: {
        userId: session.user.id,
        orderId,
        rating,
        comment: comment ?? null,
      },
      update: { rating, comment: comment ?? null },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    console.error("[REVIEWS POST]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

// GET /api/reviews — публичные отзывы для главной страницы
export async function GET() {
  const reviews = await db.review.findMany({
    where: { rating: { gte: 4 } },
    include: {
      user: { select: { name: true } },
      order: { select: { serviceType: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return NextResponse.json({ data: reviews });
}
