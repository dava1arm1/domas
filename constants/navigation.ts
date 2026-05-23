// Навигационные ссылки — редактируй тут

export const NAV_LINKS_LEFT = [
  { href: "/#services", label: "Услуги" },
  { href: "/#pricing", label: "Тарифы" },
] as const;

export const NAV_LINKS_RIGHT = [
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const ALL_NAV_LINKS = [
  ...NAV_LINKS_LEFT,
  ...NAV_LINKS_RIGHT,
] as const;

export const FOOTER_LINKS = {
  services: [
    { href: "/#services", label: "Все услуги" },
    { href: "/#pricing", label: "Тарифы" },
    { href: "/dashboard", label: "Личный кабинет" },
  ],
  company: [
    { href: "/#reviews", label: "Отзывы" },
    { href: "/#faq", label: "FAQ" },
    { href: "/privacy", label: "Политика конфиденциальности" },
  ],
} as const;

export const CONTACT_INFO = {
  phone: "+7 (495) 000-00-00",
  email: "hello@domas.ru",
  address: "Москва и Московская область",
  telegram: "https://t.me/domas_support",
  workingHours: "Пн–Пт: 9:00–20:00, Сб–Вс: 10:00–18:00",
} as const;
