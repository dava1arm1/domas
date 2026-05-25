// Реферальная программа — серверный компонент с защитой сессии
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ReferralPageClient } from "./ReferralPageClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Реферальная программа" };

export default async function ReferralPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, name: true, coinBalance: true },
  });

  if (!user) redirect("/login");

  const referrals = await db.user.findMany({
    where: { referredBy: user?.referralCode ?? "" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      orders: {
        where: { status: "DONE" },
        take: 1,
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Считаем заработанное из рефералов (только с выполненным заказом × 1000)
  const referralEarned =
    referrals.filter((r) => r.orders.length > 0).length * 1000;

  return (
    <ReferralPageClient
      referralCode={user.referralCode ?? ""}
      referrals={referrals}
      referralEarned={referralEarned}
    />
  );
}
