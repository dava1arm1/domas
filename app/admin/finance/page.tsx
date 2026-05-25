"use client";

import { useState, useEffect, useCallback } from "react";
import { formatPrice, formatDate } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  provider: string;
  createdAt: string;
  user: { name: string; email: string };
  order?: { serviceType: string } | null;
}

interface ApiResponse {
  payments: Payment[];
  total: number;
  totalPages: number;
  mrr: number;
  totalRevenue: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Ожидание",
  SUCCEEDED: "Успешно",
  FAILED: "Ошибка",
  REFUNDED: "Возврат",
};

const STATUS_BADGE: Record<PaymentStatus, string> = {
  PENDING: "bg-blue-100 text-blue-700",
  SUCCEEDED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const PROVIDER_LABELS: Record<string, string> = {
  yukassa: "ЮKassa",
  card: "Карта",
  manual: "Ручной",
};

const SERVICE_LABELS: Record<string, string> = {
  CLEANING: "Уборка",
  LAUNDRY: "Стирка",
  IRONING: "Глажка",
  COOKING: "Готовка",
  SHOPPING: "Покупки",
  OTHER: "Другое",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function TrendUp() {
  return (
    <svg className="h-4 w-4 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/payments?${params}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleRefund = async (payment: Payment) => {
    const confirmed = window.confirm(
      `Вернуть платёж ${formatPrice(payment.amount)} клиенту ${payment.user.name}?\n\nЭто действие необратимо.`
    );
    if (!confirmed) return;

    setRefundingId(payment.id);
    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === payment.id ? { ...p, status: "REFUNDED" as PaymentStatus } : p
        ),
      };
    });
    try {
      await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: payment.id }),
      });
    } catch {
      // Revert
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          payments: prev.payments.map((p) =>
            p.id === payment.id ? { ...p, status: payment.status } : p
          ),
        };
      });
    } finally {
      setRefundingId(null);
    }
  };

  const exportCSV = () => {
    if (!data) return;
    const header = "Дата,Клиент,Email,Сумма,Статус,Метод оплаты\n";
    const rows = data.payments.map((p) =>
      [
        `"${formatDate(p.createdAt)}"`,
        `"${p.user.name}"`,
        `"${p.user.email}"`,
        p.amount,
        `"${STATUS_LABELS[p.status]}"`,
        `"${PROVIDER_LABELS[p.provider] ?? p.provider}"`,
      ].join(",")
    ).join("\n");
    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `domas-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mrr = data?.mrr ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;
  const arr = mrr * 12;

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6b7280]">Общая выручка</p>
            <TrendUp />
          </div>
          <p className="text-3xl font-bold text-[#111827]">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-[#6b7280] mt-1">за всё время</p>
        </div>

        {/* MRR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6b7280]">MRR этого месяца</p>
            <TrendUp />
          </div>
          <p className="text-3xl font-bold text-[#1D9E75]">{formatPrice(mrr)}</p>
          <p className="text-xs text-[#6b7280] mt-1">ежемесячная выручка</p>
        </div>

        {/* ARR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6b7280]">ARR (оценка)</p>
            <TrendUp />
          </div>
          <p className="text-3xl font-bold text-[#5DCAA5]">{formatPrice(arr)}</p>
          <p className="text-xs text-[#6b7280] mt-1">MRR × 12</p>
        </div>
      </div>

      {/* ── Filters + Export ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: "", label: "Все" },
            { value: "SUCCEEDED", label: "Успешно" },
            { value: "PENDING", label: "Ожидание" },
            { value: "FAILED", label: "Ошибка" },
            { value: "REFUNDED", label: "Возврат" },
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

        <button
          onClick={exportCSV}
          disabled={!data || data.payments.length === 0}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-gray-200 text-[#6b7280] bg-white hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Экспорт CSV
        </button>
      </div>

      {/* ── Payments table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Дата</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Клиент</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Сумма</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Статус</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Метод</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Заказ</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6b7280]">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#6b7280]">
                      <Spinner />
                      <span>Загрузка...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-[#6b7280] text-sm">Платежи не найдены</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#111827]">{payment.user.name}</p>
                      <p className="text-xs text-[#6b7280]">{payment.user.email}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#111827] whitespace-nowrap">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[payment.status]}`}>
                        {STATUS_LABELS[payment.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {PROVIDER_LABELS[payment.provider] ?? payment.provider}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {payment.order
                        ? (SERVICE_LABELS[payment.order.serviceType] ?? payment.order.serviceType)
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === "SUCCEEDED" ? (
                        <button
                          onClick={() => handleRefund(payment)}
                          disabled={refundingId === payment.id}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60 whitespace-nowrap"
                        >
                          {refundingId === payment.id && <Spinner />}
                          Вернуть
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
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
