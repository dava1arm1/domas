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
type OrderStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NEW" | "DONE";

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
  orderNumber?: string | null;
  user: OrderUser;
  address?: OrderAddress | null;
  serviceType: string;
  status: OrderStatus;
  scheduledAt: string;
  timeSlot?: string | null;
  confirmedDate?: string | null;
  confirmedTimeSlot?: string | null;
  confirmedPrice?: number | null;
  adminNote?: string | null;
  teamNote?: string | null;
  price: number;
  comment?: string | null;
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
}[] = [
  { status: "PENDING",     label: "Новые",       headerBg: "bg-amber-500",    colBg: "bg-amber-50/60",  colBorder: "border-amber-200" },
  { status: "ACCEPTED",    label: "Принятые",    headerBg: "bg-blue-500",     colBg: "bg-blue-50/60",   colBorder: "border-blue-200" },
  { status: "IN_PROGRESS", label: "В работе",    headerBg: "bg-yellow-500",   colBg: "bg-yellow-50/60", colBorder: "border-yellow-200" },
  { status: "COMPLETED",   label: "Выполнены",   headerBg: "bg-[#1D9E75]",   colBg: "bg-green-50/60",  colBorder: "border-green-200" },
  { status: "CANCELLED",   label: "Отменены",    headerBg: "bg-gray-400",     colBg: "bg-gray-50/60",   colBorder: "border-gray-200" },
];

// ─── Icons ────────────────────────────────────────────────────
const Icons = {
  Kanban: () => (<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>),
  Table: () => (<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>),
  Search: () => (<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>),
  X: () => (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>),
  Dots: () => (<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>),
  MapPin: () => (<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
  Calendar: () => (<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
  EmptyBox: () => (<svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>),
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className ?? ""}`} />;
}

// ─── Accept Modal ─────────────────────────────────────────────
interface AcceptModalProps {
  order: Order;
  onClose: () => void;
  onAccepted: (id: string, data: Partial<Order>) => void;
}

function AcceptModal({ order, onClose, onAccepted }: AcceptModalProps) {
  const [confirmedDate, setConfirmedDate] = useState(
    order.confirmedDate ? order.confirmedDate.slice(0, 10) : order.scheduledAt.slice(0, 10)
  );
  const [confirmedTimeSlot, setConfirmedTimeSlot] = useState(order.confirmedTimeSlot ?? order.timeSlot ?? "");
  const [confirmedPrice, setConfirmedPrice] = useState(order.confirmedPrice ? String(order.confirmedPrice) : "");
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
  const [saving, setSaving] = useState(false);

  const TIME_SLOTS = ["08:00–10:00","10:00–12:00","12:00–14:00","14:00–16:00","16:00–18:00"];

  async function handleAccept() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          confirmedDate: confirmedDate || null,
          confirmedTimeSlot: confirmedTimeSlot || null,
          confirmedPrice: confirmedPrice ? Number(confirmedPrice) : null,
          adminNote: adminNote || null,
        }),
      });
      if (res.ok) {
        onAccepted(order.id, {
          status: "ACCEPTED",
          confirmedDate: confirmedDate || null,
          confirmedTimeSlot: confirmedTimeSlot || null,
          confirmedPrice: confirmedPrice ? Number(confirmedPrice) : null,
          adminNote: adminNote || null,
        });
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-raleway font-bold text-gray-900">Принять заявку</h3>
            <p className="text-xs text-gray-400 mt-0.5">{order.orderNumber ?? "#" + order.id.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Icons.X /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Client info */}
          <div className="bg-gray-50 rounded-xl p-3 text-sm">
            <p className="font-semibold text-gray-900">{order.user.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</p>
            {order.comment && <p className="text-gray-400 text-xs mt-1 italic">{order.comment}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Дата визита</label>
              <input
                type="date"
                value={confirmedDate}
                onChange={(e) => setConfirmedDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Стоимость, ₽</label>
              <input
                type="number"
                value={confirmedPrice}
                onChange={(e) => setConfirmedPrice(e.target.value)}
                placeholder="Уточняется"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Временной слот</label>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setConfirmedTimeSlot(confirmedTimeSlot === s ? "" : s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    confirmedTimeSlot === s ? "bg-[#1D9E75] border-[#1D9E75] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Сообщение клиенту</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={2}
              placeholder="Дополнительная информация..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75]"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Отмена</button>
          <button
            onClick={handleAccept}
            disabled={saving}
            className="flex-1 py-2.5 bg-[#1D9E75] text-white text-sm font-semibold rounded-lg hover:bg-[#1D9E75]/90 disabled:opacity-60 transition-colors"
          >
            {saving ? "Принимаем..." : "Принять заявку ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────
interface RejectModalProps {
  order: Order;
  onClose: () => void;
  onRejected: (id: string) => void;
}

function RejectModal({ order, onClose, onRejected }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const REASONS = ["Выбранная дата недоступна", "Район не обслуживается", "Неполная информация", "Другая причина"];

  async function handleReject() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: reason || null }),
      });
      if (res.ok) {
        onRejected(order.id);
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-raleway font-bold text-gray-900">Отклонить заявку</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Icons.X /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-2">Причина отказа</label>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[#1D9E75]"
                  />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Или напишите своё сообщение..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400"
          />
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Отмена</button>
          <button
            onClick={handleReject}
            disabled={saving}
            className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
          >
            {saving ? "Отклоняем..." : "Отклонить"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────
interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (id: string, data: Partial<Order>) => Promise<void>;
  onAccept: (order: Order) => void;
  onReject: (order: Order) => void;
}

function OrderModal({ order, onClose, onSave, onAccept, onReject }: OrderModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [teamNote, setTeamNote] = useState(order.teamNote ?? "");
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isPending = order.status === "PENDING" || order.status === "NEW";

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(order.id, { status, teamNote, adminNote });
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 800);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-raleway font-bold text-gray-900">
              {order.orderNumber ?? "#" + order.id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Создан {formatDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><Icons.X /></button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Client */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="h-9 w-9 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
              {getInitials(order.user.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{order.user.name}</p>
              <p className="text-xs text-gray-500">{order.user.email}</p>
              {order.user.phone && <p className="text-xs text-gray-500">{order.user.phone}</p>}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Услуга</p>
              <p className="font-medium text-gray-800">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Дата</p>
              <p className="font-medium text-gray-800">{order.scheduledAt ? formatDate(order.scheduledAt) : "—"}</p>
            </div>
            {(order.timeSlot || order.confirmedTimeSlot) && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Время</p>
                <p className="font-medium text-gray-800">{order.confirmedTimeSlot ?? order.timeSlot}</p>
              </div>
            )}
            {order.confirmedPrice != null && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Цена подтверждена</p>
                <p className="font-semibold text-[#1D9E75]">{formatPrice(order.confirmedPrice)}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">Адрес</p>
              <p className="font-medium text-gray-800">{order.address?.address ?? "—"}</p>
            </div>
          </div>

          {order.comment && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Комментарий клиента</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{order.comment}</p>
            </div>
          )}

          {/* Accept/Reject quick actions for PENDING */}
          {isPending && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { onClose(); onAccept(order); }}
                className="flex-1 py-2.5 bg-[#1D9E75] text-white text-sm font-semibold rounded-xl hover:bg-[#1D9E75]/90 transition-colors"
              >
                Принять заявку
              </button>
              <button
                onClick={() => { onClose(); onReject(order); }}
                className="flex-1 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
              >
                Отклонить
              </button>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Статус заказа</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white ${getOrderStatusColor(status)}`}
            >
              <option value="PENDING">В обработке</option>
              <option value="ACCEPTED">Принят</option>
              <option value="IN_PROGRESS">Выполняется</option>
              <option value="COMPLETED">Выполнен</option>
              <option value="CANCELLED">Отменён</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Сообщение клиенту</label>
            <input
              type="text"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Дата, время, цена или дополнение..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Заметка для команды</label>
            <textarea
              value={teamNote}
              onChange={(e) => setTeamNote(e.target.value)}
              rows={2}
              placeholder="Внутренняя заметка..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-colors"
            />
          </div>

          {order.review && (
            <div className="p-3 bg-amber-50 rounded-xl text-sm">
              <p className="text-xs font-medium text-amber-600 mb-1">
                Оценка: {"★".repeat(order.review.rating)}{"☆".repeat(5 - order.review.rating)}
              </p>
              {order.review.comment && <p className="text-gray-700">{order.review.comment}</p>}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Отмена</button>
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
  );
}

// ─── Kanban Card ──────────────────────────────────────────────
function KanbanCard({ order, onDragStart, onClick }: { order: Order; onDragStart: (e: React.DragEvent, o: Order) => void; onClick: (o: Order) => void }) {
  const isPending = order.status === "PENDING" || order.status === "NEW";
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order)}
      className={`bg-white rounded-xl border p-3.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 select-none ${isPending ? "border-amber-200 ring-1 ring-amber-200" : "border-gray-100"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-[10px] font-bold flex-shrink-0">
            {getInitials(order.user.name)}
          </div>
          <span className="text-sm font-semibold text-gray-900 truncate">{order.user.name}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClick(order); }} className="p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
          <Icons.Dots />
        </button>
      </div>

      {order.orderNumber && <p className="text-[10px] text-gray-300 font-mono mb-1">{order.orderNumber}</p>}

      <p className="text-xs text-gray-600 font-medium mb-2 truncate">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</p>

      {order.address && (
        <div className="flex items-center gap-1 text-gray-400 mb-1.5">
          <Icons.MapPin />
          <span className="text-[11px] truncate">{order.address.address}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1 text-gray-400">
          <Icons.Calendar />
          <span className="text-[11px]">{order.scheduledAt ? formatDate(order.scheduledAt) : "—"}</span>
        </div>
        {(order.confirmedPrice || order.price > 0) && (
          <span className="text-xs font-semibold text-gray-700">{formatPrice(order.confirmedPrice ?? order.price)}</span>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────
function KanbanColumn({ config, orders, onDragOver, onDrop, onDragStart, onCardClick, isDragOver }: {
  config: typeof COLUMNS[0];
  orders: Order[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: OrderStatus) => void;
  onDragStart: (e: React.DragEvent, order: Order) => void;
  onCardClick: (order: Order) => void;
  isDragOver: boolean;
}) {
  return (
    <div
      className={`flex-1 min-w-[200px] max-w-[300px] flex flex-col rounded-xl border-2 transition-colors duration-150 ${isDragOver ? "border-dashed border-[#1D9E75] bg-[#1D9E75]/5" : `${config.colBorder} ${config.colBg}`}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, config.status)}
    >
      <div className={`${config.headerBg} rounded-t-[10px] px-4 py-3 flex items-center justify-between`}>
        <span className="text-white text-sm font-semibold">{config.label}</span>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
      </div>
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto min-h-[100px]">
        {orders.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-6 italic">Пусто</p>
        ) : (
          orders.map((order) => (
            <KanbanCard key={order.id} order={order} onDragStart={onDragStart} onClick={onCardClick} />
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
  const [acceptOrder, setAcceptOrder] = useState<Order | null>(null);
  const [rejectOrder, setRejectOrder] = useState<Order | null>(null);
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
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, serviceFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Poll every 20s
  useEffect(() => {
    const interval = setInterval(fetchOrders, 20_000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filteredOrders = orders.filter((o) => {
    if (dateFrom && new Date(o.scheduledAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(o.scheduledAt) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  // Map legacy statuses to display columns
  const ordersByStatus = (status: OrderStatus) =>
    filteredOrders.filter((o) => {
      if (status === "PENDING") return o.status === "PENDING" || o.status === "NEW";
      if (status === "COMPLETED") return o.status === "COMPLETED" || o.status === "DONE";
      return o.status === status;
    });

  const pendingCount = ordersByStatus("PENDING").length;

  const draggingRef = useRef<Order | null>(null);

  function handleDragStart(e: React.DragEvent, order: Order) {
    draggingRef.current = order;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, status: OrderStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  }

  async function handleDrop(e: React.DragEvent, newStatus: OrderStatus) {
    e.preventDefault();
    setDragOverStatus(null);
    const order = draggingRef.current;
    draggingRef.current = null;
    if (!order || order.status === newStatus) return;
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o));
    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: order.status } : o));
    }
  }

  async function handleSaveOrder(id: string, data: Partial<Order>) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...data } : o));
      if (selectedOrder?.id === id) setSelectedOrder((prev) => prev ? { ...prev, ...data } : prev);
    }
  }

  async function handleTableStatusChange(id: string, newStatus: OrderStatus) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  function handleAccepted(id: string, data: Partial<Order>) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...data } : o));
  }

  function handleRejected(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "CANCELLED" } : o));
  }

  const serviceOptions = Object.entries(SERVICE_LABELS);

  return (
    <>
      <div className="p-6 lg:p-8 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-raleway font-bold text-2xl text-gray-900">Заказы</h1>
              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {pendingCount} новых
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{loading ? "Загрузка…" : `${filteredOrders.length} заказов`}</p>
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {(["kanban", "table"] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === v ? "bg-[#1D9E75] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                {v === "kanban" ? <Icons.Kanban /> : <Icons.Table />}
                {v === "kanban" ? "Канбан" : "Таблица"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Icons.Search /></div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по клиенту..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white" />
          </div>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 bg-white">
            <option value="">Все услуги</option>
            {serviceOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="Дата от"
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 bg-white" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="Дата до"
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 bg-white" />
          {(dateFrom || dateTo || serviceFilter || search) && (
            <button onClick={() => { setSearch(""); setServiceFilter(""); setDateFrom(""); setDateTo(""); }}
              className="px-3 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Сбросить
            </button>
          )}
        </div>

        {/* KANBAN VIEW */}
        {view === "kanban" && (
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-1 min-w-[200px] max-w-[300px]">
                  <Skeleton className="h-12 rounded-xl mb-2" />
                  <div className="space-y-2">{[0,1].map(j => <Skeleton key={j} className="h-28 rounded-xl" />)}</div>
                </div>
              ))
            ) : (
              COLUMNS.map((col) => (
                <KanbanColumn key={col.status} config={col} orders={ordersByStatus(col.status)} isDragOver={dragOverStatus === col.status}
                  onDragStart={handleDragStart} onDragOver={(e) => handleDragOver(e, col.status)} onDrop={handleDrop}
                  onCardClick={(order) => setSelectedOrder(order)} />
              ))
            )}
          </div>
        )}

        {/* TABLE VIEW */}
        {view === "table" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="flex gap-4"><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-36" /><Skeleton className="h-4 w-24" /></div>)}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-3"><Icons.EmptyBox /><p className="text-gray-500">Заказы не найдены</p></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100">
                      {["Клиент","Услуга","Адрес","Дата","Статус","Цена",""].map((h, i) => (
                        <th key={i} className={`px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider ${i === 0 || i === 6 ? "px-6" : ""} ${i >= 5 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className={`hover:bg-gray-50/50 transition-colors ${order.status === "PENDING" || order.status === "NEW" ? "bg-amber-50/30" : ""}`}>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">{getInitials(order.user.name)}</div>
                            <div>
                              <p className="font-medium text-gray-900 whitespace-nowrap">{order.user.name}</p>
                              <p className="text-xs text-gray-400">{order.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 max-w-[160px]"><span className="truncate block text-sm">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</span></td>
                        <td className="px-4 py-3.5 text-gray-500 max-w-[160px]"><span className="truncate block text-xs">{order.address?.address ?? "—"}</span></td>
                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap text-xs">{order.scheduledAt ? formatDateTime(order.scheduledAt) : "—"}</td>
                        <td className="px-4 py-3.5">
                          <select value={order.status} onChange={(e) => handleTableStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] font-medium ${getOrderStatusColor(order.status)}`}>
                            <option value="PENDING">В обработке</option>
                            <option value="ACCEPTED">Принят</option>
                            <option value="IN_PROGRESS">Выполняется</option>
                            <option value="COMPLETED">Выполнен</option>
                            <option value="CANCELLED">Отменён</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right font-medium text-gray-900 whitespace-nowrap">
                          {(order.confirmedPrice || order.price) ? formatPrice(order.confirmedPrice ?? order.price) : "—"}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {(order.status === "PENDING" || order.status === "NEW") && (
                              <button onClick={() => setAcceptOrder(order)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-[#1D9E75] rounded-lg hover:bg-[#1D9E75]/90 transition-colors">
                                Принять
                              </button>
                            )}
                            <button onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors">
                              Детали
                            </button>
                          </div>
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

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onSave={handleSaveOrder}
          onAccept={(o) => setAcceptOrder(o)} onReject={(o) => setRejectOrder(o)} />
      )}
      {acceptOrder && (
        <AcceptModal order={acceptOrder} onClose={() => setAcceptOrder(null)} onAccepted={handleAccepted} />
      )}
      {rejectOrder && (
        <RejectModal order={rejectOrder} onClose={() => setRejectOrder(null)} onRejected={handleRejected} />
      )}
    </>
  );
}
