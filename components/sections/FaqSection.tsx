"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/constants/faq";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  useScrollReveal();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">

        <div className="text-center mb-14 reveal">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            FAQ
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
            Частые вопросы
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={cn(
                "reveal",
                `reveal-delay-${Math.min(index + 1, 6)}`,
                "border rounded-2xl overflow-hidden transition-all duration-300",
                openIndex === index
                  ? "border-brand-green/30 shadow-sm shadow-brand-green/10"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <button
                onClick={() => toggle(index)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-5 text-left transition-all duration-200",
                  openIndex === index
                    ? "bg-brand-green-pale border-l-4 border-l-brand-green"
                    : "hover:bg-gray-50 border-l-4 border-l-transparent"
                )}
                aria-expanded={openIndex === index}
              >
                <span className={cn(
                  "font-semibold pr-4 transition-colors",
                  openIndex === index ? "text-brand-green" : "text-gray-900"
                )}>
                  {item.question}
                </span>
                <svg
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    openIndex === index ? "text-brand-green rotate-180" : "text-gray-400"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed text-sm border-l-4 border-l-brand-green/20 ml-0">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
