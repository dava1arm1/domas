"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface ServiceFaqProps {
  items: FaqItem[];
  accentColor?: string;
}

export function ServiceFaq({ items, accentColor = "#1D9E75" }: ServiceFaqProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding bg-surface-secondary">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            Вопросы и ответы
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
            Часто спрашивают
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-gray-900 text-base leading-snug">{item.q}</span>
                <svg
                  className="h-5 w-5 flex-shrink-0 transition-transform duration-200"
                  style={{ color: accentColor, transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
