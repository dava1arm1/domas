"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice, formatDate, formatDateTime, getOrderStatusLabel, getOrderStatusColor, getInitials } from "@/lib/utils";
import { SERVICE_LABELS } from "@/constants/services";

// ─── Types ────────────────────────────────────────────────────
interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

interface Order {
  id: string;
  user: OrderUser;
  address?: { address: string } | null;
  serviceType: string;
  status: string;
  scheduledAt: string;
  price: number;
  comment?: string | null;
  teamNote?: string | null;
  createdAt: string;
}

// ─── Skeleton ─────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className ?? ""}`} />;
}

// ─── SVG Icons ────────────────────────────────────────────────
const Icons = {
  Users: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Clipboard: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Cash: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Plus: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Mail: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  UserPlus: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  TrendUp: () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
};

// ─── Revenue mini line chart ──────────────────────────────────
function RevenueChart({ revenueThisMonth }: { revenueThisMonth: number }) {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();

  // Generate mock daily data based on monthly revenue
  const dailyAvg = revenueThisMonth / daysInMonth;
  const seed = (i: number) => {
    const x = Math.sin(i * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const days = Array.from({ length: 30 }, (_, i) => {
    const variation = 0.4 + seed(i) * 1.2;
    return i < dayOfMonth ? Math.round(dailyAvg * variation) : 0;
  });
  const filledDays = days.filter((_, i) => i < dayOfMonth);

  const maxVal = Math.max(...filledDays, 1);
  const minVal = 0;
  const range = maxVal - minVal;

  const W = 600;
  const H = 90;
  const PAD = 8;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const pts = filledDays.map((v, i) => {
    const x = PAD + (i / Math.max(filledDays.length - 1, 1)) * chartW;
    const y = PAD + chartH - ((v - minVal) / range) * chartH;
    return `${x},${y}`;
  });

  const polyline = pts.join(" ");
  const lastPt = pts[pts.length - 1];
  const [lastX, lastY] = lastPt ? lastPt.split(",").map(Number) : [PAD, PAD + chartH];
  const area = `M${PAD},${PAD + chartH} L${pts.join(" L")} L${lastX},${PAD + chartH} Z`;

  const totalDisplayed = filledDays.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-raleway font-bold text-[15px] text-gray-900">Выручка за 30 дней</h2>
          <p className="text-xs text-gray-400 mt-0.5">Прогноз на основе текущего месяца</p>
        </div>
        <div className="text-right">
          <p className="font-raleway font-bold text-lg text-[#1D9E75]">{formatPrice(totalDisplayed)}</p>
          <p className="text-xs text-gray-400">за {dayOfMonth} дн.</p>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chartGrad)" />
        <polyline
          points={polyline}
          fill="none"
          stroke="#1D9E75"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {lastPt && (
          <circle cx={lastX} cy={lastY} r="4" fill="#1D9E75" stroke="white" strokeWidth="2" />
        )}
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-300">1</span>
        <span className="text-[10px] text-gray-300">{dayOfMonth}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newUsers, setNewUsers] = useState<Array<{ id: string; name: string; email: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, ordersRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders?limit=10"),
          fetch("/api/admin/users?limit=100"),
        ]);

        const statsJson = await statsRes.json();
        const ordersJson = await ordersRes.json();
        const usersJson = await usersRes.json();

        setStats(statsJson.data ?? null);
        setOrders(ordersJson.orders ?? []);

        // Filter new users today
        const today = new Date().toISOString().slice(0, 10);
        const todayUsers = (usersJson.data ?? []).filter(
          (u: { createdAt: string }) => u.createdAt?.slice(0, 10) === today
        );
        setNewUsers(todayUsers);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const kpiCards = stats
    ? [
        {
          label: "Клиентов всего",
          value: stats.totalUsers.toLocaleString("ru-RU"),
          trend: `+${stats.newUsersThisMonth} этот месяц`,
          trendPositive: true,
          icon: <Icons.Users />,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          valueColor: "text-blue-700",
        },
        {
          label: "Активных подписок",
          value: stats.activeSubscriptions.toLocaleString("ru-RU"),
          trend: "сейчас активны",
          trendPositive: true,
          icon: <Icons.Star />,
          iconBg: "bg-amber-50",
          iconColor: "text-amber-500",
          valueColor: "text-amber-600",
        },
        {
          label: "Заказов в этом месяце",
          value: stats.ordersThisMonth.toLocaleString("ru-RU"),
          trend: `из ${stats.totalOrders} всего`,
          trendPositive: true,
          icon: <Icons.Clipboard />,
          iconBg: "bg-violet-50",
          iconColor: "text-violet-600",
          valueColor: "text-violet-700",
        },
        {
          label: "Выручка за месяц",
          value: formatPrice(stats.revenueThisMonth),
          trend: `всего ${formatPrice(stats.totalRevenue)}`,
          trendPositive: stats.revenueThisMonth > 0,
          icon: <Icons.Cash />,
          iconBg: "bg-emerald-50",
          iconColor: "text-[#1D9E75]",
          valueColor: "text-[#1D9E75]",
        },
      ]
    : null;

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading || !kpiCards
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          : kpiCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-shadow duration-150 hover:shadow-md">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} mb-4`}>
                  {card.icon}
                </div>
                <p className={`font-raleway font-bold text-2xl ${card.valueColor} leading-tight`}>
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trendPositive && <span className="text-[#1D9E75]"><Icons.TrendUp /></span>}
                  <span className="text-xs text-gray-400">{card.trend}</span>
                </div>
              </div>
            ))}
      </div>

      {/* ── Chart + Quick Actions row ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          {loading || !stats ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <RevenueChart revenueThisMonth={stats.revenueThisMonth} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
          <h2 className="font-raleway font-bold text-[15px] text-gray-900 mb-1">Быстрые действия</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1D9E75] text-white text-sm font-medium hover:bg-[#1D9E75]/90 transition-colors duration-150"
          >
            <Icons.Plus />
            Создать заказ
          </Link>
          <Link
            href="/admin/campaigns"
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
          >
            <span className="text-gray-400"><Icons.Mail /></span>
            Написать рассылку
          </Link>
          <Link
            href="/admin/clients"
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
          >
            <span className="text-gray-400"><Icons.UserPlus /></span>
            Добавить клиента
          </Link>

          {/* New users today */}
          <div className="mt-2 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Новые сегодня
            </p>
            {loading ? (
              <div className="space-y-2">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : newUsers.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Новых регистраций сегодня нет</p>
            ) : (
              <ul className="space-y-2">
                {newUsers.slice(0, 4).map((u) => (
                  <li key={u.id} className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] text-xs font-bold flex-shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </li>
                ))}
                {newUsers.length > 4 && (
                  <li className="text-xs text-gray-400">+{newUsers.length - 4} ещё</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ───────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-raleway font-bold text-[15px] text-gray-900">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-[#1D9E75] hover:underline font-medium">
            Все заказы →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">Заказов пока нет</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70">
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Клиент</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Услуга</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Статус</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Дата</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Цена</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                          {getInitials(order.user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-xs text-gray-400">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 max-w-[180px]">
                      <span className="truncate block">{SERVICE_LABELS[order.serviceType] ?? order.serviceType}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {order.scheduledAt ? formatDateTime(order.scheduledAt) : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium text-gray-900 whitespace-nowrap">
                      {order.price ? formatPrice(order.price) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
