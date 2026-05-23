// Тарифы Domas — редактируй цены тут

// ─── Основная подписка: вывоз мусора ──────────────────────────
export const MAIN_SUBSCRIPTION = {
  id: "waste_removal",
  title: "Вывоз мусора",
  badge: "Основная подписка",
  description: "Регулярный вывоз ТКО с еженедельными визитами по расписанию. Подключив эту подписку, вы получаете скидку 10% на все остальные услуги сервиса.",
  monthlyPrice: 1490,
  annualPrice: 14900,
  annualMonthlyEquivalent: 1242, // 14900 / 12, округлённо
  features: [
    "Еженедельный вывоз ТКО",
    "Согласованное расписание",
    "Уведомления до и после визита",
    "Личный кабинет",
    "Скидка 10% на все услуги сервиса",
  ],
} as const;

// ─── Дополнительные подписки ──────────────────────────────────
export interface AddonSubscription {
  id: string;
  icon: string;
  title: string;
  frequency: string;
  monthlyPrice: number;
  annualPrice: number;
  annualMonthlyEquivalent: number;
  features: string[];
}

export const ADDON_SUBSCRIPTIONS: AddonSubscription[] = [
  {
    id: "lawn_subscription",
    icon: "🌿",
    title: "Покос травы",
    frequency: "2 раза в месяц",
    monthlyPrice: 2990,
    annualPrice: 29900,
    annualMonthlyEquivalent: 2492,
    features: [
      "Стрижка газона 2 раза в месяц",
      "Уборка скошенной травы",
      "Обрезка бордюрного газона",
    ],
  },
  {
    id: "cleaning_subscription",
    icon: "✨",
    title: "Клининг",
    frequency: "3 раза в месяц",
    monthlyPrice: 3490,
    annualPrice: 34900,
    annualMonthlyEquivalent: 2908,
    features: [
      "Уборка 3 раза в месяц",
      "Мытьё полов и поверхностей",
      "Санузлы, кухня, комнаты",
    ],
  },
  {
    id: "home_care_subscription",
    icon: "🏠",
    title: "Уход за домом",
    frequency: "Ежемесячно",
    monthlyPrice: 4990,
    annualPrice: 49900,
    annualMonthlyEquivalent: 4158,
    features: [
      "Осмотр состояния дома",
      "Мелкие неисправности по списку",
      "Отчёт с фотографиями",
    ],
  },
];

// Метки планов для совместимости с остальным кодом
export const PLAN_LABELS: Record<string, string> = {
  BASIC: "Базовый",
  COMFORT: "Комфорт",
  MAX: "Максимум",
};

export const PLAN_PRICES: Record<string, number> = {
  BASIC: 1490,
  COMFORT: 3490,
  MAX: 5990,
};
