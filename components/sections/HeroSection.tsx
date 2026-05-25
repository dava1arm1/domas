import Link from "next/link";

interface HeroSectionProps {
  heading?:      string;
  subtitle?:     string;
  badge?:        string;
  ctaPrimary?:   string;
  ctaSecondary?: string;
  videoEnabled?: boolean;
}

const DEFAULTS = {
  heading:      "Всё что нужно вашему дому — в одном сервисе.",
  subtitle:     "Один сервис закрывает все задачи вашего дома — от вывоза отходов до стрижки газона и откачки септика. Для тех, кто ценит своё время.",
  badge:        "Работаем в радиусе 80 км от МКАД",
  ctaPrimary:   "Подключить сервис",
  ctaSecondary: "Узнать подробнее",
  videoEnabled: true,
};

export function HeroSection({
  heading      = DEFAULTS.heading,
  subtitle     = DEFAULTS.subtitle,
  badge        = DEFAULTS.badge,
  ctaPrimary   = DEFAULTS.ctaPrimary,
  ctaSecondary = DEFAULTS.ctaSecondary,
  videoEnabled = DEFAULTS.videoEnabled,
}: HeroSectionProps) {
  // Split heading to highlight last word in green
  const words   = heading.split(" ");
  const lastWord = words.pop() ?? "";
  const rest     = words.join(" ");

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">

      {/* Background video */}
      {videoEnabled ? (
        <video
          src="/video/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A16] via-[#0d2018] to-[#1D9E75]/30" aria-hidden="true" />
      )}

      {/* Shared gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />

      {/* Stronger bottom gradient — mobile only */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent md:hidden" />

      {/* Top nav readability gradient */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Content */}
      <div className="relative container-custom w-full pt-24 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-brand-green-light animate-pulse" />
            <span className="text-white/90 text-sm font-medium">{badge}</span>
          </div>

          {/* Heading */}
          <h1 className="font-raleway font-black text-[28px] sm:text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 md:mb-6 animate-fade-up">
            {rest}{" "}
            <span className="text-brand-green-light">{lastWord}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/80 text-sm md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {subtitle}
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/30 active:scale-95"
            >
              {ctaPrimary}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
            >
              {ctaSecondary}
            </a>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </section>
  );
}
