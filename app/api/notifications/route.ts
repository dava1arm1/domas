export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/notifications — last 20 notifications for current user
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ]);

  return NextResponse.json({ data: notifications, unreadCount });
}

// PATCH /api/notifications — mark as read
// body: { all: true } or { ids: string[] }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();

  if (body.all) {
    await db.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
  } else if (Array.isArray(body.ids) && body.ids.length > 0) {
    await db.notification.updateMany({
      where: { userId: session.user.id, id: { in: body.ids } },
      data: { read: true },
    });
  }

  return NextResponse.json({ ok: true });
}
