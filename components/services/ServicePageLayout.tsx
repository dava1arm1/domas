"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/constants/services";
import type { ServicePageData } from "@/constants/service-pages";

const SERVICE_SLUGS: Record<string, string> = {
  waste_removal: "/services/waste-removal",
  construction_waste: "/services/construction-waste",
  lawn_care: "/services/lawn-care",
  septic_pumping: "/services/septic",
  snow_removal: "/services/snow-removal",
  cleaning: "/services/cleaning",
};

const SERVICE_NAMES: Record<string, string> = {
  waste_removal: "Вывоз мусора",
  construction_waste: "Стр. отходы",
  lawn_care: "Уход за участком",
  septic_pumping: "Откачка септика",
  snow_removal: "Уборка снега",
  cleaning: "Клининг",
};

function CheckIcon({ color }: { color: string }) {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill={color} fillOpacity="0.15" />
      <path d="M6 10l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-red-400/60" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#ef4444" fillOpacity="0.1" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServicePageLayout({ data }: { data: ServicePageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { accentColor } = data;
  const isSub = data.isSubscription === true;

  const ctaPrimary    = isSub ? "Подключить сервис" : "Оставить заявку";
  const ctaPriceCard  = isSub ? "Подключить сейчас" : "Заказать";
  const priceCardNote = isSub ? "Без договора · Отмена в любой момент" : "Без предоплаты · Работаем по договору";
  const problemLabel  = isSub ? "Без подписки" : "Без нас";
  const finalNote     = isSub
    ? "Без договора · Первый выезд в течение 48 часов · Работаем в Москве и области"
    : "Без предоплаты · Первый выезд быстро · Работаем в Москве и области";

  const related = SERVICES.filter((s) => s.id !== data.id).slice(0, 3);

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
          }}
        />

        <div className="relative container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-8 font-medium">
            <Link href="/" className="hover:text-white/60 transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white/50">{data.name}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 rounded-full px-4 py-1.5 text-sm font-semibold border"
              style={{ borderColor: accentColor + "40", color: accentColor, background: accentColor + "12" }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
              {data.badge}
            </div>

            <h1 className="font-raleway font-black text-3xl sm:text-4xl md:text-[56px] lg:text-[64px] text-white leading-[1.1] mb-6">
              {data.h1.includes(" — ") ? (
                <>
                  {data.h1.split(" — ")[0]}
                  {" — "}
                  <span style={{ color: accentColor }}>{data.h1.split(" — ").slice(1).join(" — ")}</span>
                </>
              ) : (
                data.h1
              )}
            </h1>

            <p className="text-white/60 text-base md:text-xl leading-relaxed mb-10 max-w-2xl">
              {data.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:opacity-90 hover:shadow-2xl active:scale-95"
                style={{ backgroundColor: accentColor }}
              >
                {ctaPrimary}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+74950000000"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/5 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Позвонить
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 pt-8 border-t border-white/10">
              {data.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-raleway font-black text-2xl md:text-3xl text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM ──────────────────────────────────────── */}
      <section className="section-padding bg-[#F8F8F6]">
        <div className="container-custom">
          <div className="max-w-2xl mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-4">
              {problemLabel}
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-4xl text-[#0A0A0A] leading-tight">
              {data.problemHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {data.problemCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-raleway font-bold text-[#0A0A0A] text-base mb-2">{card.title}</h3>
                <p className="text-black/50 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Full-width dark last card */}
          <div
            className="rounded-2xl p-7 md:p-10 text-white"
            style={{ background: `linear-gradient(135deg, #0A0A0A 0%, ${accentColor}33 100%)` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: accentColor + "25" }}>
                ✓
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                  С Домас
                </div>
                <p className="text-white/90 text-base md:text-lg leading-relaxed font-medium">
                  {data.problemLastCard}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────── */}
      <section className="section-padding bg-[#0A0A0A]">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
              Как это работает
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-4xl text-white">
              Четыре шага до идеального результата
            </h2>
          </div>

          {/* Desktop: horizontal steps with dashed line */}
          <div className="hidden md:grid grid-cols-4 gap-6 relative">
            {/* Dashed connector */}
            <div className="absolute top-7 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-white/10 z-0" />

            {data.howItWorksSteps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center font-raleway font-black text-xl text-white mb-5"
                  style={{ background: accentColor }}
                >
                  {i + 1}
                </div>
                <h3 className="font-raleway font-bold text-white text-base mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-0">
            {data.howItWorksSteps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center font-raleway font-black text-base text-white flex-shrink-0"
                    style={{ background: accentColor }}
                  >
                    {i + 1}
                  </div>
                  {i < data.howItWorksSteps.length - 1 && (
                    <div className="w-px flex-1 my-2" style={{ background: accentColor + "30" }} />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-raleway font-bold text-white text-base mb-1">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {data.howItWorksNote && (
            <div className="mt-10 mx-auto max-w-xl text-center">
              <p className="text-white/30 text-sm leading-relaxed border-t border-white/8 pt-8">
                {data.howItWorksNote}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. INCLUDED + PRICE ─────────────────────────────── */}
      <section className="section-padding bg-[#F8F8F6]">
        <div className="container-custom">
          <div className="max-w-xl mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-4">
              Что входит
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-4xl text-[#0A0A0A] leading-tight">
              {data.includedHeading ?? "Полный пакет — всё включено"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Checklist */}
            <ul className="space-y-3">
              {data.includedFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <CheckIcon color={accentColor} />
                  <span className="text-[#0A0A0A] text-sm leading-relaxed">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Price card */}
            <div
              className="rounded-2xl p-8 border-2"
              style={{ borderColor: accentColor, background: accentColor + "08" }}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-4 text-black/40">
                Стоимость
              </div>
              <div className="font-raleway font-black text-4xl md:text-5xl text-[#0A0A0A] mb-2">
                {data.price}
              </div>
              <div className="text-black/40 text-sm mb-8">{data.priceNote}</div>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 w-full text-white font-semibold px-6 py-4 rounded-xl text-base transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: accentColor }}
              >
                {ctaPriceCard}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="text-center text-black/30 text-xs mt-4">{priceCardNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMPARISON ───────────────────────────────────── */}
      <section className="section-padding bg-[#0A0A0A]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
              Сравнение
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-4xl text-white">
              Самостоятельно vs Домас
            </h2>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8">
              {/* Header */}
              <div className="bg-[#111] px-6 py-4">
                <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Параметр</span>
              </div>
              <div className="bg-[#111] px-6 py-4 text-center">
                <span className="text-red-400/70 text-xs font-bold uppercase tracking-widest">Сами</span>
              </div>
              <div className="bg-[#111] px-6 py-4 text-center" style={{ background: accentColor + "15" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>С Домас</span>
              </div>

              {data.comparisonRows.map((row, i) => (
                <>
                  <div key={`label-${i}`} className="bg-[#0D0D0D] px-6 py-4 border-t border-white/5">
                    <span className="text-white/60 text-sm">{row.label}</span>
                  </div>
                  <div key={`without-${i}`} className="bg-[#0D0D0D] px-6 py-4 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CrossIcon />
                      <span className="text-white/40 text-sm">{row.without}</span>
                    </div>
                  </div>
                  <div key={`with-${i}`} className="bg-[#0D0D0D] px-6 py-4 border-t border-white/5 text-center" style={{ background: accentColor + "08" }}>
                    <div className="flex items-center justify-center gap-2">
                      <CheckIcon color={accentColor} />
                      <span className="text-sm font-medium text-white">{row.withDomas}</span>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3 max-w-sm mx-auto">
            {data.comparisonRows.map((row) => (
              <div key={row.label} className="bg-white/5 rounded-xl p-4 border border-white/8">
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">{row.label}</div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    <div className="text-red-400/60 text-xs mb-1">Сами</div>
                    <div className="text-white/50 text-sm">{row.without}</div>
                  </div>
                  <div className="flex-1 rounded-lg p-3 border" style={{ borderColor: accentColor + "30", background: accentColor + "10" }}>
                    <div className="text-xs mb-1" style={{ color: accentColor }}>Домас</div>
                    <div className="text-white text-sm font-medium">{row.withDomas}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FOR WHOM ─────────────────────────────────────── */}
      <section className="section-padding bg-[#F8F8F6]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-4">
              Кому подойдёт
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-4xl text-[#0A0A0A]">
              Для кого эта услуга
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {data.forWhom.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5">
                <div className="h-1.5 w-full" style={{ background: accentColor }} />
                <div className="p-6">
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="font-raleway font-bold text-[#0A0A0A] text-base mb-2">{card.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────── */}
      <section className="section-padding bg-[#0A0A0A]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
              Вопросы и ответы
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-4xl text-white">
              Частые вопросы
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            {data.faq.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  openFaq === i ? "border-white/20" : "border-white/8"
                }`}
                style={openFaq === i ? { borderLeftColor: accentColor, borderLeftWidth: 3 } : {}}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className={`font-medium text-sm md:text-base leading-snug transition-colors ${openFaq === i ? "text-white" : "text-white/70"}`}>
                    {item.q}
                  </span>
                  <span className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-white" : "text-white/30"}`}>
                    <ChevronIcon open={openFaq === i} />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. OTHER SERVICES ───────────────────────────────── */}
      <section className="section-padding bg-[#F8F8F6]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-4">
              Единый сервис
            </span>
            <h2 className="font-raleway font-black text-2xl md:text-3xl text-[#0A0A0A]">
              Другие услуги Домас
            </h2>
            <p className="text-black/40 text-sm mt-3 max-w-md mx-auto">
              Домас — это не отдельные услуги. Это единая система обслуживания вашего дома.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((service) => {
              const href = SERVICE_SLUGS[service.id] ?? "/#services";
              return (
                <Link
                  key={service.id}
                  href={href}
                  className="group block bg-white rounded-2xl border border-black/5 shadow-sm p-6 hover:shadow-md hover:border-black/10 transition-all duration-300"
                >
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-xl text-2xl mb-4"
                    style={{ background: (service.bgColor ?? "#1D9E75") + "15" }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="font-raleway font-bold text-[#0A0A0A] text-base mb-2 leading-snug group-hover:text-[#1D9E75] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-black/40 text-sm leading-relaxed mb-3">{service.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D9E75]">
                    Подробнее
                    <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 text-black/30 hover:text-black text-sm font-medium transition-colors"
            >
              Посмотреть все услуги →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0A2818 0%, #0F5C42 40%, #1D9E75 100%)" }}
        />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative container-custom text-center">
          <h2 className="font-raleway font-black text-2xl md:text-4xl lg:text-5xl text-white mb-5 max-w-3xl mx-auto leading-tight">
            {data.finalCtaHeading}
          </h2>
          <p className="text-white/70 text-base md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            {data.finalCtaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white font-semibold px-10 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/90 hover:shadow-2xl active:scale-95"
              style={{ color: accentColor }}
            >
              {ctaPrimary}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="tel:+74950000000"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/10 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Позвонить
            </a>
          </div>
          <p className="text-white/30 text-sm mt-8">{finalNote}</p>
        </div>
      </section>
    </>
  );
}
