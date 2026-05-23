import Link from "next/link";

export function DashboardPreviewSection() {
  return (
    <section className="section-padding bg-brand-dark overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Текст */}
          <div>
            <span className="inline-block text-brand-green-light font-semibold text-sm uppercase tracking-wider mb-4">
              Личный кабинет
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-white mb-6 leading-tight">
              Всё под контролем
              <br />
              <span className="text-brand-green-light">в одном месте</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Следите за расписанием визитов, оценивайте качество работы,
              управляйте подпиской и адресами — всё через удобный личный кабинет.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "История всех заказов с фотоотчётами",
                "Оценка качества каждого визита",
                "Смена тарифа и управление подпиской",
                "Быстрый контакт с менеджером",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/30 active:scale-95"
            >
              Открыть кабинет
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Превью кабинета (UI-заглушка) */}
          <div className="relative">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              {/* Заголовок карточки */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/50 text-sm">Добро пожаловать</p>
                  <h3 className="text-white font-bold text-xl">Иван Петров</h3>
                </div>
                <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl px-3 py-1.5">
                  <span className="text-brand-green-light text-sm font-medium">
                    Тариф Комфорт
                  </span>
                </div>
              </div>

              {/* Мини-карточки */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Визитов", value: "4", sub: "в этом месяце" },
                  { label: "Следующий", value: "28 мая", sub: "Вторник" },
                  { label: "Рейтинг", value: "5.0 ★", sub: "средняя оценка" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-white/5 rounded-xl p-3 border border-white/10"
                  >
                    <p className="text-white/40 text-xs mb-1">{card.label}</p>
                    <p className="text-white font-bold text-sm">{card.value}</p>
                    <p className="text-white/30 text-xs mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Ближайший визит */}
              <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/50 text-xs mb-1">Ближайший визит</p>
                    <p className="text-white font-semibold">Вывоз мусора</p>
                    <p className="text-white/50 text-sm mt-1">
                      28 мая · 10:00 – 12:00
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      ул. Лесная, д. 12, Истра
                    </p>
                  </div>
                  <span className="bg-brand-green text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    В работе
                  </span>
                </div>
              </div>
            </div>

            {/* Декоративный элемент */}
            <div className="absolute -bottom-8 -right-8 h-48 w-48 bg-brand-green/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
