import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// PATCH /api/admin/orders/[id] — update status, teamNote, or scheduledAt
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { status, teamNote, scheduledAt, price } = body;

  const data: Record<string, unknown> = {};
  if (status)      data.status      = status;
  if (teamNote !== undefined) data.teamNote = teamNote;
  if (scheduledAt) data.scheduledAt = new Date(scheduledAt);
  if (price !== undefined) data.price = Number(price);
  if (status === "DONE") data.completedAt = new Date();

  const order = await db.order.update({
    where: { id: params.id },
    data,
    include: {
      user:    { select: { id: true, name: true, email: true } },
      address: true,
    },
  });

  // Log
  try {
    await db.activityLog.create({
      data: {
        adminId: session.user.id,
        action:  "UPDATE_ORDER",
        target:  params.id,
        detail:  status ? `Статус → ${status}` : "Обновлён",
      },
    });
  } catch { /* non-critical */ }

  return NextResponse.json(order);
}

// GET /api/admin/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user:     { select: { id: true, name: true, email: true, phone: true } },
      address:  true,
      payments: true,
      review:   true,
    },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
