import Link from "next/link";

export function CtaBannerSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-[#17895f] to-[#0d6b4a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,255,255,0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,0,0,0.15),transparent_60%)]" />

      {/* Decorative dots */}
      <div className="absolute top-8 left-12 h-2 w-2 rounded-full bg-white/20" />
      <div className="absolute top-16 left-24 h-1 w-1 rounded-full bg-white/15" />
      <div className="absolute bottom-12 right-20 h-3 w-3 rounded-full bg-white/10" />
      <div className="absolute bottom-8 right-40 h-1.5 w-1.5 rounded-full bg-white/20" />

      <div className="relative container-custom text-center">
        <span className="inline-block text-white/70 font-semibold text-sm uppercase tracking-widest mb-5">
          Начните сегодня
        </span>
        <h2 className="font-raleway font-black text-3xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
          Готовы избавиться<br className="hidden sm:block" /> от забот о доме?
        </h2>
        <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Присоединяйтесь к сотням владельцев домов, которые уже доверяют Domas
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-green font-bold px-8 py-4 rounded-xl hover:bg-white/95 transition-all duration-200 hover:shadow-2xl active:scale-95 text-base"
          >
            Подключить сервис
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="#contacts"
            className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white/70 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-95 text-base"
          >
            Связаться с нами
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Без скрытых платежей
          </span>
          <span className="hidden sm:block text-white/20">·</span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Работаем в радиусе 80 км
          </span>
          <span className="hidden sm:block text-white/20">·</span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Регистрация за 2 минуты
          </span>
        </div>
      </div>
    </section>
  );
}
