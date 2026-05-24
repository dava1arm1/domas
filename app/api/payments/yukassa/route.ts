export const dynamic = "force-dynamic";

/**
 * ЮKassa интеграция
 *
 * КАК ПОДКЛЮЧИТЬ:
 * 1. Зарегистрируйтесь на yookassa.ru и пройдите верификацию
 * 2. В личном кабинете ЮKassa → Настройки → HTTP уведомления:
 *    - Укажите URL: https://your-domain.ru/api/payments/yukassa
 *    - Включите события: payment.succeeded, payment.canceled
 * 3. Получите shopId и secretKey → добавьте в .env.local
 * 4. Установите SDK: npm install @a2seven/yoo-checkout
 * 5. Раскомментируйте код ниже
 *
 * ДОКУМЕНТАЦИЯ: https://yookassa.ru/developers/api
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// TODO: Установите SDK: npm install @a2seven/yoo-checkout
// import { YooCheckout, ICreatePayment } from "@a2seven/yoo-checkout";

// const checkout = new YooCheckout({
//   shopId: process.env.YUKASSA_SHOP_ID!,
//   secretKey: process.env.YUKASSA_SECRET_KEY!,
// });

// POST /api/payments/yukassa — создать платёж
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { amount, description, orderId, subscriptionId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Некорректная сумма" }, { status: 400 });
    }

    // TODO: Создание платежа через ЮKassa
    // const payment = await checkout.createPayment({
    //   amount: {
    //     value: (amount / 100).toFixed(2),
    //     currency: "RUB",
    //   },
    //   payment_method_data: { type: "bank_card" },
    //   confirmation: {
    //     type: "redirect",
    //     return_url: process.env.YUKASSA_RETURN_URL!,
    //   },
    //   description: description ?? "Оплата услуг Домас",
    //   metadata: { userId: session.user.id, orderId, subscriptionId },
    //   capture: true,
    // });

    // Сохраняем платёж в БД
    // const dbPayment = await db.payment.create({
    //   data: {
    //     userId: session.user.id,
    //     orderId: orderId ?? null,
    //     subscriptionId: subscriptionId ?? null,
    //     amount,
    //     status: "PENDING",
    //     provider: "yukassa",
    //     externalId: payment.id,
    //   },
    // });

    // return NextResponse.json({
    //   paymentId: dbPayment.id,
    //   confirmationUrl: payment.confirmation.confirmation_url,
    // });

    // ЗАГЛУШКА — удалить после подключения ЮKassa
    return NextResponse.json({
      message: "ЮKassa не подключена. Следуйте инструкции в файле route.ts",
      todo: "npm install @a2seven/yoo-checkout && добавьте ключи в .env.local",
    }, { status: 501 });

  } catch (error) {
    console.error("[YUKASSA]", error);
    return NextResponse.json({ error: "Ошибка создания платежа" }, { status: 500 });
  }
}

// Webhook от ЮKassa — обновление статуса платежа
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: Проверьте подпись webhook от ЮKassa
    // const ip = req.headers.get("x-real-ip");
    // Разрешённые IP ЮKassa: 185.71.76.0/27, 185.71.77.0/27, 77.75.153.0/25
    // 77.75.156.11, 77.75.156.35, 77.75.154.128/25

    const { event, object } = body;

    if (event === "payment.succeeded") {
      await db.payment.updateMany({
        where: { externalId: object.id },
        data: { status: "SUCCEEDED" },
      });
    } else if (event === "payment.canceled") {
      await db.payment.updateMany({
        where: { externalId: object.id },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[YUKASSA WEBHOOK]", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
