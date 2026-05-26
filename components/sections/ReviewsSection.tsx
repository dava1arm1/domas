"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PLACEHOLDER_REVIEWS = [
  {
    name: "Александр М.",
    location: "Истра, МО",
    rating: 5,
    text: "Отличный сервис! Всё чётко по расписанию, команда профессиональная. Рекомендую всем владельцам загородных домов.",
    service: "Вывоз мусора",
    date: "Апрель 2025",
  },
  {
    name: "Елена В.",
    location: "Одинцово, МО",
    rating: 5,
    text: "Пользуюсь уже полгода. Никаких вопросов — приезжают вовремя, всё делают качественно. Очень удобно через приложение.",
    service: "Стрижка газона",
    date: "Май 2025",
  },
  {
    name: "Дмитрий К.",
    location: "Красногорск, МО",
    rating: 5,
    text: "Наконец-то нашёл сервис, которому можно доверять. Ценю своё время — Domas экономит его каждую неделю.",
    service: "Обслуживание дома",
    date: "Март 2025",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-[#F5C518]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  useScrollReveal();

  return (
    <section id="reviews" className="section-padding bg-surface-secondary">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Отзывы
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900 mb-4">
            Что говорят наши клиенты
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Будьте первыми — после каждого визита вы сможете оставить отзыв в личном кабинете
          </p>
        </div>

        {/* FOMO placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
          {PLACEHOLDER_REVIEWS.map((review, index) => (
            <div
              key={review.name}
              className={`reveal reveal-delay-${index + 1} relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden`}
            >
              {/* Blur overlay with "coming soon" badge */}
              <div className="absolute inset-0 rounded-2xl backdrop-blur-[3px] bg-white/40 z-10 flex flex-col items-center justify-center gap-3">
                <div className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Первый отзыв — ваш
                </div>
              </div>

              {/* Review content (blurred underneath) */}
              <div className="flex items-start justify-between mb-4 pointer-events-none select-none">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">{review.location}</p>
                  </div>
                </div>
                <StarRating count={review.rating} />
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 pointer-events-none select-none">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pointer-events-none select-none">
                <span className="text-xs text-gray-300 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  {review.service}
                </span>
                <span className="text-gray-300 text-xs">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/25 active:scale-95"
          >
            Стать первым клиентом
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
