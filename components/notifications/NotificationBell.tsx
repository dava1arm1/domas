"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  orderId?: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.data ?? []);
      setUnread(json.unreadCount ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  async function markRead(id: string) {
    if (notifications.find((n) => n.id === id)?.read) return;
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnread((c) => Math.max(0, c - 1));
  }

  function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;
    const days = Math.floor(hours / 24);
    return `${days} д назад`;
  }

  function typeIcon(type: string) {
    if (type.includes("ACCEPTED")) return "✓";
    if (type.includes("COMPLETED")) return "★";
    if (type.includes("CANCELLED")) return "✕";
    if (type.includes("IN_PROGRESS")) return "→";
    return "●";
  }

  function typeDotColor(type: string) {
    if (type.includes("ACCEPTED")) return "bg-blue-500";
    if (type.includes("COMPLETED")) return "bg-brand-green";
    if (type.includes("CANCELLED")) return "bg-red-500";
    if (type.includes("IN_PROGRESS")) return "bg-amber-500";
    return "bg-white/40";
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative h-9 w-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.10] transition-all"
        aria-label="Уведомления"
      >
        <svg className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-brand-green text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-[#0F1A16] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-white font-semibold text-sm">Уведомления</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-brand-green text-xs font-semibold hover:text-brand-green/80 transition-colors"
              >
                Прочитать все
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-white/30 text-sm">Нет уведомлений</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] text-left hover:bg-white/[0.03] transition-colors ${
                    !n.read ? "bg-brand-green/[0.04]" : ""
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[10px] font-bold ${typeDotColor(n.type)}`}>
                    {typeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${n.read ? "text-white/50" : "text-white/90 font-medium"}`}>
                      {n.title}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-white/20 text-[10px] mt-1">{relativeTime(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div className="h-2 w-2 rounded-full bg-brand-green flex-shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
