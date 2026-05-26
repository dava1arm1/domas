"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BENEFITS = [
  {
    title: "Копите с каждого заказа",
    description: "5% от суммы любого заказа возвращается в ДомоКоинах — автоматически.",
  },
  {
    title: "Тратьте как рубли",
    description: "1 ДомоКоин = 1 рубль скидки. Оплачивайте монетами до 30% заказа.",
  },
  {
    title: "Бонусы за активность",
    description: "500 монет за первый заказ, 100 за отзыв, 1 000 за приглашённого друга.",
  },
  {
    title: "12 месяцев действия",
    description: "Монеты не сгорают быстро — у вас есть целый год на их использование.",
  },
];

export function DomoCoinSection() {
  useScrollReveal();

  return (
    <section className="section-padding bg-brand-dark overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — content */}
          <div className="reveal">
            <span className="inline-flex items-center gap-2 text-[#F5C518] font-semibold text-sm uppercase tracking-widest mb-5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" opacity="0.2"/>
                <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">Д</text>
              </svg>
              Программа лояльности
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl lg:text-5xl text-white mb-5 leading-tight">
              ДомоКоин —<br />
              <span className="text-[#F5C518]">награда за каждый</span>
              <br />заказ
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Копите монеты и тратьте их как рубли на любые услуги Domas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {BENEFITS.map((b, i) => (
                <div
                  key={b.title}
                  className={`reveal reveal-delay-${i + 1} bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.07] hover:border-[#F5C518]/20 transition-all duration-300`}
                >
                  <h3 className="font-raleway font-bold text-white text-sm mb-1.5">{b.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#F5C518]/90 text-[#0A0A0A] font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#F5C518]/20 active:scale-95"
              >
                Начать копить монеты
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/dashboard/coins"
                className="inline-flex items-center justify-center text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Уже есть аккаунт? Монеты ждут →
              </Link>
            </div>
          </div>

          {/* Right — coin visual */}
          <div className="reveal reveal-delay-2 flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-[#F5C518]/10 animate-glow-pulse" />
              <div className="absolute inset-8 rounded-full bg-[#F5C518]/10 animate-glow-pulse" style={{ animationDelay: "1s" }} />

              {/* Coin */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "600px" }}>
                <div
                  className="w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center animate-float"
                  style={{
                    background: "conic-gradient(from 0deg, #B8860B, #FFD700, #F5C518, #DAA520, #B8860B, #FFD700, #B8860B)",
                    boxShadow: "0 0 60px rgba(245, 197, 24, 0.3), inset 0 2px 8px rgba(255,255,255,0.3)",
                  }}
                >
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #FFD700, #B8860B)",
                      boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <span className="font-raleway font-black text-4xl md:text-5xl text-[#0A0A0A]/70 leading-none">Д</span>
                    <span className="text-[#0A0A0A]/50 text-xs font-bold mt-1 tracking-wider">ДОМОКОИН</span>
                  </div>
                </div>
              </div>

              {/* Stats chips */}
              <div className="absolute -top-4 -right-4 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                <p className="font-raleway font-black text-xl text-white leading-none">5%</p>
                <p className="text-white/40 text-xs mt-0.5">кэшбэк</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                <p className="font-raleway font-black text-xl text-[#F5C518] leading-none">1=1₽</p>
                <p className="text-white/40 text-xs mt-0.5">монета = рубль</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
