export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/user/addresses — получить адреса текущего пользователя
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      label: true,
      address: true,
      city: true,
      landmark: true,
      isDefault: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: addresses });
}

// POST /api/user/addresses — создать новый адрес для текущего пользователя
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await req.json();
  const { label, address } = body;

  if (!label || !address) {
    return NextResponse.json(
      { error: "Поля label и address обязательны" },
      { status: 400 }
    );
  }

  const createdAddress = await db.address.create({
    data: {
      userId: session.user.id,
      label,
      address,
      city: body.city ?? null,
      landmark: body.landmark ?? null,
    },
  });

  return NextResponse.json({ data: createdAddress }, { status: 201 });
}
