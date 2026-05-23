// Централизованные TypeScript типы проекта Домас

// ─── Пользователь ─────────────────────────────────────────────
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  address: string;
  isDefault: boolean;
  createdAt: Date;
}

// ─── Подписка ─────────────────────────────────────────────────
export type Plan = "BASIC" | "COMFORT" | "MAX";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Заказ ────────────────────────────────────────────────────
export type ServiceType =
  | "waste_removal"
  | "construction_waste"
  | "lawn_care"
  | "septic_pumping"
  | "snow_removal"
  | "cleaning";

export type OrderStatus = "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export interface Order {
  id: string;
  userId: string;
  addressId?: string | null;
  serviceType: ServiceType;
  status: OrderStatus;
  scheduledAt: Date;
  completedAt?: Date | null;
  price: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  address?: Address | null;
  review?: Review | null;
}

// ─── Платёж ───────────────────────────────────────────────────
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  userId: string;
  orderId?: string | null;
  subscriptionId?: string | null;
  amount: number;
  status: PaymentStatus;
  provider: string;
  externalId?: string | null;
  createdAt: Date;
}

// ─── Отзыв ────────────────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  orderId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
}

// ─── API ──────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Формы ────────────────────────────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── Админ-статистика ─────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

// ─── Сервис (для UI) ──────────────────────────────────────────
export interface Service {
  id: ServiceType;
  title: string;
  description: string;
  fullDescription: string;
  included: string[];
  icon: string;
  color: string;
  bgColor: string;
  frequency?: string;
  priceNote?: string;
  isPrimarySubscription?: boolean;
}

// ─── Тарифный план (для UI) ───────────────────────────────────
export interface PricingPlan {
  id: Plan;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

// ─── FAQ ──────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

// ─── Отзыв для UI ─────────────────────────────────────────────
export interface ReviewItem {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}
