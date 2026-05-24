export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/stats — статистика для дашборда (только ADMIN)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalOrders,
    activeSubscriptions,
    newUsersThisMonth,
    ordersThisMonth,
    revenueResult,
    revenueThisMonthResult,
  ] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.order.count(),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCEEDED" },
    }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCEEDED", createdAt: { gte: startOfMonth } },
    }),
  ]);

  return NextResponse.json({
    data: {
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult._sum.amount ?? 0,
      activeSubscriptions,
      newUsersThisMonth,
      ordersThisMonth,
      revenueThisMonth: revenueThisMonthResult._sum.amount ?? 0,
    },
  });
}
