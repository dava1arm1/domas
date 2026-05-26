"use client";

import { useState } from "react";
import Link from "next/link";
import { MAIN_SUBSCRIPTION, ADDON_SUBSCRIPTIONS } from "@/constants/pricing";
import { ADDON_ICONS } from "@/constants/icons";
import { formatPrice } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
        <div className="h-14 w-14 rounded-2xl bg-brand-green-pale flex items-center justify-center mx-auto mb-4">
          <svg className="h-7 w-7 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-raleway font-black text-xl text-gray-900 mb-2">Подписки в разработке</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Мы работаем над системой подписок. Скоро всё будет готово — следите за обновлениями.
        </p>
        <Link
          href="/#contacts"
          onClick={onClose}
          className="inline-flex items-center justify-center w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-3 rounded-xl text-sm transition-all mb-3"
        >
          Узнать подробности
        </Link>
        <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
          Закрыть
        </button>
      </div>
    </div>
  );
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useScrollReveal();

  return (
    <section id="pricing" className="section-padding" style={{ backgroundColor: "#EAF0E5" }}>
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}
      <div className="container-custom">
        {/* Заголовок */}
        <div className="reveal text-center mb-12">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Подписки
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900 mb-6">
            Выберите подходящий формат
          </h2>

          {/* Переключатель месяц / год */}
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isAnnual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isAnnual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ежегодно
              <span className="bg-brand-green text-white text-xs px-2 py-0.5 rounded-full font-bold">
                −2 мес
              </span>
            </button>
          </div>
        </div>

        {/* Основная подписка + дополнительные */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ── Основная подписка ─────────────────────────── */}
          <div className="lg:col-span-2 bg-brand-dark rounded-2xl overflow-hidden shadow-xl">
            {/* Шапка */}
            <div className="p-8 pb-6">
              <span className="inline-block bg-brand-green/20 text-brand-green-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Основная подписка
              </span>
              <h3 className="font-raleway font-black text-2xl text-white mb-2">
                {MAIN_SUBSCRIPTION.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {MAIN_SUBSCRIPTION.description}
              </p>
            </div>

            {/* Цена */}
            <div className="px-8 pb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-raleway font-black text-4xl text-white">
                  {formatPrice(
                    isAnnual
                      ? MAIN_SUBSCRIPTION.annualMonthlyEquivalent
                      : MAIN_SUBSCRIPTION.monthlyPrice
                  )}
                </span>
                <span className="text-white/40 text-sm">/мес</span>
              </div>
              {isAnnual && (
                <p className="text-white/50 text-xs mt-1">
                  {formatPrice(MAIN_SUBSCRIPTION.annualPrice)} при оплате за год
                </p>
              )}
            </div>

            {/* Фичи */}
            <div className="px-8 pb-8">
              <ul className="space-y-3">
                {MAIN_SUBSCRIPTION.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg
                      className="h-4 w-4 text-brand-green-light flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      className={`text-sm ${
                        f.includes("10%")
                          ? "text-brand-green-light font-semibold"
                          : "text-white/70"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Кнопка */}
            <div className="px-8 pb-8">
              <button
                onClick={() => setShowModal(true)}
                className="block w-full text-center bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Подключить подписку
              </button>
            </div>
          </div>

          {/* ── Дополнительные подписки ───────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <p className="text-gray-500 text-sm font-medium px-1">
              Дополнительные подписки — доступны независимо от основной
            </p>

            {ADDON_SUBSCRIPTIONS.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Иконка + название */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-brand-green-pale flex items-center justify-center text-xl flex-shrink-0">
                      {ADDON_ICONS[plan.id] ?? plan.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-raleway font-bold text-gray-900 text-base">
                        {plan.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-0.5">{plan.frequency}</p>
                    </div>
                  </div>

                  {/* Цена */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-raleway font-black text-xl text-gray-900">
                        {formatPrice(
                          isAnnual ? plan.annualMonthlyEquivalent : plan.monthlyPrice
                        )}
                        <span className="text-gray-400 text-sm font-normal">/мес</span>
                      </div>
                      {isAnnual && (
                        <p className="text-gray-400 text-xs">
                          {formatPrice(plan.annualPrice)}/год
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      className="flex-shrink-0 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95"
                    >
                      Выбрать
                    </button>
                  </div>
                </div>

                {/* Фичи */}
                <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {plan.features.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <svg className="h-3 w-3 text-brand-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-gray-400 text-xs px-1 mt-1">
              Все цены указаны без учёта НДС · При наличии основной подписки — скидка 10%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
