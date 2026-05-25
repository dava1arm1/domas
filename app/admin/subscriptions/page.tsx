"use client";

import { useState, useEffect, useCallback } from "react";
import { formatPrice, formatDate, getInitials } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";
type PlanType = "BASIC" | "COMFORT" | "MAX";

interface Subscription {
  id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  price: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
}

interface ApiResponse {
  subscriptions: Subscription[];
  expiringSoon: Subscription[];
  total: number;
  totalPages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<PlanType, string> = {
  BASIC: "Базовый",
  COMFORT: "Комфорт",
  MAX: "Максимум",
};

const PLAN_BADGE: Record<PlanType, string> = {
  BASIC: "bg-blue-100 text-blue-700",
  COMFORT: "bg-purple-100 text-purple-700",
  MAX: "bg-amber-100 text-amber-700",
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: "Активна",
  PAUSED: "Приостановлена",
  CANCELLED: "Отменена",
};

const STATUS_BADGE: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function plus30Days(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString();
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      if (planFilter) params.set("plan", planFilter);
      const res = await fetch(`/api/admin/subscriptions?${params}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, planFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [statusFilter, planFilter]);

  const handleRenew = async (sub: Subscription) => {
    setRenewingId(sub.id);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sub.id, endDate: plus30Days() }),
      });
      const updated = await res.json();
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subscriptions: prev.subscriptions.map((s) => s.id === sub.id ? { ...s, ...updated } : s),
          expiringSoon: prev.expiringSoon.filter((s) => s.id !== sub.id),
        };
      });
    } finally {
      setRenewingId(null);
    }
  };

  const handleStatusChange = async (sub: Subscription, newStatus: SubscriptionStatus) => {
    setUpdatingId(sub.id);
    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        subscriptions: prev.subscriptions.map((s) =>
          s.id === sub.id ? { ...s, status: newStatus } : s
        ),
      };
    });
    try {
      await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sub.id, status: newStatus }),
      });
    } catch {
      // Revert on error
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subscriptions: prev.subscriptions.map((s) =>
            s.id === sub.id ? { ...s, status: sub.status } : s
          ),
        };
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // ── KPI ──────────────────────────────────────────────────────────────────

  const activeCount = data?.subscriptions.filter((s) => s.status === "ACTIVE").length ?? 0;
  const expiringSoonCount = data?.expiringSoon.length ?? 0;
  const avgPrice = data?.subscriptions.length
    ? data.subscriptions.reduce((sum, s) => sum + s.price, 0) / data.subscriptions.length
    : 0;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-[#6b7280] mb-1">Активных подписок</p>
          <p className="text-3xl font-bold text-[#111827]">{activeCount}</p>
          <p className="text-xs text-[#6b7280] mt-1">из {data?.total ?? 0} всего</p>
        </div>

        {/* Expiring soon */}
        <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-6">
          <p className="text-sm text-amber-700 mb-1">Истекает скоро</p>
          <p className="text-3xl font-bold text-amber-600">{expiringSoonCount}</p>
          <p className="text-xs text-amber-600 mt-1">в ближайшие 7 дней</p>
        </div>

        {/* Avg price */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-[#6b7280] mb-1">Среднее значение</p>
          <p className="text-3xl font-bold text-[#1D9E75]">
            {avgPrice > 0 ? formatPrice(Math.round(avgPrice)) : "—"}
          </p>
          <p className="text-xs text-[#6b7280] mt-1">средняя цена подписки</p>
        </div>
      </div>

      {/* ── Expiring soon section ── */}
      {(data?.expiringSoon.length ?? 0) > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="font-semibold text-amber-800">Истекает в ближайшие 7 дней</h2>
          </div>
          <div className="space-y-3">
            {data!.expiringSoon.map((sub) => {
              const days = daysUntil(sub.endDate);
              return (
                <div key={sub.id} className="flex items-center justify-between gap-4 bg-white rounded-lg px-4 py-3 border border-amber-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold flex-shrink-0">
                      {getInitials(sub.user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{sub.user.name}</p>
                      <p className="text-xs text-[#6b7280] truncate">{sub.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_BADGE[sub.plan]}`}>
                      {PLAN_LABELS[sub.plan]}
                    </span>
                    <span className="text-xs text-amber-700 font-medium whitespace-nowrap">
                      {days <= 0 ? "Сегодня" : `${days} дн.`}
                    </span>
                    <button
                      onClick={() => handleRenew(sub)}
                      disabled={renewingId === sub.id}
                      className="inline-flex items-center gap-1.5 bg-[#1D9E75] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#1D9E75]/90 transition-colors disabled:opacity-60"
                    >
                      {renewingId === sub.id && <Spinner />}
                      Продлить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5">
          {[
            { value: "", label: "Все статусы" },
            { value: "ACTIVE", label: "Активные" },
            { value: "PAUSED", label: "Приостановленные" },
            { value: "CANCELLED", label: "Отменённые" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                statusFilter === opt.value
                  ? "bg-[#1D9E75] text-white"
                  : "bg-white border border-gray-200 text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {[
            { value: "", label: "Все тарифы" },
            { value: "BASIC", label: "Базовый" },
            { value: "COMFORT", label: "Комфорт" },
            { value: "MAX", label: "Максимум" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPlanFilter(opt.value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                planFilter === opt.value
                  ? "bg-[#1D9E75] text-white"
                  : "bg-white border border-gray-200 text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Клиент</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Тариф</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Статус</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Начало</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Окончание</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Цена</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#6b7280]">
                      <Spinner />
                      <span>Загрузка...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.subscriptions.length === 0 ? (
                <EmptyState message="Подписки не найдены" />
              ) : (
                data?.subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    {/* Avatar + name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
                          {getInitials(sub.user.name)}
                        </div>
                        <span className="font-medium text-[#111827] whitespace-nowrap">{sub.user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">{sub.user.email}</td>
                    {/* Plan badge */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_BADGE[sub.plan]}`}>
                        {PLAN_LABELS[sub.plan]}
                      </span>
                    </td>
                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[sub.status]}`}>
                        {STATUS_LABELS[sub.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{formatDate(sub.startDate)}</td>
                    <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{formatDate(sub.endDate)}</td>
                    <td className="px-4 py-3 font-medium text-[#111827] whitespace-nowrap">{formatPrice(sub.price)}</td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {sub.status !== "PAUSED" && sub.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatusChange(sub, "PAUSED")}
                            disabled={updatingId === sub.id}
                            className="text-xs px-2.5 py-1 rounded-lg border border-yellow-200 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors disabled:opacity-60 whitespace-nowrap"
                          >
                            {updatingId === sub.id ? <Spinner /> : "Приостановить"}
                          </button>
                        )}
                        {sub.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatusChange(sub, "CANCELLED")}
                            disabled={updatingId === sub.id}
                            className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60 whitespace-nowrap"
                          >
                            {updatingId === sub.id ? <Spinner /> : "Отменить"}
                          </button>
                        )}
                        {sub.status === "CANCELLED" && (
                          <span className="text-xs text-[#6b7280]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {data && data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-sm text-[#6b7280]">
              Страница {page} из {data.totalPages} · всего {data.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-[#6b7280] hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-[#6b7280] hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
