import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import { ServiceFaq } from "@/components/sections/service/ServiceFaq";
import { RelatedServices } from "@/components/sections/service/RelatedServices";

export const metadata: Metadata = {
  title: "Вывоз строительного и растительного мусора в Подмосковье | Domas",
  description:
    "Вывозим строительные отходы после ремонта, ветки, листья и крупногабаритный мусор. Работаем с любым объёмом, выезд в удобное время. 80 км от МКАД.",
  openGraph: {
    title: "Вывоз строительного и растительного мусора в Подмосковье | Domas",
    description:
      "Вывозим строительные отходы после ремонта, ветки, листья и крупногабаритный мусор. Работаем с любым объёмом, выезд в удобное время. 80 км от МКАД.",
  },
};

const ACCENT = "#D97706";

const FAQ_ITEMS = [
  {
    q: "Нужно ли самому грузить мусор?",
    a: "Нет. Наша бригада приезжает с нужным инструментом и загружает всё самостоятельно. Вам нужно только указать что вывозить.",
  },
  {
    q: "Можно заказать вывоз завтра?",
    a: "В большинстве случаев да. При срочном заказе уточним наличие бригады на нужную дату.",
  },
  {
    q: "Как вы определяете цену?",
    a: "По объёму и типу отходов. Самый точный способ — описать или прислать фото. Ответим с ценой за 15 минут.",
  },
  {
    q: "Убираете ли за собой?",
    a: "Да. После загрузки бригада сметает крупный мусор с места работ. Детальная уборка — по отдельному запросу.",
  },
  {
    q: "Если объём оказался больше ожидаемого?",
    a: "Такое бывает. Менеджер связывается с вами до начала работ если объём существенно расходится с заявкой. Никаких неприятных сюрпризов на месте.",
  },
];

export default function ConstructionWastePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow="Услуга по заявке"
        h1="Вывоз строительного мусора"
        highlight="любого объёма"
        subtitle="После ремонта, сноса, обрезки деревьев — вывезем всё что нельзя выбросить в обычный контейнер. Работаем с любыми объёмами, выезд в удобное время."
        accentColor={ACCENT}
        stats={[
          { value: "от 1 дня", label: "срок выезда" },
          { value: "любой объём", label: "без ограничений" },
          { value: "80 км", label: "от МКАД" },
        ]}
      />

      {/* ── SECTION 2: ЧТО ВЫВОЗИМ ───────────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Типы отходов
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Строительные и растительные отходы
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Строительный мусор */}
            <div className="reveal reveal-delay-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-sm font-semibold"
                style={{ backgroundColor: ACCENT + "15", color: ACCENT }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Строительный мусор
              </div>
              <ul className="space-y-3">
                {[
                  "Кирпич, бетон, штукатурка",
                  "Плитка, керамика, стекло",
                  "Металлолом, арматура",
                  "Доски, фанера, ОСБ",
                  "Монтажная пена, упаковка",
                  "Старая мебель и техника",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ACCENT + "18" }}
                    >
                      <svg
                        className="h-3 w-3"
                        style={{ color: ACCENT }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Растительные отходы */}
            <div className="reveal reveal-delay-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-sm font-semibold bg-brand-green/10 text-brand-green">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Растительные отходы
              </div>
              <ul className="space-y-3">
                {[
                  "Ветки и стволы деревьев",
                  "Скошенная трава и листья",
                  "Пни (небольшие)",
                  "Корни и дёрн",
                  "Сезонная обрезка кустарников",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-brand-green/10 flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-brand-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Не берём */}
          <div className="mt-5 reveal reveal-delay-3 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4 max-w-2xl mx-auto">
            <svg
              className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <p className="text-red-700 text-sm leading-relaxed">
              <span className="font-semibold">Не берём:</span> токсичные отходы,
              асбест, автомобильные покрышки, химия.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ЗАЯВКА ────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-14 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Просто
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Как сделать заявку
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "Опишите объём",
                desc: "Позвоните или напишите нам. Скажите что нужно вывезти и примерный объём. Можно прислать фото.",
                delay: "reveal-delay-1",
              },
              {
                num: "2",
                title: "Получите цену",
                desc: "Рассчитаем стоимость в течение 15 минут и согласуем удобное время выезда.",
                delay: "reveal-delay-2",
              },
              {
                num: "3",
                title: "Получите чистый участок",
                desc: "Бригада приедет, загрузит и вывезет всё. Уберут за собой.",
                delay: "reveal-delay-3",
              },
            ].map((step) => (
              <div
                key={step.num}
                className={`reveal ${step.delay} flex items-start gap-6`}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-2xl font-raleway font-black text-white text-3xl md:text-4xl"
                  style={{
                    backgroundColor: ACCENT,
                    minWidth: "64px",
                    height: "64px",
                    width: "64px",
                  }}
                >
                  {step.num}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
                  <h3 className="font-raleway font-bold text-lg text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 reveal reveal-delay-4 text-center">
            <p className="inline-flex items-center gap-2 bg-brand-green/8 border border-brand-green/20 rounded-xl px-5 py-3 text-sm text-brand-green font-medium">
              <svg
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Клиенты с подпиской на вывоз ТКО получают скидку 10% на вывоз
              строительного мусора
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ОБЪЁМ И ЦЕНА ───────────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Стоимость
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Стоимость зависит от объёма
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Небольшой объём",
                sub: "до 5 м³",
                desc: "Остатки небольшого ремонта, обрезка сада. Приедем с небольшой машиной.",
                delay: "reveal-delay-1",
              },
              {
                title: "Средний объём",
                sub: "5–15 м³",
                desc: "Ремонт комнаты или гаража, сезонная уборка участка. Средний грузовик.",
                delay: "reveal-delay-2",
                featured: true,
              },
              {
                title: "Большой объём",
                sub: "от 15 м³",
                desc: "Снос постройки, капитальный ремонт, расчистка участка. Несколько машин или контейнер.",
                delay: "reveal-delay-3",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`reveal ${card.delay} rounded-2xl p-8 flex flex-col gap-3 ${
                  card.featured
                    ? "shadow-lg border-2 text-white"
                    : "bg-white shadow-sm border border-gray-100"
                }`}
                style={
                  card.featured
                    ? { backgroundColor: ACCENT, borderColor: ACCENT }
                    : {}
                }
              >
                <div>
                  <h3
                    className={`font-raleway font-bold text-lg mb-1 ${
                      card.featured ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <span
                    className={`text-sm font-semibold ${
                      card.featured ? "text-white/70" : ""
                    }`}
                    style={!card.featured ? { color: ACCENT } : {}}
                  >
                    {card.sub}
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    card.featured ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {card.desc}
                </p>
                <p
                  className={`text-xs font-medium mt-auto pt-3 border-t ${
                    card.featured
                      ? "text-white/60 border-white/20"
                      : "text-gray-400 border-gray-100"
                  }`}
                >
                  Цена — по запросу. Без скрытых доплат за погрузку и уборку
                  территории.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: СЦЕНАРИИ ──────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Случаи
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Когда обычно вызывают
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              {
                title: "После ремонта",
                desc: "Заменили полы, переклеили обои? Штукатурка, плитка, упаковка — всё заберём за один раз.",
                delay: "reveal-delay-1",
                icon: (
                  <svg
                    className="h-6 w-6"
                    style={{ color: ACCENT }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ),
              },
              {
                title: "Строительство на участке",
                desc: "Залили фундамент, поставили забор? Куски бетона, опалубка, арматура.",
                delay: "reveal-delay-2",
                icon: (
                  <svg
                    className="h-6 w-6"
                    style={{ color: ACCENT }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
              },
              {
                title: "Осенняя уборка сада",
                desc: "Обрезали деревья, убрали старые кусты? Объём веток и листьев всегда больше, чем кажется.",
                delay: "reveal-delay-3",
                icon: (
                  <svg
                    className="h-6 w-6"
                    style={{ color: ACCENT }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
              },
              {
                title: "Расчистка участка",
                desc: "Купили запущенный участок и хотите начать с чистого листа.",
                delay: "reveal-delay-4",
                icon: (
                  <svg
                    className="h-6 w-6"
                    style={{ color: ACCENT }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`reveal ${card.delay} bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3`}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: ACCENT + "12" }}
                >
                  {card.icon}
                </div>
                <h3 className="font-raleway font-bold text-base text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ backgroundColor: ACCENT + "0F" }}
      >
        <div className="container-custom max-w-3xl text-center reveal">
          <h2 className="font-raleway font-black text-2xl md:text-3xl text-gray-900 mb-4">
            Готовы вывезти мусор?
          </h2>
          <p className="text-gray-500 text-base mb-8">
            Опишите задачу — ответим с ценой за 15 минут
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: ACCENT }}
            >
              Оставить заявку
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href="tel:+74950000000"
              className="inline-flex items-center justify-center gap-2 border-2 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:bg-gray-50 active:scale-95"
              style={{ borderColor: ACCENT + "40" }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: ACCENT }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Позвонить
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <ServiceFaq items={FAQ_ITEMS} accentColor={ACCENT} />

      {/* ── RELATED SERVICES ─────────────────────────────────────────── */}
      <RelatedServices currentId="construction_waste" />
    </>
  );
}
