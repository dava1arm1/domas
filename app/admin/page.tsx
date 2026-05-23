// Админ-панель — серверный компонент
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminClient } from "./AdminClient";

export const metadata = {
  title: "Администрирование",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Статистика
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
    users,
    orders,
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
    db.user.findMany({
      where: { role: "USER" },
      include: {
        subscriptions: { where: { status: "ACTIVE" }, take: 1 },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const stats = {
    totalUsers,
    totalOrders,
    totalRevenue: revenueResult._sum.amount ?? 0,
    activeSubscriptions,
    newUsersThisMonth,
    ordersThisMonth,
    revenueThisMonth: revenueThisMonthResult._sum.amount ?? 0,
  };

  return <AdminClient stats={stats} users={users} orders={orders} />;
}
