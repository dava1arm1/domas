"use client";

import { useState } from "react";
import Link from "next/link";
import type { User, Address, Order, Subscription, Review } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";
import { BookingModal } from "@/components/booking/BookingModal";
import { DomoCoinIcon } from "@/components/ui/DomoCoinIcon";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { SERVICES, SERVICE_LABELS } from "@/constants/services";
import { CONTACT_INFO } from "@/constants/navigation";
import { PLAN_LABELS } from "@/constants/pricing";
import { formatDate, formatDateTime, formatPrice, getOrderStatusLabel } from "@/lib/utils";

type OrderWithRelations = Order & { address: Address | null; review: Review | null };
type UserWithAddresses = User & { addresses: Address[] };

interface Props {
  user: UserWithAddresses;
  orders: OrderWithRelations[];
  subscription: Subscription | null;
  coinBalance?: number;
}

const statusVariantMap: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  NEW: "info",
  IN_PROGRESS: "warning",
  DONE: "success",
  CANCELLED: "danger",
};

function getGreeting(name: string) {
  const h = new Date().getHours();
  const first = name.split(" ")[0];
  if (h < 6) return `Доброй ночи, ${first}`;
  if (h < 12) return `Доброе утро, ${first}`;
  if (h < 18) return `Добрый день, ${first}`;
  return `Добрый вечер, ${first}`;
}

export function DashboardClient({ user, orders, subscription, coinBalance = 0 }: Props) {
  const [reviewOrder, setReviewOrder] = useState<OrderWithRelations | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const nextOrder = orders.find((o) => o.status === "NEW" || o.status === "IN_PROGRESS");
  const thisMonthOrders = orders.filter((o) => {
    const now = new Date();
    const d = new Date(o.scheduledAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const pendingReview = orders.find((o) => o.status === "DONE" && !o.review);
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 5);

  function openBooking(serviceId?: string) {
    setBookingServiceId(serviceId);
    setBookingOpen(true);
  }

  const submitReview = async () => {
    if (!reviewOrder) return;
    setReviewLoading(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: reviewOrder.id, rating: reviewRating, comment: reviewComment }),
      });
      setReviewOrder(null);
      window.location.reload();
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <>
      <main>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-5">

          {/* 1. Greeting */}
          <div className="animate-fade-in">
            <h1 className="font-raleway font-black text-2xl md:text-3xl text-gray-900">
              {getGreeting(user.name)}
            </h1>
            <div className="mt-2">
              {subscription ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green bg-brand-green-pale px-3 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                  Подписка активна · {PLAN_LABELS[subscription.plan] ?? subscription.plan}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Нет активной подписки
                </span>
              )}
            </div>
          </div>

          {/* 2. Next visit */}
          <div className="animate-fade-in" style={{ animationDelay: "0.06s" }}>
            {nextOrder ? (
              <div className="bg-brand-dark rounded-2xl p-6 sm:p-8">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
                  Ближайший визит
                </p>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-raleway font-black text-2xl text-white mb-1.5">
                      {SERVICE_LABELS[nextOrder.serviceType] ?? nextOrder.serviceType}
                    </h2>
                    <p className="text-brand-green-light font-semibold text-lg">
                      {formatDateTime(nextOrder.scheduledAt)}
                    </p>
                    {nextOrder.address && (
                      <p className="text-white/40 text-sm mt-2 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {nextOrder.address.address}
                      </p>
                    )}
                  </div>
                  <Badge variant={statusVariantMap[nextOrder.status] ?? "default"}>
                    {getOrderStatusLabel(nextOrder.status)}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-600 mb-1">Нет запланированных визитов</p>
                <p className="text-gray-400 text-sm mb-4">Закажите первую услугу — и мы приедем</p>
                <button
                  onClick={() => openBooking()}
                  className="text-brand-green font-semibold text-sm hover:underline"
                >
                  Заказать услугу →
                </button>
              </div>
            )}
          </div>

          {/* 3. Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.12s" }}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Визитов в месяце</p>
              <p className="font-raleway font-black text-4xl text-gray-900">{thisMonthOrders.length}</p>
              <p className="text-gray-400 text-xs mt-1.5">
                в {new Date().toLocaleString("ru", { month: "long" })}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Активная подписка</p>
              {subscription ? (
                <>
                  <p className="font-raleway font-black text-xl text-gray-900">
                    {PLAN_LABELS[subscription.plan] ?? subscription.plan}
                  </p>
                  <p className="text-gray-400 text-xs mt-1.5">с {formatDate(subscription.startDate)}</p>
                </>
              ) : (
                <p className="text-gray-400 font-semibold mt-1">Нет подписки</p>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Следующий платёж</p>
              {subscription ? (
                <>
                  <p className="font-raleway font-black text-xl text-gray-900">
                    {formatPrice(subscription.price)}
                  </p>
                  <p className="text-gray-400 text-xs mt-1.5">ежемесячно</p>
                </>
              ) : (
                <Link href="/#pricing" className="text-brand-green text-sm font-semibold hover:underline mt-1 block">
                  Выбрать тариф →
                </Link>
              )}
            </div>
          </div>

          {/* 3b. ДомоКоины widget */}
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="bg-brand-dark rounded-2xl p-5 flex items-center gap-4">
              <div className="flex-shrink-0">
                <DomoCoinIcon size={44} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-0.5">ДомоКоины</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-raleway font-black text-3xl text-white tabular-nums leading-none">
                    {coinBalance.toLocaleString("ru-RU")}
                  </span>
                  <span className="text-white/30 text-sm">= {coinBalance.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link
                  href="/dashboard/coins"
                  className="text-xs font-semibold text-brand-green-light hover:text-white transition-colors whitespace-nowrap"
                >
                  История →
                </Link>
                <Link
                  href="/dashboard/referral"
                  className="text-xs font-semibold text-white/30 hover:text-white/60 transition-colors whitespace-nowrap"
                >
                  Рефералы →
                </Link>
              </div>
            </div>
          </div>

          {/* 4. Active subscription card */}
          {subscription && (() => {
            const defaultAddress = user.addresses.find(a => a.isDefault) ?? user.addresses[0] ?? null;
            return (
              <div className="animate-fade-in" style={{ animationDelay: "0.18s" }}>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Header stripe */}
                  <div className="bg-gradient-to-r from-brand-green to-[#159a6e] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">♻️</span>
                      <div>
                        <p className="text-white font-raleway font-black text-base leading-tight">
                          Вывоз мусора
                        </p>
                        <p className="text-white/70 text-xs mt-0.5">Еженедельно · по расписанию</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Активна
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Тариф</p>
                          <p className="font-raleway font-black text-lg text-gray-900">
                            {PLAN_LABELS[subscription.plan] ?? subscription.plan}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Стоимость</p>
                          <p className="font-semibold text-gray-900">
                            {formatPrice(subscription.price)}
                            <span className="text-gray-400 font-normal text-sm">/мес</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Подключена</p>
                          <p className="font-semibold text-gray-900">{formatDate(subscription.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm">Сменить тариф</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                          Отменить
                        </Button>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-400 font-medium mb-1.5">Адрес обслуживания</p>
                      {defaultAddress ? (
                        <div className="flex items-start gap-2">
                          <svg className="h-4 w-4 text-brand-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{defaultAddress.address}</p>
                            {defaultAddress.city && (
                              <p className="text-xs text-gray-400 mt-0.5">{defaultAddress.city}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubscriptionModalOpen(true)}
                          className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1"
                        >
                          + Указать адрес обслуживания
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-brand-green font-semibold">
                      ✓ Скидка 10% на все остальные услуги активна
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Quality control */}
          {pendingReview && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in" style={{ animationDelay: "0.18s" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-raleway font-bold text-lg text-gray-900 mb-1">
                    Оцените последний визит
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {SERVICE_LABELS[pendingReview.serviceType]} · {formatDate(pendingReview.scheduledAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
                  <Button size="sm" onClick={() => setReviewOrder(pendingReview)}>
                    Оставить отзыв
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Order CTA */}
          <div className="animate-fade-in" style={{ animationDelay: "0.22s" }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openBooking()}
                className="flex-1 flex items-center justify-between gap-4 bg-brand-green hover:bg-brand-green/90 text-white px-6 py-5 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/25 active:scale-[0.99] group"
              >
                <div className="text-left">
                  <p className="font-raleway font-black text-lg">Заказать услугу</p>
                  <p className="text-white/70 text-sm mt-0.5">Менеджер свяжется в течение 5 минут</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>

              {/* Quick repeat last order */}
              {orders.length > 0 && (() => {
                const last = orders[0];
                const svc = SERVICES.find(s => s.id === last.serviceType);
                if (!svc) return null;
                return (
                  <button
                    onClick={() => openBooking(last.serviceType)}
                    className="sm:w-48 flex items-center gap-3 px-5 py-5 bg-white border border-gray-100 hover:border-brand-green hover:shadow-sm rounded-2xl transition-all duration-200 text-left group"
                  >
                    <span className="text-2xl flex-shrink-0">{svc.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">Повторить</p>
                      <p className="font-semibold text-sm text-gray-800 truncate group-hover:text-brand-green transition-colors">
                        {svc.title}
                      </p>
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* 6. Order history */}
          <div className="animate-fade-in" style={{ animationDelay: "0.28s" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-raleway font-bold text-lg text-gray-900">История заказов</h2>
              {orders.length > 5 && (
                <button
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className="text-brand-green text-sm font-semibold hover:underline"
                >
                  {showAllOrders ? "Свернуть" : "Показать все"}
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-600 mb-1">Заказов пока нет</p>
                  <p className="text-gray-400 text-sm">После первого визита история появится здесь</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {displayedOrders.map((order) => (
                    <div key={order.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50/70 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {formatDate(order.scheduledAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        {order.review && <StarRating value={order.review.rating} readOnly size="sm" />}
                        <Badge variant={statusVariantMap[order.status] ?? "default"}>
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                        {order.status === "DONE" && !order.review && (
                          <button
                            onClick={() => setReviewOrder(order)}
                            className="text-brand-green text-xs font-semibold hover:underline hidden sm:block"
                          >
                            Оценить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. Support */}
          <div className="animate-fade-in" style={{ animationDelay: "0.38s" }}>
            <h2 className="font-raleway font-bold text-lg text-gray-900 mb-3">Связь с нами</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  href: `mailto:${CONTACT_INFO.email}`,
                  label: "Написать менеджеру",
                  sub: "Ответим в течение часа",
                  icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  external: false,
                },
                {
                  href: `tel:${CONTACT_INFO.phone}`,
                  label: "Позвонить",
                  sub: CONTACT_INFO.phone,
                  icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                  external: false,
                },
                {
                  href: CONTACT_INFO.telegram,
                  label: "Telegram-бот",
                  sub: "Ответ за 10 минут",
                  icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
                  external: true,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-green hover:shadow-sm transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-xl bg-brand-green-pale flex items-center justify-center flex-shrink-0 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 9. No subscription CTA */}
          {!subscription && (
            <div className="animate-fade-in" style={{ animationDelay: "0.44s" }}>
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                <p className="font-raleway font-bold text-gray-700 mb-1">Подключите подписку</p>
                <p className="text-gray-400 text-sm mb-4">Еженедельный вывоз мусора + скидка 10% на все услуги</p>
                <Button onClick={() => setSubscriptionModalOpen(true)}>Подключить</Button>
              </div>
            </div>
          )}

          <div className="h-6" />
        </div>
      </main>

      {/* ── Review modal ── */}
      <Modal isOpen={!!reviewOrder} onClose={() => setReviewOrder(null)} title="Оценить визит">
        {reviewOrder && (
          <div className="space-y-5">
            <div>
              <p className="text-gray-500 text-sm mb-1">Услуга</p>
              <p className="font-semibold text-gray-900">
                {SERVICE_LABELS[reviewOrder.serviceType]} · {formatDate(reviewOrder.scheduledAt)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-3">Ваша оценка</p>
              <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
            </div>
            <div>
              <label className="text-gray-500 text-sm block mb-2">Комментарий (необязательно)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                placeholder="Что понравилось или что можно улучшить?"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setReviewOrder(null)} fullWidth>Отмена</Button>
              <Button loading={reviewLoading} onClick={submitReview} fullWidth>Отправить</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Subscription activation modal ── */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onSuccess={() => { setSubscriptionModalOpen(false); setTimeout(() => window.location.reload(), 300); }}
      />

      {/* ── Booking modal ── */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialServiceId={bookingServiceId}
        user={{ id: user.id, name: user.name, phone: user.phone }}
        addresses={user.addresses}
        subscription={subscription}
        onSuccess={() => setTimeout(() => window.location.reload(), 1500)}
      />
    </>
  );
}
