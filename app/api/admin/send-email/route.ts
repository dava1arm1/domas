export const dynamic = "force-dynamic";

/**
 * Email рассылка через UniSender или SendPulse
 *
 * КАК ПОДКЛЮЧИТЬ UniSender:
 * 1. Зарегистрируйтесь на unisender.com
 * 2. Создайте список рассылки, скопируйте его ID
 * 3. Перейдите в Настройки → API → скопируйте ключ
 * 4. Добавьте в .env.local:
 *    UNISENDER_API_KEY=ваш-ключ
 *    UNISENDER_LIST_ID=id-вашего-списка
 *
 * API ДОКУМЕНТАЦИЯ: https://www.unisender.com/ru/support/api/common/
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmailSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = sendEmailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      );
    }

    const { subject, body: emailBody, segment } = result.data;

    // Получаем нужных получателей
    const where =
      segment === "ALL"
        ? { role: "USER" as const }
        : {
            role: "USER" as const,
            subscriptions: {
              some: {
                status:
                  segment === "ACTIVE"
                    ? ("ACTIVE" as const)
                    : ("CANCELLED" as const),
              },
            },
          };

    const users = await db.user.findMany({
      where,
      select: { email: true, name: true },
    });

    // TODO: Реализация через UniSender
    // const response = await fetch("https://api.unisender.com/ru/api/createEmailMessage", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     api_key: process.env.UNISENDER_API_KEY,
    //     format: "json",
    //     list_id: process.env.UNISENDER_LIST_ID,
    //     subject,
    //     body: emailBody,
    //     from_email: "hello@domas.ru",
    //     from_name: "Домас",
    //   }),
    // });
    //
    // Затем запустить кампанию через createCampaign:
    // https://www.unisender.com/ru/support/api/partners/create-campaign/

    // TODO: Или через SendPulse
    // https://sendpulse.com/ru/integrations/api

    console.log(`[MAILING] Отправка ${users.length} получателям. Тема: "${subject}"`);

    return NextResponse.json({
      message: `Рассылка запущена для ${users.length} получателей (ЗАГЛУШКА — подключите UniSender)`,
      recipients: users.length,
    });
  } catch (error) {
    console.error("[SEND EMAIL]", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
