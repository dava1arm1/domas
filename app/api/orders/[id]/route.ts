export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/orders/[id] — обновить статус заказа
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, teamNote } = body;

    // Найти заказ
    const order = await db.order.findUnique({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    // Обычный пользователь может менять только свои заказы
    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const updated = await db.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(status === "DONE" && { completedAt: new Date() }),
        // teamNote видит только ADMIN
        ...(teamNote && session.user.role === "ADMIN" && { teamNote }),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[ORDER PATCH]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
