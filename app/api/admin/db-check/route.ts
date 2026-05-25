import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Открытый endpoint для диагностики (без auth — только для разработки)
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Проверяем есть ли таблица Setting
  try {
    const count = await db.setting.count();
    results.setting_table = { ok: true, rows: count };
  } catch (e) {
    results.setting_table = { ok: false, error: String(e) };
  }

  // 2. Пробуем записать и прочитать тестовую настройку
  try {
    await db.setting.upsert({
      where:  { key: "__test__" },
      update: { value: "ok" },
      create: { key: "__test__", value: "ok" },
    });
    const row = await db.setting.findUnique({ where: { key: "__test__" } });
    results.write_read = { ok: row?.value === "ok" };
    await db.setting.delete({ where: { key: "__test__" } });
  } catch (e) {
    results.write_read = { ok: false, error: String(e) };
  }

  // 3. Читаем текущие настройки
  try {
    const settings = await db.setting.findMany({ take: 10 });
    results.current_settings = settings.map(s => ({ key: s.key, value: s.value.slice(0, 50) }));
  } catch {
    results.current_settings = [];
  }

  const allOk = Object.values(results).every((r: any) => r?.ok !== false);

  return NextResponse.json({
    status: allOk ? "OK" : "ERROR",
    message: allOk
      ? "База данных настроена. CMS должен работать."
      : "Ошибка! Выполни в терминале: npx prisma generate && npx prisma db push",
    results,
  });
}
