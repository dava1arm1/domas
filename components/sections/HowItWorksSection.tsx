"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEPS = [
  {
    number: "01",
    title: "Выберите тариф или услугу",
    description:
      "Зарегистрируйтесь за 2 минуты, выберите подходящий тариф или разовую услугу и укажите адрес.",
  },
  {
    number: "02",
    title: "Мы свяжемся удобным способом",
    description:
      "Менеджер свяжется в течение 5 минут, уточнит детали и согласует удобное расписание визитов.",
  },
  {
    number: "03",
    title: "Наслаждайтесь результатом",
    description:
      "После каждой услуги вы оцениваете качество — это помогает нам становиться лучше.",
  },
] as const;

export function HowItWorksSection() {
  useScrollReveal();

  return (
    <section className="section-padding bg-[#0A0A0A] overflow-hidden">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-widest mb-4">
            Как это работает
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-5xl text-white">
            Три шага до комфорта
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* Dashed connector (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px">
            <div className="w-full h-full border-t-2 border-dashed border-white/10" />
          </div>

          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`reveal reveal-delay-${index + 1} flex flex-col items-center text-center px-6 md:px-8 pb-12 md:pb-0 relative`}
            >
              {/* Vertical connector (mobile only) */}
              {index < STEPS.length - 1 && (
                <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 border-l-2 border-dashed border-white/10" />
              )}

              {/* Large step number */}
              <div className="relative mb-6">
                <span className="font-raleway font-black text-[80px] md:text-[96px] leading-none text-white/[0.04] select-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {step.number}
                </span>
                <div className="relative z-10 h-20 w-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <span className="font-raleway font-black text-2xl text-brand-green">
                    {step.number}
                  </span>
                </div>
              </div>

              <h3 className="font-raleway font-bold text-xl text-white mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
