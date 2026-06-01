import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import { ServiceFaq } from "@/components/sections/service/ServiceFaq";
import { RelatedServices } from "@/components/sections/service/RelatedServices";

export const metadata: Metadata = {
  title: "Уборка снега с участка и дорожек в Подмосковье | Domas",
  description:
    "Расчистка снега с подъездных путей, дорожек, кровли и ворот. Выезжаем после каждого снегопада, работаем круглосуточно. 80 км от МКАД.",
  openGraph: {
    title: "Уборка снега | Domas",
    description: "Расчистим до того как это стало проблемой.",
    url: "https://domas-mo.ru/services/snow-removal",
  },
};

const ACCENT = "#6366F1";

const FAQ_ITEMS = [
  {
    q: "Когда начинается и заканчивается зимний сезон?",
    a: "Ориентировочно ноябрь–март. Следим за погодой: начинаем при первом устойчивом снеге, заканчиваем когда снег перестаёт накапливаться.",
  },
  {
    q: "Убираете ли снег с кровли?",
    a: "Да. Это обязательная часть зимнего обслуживания. Снег с кровли убираем специальными инструментами без риска повреждения покрытия.",
  },
  {
    q: "Что если снег выпал ночью и нужно выехать утром?",
    a: "Именно для этого мы работаем 24/7 в снегопады. Мониторим прогноз и выезжаем заранее — утром участок уже расчищен.",
  },
  {
    q: "Нужно ли мне быть дома?",
    a: "Нет. Вы можете уехать — мы приедем и всё расчистим. Пришлём уведомление когда готово.",
  },
  {
    q: "Можно заключить контракт только на один снегопад?",
    a: "Можно. Но при сезонном контракте вы получаете приоритет и фиксированную цену.",
  },
];

const PROBLEM_CARDS = [
  {
    icon: "❄️",
    title: "Машина в снежном плену",
    desc: "50 метров подъезда засыпало ночью. Полтора часа работы лопатой. Опоздание на работу.",
  },
  {
    icon: "🧊",
    title: "Наледь у крыльца",
    desc: "После оттепели и мороза — каток у входной двери. Риск падения для всей семьи.",
  },
  {
    icon: "🏠",
    title: "Нагрузка на кровлю",
    desc: "Слой мокрого снега весит до 300 кг. Через 2–3 дня без уборки — деформация кровли.",
  },
];

const ZONES = [
  {
    icon: "🚗",
    title: "Подъездная дорожка",
    desc: "Расчищаем от ворот до гаража или парковочного места.",
  },
  {
    icon: "🚶",
    title: "Пешеходные дорожки",
    desc: "Все тропинки на участке, ступени, входная группа.",
  },
  {
    icon: "🏠",
    title: "Кровля и отмостка",
    desc: "Снег с крыши, ледяные сосульки, наледь по периметру.",
  },
  {
    icon: "🚪",
    title: "Въездные ворота",
    desc: "Снег у ворот и под ними, чтобы они открывались нормально.",
  },
  {
    icon: "🌳",
    title: "Периметр участка",
    desc: "Расчистка вдоль забора и у хозяйственных построек.",
  },
];

const SCENARIOS = [
  {
    title: "Первый снег сезона",
    desc: "Составляем план работ для вашего участка, фиксируем все зоны уборки.",
  },
  {
    title: "Плановый снегопад",
    desc: "Выезжаем утром после снегопада. Большинство клиентов ещё спят.",
  },
  {
    title: "Интенсивный снегопад",
    desc: "При сильном снегопаде выезжаем 2 раза: утром и вечером.",
  },
];

const CHECKLIST = [
  "Не повреждаем покрытие дорожек",
  "Не царапаем кровлю",
  "Снег вывозим или складируем в указанном месте",
  "Посыпаем дорожки реагентом при гололёде",
  "Работаем в ночное время — тихое оборудование",
];

export default function SnowRemovalPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow="Сезонная услуга"
        h1="Уборка снега"
        highlight="до того как это стало проблемой"
        subtitle="Снег падает ночью. Мы расчищаем подъезд, дорожки и кровлю до того, как вы проснётесь. Работаем круглосуточно в зимний сезон."
        accentColor={ACCENT}
        badge="Сезон: ноябрь — март"
        stats={[
          { value: "24/7", label: "в период снегопадов" },
          { value: "3 часа", label: "среднее время реакции" },
          { value: "любая техника", label: "лопаты и снегоуборщики" },
        ]}
      />

      {/* ── SECTION 2: ПРОБЛЕМА ──────────────────────────────────────── */}
      <section className="section-padding bg-[#EEF2FF]">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Зима без подготовки
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Утро после снегопада — без нас
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEM_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`reveal reveal-delay-${i + 1} bg-white rounded-2xl shadow-sm border border-gray-100 p-8`}
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-raleway font-bold text-base text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ЗОНЫ УБОРКИ ───────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Зоны работ
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Зоны уборки
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {ZONES.map((zone, i) => (
              <div
                key={zone.title}
                className={`reveal reveal-delay-${i + 1} bg-surface-secondary rounded-2xl p-6 text-center flex flex-col items-center`}
              >
                <div className="text-3xl mb-3">{zone.icon}</div>
                <h3 className="font-raleway font-bold text-sm text-gray-900 mb-2 leading-snug">
                  {zone.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{zone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: РЕЖИМ РАБОТЫ ──────────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-5 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Логика работы
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Работаем по снегопадам, не по расписанию
            </h2>
          </div>

          <p className="text-center text-gray-500 text-base max-w-xl mx-auto mb-12 reveal">
            Мы отслеживаем прогноз погоды. Как только синоптики обещают снег —
            планируем выезды заранее. Утром вы уже видите расчищенный участок.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {SCENARIOS.map((s, i) => (
              <div
                key={s.title}
                className={`reveal reveal-delay-${i + 1} bg-white rounded-2xl shadow-sm border border-gray-100 p-7`}
              >
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-xl mb-4 font-raleway font-black text-sm text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </div>
                <h3 className="font-raleway font-bold text-base text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center reveal">
            <p
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white"
              style={{ backgroundColor: ACCENT }}
            >
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Аварийный вызов 24/7 — если нужно срочно и вне плана
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: ТЕХНИКА И ПОДХОД ──────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Оборудование
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Техника и подход
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT — описание */}
            <div className="reveal reveal-delay-1 bg-surface-secondary rounded-2xl p-8">
              <p className="text-gray-700 text-base leading-relaxed">
                Используем ручные лопаты для бережной работы у строений,
                снегоуборщики для больших площадей, ледорубы для наледи. Для
                кровли — специальные безопасные инструменты без риска повреждения
                покрытия.
              </p>
            </div>

            {/* RIGHT — чеклист */}
            <div className="reveal reveal-delay-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ul className="space-y-4">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ACCENT + "1A" }}
                    >
                      <svg
                        className="h-3 w-3"
                        style={{ color: ACCENT }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: ПОДПИСКА VS РАЗОВО ────────────────────────────── */}
      <section className="section-padding bg-[#0F1A16]">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Варианты работы
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-white">
              Сезонный контракт или разовый вызов
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* LEFT — разовый */}
            <div className="reveal reveal-delay-1 rounded-2xl border border-white/15 bg-white/[0.04] p-8">
              <h3 className="font-raleway font-bold text-lg text-white mb-6">
                Разовый вызов
              </h3>
              <ul className="space-y-3 mb-0">
                {[
                  "Звоните когда нужно",
                  "Приедем при наличии бригады",
                  "Стоимость выше",
                  "Нет гарантии быстрого приезда",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-white/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT — сезонный (рекомендован) */}
            <div
              className="reveal reveal-delay-2 rounded-2xl p-8 relative overflow-hidden"
              style={{ border: `2px solid ${ACCENT}`, backgroundColor: ACCENT + "12" }}
            >
              <div
                className="absolute top-4 right-4 text-xs font-semibold text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: ACCENT }}
              >
                Рекомендуем
              </div>
              <h3 className="font-raleway font-bold text-lg text-white mb-6">
                Сезонный контракт
              </h3>
              <ul className="space-y-3">
                {[
                  "Вы в приоритете у бригады",
                  "Мониторим погоду за вас",
                  "Фиксированная цена на сезон",
                  "Гарантированный выезд в течение 3 часов",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <svg
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: ACCENT }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="mt-8 block text-center font-semibold px-8 py-4 rounded-xl text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: ACCENT }}
              >
                Заключить контракт
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALLOUT BANNER ───────────────────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container-custom text-center">
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Domas обслуживает частные дома в Московской области в радиусе 80 км от МКАД
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <ServiceFaq items={FAQ_ITEMS} accentColor={ACCENT} />

      {/* ── RELATED SERVICES ─────────────────────────────────────────── */}
      <RelatedServices currentId="snow_removal" />
    </>
  );
}
