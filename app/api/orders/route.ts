export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderSchema } from "@/lib/validations";

// GET /api/orders — получить заказы текущего пользователя
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const page = parseInt(searchParams.get("page") ?? "1");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (status && status !== "ALL") where.status = status;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: { address: true, review: true },
      orderBy: { scheduledAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({
    data: orders,
    total,
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/orders — создать новый заказ
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = orderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      );
    }

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        serviceType: result.data.serviceType,
        scheduledAt: new Date(result.data.scheduledAt),
        addressId: result.data.addressId ?? null,
        comment: result.data.comment ?? null,
        price: 0,
        status: "NEW",
      },
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error("[ORDERS POST]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
