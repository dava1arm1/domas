"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  formatDate,
  formatDateTime,
  formatPhone,
  getInitials,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";
import { PLAN_LABELS } from "@/constants/pricing";
import { SERVICE_LABELS } from "@/constants/services";

// ─── Types ────────────────────────────────────────────────────
interface ClientSubscription {
  plan: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  subscriptions: ClientSubscription[];
  _count: { orders: number };
}

interface ClientOrder {
  id: string;
  serviceType: string;
  status: string;
  scheduledAt: string;
  price: number;
}

interface ClientAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

// ─── Skeleton ─────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className ?? ""}`} />;
}

// ─── Icons ────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Download: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  X: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  MapPin: () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  EmptyBox: () => (
    <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

// ─── Subscription badge ───────────────────────────────────────
function SubBadge({ sub }: { sub?: ClientSubscription }) {
  if (!sub) return <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Нет</span>;
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PAUSED: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status] ?? "bg-gray-100 text-gray-500"}`}>
      {PLAN_LABELS[sub.plan] ?? sub.plan}
    </span>
  );
}

// ─── Slide-over panel ─────────────────────────────────────────
interface SlideOverProps {
  client: Client | null;
  onClose: () => void;
  allOrders: ClientOrder[];
  allAddresses: ClientAddress[];
  loadingDetail: boolean;
}

function SlideOver({ client, onClose, allOrders, allAddresses, loadingDetail }: SlideOverProps) {
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSaveNote = () => {
    // Local only — no API endpoint for notes yet
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  if (!client) return null;

  const sub = client.subscriptions[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] font-bold text-sm flex-shrink-0">
              {getInitials(client.name)}
            </div>
            <div>
              <h3 className="font-raleway font-bold text-gray-900 text-[15px]">{client.name}</h3>
              <SubBadge sub={sub} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Закрыть"
          >
            <Icons.X />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Contact info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Контакты</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[180px]">{client.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Телефон</span>
                <span className="font-medium text-gray-900">{client.phone ? formatPhone(client.phone) : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Регистрация</span>
                <span className="font-medium text-gray-900">{formatDate(client.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Заказов</span>
                <span className="font-medium text-gray-900">{client._count.orders}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {!loadingDetail && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Адреса</p>
              {allAddresses.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Нет сохранённых адресов</p>
              ) : (
                <ul className="space-y-2">
                  {allAddresses.map((addr) => (
                    <li key={addr.id} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0"><Icons.MapPin /></span>
                      <div>
                        <p className="font-medium text-gray-800">{addr.label}</p>
                        <p className="text-gray-500">{addr.address}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-[#1D9E75]/10 text-[#1D9E75] rounded font-medium flex-shrink-0">
                          Основной
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Orders history */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">История заказов</p>
            {loadingDetail ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : allOrders.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Заказов нет</p>
            ) : (
              <ul className="space-y-2">
                {allOrders.slice(0, 5).map((order) => (
                  <li key={order.id} className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.scheduledAt ? formatDateTime(order.scheduledAt) : "—"}
                      </p>
                    </div>
                    <span className={`inline-flex flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Заметка</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Добавить заметку о клиенте..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-colors"
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 px-4 py-2 bg-[#1D9E75] text-white text-sm rounded-lg hover:bg-[#1D9E75]/90 transition-colors font-medium"
            >
              {noteSaved ? "Сохранено ✓" : "Сохранить заметку"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────
const PLAN_FILTER_OPTIONS = [
  { value: "", label: "Все планы" },
  { value: "BASIC", label: "BASIC" },
  { value: "COMFORT", label: "COMFORT" },
  { value: "MAX", label: "MAX" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientOrders, setClientOrders] = useState<ClientOrder[]>([]);
  const [clientAddresses, setClientAddresses] = useState<ClientAddress[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Fetch clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await fetch(`/api/admin/users?${params}`);
      const json = await res.json();
      setClients(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.totalPages ?? 1);
    } catch (err) {
      console.error("Clients fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  // Apply plan filter client-side (since API doesn't support plan filter yet)
  const displayedClients = planFilter
    ? clients.filter((c) => c.subscriptions.some((s) => s.plan === planFilter))
    : clients;

  // Open slide-over and load extra data for a client
  const openClient = async (client: Client) => {
    setSelectedClient(client);
    setLoadingDetail(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch(`/api/admin/orders?search=${encodeURIComponent(client.email)}&limit=5`),
        fetch(`/api/admin/users?search=${encodeURIComponent(client.email)}&limit=1`),
      ]);
      const ordersJson = await ordersRes.json();
      setClientOrders(ordersJson.orders ?? []);

      // Addresses aren't exposed by the admin users API, show empty for now
      setClientAddresses([]);
    } catch (err) {
      console.error("Detail fetch error:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // CSV export
  const exportCSV = () => {
    const header = "Имя,Email,Телефон,Заказов,Подписка,Дата регистрации\n";
    const rows = clients
      .map(
        (u) =>
          `"${u.name}","${u.email}","${u.phone ?? ""}",${u._count.orders},"${
            u.subscriptions[0] ? (PLAN_LABELS[u.subscriptions[0].plan] ?? u.subscriptions[0].plan) : "Нет"
          }","${formatDate(u.createdAt)}"`
      )
      .join("\n");
    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `domas-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="p-6 lg:p-8 space-y-5">

        {/* ── Top bar ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-raleway font-bold text-2xl text-gray-900">Клиенты</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Загрузка…" : `${total.toLocaleString("ru-RU")} клиентов`}
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={loading || clients.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icons.Download />
            Экспорт CSV
          </button>
        </div>

        {/* ── Filters ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени или email..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-colors bg-white"
            />
          </div>
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] bg-white"
          >
            {PLAN_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Table ────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : displayedClients.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-center">
                <Icons.EmptyBox />
                <p className="text-gray-500 font-medium">Клиенты не найдены</p>
                <p className="text-gray-400 text-sm">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Клиент</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Телефон</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">План</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Заказов</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Регистрация</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Подписка</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayedClients.map((client) => {
                    const sub = client.subscriptions[0];
                    const subStatusLabels: Record<string, string> = {
                      ACTIVE: "Активна",
                      PAUSED: "На паузе",
                      CANCELLED: "Отменена",
                    };
                    const subStatusColors: Record<string, string> = {
                      ACTIVE: "bg-emerald-100 text-emerald-700",
                      PAUSED: "bg-yellow-100 text-yellow-700",
                      CANCELLED: "bg-red-100 text-red-700",
                    };
                    return (
                      <tr key={client.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
                              {getInitials(client.name)}
                            </div>
                            <span className="font-medium text-gray-900 whitespace-nowrap">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 max-w-[180px]">
                          <span className="truncate block">{client.email}</span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                          {client.phone ? formatPhone(client.phone) : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <SubBadge sub={sub} />
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-medium text-gray-800">{client._count.orders}</span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                          {formatDate(client.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          {sub ? (
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${subStatusColors[sub.status] ?? "bg-gray-100 text-gray-500"}`}>
                              {subStatusLabels[sub.status] ?? sub.status}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => openClient(client)}
                            className="px-3 py-1.5 text-xs font-medium text-[#1D9E75] border border-[#1D9E75]/30 rounded-lg hover:bg-[#1D9E75]/5 transition-colors whitespace-nowrap"
                          >
                            Просмотр
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Страница <span className="font-medium text-gray-900">{page}</span> из{" "}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Предыдущая"
                >
                  <Icons.ChevronLeft />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Следующая"
                >
                  <Icons.ChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Slide-over ───────────────────────────────────────── */}
      {selectedClient && (
        <SlideOver
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          allOrders={clientOrders}
          allAddresses={clientAddresses}
          loadingDetail={loadingDetail}
        />
      )}
    </>
  );
}
