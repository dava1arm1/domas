export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

async function notify(userId: string, title: string, message: string, type: string, orderId?: string) {
  await db.notification.create({
    data: { userId, title, message, type: type as any, orderId: orderId ?? null },
  });
}

// PATCH /api/admin/orders/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id } = params;

  const order = await db.order.findUnique({ where: { id }, include: { user: true } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ── Accept order ──────────────────────────────────────────
  if (body.action === "accept") {
    const updated = await db.order.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        confirmedDate: body.confirmedDate ? new Date(body.confirmedDate) : undefined,
        confirmedTimeSlot: body.confirmedTimeSlot ?? null,
        confirmedPrice: body.confirmedPrice ?? null,
        adminNote: body.adminNote ?? null,
        teamNote: body.internalNote ?? null,
      },
    });

    const priceStr = body.confirmedPrice
      ? `${Number(body.confirmedPrice).toLocaleString("ru-RU")} ₽`
      : "уточняется";
    const dateStr = body.confirmedDate
      ? new Date(body.confirmedDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
      : "";
    await notify(
      order.userId,
      `Заказ ${order.orderNumber ?? "#" + id.slice(-4).toUpperCase()} подтверждён ✓`,
      `${dateStr}${body.confirmedTimeSlot ? " · " + body.confirmedTimeSlot : ""} · ${priceStr}`,
      "ORDER_ACCEPTED",
      id
    );

    try {
      await db.activityLog.create({
        data: { adminId: session.user.id, action: "ACCEPT_ORDER", target: id, detail: `Принят, цена: ${priceStr}` },
      });
    } catch { /* non-critical */ }

    return NextResponse.json({ order: updated });
  }

  // ── Reject order ──────────────────────────────────────────
  if (body.action === "reject") {
    const updated = await db.order.update({
      where: { id },
      data: { status: "CANCELLED", adminNote: body.reason ?? null },
    });

    await notify(
      order.userId,
      `Заказ ${order.orderNumber ?? "#" + id.slice(-4).toUpperCase()} отклонён`,
      body.reason ?? "Свяжитесь с нами для уточнения деталей",
      "ORDER_CANCELLED",
      id
    );

    return NextResponse.json({ order: updated });
  }

  // ── Generic update ────────────────────────────────────────
  const data: Record<string, unknown> = {};
  if (body.status)    data.status   = body.status;
  if (body.teamNote  !== undefined) data.teamNote  = body.teamNote;
  if (body.price     !== undefined) data.price     = Number(body.price);
  if (body.adminNote !== undefined) data.adminNote = body.adminNote;
  if (body.scheduledAt) data.scheduledAt = new Date(body.scheduledAt);
  if (body.status === "COMPLETED" || body.status === "DONE") data.completedAt = new Date();

  const updated = await db.order.update({ where: { id }, data, include: { user: { select: { id: true, name: true, email: true } }, address: true } });

  // Status-change notifications
  if (body.status && body.status !== order.status) {
    const msgs: Record<string, { title: string; message: string; type: string }> = {
      IN_PROGRESS: {
        title: `Заказ ${order.orderNumber ?? ""} выполняется`,
        message: "Наша команда уже работает над вашим заказом",
        type: "ORDER_IN_PROGRESS",
      },
      COMPLETED: {
        title: `Заказ ${order.orderNumber ?? ""} выполнен! 🌟`,
        message: "Оцените качество работы — ваш отзыв очень важен для нас",
        type: "ORDER_COMPLETED",
      },
      CANCELLED: {
        title: `Заказ ${order.orderNumber ?? ""} отменён`,
        message: body.adminNote ?? "Свяжитесь с нами для уточнения",
        type: "ORDER_CANCELLED",
      },
    };
    if (msgs[body.status]) {
      const { title, message, type } = msgs[body.status];
      await notify(order.userId, title, message, type, id);
    }
  }

  try {
    await db.activityLog.create({
      data: { adminId: session.user.id, action: "UPDATE_ORDER", target: id, detail: body.status ? `Статус → ${body.status}` : "Обновлён" },
    });
  } catch { /* non-critical */ }

  return NextResponse.json(updated);
}

// GET /api/admin/orders/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, email: true, phone: true } }, address: true, payments: true, review: true },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
