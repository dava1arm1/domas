export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body as { code: string };

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Реферальный код не указан" },
        { status: 400 }
      );
    }

    const referrer = await db.user.findUnique({
      where: { referralCode: code.trim().toUpperCase() },
      select: { id: true, name: true },
    });

    if (!referrer) {
      return NextResponse.json(
        { valid: false, error: "Реферальный код не найден" },
        { status: 404 }
      );
    }

    // Return only the first name
    const firstName = referrer.name.trim().split(" ")[0];

    return NextResponse.json({ valid: true, referrerName: firstName });
  } catch (error) {
    console.error("[REFERRAL_VALIDATE]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
