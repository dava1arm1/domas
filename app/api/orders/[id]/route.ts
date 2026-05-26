export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/orders/[id] — client cancels their own PENDING order
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const order = await db.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });

  if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  // Clients can only cancel PENDING orders
  if (session.user.role !== "ADMIN" && order.status !== "PENDING" && order.status !== "NEW") {
    return NextResponse.json({ error: "Можно отменить только заявку в статусе «В обработке»" }, { status: 400 });
  }

  const updated = await db.order.update({
    where: { id: params.id },
    data: {
      status: body.status ?? "CANCELLED",
      ...(body.status === "COMPLETED" && { completedAt: new Date() }),
      ...(body.teamNote && session.user.role === "ADMIN" && { teamNote: body.teamNote }),
    },
  });

  // Notify admin when client cancels
  if (body.status === "CANCELLED" || !body.status) {
    const adminUsers = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    for (const admin of adminUsers) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: `Клиент отменил заявку ${order.orderNumber ?? "#" + params.id.slice(-4).toUpperCase()}`,
          message: `Услуга: заказ отменён клиентом`,
          type: "ORDER_CANCELLED",
          orderId: params.id,
        },
      });
    }
  }

  return NextResponse.json({ data: updated });
}

// GET /api/orders/[id] — get own order detail
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { address: true, review: true },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  return NextResponse.json({ data: order });
}
