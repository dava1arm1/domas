"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerSchema } from "@/lib/validations";
import { MAIN_SUBSCRIPTION } from "@/constants/pricing";
import { formatPrice } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
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

    // Клиентская валидация
    const result = registerSchema.safeParse(form);
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
      // Регистрируем пользователя
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: "BASIC" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Ошибка при регистрации");
        return;
      }

      // Автоматически входим после регистрации
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/dashboard");
    } catch {
      setServerError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface-secondary flex">
      {/* Левая панель — выбранный тариф */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark flex-col justify-between p-12">
        <Link href="/" className="font-raleway font-black text-2xl">
          <span className="text-brand-green-light">Дом</span>
          <span className="text-white">ас</span>
        </Link>

        <div>
          <p className="text-white/50 text-sm uppercase tracking-wider mb-4">
            Основная подписка
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="font-raleway font-black text-3xl text-white mb-1">
              {MAIN_SUBSCRIPTION.title}
            </h3>
            <p className="text-white/50 text-sm mb-4">{MAIN_SUBSCRIPTION.description}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-raleway font-black text-4xl text-brand-green-light">
                {formatPrice(MAIN_SUBSCRIPTION.monthlyPrice)}
              </span>
              <span className="text-white/40">/мес</span>
            </div>
            <ul className="space-y-2">
              {MAIN_SUBSCRIPTION.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
                  <svg className="h-4 w-4 text-brand-green-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/#pricing"
            className="text-brand-green-light hover:text-white text-sm transition-colors"
          >
            ← Посмотреть все подписки
          </Link>
        </div>

        <p className="text-white/30 text-sm">
          Без обязательств. Отмена в любой момент.
        </p>
      </div>

      {/* Правая панель — форма */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="font-raleway font-black text-3xl">
              <span className="text-brand-green">Дом</span>
              <span className="text-gray-900">ас</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h1 className="font-raleway font-black text-2xl text-gray-900 mb-2">
              Создать аккаунт
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="text-brand-green font-medium hover:underline"
              >
                Войдите
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Ваше имя"
                name="name"
                type="text"
                placeholder="Иван Петров"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
                autoFocus
              />
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
                label="Телефон"
                name="phone"
                type="tel"
                placeholder="+7 (900) 000-00-00"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                hint="Менеджер свяжется с вами после регистрации"
                autoComplete="tel"
              />
              <Input
                label="Пароль"
                name="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-6"
              >
                Создать аккаунт
              </Button>

              <p className="text-center text-gray-400 text-xs">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <Link href="/privacy" className="underline hover:text-brand-green">
                  политикой конфиденциальности
                </Link>
              </p>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            <Link href="/" className="hover:text-brand-green transition-colors">
              ← Вернуться на главную
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
