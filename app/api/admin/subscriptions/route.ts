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

// GET /api/admin/subscriptions?status=ACTIVE&plan=&page=1&limit=50
export async function GET(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const plan   = searchParams.get("plan")   || "";
  const page   = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") || "50"));

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;
  if (plan   && plan   !== "ALL") where.plan   = plan;

  // Expiring in next 7 days
  const now    = new Date();
  const in7    = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [total, subscriptions, expiringSoon] = await Promise.all([
    db.subscription.count({ where }),
    db.subscription.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.subscription.findMany({
      where: {
        status:  "ACTIVE",
        endDate: { gte: now, lte: in7 },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { endDate: "asc" },
    }),
  ]);

  return NextResponse.json({
    subscriptions,
    expiringSoon,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// PATCH /api/admin/subscriptions — change status of a subscription
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status, endDate } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (status)  data.status  = status;
  if (endDate) data.endDate = new Date(endDate);

  const sub = await db.subscription.update({
    where: { id },
    data,
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  try {
    await db.activityLog.create({
      data: {
        adminId: session.user.id,
        action:  "UPDATE_SUBSCRIPTION",
        target:  id,
        detail:  `Статус → ${status}`,
      },
    });
  } catch { /* non-critical */ }

  return NextResponse.json(sub);
}
