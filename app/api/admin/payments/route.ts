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

// GET /api/admin/payments?status=&page=1&limit=50
export async function GET(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const page   = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit  = Math.min(100, parseInt(searchParams.get("limit") || "50"));

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;

  const now        = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, payments, mrrResult, totalResult] = await Promise.all([
    db.payment.count({ where }),
    db.payment.findMany({
      where,
      include: {
        user:  { select: { id: true, name: true, email: true } },
        order: { select: { id: true, serviceType: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCEEDED", createdAt: { gte: startMonth } },
    }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCEEDED" },
    }),
  ]);

  return NextResponse.json({
    payments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    mrr: mrrResult._sum.amount ?? 0,
    totalRevenue: totalResult._sum.amount ?? 0,
  });
}

// PATCH /api/admin/payments — refund a payment
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const payment = await db.payment.update({
    where: { id },
    data: { status: "REFUNDED" },
  });

  try {
    await db.activityLog.create({
      data: {
        adminId: session.user.id,
        action:  "REFUND_PAYMENT",
        target:  id,
        detail:  `Возврат платежа ${id}`,
      },
    });
  } catch { /* non-critical */ }

  return NextResponse.json(payment);
}
