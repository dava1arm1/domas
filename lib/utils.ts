import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Объединение Tailwind классов без конфликтов
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматирование цены: 3490 → "3 490 ₽"
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Форматирование даты: Date → "25 мая 2024"
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// Форматирование даты и времени: Date → "25 мая, 10:00"
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Форматирование телефона: 79161234567 → "+7 (916) 123-45-67"
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
}

// Первая буква заглавная
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Получить инициалы из имени: "Иван Петров" → "ИП"
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Склонение числительных: (1, "визит", "визита", "визитов") → "1 визит"
export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const abs = Math.abs(count) % 100;
  const mod = abs % 10;
  if (abs > 10 && abs < 20) return `${count} ${many}`;
  if (mod === 1) return `${count} ${one}`;
  if (mod >= 2 && mod <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
}

// Цвет бейджа для статуса заказа
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING:     "bg-amber-50 text-amber-700 border border-amber-200",
    ACCEPTED:    "bg-blue-50 text-blue-700 border border-blue-200",
    IN_PROGRESS: "bg-green-50 text-green-700 border border-green-200",
    COMPLETED:   "bg-gray-100 text-gray-600 border border-gray-200",
    CANCELLED:   "bg-red-50 text-red-700 border border-red-200",
    // Legacy
    NEW:  "bg-blue-50 text-blue-700 border border-blue-200",
    DONE: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return colors[status] ?? "bg-gray-100 text-gray-700";
}

// Метка статуса заказа
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING:     "В обработке",
    ACCEPTED:    "Заказ принят",
    IN_PROGRESS: "Выполняется",
    COMPLETED:   "Выполнен",
    CANCELLED:   "Отменён",
    // Legacy
    NEW:  "В обработке",
    DONE: "Выполнен",
  };
  return labels[status] ?? status;
}

// Dot color for animated status indicator
export function getOrderStatusDot(status: string): string {
  const dots: Record<string, string> = {
    PENDING:     "bg-amber-400",
    ACCEPTED:    "bg-blue-500",
    IN_PROGRESS: "bg-brand-green",
    COMPLETED:   "bg-gray-400",
    CANCELLED:   "bg-red-500",
    NEW:         "bg-amber-400",
    DONE:        "bg-gray-400",
  };
  return dots[status] ?? "bg-gray-400";
}

// Whether a status should show a pulsing dot
export function isActiveStatus(status: string): boolean {
  return status === "PENDING" || status === "IN_PROGRESS" || status === "NEW";
}

// Цвет бейджа для статуса подписки
export function getSubscriptionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PAUSED: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return colors[status] ?? "bg-gray-100 text-gray-700";
}
