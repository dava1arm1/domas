"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SERVICES } from "@/constants/services";
import { SERVICE_ICONS } from "@/constants/icons";
import type { Service } from "@/types";

// ─── Модальное окно услуги ─────────────────────────────────────
function ServiceModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  // Закрытие по Escape + блокировка скролла
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Карточка */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in overflow-hidden">
        {/* Цветная полоска сверху */}
        <div className="h-1.5" style={{ backgroundColor: service.color }} />

        <div className="p-8">
          {/* Шапка */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center h-14 w-14 rounded-2xl text-3xl flex-shrink-0"
                style={{ backgroundColor: service.bgColor }}
              >
                {SERVICE_ICONS[service.id] ?? service.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-raleway font-black text-2xl text-gray-900">
                    {service.title}
                  </h2>
                  {service.isPrimarySubscription && (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: service.bgColor, color: service.color }}
                    >
                      Основная подписка
                    </span>
                  )}
                </div>
                {service.frequency && (
                  <p className="text-gray-400 text-sm mt-0.5">{service.frequency}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
              aria-label="Закрыть"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Описание */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {service.fullDescription}
          </p>

          {/* Что включено */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">
              Что включено
            </h3>
            <ul className="space-y-2">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-700 text-sm">
                  <svg
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: service.color }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Цена и кнопки */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Стоимость</p>
              <p className="font-semibold text-gray-900">
                {service.priceNote ?? "По запросу"}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <a
                href={`mailto:hello@domas.ru?subject=Заявка: ${service.title}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
              >
                Узнать цену
              </a>
              <Link
                href="/register"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-white text-sm active:scale-95"
                style={{ backgroundColor: service.color }}
                onClick={onClose}
              >
                Заказать
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Секция услуг ─────────────────────────────────────────────
interface ServicesSectionProps {
  servicesData?: string; // JSON из настроек (из site.services)
}

export function ServicesSection({ servicesData }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Мержим данные из настроек с константами (цвета/иконки берём из констант)
  const services: Service[] = (() => {
    if (!servicesData) return SERVICES;
    try {
      const overrides = JSON.parse(servicesData) as Array<{
        id: string; title?: string; description?: string;
        fullDescription?: string; included?: string[];
        frequency?: string; priceNote?: string; active?: boolean;
      }>;
      return overrides
        .filter((o) => o.active !== false)
        .map((o) => {
          const base = SERVICES.find((s) => s.id === o.id);
          if (!base) return null;
          return {
            ...base,
            title: o.title ?? base.title,
            description: o.description ?? base.description,
            fullDescription: o.fullDescription ?? base.fullDescription,
            included: o.included ?? base.included,
            frequency: o.frequency ?? base.frequency,
            priceNote: o.priceNote ?? base.priceNote,
          };
        })
        .filter(Boolean) as Service[];
    } catch {
      return SERVICES;
    }
  })();

  return (
    <>
      <section id="services" className="section-padding bg-surface-secondary">
        <div className="container-custom">
          {/* Заголовок */}
          <div className="text-center mb-14">
            <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-wider mb-3">
              Что мы делаем
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900 mb-4">
              Услуги для вашего дома
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Нажмите на любую карточку, чтобы узнать подробнее
            </p>
          </div>

          {/* Карточки услуг */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
              >
                {/* Цветная полоска */}
                <div className="h-1.5" style={{ backgroundColor: service.color }} />

                <div className="p-6 flex flex-col h-full">
                  {/* Иконка и метки */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center justify-center h-12 w-12 rounded-xl text-2xl flex-shrink-0"
                      style={{ backgroundColor: service.bgColor }}
                    >
                      {SERVICE_ICONS[service.id] ?? service.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 min-h-[28px]">
                      {service.isPrimarySubscription ? (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: service.bgColor, color: service.color }}
                        >
                          Основная подписка
                        </span>
                      ) : service.frequency ? (
                        <span className="text-xs text-gray-400 font-medium">
                          {service.frequency}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Название */}
                  <h3 className="font-raleway font-bold text-lg text-gray-900 mb-2 leading-snug">
                    {service.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                    {service.description}
                  </p>

                  {/* Подробнее */}
                  <span
                    className="inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: service.color }}
                  >
                    Подробнее
                    <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Подключить сервис
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Модальное окно */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
