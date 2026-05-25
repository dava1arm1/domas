import { db } from "./db";

// ─── Default values for all CMS settings ──────────────────────
export const SETTING_DEFAULTS: Record<string, string> = {
  // Hero section
  "hero.heading":       "Всё что нужно вашему дому — в одном сервисе.",
  "hero.subtitle":      "Один сервис закрывает все задачи вашего дома — от вывоза отходов до стрижки газона и откачки септика. Для тех, кто ценит своё время.",
  "hero.badge":         "Работаем в радиусе 80 км от МКАД",
  "hero.cta_primary":   "Подключить сервис",
  "hero.cta_secondary": "Узнать подробнее",
  "hero.video_enabled": "true",

  // Site contacts
  "site.phone":         "+7 (925) 000-00-00",
  "site.email":         "info@domas.ru",
  "site.hours":         "Пн–Пт, 9:00–20:00",
  "site.area":          "Радиус 80 км от МКАД",
  "site.telegram":      "",
  "site.legal_name":    "",
  "site.ogrnip":        "",
  "site.inn":           "",
  "site.legal_address": "",

  // Text blocks
  "texts.footer":       "© 2024 Domas. Профессиональный уход за вашим домом.",

  // SEO
  "seo.home.title":       "Domas — сервис обслуживания загородных домов",
  "seo.home.description": "Профессиональный уход за вашим домом: вывоз мусора, стрижка газона, откачка септика и многое другое.",

  // Notification templates
  "notify.order_confirm":      "Ваш заказ {{service}} на {{date}} подтверждён. Мы свяжемся с вами заранее.",
  "notify.visit_reminder_24h": "Напоминаем: завтра в {{time}} к вам приедет наш специалист ({{service}}).",
  "notify.visit_reminder_1h":  "Наш специалист будет у вас через час ({{service}}). Пожалуйста, обеспечьте доступ.",
  "notify.order_done":         "Заказ выполнен! Спасибо за доверие. Оцените качество работы в личном кабинете.",
  "notify.payment_success":    "Оплата {{amount}} ₽ прошла успешно. Спасибо!",
  "notify.subscription_renew": "Ваша подписка «{{plan}}» будет продлена через 3 дня. Сумма: {{amount}} ₽.",

  // Notify toggles
  "notify.order_confirm.enabled":      "true",
  "notify.visit_reminder_24h.enabled": "true",
  "notify.visit_reminder_1h.enabled":  "true",
  "notify.order_done.enabled":         "true",
  "notify.payment_success.enabled":    "true",
  "notify.subscription_renew.enabled": "true",

  // System
  "system.maintenance_mode": "false",
  "system.yukassa_shop_id":  "",
  "system.yukassa_secret":   "",
  "system.unisender_key":    "",
};

// ─── Read a single setting ─────────────────────────────────────
export async function getSetting(key: string): Promise<string> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    return row?.value ?? SETTING_DEFAULTS[key] ?? "";
  } catch {
    return SETTING_DEFAULTS[key] ?? "";
  }
}

// ─── Read multiple settings in one query ──────────────────────
export async function getSettings(
  keys: string[]
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const k of keys) result[k] = SETTING_DEFAULTS[k] ?? "";

  try {
    const rows = await db.setting.findMany({ where: { key: { in: keys } } });
    for (const row of rows) result[row.key] = row.value;
  } catch {
    // fallback to defaults already set
  }
  return result;
}

// ─── Read all settings (for admin CMS) ───────────────────────
export async function getAllSettings(): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...SETTING_DEFAULTS };
  try {
    const rows = await db.setting.findMany();
    for (const row of rows) result[row.key] = row.value;
  } catch {
    // fallback to defaults
  }
  return result;
}

// ─── Upsert a single setting ──────────────────────────────────
export async function saveSetting(key: string, value: string): Promise<void> {
  await db.setting.upsert({
    where:  { key },
    update: { value },
    create: { key, value },
  });
}

// ─── Upsert multiple settings at once ────────────────────────
export async function saveSettings(
  data: Record<string, string>
): Promise<void> {
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      db.setting.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}
