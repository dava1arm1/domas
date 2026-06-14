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
    { href: "/services/waste-removal",      label: "Вывоз мусора" },
    { href: "/services/lawn-care",           label: "Уход за участком" },
    { href: "/services/septic",              label: "Откачка септика" },
    { href: "/services/construction-waste",  label: "Строительные отходы" },
    { href: "/services/snow-removal",        label: "Уборка снега" },
    { href: "/services/cleaning",            label: "Клининг" },
    { href: "/#pricing",                     label: "Тарифы" },
  ],
  company: [
    { href: "/#reviews", label: "Отзывы" },
    { href: "/#faq",     label: "FAQ" },
    { href: "/privacy",       label: "Политика конфиденциальности" },
    { href: "/personal-data", label: "Обработка персональных данных" },
    { href: "/dashboard", label: "Личный кабинет" },
  ],
} as const;

export const CONTACT_INFO = {
  phone: "+7 (495) 000-00-00",
  email: "hello@domas.ru",
  address: "Москва и Московская область",
  telegram: "https://t.me/domas_support",
  workingHours: "Пн–Пт: 9:00–20:00, Сб–Вс: 10:00–18:00",
} as const;
