"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        setServerError("Неверный email или пароль");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setServerError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          MOBILE — тёмный верх + белый низ, без скролла окна
          ═══════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed inset-0 flex flex-col bg-brand-dark overflow-hidden">

        {/* Safe-area iPhone */}
        <div className="flex-shrink-0" style={{ height: "env(safe-area-inset-top)" }} />

        {/* Топ-бар */}
        <div className="flex-shrink-0 flex items-center px-4 h-12">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors touch-manipulation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Назад</span>
          </Link>
        </div>

        {/* Тёмная зона — логотип и заголовок */}
        <div className="flex-shrink-0 px-6 pt-3 pb-9">
          <Link href="/" className="font-raleway font-black text-2xl block mb-5 tracking-tight">
            <span className="text-brand-green-light">Dom</span>
            <span className="text-white">as</span>
          </Link>
          <h1 className="font-raleway font-black text-[2.1rem] leading-[1.1] text-white">
            Войдите<br />в аккаунт
          </h1>
          <p className="text-white/45 text-sm mt-2">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-brand-green-light font-semibold">
              Регистрация →
            </Link>
          </p>
        </div>

        {/* Белая карточка — форма */}
        <div
          className="flex-1 min-h-0 bg-white rounded-t-[2rem] overflow-y-auto overscroll-contain shadow-2xl"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <div
            className="px-6 pt-7 pb-4"
            style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
          >
            {/* Ручка */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-7" />

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="ivan@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />
              <Input
                label="Пароль"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
              />

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-green hover:bg-[#18896A] active:scale-[0.98] text-white font-bold text-base rounded-xl mt-1 flex items-center justify-center gap-2 transition-all disabled:opacity-60 touch-manipulation"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : "Войти"}
              </button>
            </form>

            <p className="text-center text-gray-400 text-xs mt-6">
              1 ДомоКоин = 1 ₽ скидки · Вывоз мусора · Клининг
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP — двухпанельный макет
          ═══════════════════════════════════════════════════ */}
      <div className="hidden lg:flex min-h-[100dvh] bg-surface-secondary">

        {/* Левая панель */}
        <div className="lg:w-1/2 bg-brand-dark flex flex-col justify-between p-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              На главную
            </Link>
            <Link href="/" className="font-raleway font-black text-2xl">
              <span className="text-brand-green-light">Dom</span>
              <span className="text-white">as</span>
            </Link>
          </div>
          <div>
            <blockquote className="text-white text-2xl font-raleway font-bold leading-snug mb-6">
              "Подключил Domas и теперь не представляю жизнь без них."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Вы, через несколько месяцев</p>
                <p className="text-white/50 text-sm">Клиент с 2026 года</p>
              </div>
            </div>
          </div>
          <p className="text-white/30 text-sm">© 2026 Domas. Обслуживание частных домов в МО.</p>
        </div>

        {/* Правая панель */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="font-raleway font-black text-2xl text-gray-900 mb-2">Войти в аккаунт</h1>
              <p className="text-gray-500 text-sm mb-8">
                Нет аккаунта?{" "}
                <Link href="/register" className="text-brand-green font-medium hover:underline">Зарегистрируйтесь</Link>
              </p>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Input label="Email" name="email" type="email" placeholder="ivan@example.com" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" autoFocus />
                <Input label="Пароль" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-red-600 text-sm">{serverError}</p>
                  </div>
                )}
                <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">Войти</Button>
              </form>
            </div>
            <p className="text-center text-gray-400 text-sm mt-6">
              <Link href="/" className="hover:text-brand-green transition-colors">← Вернуться на главную</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
