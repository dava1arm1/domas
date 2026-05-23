"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  formatPrice,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
} from "@/lib/utils";
import { PLAN_LABELS } from "@/constants/pricing";
import { SERVICE_LABELS } from "@/constants/services";
import type { AdminStats } from "@/types";

type Tab = "overview" | "users" | "orders" | "mailing";

const statusVariantMap: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  NEW: "info",
  IN_PROGRESS: "warning",
  DONE: "success",
  CANCELLED: "danger",
};

interface Props {
  stats: AdminStats;
  users: any[];
  orders: any[];
}

export function AdminClient({ stats, users, orders }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [mailingLoading, setMailingLoading] = useState(false);
  const [mailingForm, setMailingForm] = useState({
    subject: "",
    body: "",
    segment: "ALL",
  });
  const [mailingResult, setMailingResult] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) => orderFilter === "ALL" || o.status === orderFilter
  );

  const exportUsersCSV = () => {
    const header = "Имя,Email,Телефон,Заказов,Подписка,Дата регистрации\n";
    const rows = users
      .map(
        (u) =>
          `"${u.name}","${u.email}","${u.phone ?? ""}",${u._count.orders},"${
            u.subscriptions[0] ? PLAN_LABELS[u.subscriptions[0].plan] : "Нет"
          }","${formatDate(u.createdAt)}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `domas-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const sendMailing = async () => {
    setMailingLoading(true);
    setMailingResult("");
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mailingForm),
      });
      const data = await res.json();
      setMailingResult(data.message ?? "Готово");
    } catch {
      setMailingResult("Ошибка при отправке");
    } finally {
      setMailingLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Хедер */}
      <header className="bg-brand-dark text-white sticky top-0 z-10">
        <div className="container-custom py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-raleway font-black text-xl">
              <span className="text-brand-green-light">Dom</span>
              <span className="text-white">as</span>
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-white/70 text-sm">Администрирование</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                Кабинет
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Навигация по вкладкам */}
        <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {(
            [
              { id: "overview", label: "Обзор" },
              { id: "users", label: "Клиенты" },
              { id: "orders", label: "Заказы" },
              { id: "mailing", label: "Рассылки" },
            ] as { id: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-brand-green text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Обзор ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h1 className="font-raleway font-black text-2xl text-gray-900">
              Обзор
            </h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Всего клиентов",
                  value: stats.totalUsers,
                  sub: `+${stats.newUsersThisMonth} за месяц`,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  icon: "👥",
                },
                {
                  label: "Всего заказов",
                  value: stats.totalOrders,
                  sub: `${stats.ordersThisMonth} за месяц`,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                  icon: "📋",
                },
                {
                  label: "Активных подписок",
                  value: stats.activeSubscriptions,
                  sub: "в данный момент",
                  color: "text-green-600",
                  bg: "bg-green-50",
                  icon: "⚡",
                },
                {
                  label: "Выручка",
                  value: formatPrice(stats.totalRevenue),
                  sub: `${formatPrice(stats.revenueThisMonth)} за месяц`,
                  color: "text-brand-green",
                  bg: "bg-brand-green-pale",
                  icon: "💰",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl ${card.bg} mb-3`}>
                    {card.icon}
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                  <p className={`font-raleway font-black text-2xl ${card.color}`}>
                    {card.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Клиенты ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-raleway font-black text-2xl text-gray-900">
                Клиенты ({users.length})
              </h1>
              <Button variant="outline" size="sm" onClick={exportUsersCSV}>
                Экспорт CSV
              </Button>
            </div>

            {/* Поиск */}
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Клиент</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Телефон</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Подписка</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Заказов</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">С нами с</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3 text-gray-500">{u.phone ?? "—"}</td>
                        <td className="px-4 py-3">
                          {u.subscriptions[0] ? (
                            <Badge variant="success">
                              {PLAN_LABELS[u.subscriptions[0].plan]}
                            </Badge>
                          ) : (
                            <Badge variant="default">Нет</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-900">{u._count.orders}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Заказы ── */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h1 className="font-raleway font-black text-2xl text-gray-900">
              Заказы ({orders.length})
            </h1>

            <div className="flex gap-2">
              {["ALL", "NEW", "IN_PROGRESS", "DONE", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setOrderFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    orderFilter === s
                      ? "bg-brand-green text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s === "ALL" ? "Все" : getOrderStatusLabel(s)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Клиент</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Услуга</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Дата</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Статус</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-gray-400 text-xs">{order.user.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {formatDateTime(order.scheduledAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariantMap[order.status] ?? "default"}>
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            defaultValue={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-green"
                          >
                            <option value="NEW">Новый</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="DONE">Выполнен</option>
                            <option value="CANCELLED">Отменён</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Рассылки ── */}
        {activeTab === "mailing" && (
          <div className="max-w-2xl space-y-6">
            <h1 className="font-raleway font-black text-2xl text-gray-900">
              Email-рассылка
            </h1>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              <strong>TODO:</strong> Подключите UniSender или SendPulse. Добавьте API-ключ в{" "}
              <code className="bg-yellow-100 px-1 rounded">.env.local</code> и реализуйте функцию
              отправки в <code className="bg-yellow-100 px-1 rounded">/api/admin/send-email</code>.
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Сегмент получателей
                </label>
                <select
                  value={mailingForm.segment}
                  onChange={(e) => setMailingForm((p) => ({ ...p, segment: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green w-full"
                >
                  <option value="ALL">Все клиенты ({users.length})</option>
                  <option value="ACTIVE">Активные подписчики</option>
                  <option value="CANCELLED">Отменённые подписки</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Тема письма
                </label>
                <input
                  type="text"
                  value={mailingForm.subject}
                  onChange={(e) => setMailingForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="Новости Domas — May 2024"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Текст письма
                </label>
                <textarea
                  rows={8}
                  value={mailingForm.body}
                  onChange={(e) => setMailingForm((p) => ({ ...p, body: e.target.value }))}
                  placeholder="Введите текст письма..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              {mailingResult && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
                  {mailingResult}
                </div>
              )}

              <Button
                onClick={sendMailing}
                loading={mailingLoading}
                disabled={!mailingForm.subject || !mailingForm.body}
              >
                Отправить рассылку
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
