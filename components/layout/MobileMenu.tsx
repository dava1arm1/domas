"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { ALL_NAV_LINKS, CONTACT_INFO } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onSignOut: () => void;
}

export function MobileMenu({ isOpen, onClose, session, onSignOut }: MobileMenuProps) {
  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[min(288px,85vw)] bg-brand-dark flex flex-col transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label="Мобильное меню"
      >
        {/* Шапка drawer */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-white/10">
          <span className="font-raleway font-black text-xl">
            <span className="text-brand-green-light">Дом</span>
            <span className="text-white">ас</span>
          </span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 -mr-2 transition-colors"
            aria-label="Закрыть меню"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ссылки */}
        <nav className="flex-1 px-6 py-8 flex flex-col gap-2">
          {ALL_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-white/80 hover:text-white py-2 text-lg font-medium transition-colors border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 flex flex-col gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="bg-brand-green text-white rounded-xl px-6 py-3 font-semibold text-center"
                >
                  Личный кабинет
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="border border-white/20 text-white rounded-xl px-6 py-3 font-semibold text-center"
                  >
                    Администрирование
                  </Link>
                )}
                <button
                  onClick={() => { onClose(); onSignOut(); }}
                  className="text-white/60 hover:text-white text-center py-2 transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="bg-brand-green text-white rounded-xl px-6 py-3 font-semibold text-center"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="border border-white/20 text-white rounded-xl px-6 py-3 font-semibold text-center"
                >
                  Зарегистрироваться
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Контакты внизу */}
        <div className="px-6 py-6 border-t border-white/10">
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="text-white font-semibold text-lg block mb-1 hover:text-brand-green-light transition-colors"
          >
            {CONTACT_INFO.phone}
          </a>
          <p className="text-white/40 text-sm">{CONTACT_INFO.workingHours}</p>
        </div>
      </aside>
    </>
  );
}
