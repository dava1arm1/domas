// Личный кабинет — серверный компонент с защитой сессии
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
  title: "Личный кабинет",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Загружаем данные пользователя
  const [user, orders, subscription] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      include: { addresses: true },
      // coinBalance, referralCode are scalar fields — always returned
    }),
    db.order.findMany({
      where: { userId: session.user.id },
      include: { address: true, review: true },
      orderBy: { scheduledAt: "desc" },
      take: 10,
    }),
    db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ACTIVE", "PAUSED"] },
      },
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <DashboardClient
      user={user}
      orders={orders}
      subscription={subscription}
      coinBalance={(user as any).coinBalance ?? 0}
    />
  );
}
