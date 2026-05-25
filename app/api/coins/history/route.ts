export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CoinTransactionType } from "@prisma/client";

const EARNED_TYPES: CoinTransactionType[] = [
  "EARNED_ORDER",
  "EARNED_REVIEW",
  "EARNED_REFERRAL",
  "EARNED_WELCOME",
];

const SPENT_TYPES: CoinTransactionType[] = ["SPENT_DISCOUNT", "EXPIRED"];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const filter = searchParams.get("filter") ?? "all";

    // Build type filter
    let typeFilter: { in?: CoinTransactionType[] } | undefined;
    if (filter === "earned") {
      typeFilter = { in: EARNED_TYPES };
    } else if (filter === "spent") {
      typeFilter = { in: SPENT_TYPES };
    }

    const where = {
      userId,
      ...(typeFilter ? { type: typeFilter } : {}),
    };

    // Paginated transactions
    const [data, total] = await Promise.all([
      db.coinTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.coinTransaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Stats over all transactions for this user (regardless of filter)
    const allTransactions = await db.coinTransaction.findMany({
      where: { userId },
      select: { amount: true, type: true },
    });

    const stats = allTransactions.reduce(
      (acc, t) => {
        if (EARNED_TYPES.includes(t.type)) {
          acc.totalEarned += t.amount;
        } else if (t.type === "SPENT_DISCOUNT") {
          acc.totalSpent += Math.abs(t.amount);
        } else if (t.type === "EXPIRED") {
          acc.totalExpired += Math.abs(t.amount);
        }
        return acc;
      },
      { totalEarned: 0, totalSpent: 0, totalExpired: 0 }
    );

    return NextResponse.json({ data, total, page, totalPages, stats });
  } catch (error) {
    console.error("[COINS_HISTORY]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
