export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация входных данных
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = result.data;
    const incomingReferralCode: string | undefined = body.referralCode;

    // Валидируем реферальный код, если передан
    let referredBy: string | undefined;
    if (incomingReferralCode) {
      const referrer = await db.user.findUnique({
        where: { referralCode: incomingReferralCode.trim().toUpperCase() },
        select: { id: true },
      });
      if (referrer) {
        referredBy = incomingReferralCode.trim().toUpperCase();
      }
    }

    // Проверяем, не занят ли email
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        referredBy: referredBy ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Генерируем уникальный реферальный код для нового пользователя
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await db.user.update({ where: { id: user.id }, data: { referralCode } });

    return NextResponse.json(
      { message: "Аккаунт создан успешно", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
