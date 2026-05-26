export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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

// POST /api/orders — создать новый заказ (из формы бронирования)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.serviceType || !body.scheduledAt) {
      return NextResponse.json(
        { error: "serviceType и scheduledAt обязательны" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderCount = await db.order.count();
    const orderNumber = `DOMAS-${String(1000 + orderCount + 1).padStart(4, "0")}`;

    // Accept both full ISO datetime and date-only "YYYY-MM-DD"
    let scheduledAt: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(body.scheduledAt))) {
      scheduledAt = new Date(`${body.scheduledAt}T09:00:00`);
    } else {
      scheduledAt = new Date(body.scheduledAt);
    }

    // If addressId not provided but inline newAddress given — auto-create it
    let addressId: string | null = body.addressId ?? null;
    if (!addressId && body.newAddress?.fullAddress) {
      const addr = await db.address.create({
        data: {
          userId: session.user.id,
          label: body.newAddress.label ?? "Адрес",
          address: body.newAddress.fullAddress,
          city: body.newAddress.city ?? null,
          landmark: body.newAddress.landmark ?? null,
        },
      });
      addressId = addr.id;
    }

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        serviceType: body.serviceType,
        scheduledAt,
        addressId,
        comment: body.specialRequests ?? body.comment ?? null,
        price: 0,
        status: "PENDING",
        timeSlot: body.timeSlot ?? null,
        isRecurring: body.isRecurring ?? false,
        recurringType: body.recurringType ?? null,
        specialRequests: body.specialRequests ?? null,
        photos: body.photos ?? [],
        promoCode: body.promoCode ?? null,
        paymentMethod: body.paymentMethod ?? "cash",
        orderNumber,
      },
    });

    // Notify all admins of new order
    const adminUsers = await db.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    await Promise.all(
      adminUsers.map((admin) =>
        db.notification.create({
          data: {
            userId: admin.id,
            title: `Новая заявка ${orderNumber}`,
            message: `Услуга: ${body.serviceType}`,
            type: "ORDER_PENDING",
            orderId: order.id,
          },
        })
      )
    );

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error("[ORDERS POST]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
