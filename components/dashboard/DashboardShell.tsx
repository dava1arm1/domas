"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { getInitials } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
interface Props {
  user: { name: string; email: string };
  children: React.ReactNode;
  hasPendingReview?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Desktop sidebar navigation (6 items)
// ─────────────────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  {
    label: "Главная", href: "/dashboard",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    label: "Мои заказы", href: "/dashboard/orders",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  },
  {
    label: "Подписка", href: "/dashboard/subscription",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
  {
    label: "ДомоКоины", href: "/dashboard/coins",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5a2.5 2.5 0 00-5 0v1h5m-5 0v3h5v-3m-5 3a2.5 2.5 0 005 0" /></svg>,
  },
  {
    label: "Рефералы", href: "/dashboard/referral",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25L12 3.75 7.5 8.25" /></svg>,
  },
  {
    label: "Адреса", href: "/dashboard/addresses",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    label: "Поддержка", href: "/dashboard/support",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
  {
    label: "Настройки", href: "/dashboard/settings",
    icon: <svg className="h-[18px] w-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

// ─────────────────────────────────────────────────────────────────
// Mobile bottom navigation (5 tabs, Apple HIG ≥44px tap targets)
// ─────────────────────────────────────────────────────────────────
const BOTTOM_NAV = [
  {
    label: "Главная", href: "/dashboard",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    label: "Заказы", href: "/dashboard/orders",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    label: "Подписка", href: "/dashboard/subscription",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
  {
    label: "Монеты", href: "/dashboard/coins",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5a2.5 2.5 0 00-5 0v1h5m-5 0v3h5v-3m-5 3a2.5 2.5 0 005 0" /></svg>,
  },
  {
    label: "Профиль", href: "/dashboard/settings",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
];

// ─────────────────────────────────────────────────────────────────
// Route → page title map (for desktop top bar)
// ─────────────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/dashboard":              "Главная",
  "/dashboard/orders":       "Мои заказы",
  "/dashboard/subscription": "Подписка",
  "/dashboard/addresses":    "Адреса",
  "/dashboard/coins":        "ДомоКоины",
  "/dashboard/referral":     "Рефералы",
  "/dashboard/support":      "Поддержка",
  "/dashboard/settings":     "Настройки",
};

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────
export function DashboardShell({ user, children, hasPendingReview }: Props) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollRef = useRef(0);

  const pageTitle = PAGE_TITLES[pathname] ?? "Кабинет";

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change + reset header
  useEffect(() => {
    setDropdownOpen(false);
    setHeaderHidden(false);
    lastScrollRef.current = 0;
  }, [pathname]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) return;
    const currentY = e.currentTarget.scrollTop;
    const diff = currentY - lastScrollRef.current;
    lastScrollRef.current = currentY;
    if (currentY < 60) { setHeaderHidden(false); return; }
    if (diff > 5) setHeaderHidden(true);
    else if (diff < -5) setHeaderHidden(false);
  };

  return (
    /*
     * Root container: full viewport height, no overflow.
     * Mobile: flex-col (top bar → content → bottom nav handled via fixed positioning).
     * Desktop: flex-row (sidebar | content area).
     */
    <div className="h-[100dvh] flex overflow-hidden bg-[#f8f8f6]">

      {/* ════════════════════════════════════════════════════════
          DESKTOP SIDEBAR — hidden below lg breakpoint
          ════════════════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 h-full bg-[#0f0f0f] z-40"
        aria-label="Навигация"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 flex-shrink-0 border-b border-white/[0.06]">
          <Link href="/" className="font-raleway font-black text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75] rounded-lg">
            <span className="text-[#5DCAA5]">Dom</span>
            <span className="text-white">as</span>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Основная навигация">
          {SIDEBAR_NAV.map((item) => {
            const active = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 outline-none
                  focus-visible:ring-2 focus-visible:ring-[#1D9E75]
                  ${active
                    ? "bg-[#1D9E75] text-white"
                    : "text-white/40 hover:text-white hover:bg-white/[0.07]"
                  }
                `}
              >
                <span className={`transition-colors ${active ? "text-white" : "text-white/40 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                {item.label}

                {/* Pending review dot on "Главная" */}
                {item.href === "/dashboard" && hasPendingReview && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white/60 flex-shrink-0" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section — avatar + name + dropdown */}
        <div className="px-3 py-4 border-t border-white/[0.06] flex-shrink-0" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-colors duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9E75]"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
                {getInitials(user.name)}
              </div>
              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate leading-tight">{user.name.split(" ")[0]}</p>
                <p className="text-white/30 text-xs truncate leading-tight mt-0.5">{user.email}</p>
              </div>
              {/* Chevron */}
              <svg
                className={`h-4 w-4 text-white/25 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                role="menu"
                className="absolute bottom-full left-0 right-0 mb-1.5 bg-[#1c1c1c] border border-white/[0.08] rounded-xl py-1 shadow-2xl animate-fade-in z-50"
              >
                <Link
                  href="/dashboard/settings"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.07] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Настройки
                </Link>
                <button
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.07] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT AREA (flex-col: top bar + scrollable content)
          ════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">

        {/* ── TOP BAR ─────────────────────────────────────────── *
         *  Matches the main site header: dark bg, white logo.     *
         *  Mobile:  logo centered, bell on right.                 *
         *  Desktop: logo left, page title center, bell+avatar right *
         */}
        <div className={`flex-shrink-0 overflow-hidden transition-[max-height] duration-300 ease-in-out lg:!max-h-16 ${headerHidden ? "max-h-0" : "max-h-14"}`}>
        <header
          className="h-14 lg:h-16 bg-brand-dark flex items-center px-4 lg:px-6 z-30"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {/* Back arrow — mobile only, returns to main site */}
          <Link
            href="/"
            className="lg:hidden -ml-1 mr-1 p-2 text-white/50 hover:text-white transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DCAA5]"
            aria-label="На главную"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>

          {/* Logo */}
          <Link
            href="/"
            className="font-raleway font-black text-2xl tracking-tight flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DCAA5] rounded"
            aria-label="Domas — на главную"
          >
            <span className="text-brand-green-light">Dom</span>
            <span className="text-white">as</span>
          </Link>

          {/* Center: page title (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <h1 className="font-raleway font-semibold text-base text-white/60 leading-none">
              {pageTitle}
            </h1>
          </div>

          {/* Mobile: spacer to keep logo visually centered */}
          <div className="flex-1 lg:hidden" />

          {/* Right: notification bell + avatar (desktop) */}
          <div className="flex items-center gap-1">
            <button
              className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DCAA5]"
              aria-label="Уведомления"
            >
              <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasPendingReview && (
                <span
                  className="absolute top-[7px] right-[7px] h-2 w-2 bg-brand-green-light rounded-full ring-2 ring-brand-dark"
                  aria-label="Есть непрочитанные уведомления"
                />
              )}
            </button>

            {/* Desktop only: avatar → settings */}
            <Link
              href="/dashboard/settings"
              className="hidden lg:flex h-9 w-9 rounded-full bg-[#1D9E75] items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity ml-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DCAA5]"
              aria-label="Профиль"
            >
              {getInitials(user.name)}
            </Link>
          </div>
        </header>
        </div>

        {/* ── SCROLLABLE CONTENT ───────────────────────────────── *
         *  This is the single scroll container for all pages.      *
         *  Mobile: bottom padding accounts for the fixed bottom nav *
         *  and the device's safe-area-inset-bottom.                *
         */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          onScroll={handleScroll}
        >
          {children}

          {/* Spacer that lifts content above the mobile bottom nav */}
          <div
            className="lg:hidden flex-shrink-0"
            style={{ height: "calc(72px + env(safe-area-inset-bottom))" }}
            aria-hidden="true"
          />
        </div>

      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION — fixed, hidden on desktop
          ════════════════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 flex"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Нижняя навигация"
      >
        {BOTTOM_NAV.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={`
                flex-1 flex flex-col items-center justify-center gap-[3px]
                min-h-[56px] py-2 transition-colors duration-150
                focus:outline-none focus-visible:bg-gray-50
                ${active ? "text-[#1D9E75]" : "text-gray-400"}
              `}
            >
              {/* Icon scales up slightly on active for haptic-ready feel */}
              <span className={`transition-transform duration-150 ${active ? "scale-110" : "scale-100"}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold leading-none ${active ? "text-[#1D9E75]" : "text-gray-400"}`}>
                {item.label}
              </span>

              {/* Pending review indicator on "Главная" tab */}
              {item.href === "/dashboard" && hasPendingReview && (
                <span
                  className="absolute top-2 h-1.5 w-1.5 rounded-full bg-[#1D9E75]"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
