"use client";

import { useState, useCallback, useEffect } from "react";
import { SERVICE_LABELS } from "@/constants/services";
import { formatDate, getOrderStatusLabel, getOrderStatusColor, getOrderStatusDot, isActiveStatus } from "@/lib/utils";
import { OrderFormModal } from "@/components/orders/OrderFormModal";
import { StarRating } from "@/components/ui/StarRating";

type OrderStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NEW" | "DONE";

interface OrderAddress {
  id: string;
  address: string;
  label: string;
}

interface OrderReview {
  id: string;
  rating: number;
  comment?: string | null;
}

interface Order {
  id: string;
  serviceType: string;
  status: OrderStatus;
  scheduledAt: string;
  orderNumber?: string | null;
  confirmedDate?: string | null;
  confirmedTimeSlot?: string | null;
  confirmedPrice?: number | null;
  adminNote?: string | null;
  timeSlot?: string | null;
  comment?: string | null;
  address?: OrderAddress | null;
  review?: OrderReview | null;
}

const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "ACCEPTED", "IN_PROGRESS", "NEW"];
const HISTORY_STATUSES: OrderStatus[] = ["COMPLETED", "CANCELLED", "DONE"];

function StatusBadge({ status }: { status: string }) {
  const dotColor = getOrderStatusDot(status);
  const active = isActiveStatus(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(status)}`}>
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${dotColor} ${active ? "animate-pulse" : ""}`} />
      {getOrderStatusLabel(status)}
    </span>
  );
}

function StatusMessage({ order }: { order: Order }) {
  if (order.status === "PENDING" || order.status === "NEW") {
    return (
      <p className="text-amber-600/80 text-xs mt-2 flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Ждём подтверждения. Мы свяжемся с вами для согласования деталей.
      </p>
    );
  }
  if (order.status === "ACCEPTED") {
    const price = order.confirmedPrice ? `${Number(order.confirmedPrice).toLocaleString("ru-RU")} ₽` : "уточняется";
    const timeInfo = [
      order.confirmedDate ? new Date(order.confirmedDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) : null,
      order.confirmedTimeSlot ?? order.timeSlot,
    ].filter(Boolean).join(" · ");
    return (
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 space-y-0.5">
        {timeInfo && <p className="text-blue-700 text-xs font-medium">{timeInfo}</p>}
        <p className="text-blue-600 text-xs">Стоимость: <span className="font-semibold">{price}</span></p>
        {order.adminNote && <p className="text-blue-500 text-xs italic">{order.adminNote}</p>}
      </div>
    );
  }
  if (order.status === "IN_PROGRESS") {
    return (
      <p className="text-brand-green text-xs mt-2 flex items-center gap-1.5 font-medium">
        <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse flex-shrink-0" />
        Наша команда работает над вашим заказом
      </p>
    );
  }
  return null;
}

interface ReviewModalProps {
  order: Order;
  onClose: () => void;
  onSubmitted: () => void;
}

function ReviewModal({ order, onClose, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, rating, comment }),
      });
      onSubmitted();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F1A16] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <h3 className="font-raleway font-black text-lg text-white">Оставить отзыв</h3>
          <p className="text-white/40 text-sm mt-1">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</p>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">Ваша оценка</p>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">Комментарий</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Что понравилось или что можно улучшить?"
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-green/50 resize-none transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/[0.10] text-white/50 text-sm font-semibold hover:text-white hover:border-white/20 transition-all">
              Закрыть
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white text-sm font-bold transition-all disabled:opacity-60"
            >
              {loading ? "Отправляем..." : "Отправить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  initialOrders: Order[];
}

export function OrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status as OrderStatus));
  const historyOrders = orders.filter((o) => HISTORY_STATUSES.includes(o.status as OrderStatus));

  // Poll every 30s
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?limit=50");
      if (res.ok) {
        const json = await res.json();
        setOrders(json.data ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchOrders, 30_000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function cancelOrder(id: string) {
    setCancellingId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "CANCELLED" as OrderStatus } : o));
    } finally {
      setCancellingId(null);
    }
  }

  function renderOrder(order: Order) {
    const isActive = ACTIVE_STATUSES.includes(order.status as OrderStatus);
    const isCompleted = order.status === "COMPLETED" || order.status === "DONE";
    const canCancel = order.status === "PENDING" || order.status === "NEW";

    return (
      <div key={order.id} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 space-y-3 hover:border-white/[0.12] transition-all duration-200">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {order.orderNumber && (
              <p className="text-white/30 text-[10px] font-mono mb-1">{order.orderNumber}</p>
            )}
            <h3 className="font-raleway font-bold text-white text-base leading-tight">
              {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
            </h3>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Status message */}
        <StatusMessage order={order} />

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            {formatDate(order.scheduledAt)}
          </span>
          {(order.timeSlot || order.confirmedTimeSlot) && (
            <span className="text-white/40 text-xs">
              {order.confirmedTimeSlot ?? order.timeSlot}
            </span>
          )}
          {order.address && (
            <span className="flex items-center gap-1.5 text-white/30 text-xs truncate max-w-[200px]">
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {order.address.address}
            </span>
          )}
        </div>

        {/* Review (completed) */}
        {isCompleted && order.review && (
          <div className="flex items-center gap-2 pt-1">
            <StarRating value={order.review.rating} readOnly size="sm" />
            {order.review.comment && (
              <p className="text-white/30 text-xs truncate">{order.review.comment}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {isCompleted && !order.review && (
            <button
              onClick={() => setReviewOrder(order)}
              className="flex-1 py-2.5 rounded-xl bg-brand-green/10 border border-brand-green/20 text-brand-green font-semibold text-sm hover:bg-brand-green/20 transition-all"
            >
              Оставить отзыв
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => cancelOrder(order.id)}
              disabled={cancellingId === order.id}
              className="py-2.5 px-4 rounded-xl border border-white/[0.08] text-white/30 text-sm font-medium hover:border-red-500/30 hover:text-red-400 transition-all disabled:opacity-40"
            >
              {cancellingId === order.id ? "Отменяем..." : "Отменить"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══════════ MOBILE LAYOUT ═══════════ */}
      <div className="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-3">
          <h1 className="font-raleway font-black text-xl text-white">Мои заказы</h1>
          <button
            onClick={() => setNewOrderOpen(true)}
            className="flex items-center gap-1.5 bg-brand-green text-white px-3.5 py-2 rounded-xl text-sm font-bold touch-manipulation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Заказ
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex gap-1 bg-white/[0.05] p-1 rounded-xl mx-4 mb-3">
          <button
            onClick={() => setTab("active")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all touch-manipulation ${
              tab === "active" ? "bg-white/[0.10] text-white" : "text-white/30"
            }`}
          >
            Активные
            {activeOrders.length > 0 && (
              <span className={`h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                tab === "active" ? "bg-brand-green text-white" : "bg-white/[0.08] text-white/40"
              }`}>{activeOrders.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all touch-manipulation ${
              tab === "history" ? "bg-white/[0.10] text-white" : "text-white/30"
            }`}
          >
            История
            {historyOrders.length > 0 && (
              <span className={`h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                tab === "history" ? "bg-white/[0.08] text-white/60" : "bg-white/[0.06] text-white/30"
              }`}>{historyOrders.length}</span>
            )}
          </button>
        </div>

        {/* Scrollable orders list */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 space-y-3"
          style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {tab === "active" && (
            activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-semibold text-white/60 mb-1">Активных заказов нет</p>
                <p className="text-white/30 text-sm mb-4">Оформите заявку — мы приедем в удобное время</p>
                <button
                  onClick={() => setNewOrderOpen(true)}
                  className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2.5 rounded-xl text-sm font-bold touch-manipulation"
                >
                  Заказать услугу
                </button>
              </div>
            ) : activeOrders.map(renderOrder)
          )}
          {tab === "history" && (
            historyOrders.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-white/30 text-sm">История появится после выполнения заказов</p>
              </div>
            ) : historyOrders.map(renderOrder)
          )}
        </div>
      </div>

      {/* ═══════════ DESKTOP LAYOUT ═══════════ */}
      <div className="hidden lg:block max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-raleway font-black text-2xl text-white">Мои заказы</h1>
          <button
            onClick={() => setNewOrderOpen(true)}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Новый заказ
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.05] p-1 rounded-xl mb-6">
          <button
            onClick={() => setTab("active")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "active" ? "bg-white/[0.10] text-white" : "text-white/30 hover:text-white/60"
            }`}
          >
            Активные
            {activeOrders.length > 0 && (
              <span className={`h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                tab === "active" ? "bg-brand-green text-white" : "bg-white/[0.08] text-white/40"
              }`}>
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "history" ? "bg-white/[0.10] text-white" : "text-white/30 hover:text-white/60"
            }`}
          >
            История
            {historyOrders.length > 0 && (
              <span className={`h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                tab === "history" ? "bg-white/[0.08] text-white/60" : "bg-white/[0.06] text-white/30"
              }`}>
                {historyOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {tab === "active" && (
          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <svg className="h-7 w-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-semibold text-white/60 mb-1">Активных заказов нет</p>
                <p className="text-white/30 text-sm mb-5">Оформите первую заявку — мы приедем в удобное время</p>
                <button
                  onClick={() => setNewOrderOpen(true)}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all"
                >
                  Заказать услугу
                </button>
              </div>
            ) : (
              activeOrders.map(renderOrder)
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-3">
            {historyOrders.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-white/30 text-sm">История заказов появится здесь после выполнения</p>
              </div>
            ) : (
              historyOrders.map(renderOrder)
            )}
          </div>
        )}
      </div>

      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSubmitted={() => {
            setReviewOrder(null);
            fetchOrders();
          }}
        />
      )}

      {newOrderOpen && (
        <OrderFormModal
          onClose={() => {
            setNewOrderOpen(false);
            fetchOrders();
          }}
        />
      )}
    </>
  );
}
