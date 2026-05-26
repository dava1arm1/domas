"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { NAV_LINKS_LEFT, NAV_LINKS_RIGHT } from "@/constants/navigation";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Тёмный фон при скролле
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-brand-dark/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-14 md:h-20">
            {/* Левые ссылки — только на десктопе */}
            <div className="hidden md:flex items-center gap-8 flex-1">
              {NAV_LINKS_LEFT.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Логотип по центру */}
            <Link
              href="/"
              className="font-raleway font-black text-2xl tracking-tight flex-shrink-0"
              aria-label="Domas — на главную"
            >
              <span className="text-brand-green-light">Dom</span>
              <span className="text-white">as</span>
            </Link>

            {/* Правые ссылки + кнопка — только на десктопе */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
              {NAV_LINKS_RIGHT.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {session ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button size="sm" variant="outline">
                      Кабинет
                    </Button>
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        Админ
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm" variant="primary">
                    Войти
                  </Button>
                </Link>
              )}
            </div>

            {/* Бургер — только на мобильном */}
            <button
              className="md:hidden text-white p-3 -mr-3 touch-manipulation"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Мобильное меню */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        session={session}
        onSignOut={() => signOut({ callbackUrl: "/" })}
      />
    </>
  );
}
