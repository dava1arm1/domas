"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FEATURES = [
  "История всех заказов с фотоотчётами",
  "Оценка качества каждого визита",
  "Смена тарифа и управление подпиской",
  "Быстрый контакт с менеджером",
];

export function DashboardPreviewSection() {
  useScrollReveal();

  return (
    <section className="section-padding bg-brand-dark overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div className="reveal">
            <span className="inline-block text-brand-green-light font-semibold text-sm uppercase tracking-widest mb-5">
              Личный кабинет
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Всё под контролем
              <br />
              <span className="text-brand-green-light">в одном месте</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Следите за расписанием визитов, оценивайте качество работы,
              управляйте подпиской и адресами — всё через удобный личный кабинет.
            </p>

            <ul className="space-y-4 mb-10">
              {FEATURES.map((feature, i) => (
                <li key={feature} className={`reveal reveal-delay-${i + 1} flex items-center gap-3`}>
                  <div className="h-6 w-6 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center flex-shrink-0">
                    <svg className="h-3.5 w-3.5 text-brand-green-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-base">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-green/30 active:scale-95"
            >
              Открыть кабинет
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Dashboard preview */}
          <div className="reveal reveal-delay-2 relative">
            {/* Green glow */}
            <div className="absolute -inset-10 bg-brand-green/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-brand-green/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative bg-white/[0.05] border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-black/40">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/40 text-xs mb-1">Добро пожаловать</p>
                  <h3 className="text-white font-bold text-xl">Иван Петров</h3>
                </div>
                <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl px-3 py-1.5">
                  <span className="text-brand-green-light text-sm font-medium">Тариф Комфорт</span>
                </div>
              </div>

              {/* Mini stat cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Визитов", value: "4", sub: "в этом месяце" },
                  { label: "Следующий", value: "28 мая", sub: "Вторник" },
                  { label: "Рейтинг", value: "5.0 ★", sub: "средняя оценка" },
                ].map((card) => (
                  <div key={card.label} className="bg-white/[0.06] rounded-xl p-3 border border-white/10">
                    <p className="text-white/40 text-xs mb-1">{card.label}</p>
                    <p className="text-white font-bold text-sm">{card.value}</p>
                    <p className="text-white/30 text-xs mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Next visit */}
              <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Ближайший визит</p>
                    <p className="text-white font-semibold">Вывоз мусора</p>
                    <p className="text-white/50 text-sm mt-1">28 мая · 10:00 – 12:00</p>
                    <p className="text-white/30 text-xs mt-1">ул. Лесная, д. 12, Истра</p>
                  </div>
                  <span className="bg-brand-green text-white text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                    В работе
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
