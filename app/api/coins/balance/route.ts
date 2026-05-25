export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const userId = session.user.id;

    // Get current balance directly from user record
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { coinBalance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Calculate coins expiring in the next 30 days
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringTransactions = await db.coinTransaction.findMany({
      where: {
        userId,
        type: { notIn: ["SPENT_DISCOUNT", "EXPIRED"] },
        expiresAt: { lte: in30Days, gt: now },
      },
      select: { amount: true },
    });

    const pendingExpiry = expiringTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Last 5 transactions
    const history = await db.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      balance: user.coinBalance,
      pendingExpiry,
      history,
    });
  } catch (error) {
    console.error("[COINS_BALANCE]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
