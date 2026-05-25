"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { getInitials } from "@/lib/utils";

interface AdminShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
}

// ─── Page title map ────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard":          "Обзор",
  "/admin/clients":            "Клиенты",
  "/admin/orders":             "Заказы",
  "/admin/subscriptions":      "Подписки",
  "/admin/finance":            "Финансы",
  "/admin/campaigns":          "Рассылки",
  "/admin/site":               "Настройки сайта",
  "/admin/site/hero":          "Главная страница",
  "/admin/site/services":      "Услуги",
  "/admin/site/pricing":       "Цены и тарифы",
  "/admin/site/contacts":      "Контакты и реквизиты",
  "/admin/site/texts":         "Тексты сайта",
  "/admin/site/media":         "Медиа и фото",
  "/admin/site/notifications": "Шаблоны уведомлений",
  "/admin/system":             "Настройки системы",
};

// ─── Inline SVG icons ──────────────────────────────────────────
const Icon = {
  Home: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Users: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clipboard: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Star: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Card: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Mail: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Globe: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  Cog: () => (
    <svg className="h-[17px] w-[17px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Chevron: ({ open }: { open: boolean }) => (
    <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Bell: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  External: () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Logout: () => (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

// ─── Navigation definition ────────────────────────────────────
type NavItem = {
  type: "item";
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
} | {
  type: "group";
  label: string;
  href: string;
  icon: React.ReactNode;
  children: { label: string; href: string }[];
} | { type: "divider" };

const NAV: NavItem[] = [
  { type: "item", label: "Обзор",    href: "/admin/dashboard",     icon: <Icon.Home />,      exact: true },
  { type: "item", label: "Клиенты",  href: "/admin/clients",        icon: <Icon.Users /> },
  { type: "item", label: "Заказы",   href: "/admin/orders",         icon: <Icon.Clipboard /> },
  { type: "divider" },
  { type: "item", label: "Подписки", href: "/admin/subscriptions",  icon: <Icon.Star /> },
  { type: "item", label: "Финансы",  href: "/admin/finance",        icon: <Icon.Card /> },
  { type: "divider" },
  { type: "item", label: "Рассылки", href: "/admin/campaigns",      icon: <Icon.Mail /> },
  { type: "divider" },
  {
    type: "group",
    label: "Настройки сайта",
    href: "/admin/site",
    icon: <Icon.Globe />,
    children: [
      { label: "Главная страница",   href: "/admin/site/hero" },
      { label: "Услуги",             href: "/admin/site/services" },
      { label: "Цены и тарифы",      href: "/admin/site/pricing" },
      { label: "Контакты",           href: "/admin/site/contacts" },
      { label: "Тексты сайта",       href: "/admin/site/texts" },
      { label: "Медиа и фото",       href: "/admin/site/media" },
      { label: "Уведомления",        href: "/admin/site/notifications" },
    ],
  },
  { type: "item", label: "Настройки системы", href: "/admin/system", icon: <Icon.Cog /> },
];

// ─── Component ────────────────────────────────────────────────
export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [siteExpanded, setSiteExpanded] = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [dbStatus, setDbStatus]         = useState<"checking" | "ok" | "error">("checking");
  const [dbError, setDbError]           = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  // Check DB on mount — if Setting table doesn't exist, show banner
  useEffect(() => {
    fetch("/api/admin/db-check")
      .then(r => r.json())
      .then(data => {
        if (data.status === "OK") {
          setDbStatus("ok");
        } else {
          setDbStatus("error");
          setDbError(data.message ?? "Ошибка базы данных");
        }
      })
      .catch(() => {
        setDbStatus("error");
        setDbError("Не удалось подключиться к базе данных");
      });
  }, []);

  const isSitePage = pathname.startsWith("/admin/site");

  // Auto-expand site group when navigating to site/* pages
  useEffect(() => {
    if (isSitePage) setSiteExpanded(true);
  }, [isSitePage]);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const pageTitle = (() => {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      if (pathname.startsWith(path + "/")) return title;
    }
    return "Администрирование";
  })();

  // ── Sidebar content (shared between fixed+overlay) ──────────
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-2.5 flex-shrink-0 border-b border-white/[0.06]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75] rounded"
        >
          <span className="font-raleway font-black text-[22px] tracking-tight">
            <span className="text-[#5DCAA5]">Дом</span>
            <span className="text-white">ас</span>
          </span>
          <span className="text-[9px] font-bold bg-[#1D9E75] text-white px-1.5 py-0.5 rounded-md uppercase tracking-widest select-none">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Навигация">
        <ul className="space-y-0.5">
          {NAV.map((item, i) => {
            if (item.type === "divider") {
              return <li key={i} role="separator"><hr className="border-white/[0.06] my-2" /></li>;
            }

            if (item.type === "group") {
              const groupActive = isActive(item.href);
              return (
                <li key={item.href}>
                  <button
                    onClick={() => setSiteExpanded((p) => !p)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium
                      transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75]
                      ${groupActive
                        ? "text-[#5DCAA5]"
                        : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
                      }
                    `}
                    aria-expanded={siteExpanded}
                  >
                    <span className={groupActive ? "text-[#1D9E75]" : "text-white/30"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <Icon.Chevron open={siteExpanded} />
                  </button>

                  {siteExpanded && (
                    <ul className="mt-0.5 ml-6 pl-3 border-l border-white/[0.06] space-y-0.5 pb-1">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`
                                block px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150
                                ${childActive
                                  ? "text-[#1D9E75] bg-[#1D9E75]/10"
                                  : "text-white/30 hover:text-white/70 hover:bg-white/[0.05]"
                                }
                              `}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Regular item
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium
                    transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75]
                    ${active
                      ? "bg-[#1D9E75]/12 text-[#5DCAA5] border-l-2 border-[#1D9E75] pl-[10px]"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
                    }
                  `}
                >
                  <span className={active ? "text-[#1D9E75]" : "text-white/30"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin user + sign out */}
      <div className="px-3 py-4 border-t border-white/[0.06] flex-shrink-0 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-medium truncate leading-tight">{user.name}</p>
            <p className="text-white/30 text-[11px] truncate leading-tight mt-0.5">{user.email}</p>
          </div>
          <span className="text-[9px] font-bold text-[#1D9E75] bg-[#1D9E75]/15 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
            Admin
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Icon.Logout />
          Выйти из аккаунта
        </button>
      </div>
    </>
  );

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-[#f8f8f6]">

      {/* ── Mobile overlay ──────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (desktop fixed, mobile overlay) ─────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-[260px] flex-shrink-0
          bg-[#0f0f0f] flex flex-col h-full
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
        aria-label="Боковое меню"
      >
        <SidebarContent />
      </aside>

      {/* ── Main content column ──────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

        {/* ── Top bar ─────────────────────────────────────────── */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-100 flex items-center gap-3 px-4 lg:px-6 z-20">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
          >
            <Icon.Menu />
          </button>

          {/* Page title */}
          <h1 className="font-raleway font-bold text-[17px] text-gray-900 flex-shrink-0">
            {pageTitle}
          </h1>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View site link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            <Icon.External />
            Сайт
          </a>

          {/* Notifications bell */}
          <button
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Уведомления"
          >
            <Icon.Bell />
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="h-9 w-9 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-[13px] font-bold hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75]"
              aria-expanded={profileOpen}
              aria-label="Профиль"
            >
              {getInitials(user.name)}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/admin/system"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon.Cog />
                  Настройки системы
                </Link>
                <hr className="border-gray-100 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Icon.Logout />
                  Выйти из аккаунта
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── DB error banner ─────────────────────────────────── */}
        {dbStatus === "error" && (
          <div className="flex-shrink-0 bg-red-50 border-b border-red-200 px-4 lg:px-6 py-3 flex items-start gap-3">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800">Таблица настроек не найдена в базе данных</p>
              <p className="text-xs text-red-600 mt-0.5">
                CMS не будет работать. Выполни в терминале:&nbsp;
                <code className="font-mono bg-red-100 px-1.5 py-0.5 rounded text-red-700 select-all">
                  npx prisma generate &amp;&amp; npx prisma db push
                </code>
                &nbsp;и перезапусти сервер.
              </p>
            </div>
            <button
              onClick={() => setDbStatus("ok")}
              className="text-red-400 hover:text-red-600 flex-shrink-0 p-1"
              aria-label="Закрыть"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Scrollable page content ──────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {children}
        </div>

      </div>
    </div>
  );
}
