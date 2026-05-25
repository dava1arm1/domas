// ДомоКоины — серверный компонент с защитой сессии
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CoinsPageClient } from "./CoinsPageClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "ДомоКоины" };

export default async function CoinsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [user, transactions] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { coinBalance: true, name: true },
    }),
    db.coinTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  // Итоговая статистика
  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);

  const totalSpent = Math.abs(
    transactions
      .filter((t) => t.type === "SPENT_DISCOUNT")
      .reduce((s, t) => s + t.amount, 0)
  );

  const totalExpired = Math.abs(
    transactions
      .filter((t) => t.type === "EXPIRED")
      .reduce((s, t) => s + t.amount, 0)
  );

  // Монеты, сгорающие в ближайшие 30 дней
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);

  const expiringAmount = transactions
    .filter(
      (t) =>
        t.expiresAt &&
        t.expiresAt <= soon &&
        t.expiresAt > now &&
        t.amount > 0 &&
        t.type !== "SPENT_DISCOUNT" &&
        t.type !== "EXPIRED"
    )
    .reduce((s, t) => s + t.amount, 0);

  return (
    <CoinsPageClient
      balance={user?.coinBalance ?? 0}
      transactions={transactions}
      totalEarned={totalEarned}
      totalSpent={totalSpent}
      totalExpired={totalExpired}
      expiringAmount={expiringAmount}
    />
  );
}
