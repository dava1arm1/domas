"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User, Address, Order, Subscription, Review } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";
import { DomoCoinIcon } from "@/components/ui/DomoCoinIcon";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { OrderFormModal } from "@/components/orders/OrderFormModal";
import { SERVICES, SERVICE_LABELS } from "@/constants/services";
import { CONTACT_INFO } from "@/constants/navigation";
import { PLAN_LABELS } from "@/constants/pricing";
import { formatDate, formatPrice, getOrderStatusLabel } from "@/lib/utils";

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
  if (h < 6)  return `Доброй ночи, ${first}`;
  if (h < 12) return `Доброе утро, ${first}`;
  if (h < 18) return `Добрый день, ${first}`;
  return `Добрый вечер, ${first}`;
}

/* ── Reusable dark card wrapper ──────────────────────────────── */
function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.05] border border-white/[0.08] rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

/* ── Section label ───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2 px-1">
      {children}
    </p>
  );
}

export function DashboardClient({ user, orders, subscription, coinBalance = 0 }: Props) {
  const router = useRouter();
  const [reviewOrder, setReviewOrder]     = useState<OrderWithRelations | null>(null);
  const [reviewRating, setReviewRating]   = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalServiceId, setOrderModalServiceId] = useState<string | undefined>(undefined);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const nextOrder       = orders.find((o) => o.status === "NEW" || o.status === "IN_PROGRESS");
  const thisMonthOrders = orders.filter((o) => {
    const now = new Date();
    const d   = new Date(o.scheduledAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const pendingReview   = orders.find((o) => o.status === "DONE" && !o.review);
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 5);

  function openOrderModal(serviceId?: string) {
    setOrderModalServiceId(serviceId);
    setOrderModalOpen(true);
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
      {/* ═══════════════════════════════════════════════════════════
          MOBILE LAYOUT — static, no scroll, fits viewport exactly
          ═══════════════════════════════════════════════════════════ */}
      <main
        className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden px-4"
        style={{ paddingTop: "12px", paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
      >
        {/* 1. Greeting */}
        <div className="flex-shrink-0 mb-3">
          <h1 className="font-raleway font-black text-xl text-white leading-tight">{getGreeting(user.name)}</h1>
          <div className="mt-1.5">
            {subscription ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-green-light bg-brand-green/15 border border-brand-green/20 px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                Подписка · {PLAN_LABELS[subscription.plan] ?? subscription.plan}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/40 bg-white/[0.06] px-2.5 py-0.5 rounded-full">
                Нет активной подписки
              </span>
            )}
          </div>
        </div>

        {/* 2. Next visit (compact) */}
        <div className="flex-shrink-0 mb-3">
          {nextOrder ? (() => {
            const d       = new Date(nextOrder.scheduledAt);
            const day     = d.toLocaleString("ru", { day: "numeric" });
            const month   = d.toLocaleString("ru", { month: "short" });
            const weekday = d.toLocaleString("ru", { weekday: "short" });
            const time    = d.toLocaleString("ru", { hour: "2-digit", minute: "2-digit" });
            return (
              <div className="relative bg-brand-green/10 border border-brand-green/20 rounded-xl overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-green rounded-l-xl" />
                <div className="pl-5 pr-4 py-3 flex items-center gap-3">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-brand-green/20 rounded-lg w-11 h-11">
                    <span className="font-raleway font-black text-xl text-brand-green-light leading-none">{day}</span>
                    <span className="text-brand-green-light/70 text-[9px] font-bold uppercase">{month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-0.5">Ближайший визит</p>
                    <p className="font-raleway font-bold text-sm text-white truncate">{SERVICE_LABELS[nextOrder.serviceType] ?? nextOrder.serviceType}</p>
                    <p className="text-brand-green-light text-xs">{weekday}, {time}</p>
                  </div>
                  <Badge variant={statusVariantMap[nextOrder.status] ?? "default"}>{getOrderStatusLabel(nextOrder.status)}</Badge>
                </div>
              </div>
            );
          })() : (
            <div className="bg-white/[0.04] border border-dashed border-white/[0.10] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-sm font-semibold">Нет запланированных визитов</p>
                <p className="text-white/30 text-xs">Закажите услугу ниже</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Order CTA */}
        <div className="flex-shrink-0 mb-3">
          <button
            onClick={() => openOrderModal()}
            className="w-full flex items-center justify-between gap-3 bg-brand-green text-white px-5 py-3.5 rounded-xl active:scale-[0.99] touch-manipulation transition-transform"
          >
            <div className="text-left">
              <p className="font-raleway font-black text-base leading-tight">Заказать услугу</p>
              <p className="text-white/70 text-xs">Менеджер свяжется за 5 минут</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 leading-none">
              <svg className="h-5 w-5 block flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        </div>

        {/* 4. Stats row */}
        <div className="flex-shrink-0 grid grid-cols-3 gap-2 mb-3">
          <DarkCard className="p-3">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider mb-1">Визитов</p>
            <p className="font-raleway font-black text-2xl text-white leading-none">{thisMonthOrders.length}</p>
            <p className="text-white/25 text-[10px] mt-0.5">в месяце</p>
          </DarkCard>
          <DarkCard className="p-3">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider mb-1">Подписка</p>
            {subscription ? (
              <p className="font-raleway font-bold text-xs text-brand-green-light mt-1">Активна</p>
            ) : (
              <p className="text-white/40 text-xs mt-1">Нет</p>
            )}
          </DarkCard>
          <DarkCard className="p-3">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider mb-1">Платёж</p>
            {subscription ? (
              <p className="font-raleway font-bold text-xs text-white mt-1">{formatPrice(subscription.price)}</p>
            ) : (
              <Link href="/#pricing" className="text-brand-green-light text-[10px] font-semibold mt-1 block touch-manipulation">Выбрать →</Link>
            )}
          </DarkCard>
        </div>

        {/* 5. DomoCoin bar */}
        <div className="flex-shrink-0 bg-[#F5C518]/[0.07] border border-[#F5C518]/[0.12] rounded-xl px-4 py-2.5 flex items-center gap-3 mb-3">
          <DomoCoinIcon size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">ДомоКоины</p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-raleway font-black text-lg text-white tabular-nums leading-none">{coinBalance.toLocaleString("ru-RU")}</span>
              <span className="text-white/25 text-xs">= {coinBalance.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
          <Link href="/dashboard/coins" className="text-xs font-semibold text-brand-green-light whitespace-nowrap touch-manipulation">История →</Link>
        </div>

        {/* 6. Subscription card or CTA — fills remaining space */}
        <div className="flex-1 min-h-0">
          {subscription ? (
            <DarkCard className="h-full overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-brand-green to-[#159a6e] px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">♻️</span>
                  <div>
                    <p className="text-white font-raleway font-bold text-sm leading-tight">Вывоз мусора</p>
                    <p className="text-white/70 text-xs">Еженедельно</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Активна
                </span>
              </div>
              <div className="px-4 py-3 flex-1 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Тариф</p>
                    <p className="font-raleway font-black text-lg text-white">{PLAN_LABELS[subscription.plan] ?? subscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Стоимость</p>
                    <p className="font-semibold text-white text-sm">{formatPrice(subscription.price)}<span className="text-white/40 text-xs font-normal">/мес</span></p>
                  </div>
                </div>
                <p className="text-xs text-brand-green-light font-semibold">✓ Скидка 10% на все услуги активна</p>
              </div>
            </DarkCard>
          ) : (
            <DarkCard className="h-full overflow-hidden border-dashed border-brand-green/20 bg-brand-green/[0.04] flex flex-col items-center justify-center p-4 text-center">
              <p className="font-raleway font-bold text-white/80 mb-1 text-sm">Подключите подписку</p>
              <p className="text-white/40 text-xs mb-3 leading-snug">Вывоз мусора + скидка 10% на все услуги</p>
              <Button onClick={() => setSubscriptionModalOpen(true)}>Подключить</Button>
            </DarkCard>
          )}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP LAYOUT — scrollable, full content
          ═══════════════════════════════════════════════════════════ */}
      <main className="hidden lg:block">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-4">

          {/* ── 1. Greeting ─────────────────────────────────────── */}
          <div className="animate-fade-in pt-1">
            <h1 className="font-raleway font-black text-2xl md:text-3xl text-white">
              {getGreeting(user.name)}
            </h1>
            <div className="mt-2">
              {subscription ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green-light bg-brand-green/15 border border-brand-green/20 px-3 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                  Подписка активна · {PLAN_LABELS[subscription.plan] ?? subscription.plan}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 bg-white/[0.06] px-3 py-1 rounded-full">
                  Нет активной подписки
                </span>
              )}
            </div>
          </div>

          {/* ── 2. Next visit ────────────────────────────────────── */}
          <div className="animate-fade-in" style={{ animationDelay: "0.06s" }}>
            {nextOrder ? (() => {
              const d       = new Date(nextOrder.scheduledAt);
              const day     = d.toLocaleString("ru", { day: "numeric" });
              const month   = d.toLocaleString("ru", { month: "long" });
              const weekday = d.toLocaleString("ru", { weekday: "long" });
              const time    = d.toLocaleString("ru", { hour: "2-digit", minute: "2-digit" });
              return (
                <div className="relative bg-brand-green/10 border border-brand-green/20 rounded-2xl overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green rounded-l-2xl" />
                  <div className="pl-6 pr-5 py-5 flex items-center gap-5">
                    {/* Calendar block */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-brand-green/20 rounded-xl w-14 h-14">
                      <span className="font-raleway font-black text-2xl text-brand-green-light leading-none">{day}</span>
                      <span className="text-brand-green-light/70 text-[11px] font-semibold uppercase tracking-wide leading-none mt-0.5">{month.slice(0, 3)}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-0.5">Ближайший визит</p>
                      <h2 className="font-raleway font-black text-lg text-white leading-tight truncate">
                        {SERVICE_LABELS[nextOrder.serviceType] ?? nextOrder.serviceType}
                      </h2>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-brand-green-light font-semibold text-sm">
                          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {weekday}, {time}
                        </span>
                        {nextOrder.address && (
                          <span className="flex items-center gap-1 text-white/40 text-xs truncate">
                            <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {nextOrder.address.address}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex-shrink-0">
                      <Badge variant={statusVariantMap[nextOrder.status] ?? "default"}>
                        {getOrderStatusLabel(nextOrder.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <DarkCard className="border-dashed p-8 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-semibold text-white/70 mb-1">Нет запланированных визитов</p>
                <p className="text-white/40 text-sm mb-4">Закажите первую услугу — и мы приедем</p>
                <button onClick={() => openOrderModal()} className="text-brand-green-light font-semibold text-sm hover:text-brand-green transition-colors">
                  Заказать услугу →
                </button>
              </DarkCard>
            )}
          </div>

          {/* ── 3. Order CTA ─────────────────────────────────────── */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openOrderModal()}
                className="flex-1 flex items-center justify-between gap-4 bg-brand-green hover:bg-brand-green/90 text-white px-6 py-5 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-green/25 active:scale-[0.99] group"
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

              {orders.length > 0 && (() => {
                const last = orders[0];
                const svc  = SERVICES.find(s => s.id === last.serviceType);
                if (!svc) return null;
                return (
                  <button
                    onClick={() => openOrderModal(last.serviceType)}
                    className="sm:w-48 flex items-center gap-3 px-5 py-5 bg-white/[0.06] border border-white/10 hover:border-brand-green/40 hover:bg-white/[0.09] rounded-2xl transition-all duration-200 text-left group"
                  >
                    <span className="text-2xl flex-shrink-0">{svc.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-white/40 font-medium">Повторить</p>
                      <p className="font-semibold text-sm text-white/80 truncate group-hover:text-brand-green-light transition-colors">
                        {svc.title}
                      </p>
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* ── 4. Stats row ─────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "0.12s" }}>
            <DarkCard className="p-4">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Визитов</p>
              <p className="font-raleway font-black text-3xl text-white leading-none">{thisMonthOrders.length}</p>
              <p className="text-white/30 text-xs mt-1.5">в этом месяце</p>
            </DarkCard>

            <DarkCard className="p-4">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Подписка</p>
              {subscription ? (
                <>
                  <p className="font-raleway font-bold text-sm text-white leading-tight">
                    {PLAN_LABELS[subscription.plan] ?? subscription.plan}
                  </p>
                  <p className="text-white/30 text-xs mt-1.5">активна</p>
                </>
              ) : (
                <p className="text-white/40 font-semibold text-sm mt-1">Нет</p>
              )}
            </DarkCard>

            <DarkCard className="p-4">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">Платёж</p>
              {subscription ? (
                <>
                  <p className="font-raleway font-bold text-sm text-white leading-tight">
                    {formatPrice(subscription.price)}
                  </p>
                  <p className="text-white/30 text-xs mt-1.5">ежемесячно</p>
                </>
              ) : (
                <Link href="/#pricing" className="text-brand-green-light text-xs font-semibold mt-1 block hover:text-brand-green transition-colors">
                  Выбрать тариф →
                </Link>
              )}
            </DarkCard>
          </div>

          {/* ── 5. ДомоКоины ─────────────────────────────────────── */}
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="bg-[#F5C518]/[0.07] border border-[#F5C518]/[0.12] rounded-2xl p-5 flex items-center gap-4">
              <div className="flex-shrink-0">
                <DomoCoinIcon size={44} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">ДомоКоины</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-raleway font-black text-3xl text-white tabular-nums leading-none">
                    {coinBalance.toLocaleString("ru-RU")}
                  </span>
                  <span className="text-white/30 text-sm">= {coinBalance.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link href="/dashboard/coins" className="text-xs font-semibold text-brand-green-light hover:text-white transition-colors whitespace-nowrap">
                  История →
                </Link>
                <Link href="/dashboard/referral" className="text-xs font-semibold text-white/30 hover:text-white/60 transition-colors whitespace-nowrap">
                  Рефералы →
                </Link>
              </div>
            </div>
          </div>

          {/* ── 6. Active subscription card ──────────────────────── */}
          {subscription && (() => {
            const defaultAddress = user.addresses.find(a => a.isDefault) ?? user.addresses[0] ?? null;
            return (
              <div className="animate-fade-in" style={{ animationDelay: "0.18s" }}>
                <DarkCard className="overflow-hidden">
                  {/* Green gradient header */}
                  <div className="bg-gradient-to-r from-brand-green to-[#159a6e] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">♻️</span>
                      <div>
                        <p className="text-white font-raleway font-black text-base leading-tight">Вывоз мусора</p>
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
                          <p className="text-xs text-white/40 font-medium mb-0.5">Тариф</p>
                          <p className="font-raleway font-black text-lg text-white">
                            {PLAN_LABELS[subscription.plan] ?? subscription.plan}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 font-medium mb-0.5">Стоимость</p>
                          <p className="font-semibold text-white">
                            {formatPrice(subscription.price)}
                            <span className="text-white/40 font-normal text-sm">/мес</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 font-medium mb-0.5">Подключена</p>
                          <p className="font-semibold text-white">{formatDate(subscription.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm">Сменить</Button>
                      </div>
                    </div>
                    <div className="border-t border-white/[0.08] pt-3">
                      <p className="text-xs text-white/40 font-medium mb-1.5">Адрес обслуживания</p>
                      {defaultAddress ? (
                        <div className="flex items-start gap-2">
                          <svg className="h-4 w-4 text-brand-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-white/80">{defaultAddress.address}</p>
                            {defaultAddress.city && <p className="text-xs text-white/40 mt-0.5">{defaultAddress.city}</p>}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubscriptionModalOpen(true)}
                          className="text-sm text-brand-green-light font-semibold hover:text-brand-green transition-colors flex items-center gap-1"
                        >
                          + Указать адрес обслуживания
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-brand-green-light font-semibold">
                      ✓ Скидка 10% на все остальные услуги активна
                    </p>
                  </div>
                </DarkCard>
              </div>
            );
          })()}

          {/* ── 7. Pending review ────────────────────────────────── */}
          {pendingReview && (
            <div className="animate-fade-in" style={{ animationDelay: "0.18s" }}>
            <DarkCard className="p-6 border-[#F5C518]/20 bg-[#F5C518]/[0.04]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-raleway font-bold text-lg text-white mb-1">Оцените последний визит</h2>
                  <p className="text-white/40 text-sm">
                    {SERVICE_LABELS[pendingReview.serviceType]} · {formatDate(pendingReview.scheduledAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
                  <Button size="sm" onClick={() => setReviewOrder(pendingReview)}>Оставить отзыв</Button>
                </div>
              </div>
            </DarkCard>
            </div>
          )}

          {/* ── 8. No subscription CTA ───────────────────────────── */}
          {!subscription && (
            <div className="animate-fade-in" style={{ animationDelay: "0.20s" }}>
              <DarkCard className="border-dashed border-brand-green/20 p-6 text-center bg-brand-green/[0.04]">
                <p className="font-raleway font-bold text-white/80 mb-1">Подключите подписку</p>
                <p className="text-white/40 text-sm mb-4">Еженедельный вывоз мусора + скидка 10% на все услуги</p>
                <Button onClick={() => setSubscriptionModalOpen(true)}>Подключить</Button>
              </DarkCard>
            </div>
          )}

          {/* ── 9. Order history ─────────────────────────────────── */}
          <div className="animate-fade-in" style={{ animationDelay: "0.24s" }}>
            <div className="flex items-center justify-between mb-3 px-1">
              <SectionLabel>История заказов</SectionLabel>
              {orders.length > 5 && (
                <button
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className="text-brand-green-light text-xs font-semibold hover:text-brand-green transition-colors"
                >
                  {showAllOrders ? "Свернуть" : "Показать все"}
                </button>
              )}
            </div>
            <DarkCard className="overflow-hidden">
              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="font-semibold text-white/60 mb-1">Заказов пока нет</p>
                  <p className="text-white/30 text-sm">После первого визита история появится здесь</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {displayedOrders.map((order) => (
                    <div key={order.id} className="px-5 py-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white/80 text-sm truncate">
                          {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">{formatDate(order.scheduledAt)}</p>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        {order.review && <StarRating value={order.review.rating} readOnly size="sm" />}
                        <Badge variant={statusVariantMap[order.status] ?? "default"}>
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                        {order.status === "DONE" && !order.review && (
                          <button
                            onClick={() => setReviewOrder(order)}
                            className="text-brand-green-light text-xs font-semibold hover:text-brand-green transition-colors hidden sm:block"
                          >
                            Оценить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DarkCard>
          </div>

          {/* ── 10. Support ──────────────────────────────────────── */}
          <div className="animate-fade-in" style={{ animationDelay: "0.30s" }}>
            <SectionLabel>Связь с нами</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  href: `mailto:${CONTACT_INFO.email}`,
                  label: "Написать менеджеру",
                  sub: "Ответим за час",
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
                  label: "Telegram",
                  sub: "Ответ за 10 минут",
                  icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
                  external: true,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3.5 p-4 bg-white/[0.05] border border-white/[0.07] hover:border-brand-green/30 hover:bg-white/[0.08] rounded-2xl transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center flex-shrink-0 text-brand-green group-hover:bg-brand-green group-hover:text-white group-hover:border-brand-green transition-all duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white/80 text-sm">{item.label}</p>
                    <p className="text-white/30 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="h-4" />
        </div>
      </main>

      {/* ── Review modal ─────────────────────────────────────────── */}
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

      {/* ── Subscription modal ───────────────────────────────────── */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onSuccess={() => { setSubscriptionModalOpen(false); router.refresh(); }}
      />

      {/* ── Order form modal ─────────────────────────────────────── */}
      {orderModalOpen && (
        <OrderFormModal
          onClose={() => {
            setOrderModalOpen(false);
            router.refresh();
          }}
          preselectedService={orderModalServiceId}
        />
      )}
    </>
  );
}
