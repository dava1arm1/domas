"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  formatPrice,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
  getOrderStatusColor,
  getInitials,
} from "@/lib/utils";
import { SERVICE_LABELS } from "@/constants/services";

// ─── Types ────────────────────────────────────────────────────
type OrderStatus = "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";

interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

interface OrderAddress {
  id: string;
  label: string;
  address: string;
}

interface OrderReview {
  rating: number;
  comment?: string | null;
}

interface Order {
  id: string;
  user: OrderUser;
  address?: OrderAddress | null;
  serviceType: string;
  status: OrderStatus;
  scheduledAt: string;
  price: number;
  comment?: string | null;
  teamNote?: string | null;
  review?: OrderReview | null;
  createdAt: string;
}

// ─── Column config ────────────────────────────────────────────
const COLUMNS: {
  status: OrderStatus;
  label: string;
  headerBg: string;
  colBg: string;
  colBorder: string;
  textColor: string;
}[] = [
  {
    status: "NEW",
    label: "Новые",
    headerBg: "bg-blue-500",
    colBg: "bg-blue-50/60",
    colBorder: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    status: "IN_PROGRESS",
    label: "В работе",
    headerBg: "bg-yellow-500",
    colBg: "bg-yellow-50/60",
    colBorder: "border-yellow-200",
    textColor: "text-yellow-700",
  },
  {
    status: "DONE",
    label: "Выполнены",
    headerBg: "bg-[#1D9E75]",
    colBg: "bg-green-50/60",
    colBorder: "border-green-200",
    textColor: "text-green-700",
  },
  {
    status: "CANCELLED",
    label: "Отменены",
    headerBg: "bg-gray-400",
    colBg: "bg-gray-50/60",
    colBorder: "border-gray-200",
    textColor: "text-gray-500",
  },
];

// ─── Skeleton ─────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className ?? ""}`} />;
}

// ─── Icons ────────────────────────────────────────────────────
const Icons = {
  Kanban: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  Table: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Search: () => (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  X: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Dots: () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  EmptyBox: () => (
    <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

// ─── Order Detail Modal ───────────────────────────────────────
interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (id: string, data: Partial<Pick<Order, "status" | "teamNote" | "price">>) => Promise<void>;
}

function OrderModal({ order, onClose, onSave }: OrderModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [teamNote, setTeamNote] = useState(order.teamNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(order.id, { status, teamNote });
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-raleway font-bold text-gray-900">Заказ #{order.id.slice(-8).toUpperCase()}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Создан {formatDate(order.createdAt)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Client */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="h-9 w-9 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
                {getInitials(order.user.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.user.name}</p>
                <p className="text-xs text-gray-500">{order.user.email}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Услуга</p>
                <p className="font-medium text-gray-800">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Цена</p>
                <p className="font-medium text-gray-800">{order.price ? formatPrice(order.price) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Дата</p>
                <p className="font-medium text-gray-800">{order.scheduledAt ? formatDateTime(order.scheduledAt) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Адрес</p>
                <p className="font-medium text-gray-800 truncate">{order.address?.address ?? "—"}</p>
              </div>
            </div>

            {order.comment && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Комментарий клиента</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{order.comment}</p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Статус заказа</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white"
              >
                <option value="NEW">Новый</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="DONE">Выполнен</option>
                <option value="CANCELLED">Отменён</option>
              </select>
            </div>

            {/* Team note */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Заметка для команды</label>
              <textarea
                value={teamNote}
                onChange={(e) => setTeamNote(e.target.value)}
                rows={3}
                placeholder="Внутренняя заметка для исполнителей..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-colors"
              />
            </div>

            {/* Review */}
            {order.review && (
              <div className="p-3 bg-amber-50 rounded-xl text-sm">
                <p className="text-xs font-medium text-amber-600 mb-1">
                  Оценка: {"★".repeat(order.review.rating)}{"☆".repeat(5 - order.review.rating)}
                </p>
                {order.review.comment && <p className="text-gray-700">{order.review.comment}</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#1D9E75] text-white text-sm font-medium rounded-lg hover:bg-[#1D9E75]/90 disabled:opacity-60 transition-colors"
            >
              {saving ? "Сохранение…" : saved ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────
interface KanbanCardProps {
  order: Order;
  onDragStart: (e: React.DragEvent, order: Order) => void;
  onClick: (order: Order) => void;
}

function KanbanCard({ order, onDragStart, onClick }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order)}
      className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-[10px] font-bold flex-shrink-0">
            {getInitials(order.user.name)}
          </div>
          <span className="text-sm font-semibold text-gray-900 truncate">{order.user.name}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(order); }}
          className="p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          aria-label="Детали"
        >
          <Icons.Dots />
        </button>
      </div>

      <p className="text-xs text-gray-600 font-medium mb-2 truncate">
        {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
      </p>

      {order.address && (
        <div className="flex items-center gap-1 text-gray-400 mb-1.5">
          <Icons.MapPin />
          <span className="text-[11px] truncate">{order.address.address}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1 text-gray-400">
          <Icons.Calendar />
          <span className="text-[11px]">
            {order.scheduledAt ? formatDate(order.scheduledAt) : "—"}
          </span>
        </div>
        {order.price > 0 && (
          <span className="text-xs font-semibold text-gray-700">{formatPrice(order.price)}</span>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────
interface KanbanColumnProps {
  config: typeof COLUMNS[0];
  orders: Order[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: OrderStatus) => void;
  onDragStart: (e: React.DragEvent, order: Order) => void;
  onCardClick: (order: Order) => void;
  isDragOver: boolean;
}

function KanbanColumn({ config, orders, onDragOver, onDrop, onDragStart, onCardClick, isDragOver }: KanbanColumnProps) {
  return (
    <div
      className={`flex-1 min-w-[220px] max-w-[320px] flex flex-col rounded-xl border-2 transition-colors duration-150 ${isDragOver ? "border-dashed border-[#1D9E75] bg-[#1D9E75]/5" : `${config.colBorder} ${config.colBg}`}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, config.status)}
    >
      {/* Column header */}
      <div className={`${config.headerBg} rounded-t-[10px] px-4 py-3 flex items-center justify-between`}>
        <span className="text-white text-sm font-semibold">{config.label}</span>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto min-h-[100px]">
        {orders.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-6 italic">Пусто</p>
        ) : (
          orders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              onDragStart={onDragStart}
              onClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
type ViewMode = "kanban" | "table";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("kanban");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<OrderStatus | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (serviceFilter) params.set("service", serviceFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      const json = await res.json();
      setOrders(json.orders ?? []);
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, serviceFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Client-side date filter
  const filteredOrders = orders.filter((o) => {
    if (dateFrom && o.scheduledAt && new Date(o.scheduledAt) < new Date(dateFrom)) return false;
    if (dateTo && o.scheduledAt && new Date(o.scheduledAt) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  const ordersByStatus = (status: OrderStatus) => filteredOrders.filter((o) => o.status === status);

  // ── Drag & Drop ──────────────────────────────────────────────
  const draggingRef = useRef<Order | null>(null);

  const handleDragStart = (e: React.DragEvent, order: Order) => {
    draggingRef.current = order;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: OrderStatus) => {
    e.preventDefault();
    setDragOverStatus(null);
    const order = draggingRef.current;
    draggingRef.current = null;
    if (!order || order.status === newStatus) return;

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o)
    );

    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Status update error:", err);
      // Revert on error
      setOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, status: order.status } : o)
      );
    }
  };

  // ── Save from modal ───────────────────────────────────────────
  const handleSaveOrder = async (id: string, data: Partial<Pick<Order, "status" | "teamNote" | "price">>) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => o.id === id ? { ...o, ...data } : o)
      );
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => prev ? { ...prev, ...data } : prev);
      }
    }
  };

  // ── Inline table status update ────────────────────────────────
  const handleTableStatusChange = async (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: newStatus } : o)
    );
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Table status update error:", err);
    }
  };

  const serviceOptions = Object.entries(SERVICE_LABELS);

  return (
    <>
      <div className="p-6 lg:p-8 space-y-5">

        {/* ── Header + View Toggle ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-raleway font-bold text-2xl text-gray-900">Заказы</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Загрузка…" : `${filteredOrders.length.toLocaleString("ru-RU")} заказов`}
            </p>
          </div>

          {/* View toggle pill */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {(["kanban", "table"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  view === v
                    ? "bg-[#1D9E75] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {v === "kanban" ? <Icons.Kanban /> : <Icons.Table />}
                {v === "kanban" ? "Канбан" : "Таблица"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по клиенту..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white transition-colors"
            />
          </div>

          {/* Service filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white"
          >
            <option value="">Все услуги</option>
            {serviceOptions.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Date from */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white"
            title="Дата от"
          />

          {/* Date to */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white"
            title="Дата до"
          />

          {(dateFrom || dateTo || serviceFilter || search) && (
            <button
              onClick={() => { setSearch(""); setServiceFilter(""); setDateFrom(""); setDateTo(""); }}
              className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* ── KANBAN VIEW ───────────────────────────────────────── */}
        {view === "kanban" && (
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-1 min-w-[220px] max-w-[320px]">
                  <Skeleton className="h-12 rounded-xl mb-2" />
                  <div className="space-y-2">
                    {[0, 1, 2].map((j) => <Skeleton key={j} className="h-28 rounded-xl" />)}
                  </div>
                </div>
              ))
            ) : (
              COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.status}
                  config={col}
                  orders={ordersByStatus(col.status)}
                  isDragOver={dragOverStatus === col.status}
                  onDragStart={handleDragStart}
                  onDragOver={(e) => handleDragOver(e, col.status)}
                  onDrop={handleDrop}
                  onCardClick={(order) => setSelectedOrder(order)}
                />
              ))
            )}
          </div>
        )}

        {/* ── TABLE VIEW ───────────────────────────────────────── */}
        {view === "table" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-3 text-center">
                  <Icons.EmptyBox />
                  <p className="text-gray-500 font-medium">Заказы не найдены</p>
                  <p className="text-gray-400 text-sm">Попробуйте изменить параметры фильтрации</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100">
                      <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Клиент</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Услуга</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Адрес</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Дата</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Статус</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Цена</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
                              {getInitials(order.user.name)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 whitespace-nowrap">{order.user.name}</p>
                              <p className="text-xs text-gray-400">{order.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 max-w-[160px]">
                          <span className="truncate block text-sm">
                            {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 max-w-[160px]">
                          <span className="truncate block text-xs">{order.address?.address ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                          {order.scheduledAt ? formatDateTime(order.scheduledAt) : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => handleTableStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] font-medium ${getOrderStatusColor(order.status)}`}
                          >
                            <option value="NEW">Новый</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="DONE">Выполнен</option>
                            <option value="CANCELLED">Отменён</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right font-medium text-gray-900 whitespace-nowrap">
                          {order.price ? formatPrice(order.price) : "—"}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                          >
                            Детали
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── Order Modal ───────────────────────────────────────── */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleSaveOrder}
        />
      )}
    </>
  );
}
