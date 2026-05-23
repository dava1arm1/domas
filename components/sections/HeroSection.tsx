import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Фоновое видео */}
      <video
        src="/video/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Градиентный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />

      {/* Градиент сверху — для читаемости навигации на фоне видео */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Контент */}
      <div className="relative container-custom w-full pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Тег */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-brand-green-light animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Работаем в радиусе 80 км от МКАД
            </span>
          </div>

          {/* Заголовок */}
          <h1 className="font-raleway font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-fade-up">
            Всё что нужно вашему{" "}
            <span className="text-brand-green-light">дому</span>
            {" "}— в одном сервисе.
          </h1>

          {/* Подзаголовок */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Один сервис закрывает все задачи вашего дома — от вывоза отходов
            до стрижки газона и откачки септика.{" "}
            <strong className="text-white">Для тех, кто ценит своё время.</strong>
          </p>

          {/* CTA кнопки */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/30 active:scale-95"
            >
              Подключить сервис
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
            >
              Узнать подробнее
            </a>
          </div>

        </div>
      </div>

      {/* Стрелка вниз */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
