import Link from "next/link";

interface Stat {
  value: string;
  label: string;
}

interface ServiceHeroProps {
  eyebrow: string;
  h1: string;
  highlight?: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
  stats?: Stat[];
  accentColor?: string;
  badge?: string;
}

export function ServiceHero({
  eyebrow,
  h1,
  highlight,
  subtitle,
  cta = "Подключить сервис",
  ctaHref = "/register",
  stats,
  accentColor = "#1D9E75",
  badge,
}: ServiceHeroProps) {
  const words = h1.split(" ");
  const lastWord = highlight ?? words.pop() ?? "";
  const rest = highlight ? h1 : words.join(" ");

  return (
    <section className="relative bg-brand-dark pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none"
        style={{ background: accentColor }}
      />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px] pointer-events-none bg-brand-green" />

      <div className="relative container-custom">
        <div className="max-w-3xl">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: accentColor }} />
              <span className="text-white/90 text-sm font-medium">{badge}</span>
            </div>
          )}

          <span className="inline-block text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: accentColor }}>
            {eyebrow}
          </span>

          <h1 className="font-raleway font-black text-3xl sm:text-4xl md:text-6xl text-white leading-tight mb-5">
            {rest}{" "}
            <span style={{ color: accentColor }}>{lastWord}</span>
          </h1>

          <p className="text-white/60 text-base md:text-xl leading-relaxed mb-8 max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:opacity-90 hover:shadow-xl active:scale-95"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 0 0 ${accentColor}` }}
            >
              {cta}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="tel:+74950000000"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/50 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-white/5 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Позвонить
            </a>
          </div>

          {stats && (
            <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-white/10">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-raleway font-black text-2xl md:text-3xl text-white leading-none">{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
