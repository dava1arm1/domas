import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import { ServiceFaq } from "@/components/sections/service/ServiceFaq";
import { RelatedServices } from "@/components/sections/service/RelatedServices";

export const metadata: Metadata = {
  title: "Уход за участком и стрижка газона в Подмосковье | Domas",
  description:
    "Стрижка газона, обрезка кустарников, уборка листьев — комплексный уход за участком весь сезон. Работаем по расписанию, без контроля с вашей стороны. 80 км от МКАД.",
  openGraph: {
    title: "Уход за участком | Domas",
    description: "Комплексный уход за вашим участком весь сезон.",
    url: "https://domas-mo.ru/services/lawn-care",
  },
};

const ACCENT = "#059669";

const FAQ_ITEMS = [
  {
    q: "Когда начинается и заканчивается сезон?",
    a: "Активный сезон — апрель по ноябрь. Первая стрижка — когда трава достигает 10 см, обычно в апреле. Последняя — до первых заморозков.",
  },
  {
    q: "Что если я хочу сам косить иногда?",
    a: "Просто предупредите нас. Мы скорректируем расписание. Гибкий режим — часть нашего сервиса.",
  },
  {
    q: "Нужна ли у меня газонокосилка?",
    a: "Нет. Мы приезжаем со своим оборудованием — газонокосилка, триммер, воздуходувка.",
  },
  {
    q: "Вывозите ли скошенную траву и листья?",
    a: "Траву обычно оставляем в мульчированном виде — полезно для газона. Листья осенью собираем и вывозим или укладываем в компост по желанию.",
  },
  {
    q: "Работаете ли на больших участках?",
    a: "Да. Стоимость зависит от площади. Уточните размер участка при первом контакте.",
  },
];

const SEASONS = [
  {
    name: "Весна",
    period: "Апрель–Май",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "text-emerald-700",
    items: [
      "Первая стрижка после зимы",
      "Граблевание и аэрация газона",
      "Обрезка кустарников после зимовки",
      "Уборка прошлогодней листвы",
    ],
  },
  {
    name: "Лето",
    period: "Июнь–Август",
    bg: "bg-lime-50",
    border: "border-lime-200",
    dot: "bg-lime-500",
    label: "text-lime-700",
    items: [
      "Регулярная стрижка газона (раз в 10–14 дней)",
      "Обрезка и формирование кустарников",
      "Удаление сорняков",
      "Полив по необходимости",
    ],
  },
  {
    name: "Осень",
    period: "Сентябрь–Октябрь",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-400",
    label: "text-orange-700",
    items: [
      "Подготовка газона к зиме",
      "Уборка листьев",
      "Обрезка деревьев и кустарников",
      "Последняя стрижка сезона",
    ],
  },
  {
    name: "Зима",
    period: "Ноябрь–Март",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: "text-slate-600",
    items: [
      "Сезон завершён — отдыхайте",
      "Мы готовим план работ на следующий год",
      "Снегоуборка — по отдельной услуге",
    ],
  },
];

const WORK_ITEMS = [
  {
    icon: "🌿",
    title: "Стрижка газона",
    desc: "Равномерная стрижка на нужную высоту. Края формируем триммером.",
  },
  {
    icon: "✂️",
    title: "Обрезка кустарников",
    desc: "Санитарная и декоративная обрезка. Формируем по желанию.",
  },
  {
    icon: "🍂",
    title: "Уборка листьев",
    desc: "Собираем в мешки и вывозим на место с согласия хозяина или вывозим по заявке.",
  },
  {
    icon: "💧",
    title: "Полив",
    desc: "По необходимости вручную или через систему автополива.",
  },
  {
    icon: "🌱",
    title: "Удаление сорняков",
    desc: "Прополка грядок, дорожек и приствольных кругов.",
  },
  {
    icon: "🌳",
    title: "Обрезка деревьев",
    desc: "Санитарная обрезка. Высотные работы с привлечением специалиста.",
  },
];

const PROBLEMS = [
  "Газон вырастает выше 15 см — нельзя косить обычной техникой",
  "Стрижка редкого газона — стресс для травы, желтеет",
  "Нерегулярная обрезка — кустарники теряют форму за один сезон",
  "Листья зимуют под снегом — гниль и плесень",
];

const BENEFITS = [
  "Высота газона 5–8 см — идеально для среза",
  "Трава здорова, ровного цвета",
  "Кустарники держат форму весь сезон",
  "Осенью убираем всю листву до первого снега",
];

const STEPS = [
  {
    num: "01",
    title: "Доступ на участок",
    desc: "Достаточно калитки с кодовым замком или спрятанного ключа.",
  },
  {
    num: "02",
    title: "Уведомление о визите",
    desc: "Присылаем за 1 час до приезда.",
  },
  {
    num: "03",
    title: "Отчёт после работ",
    desc: "Фото результата в личном кабинете.",
  },
];

export default function LawnCarePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow="Услуга Domas"
        h1="Уход за участком"
        highlight="весь сезон"
        subtitle="Стрижка газона, обрезка кустарников, уборка листьев — без напоминаний с вашей стороны. Вы приезжаете и видите ухоженный участок."
        accentColor={ACCENT}
        stats={[
          { value: "Апрель–Ноябрь", label: "активный сезон" },
          { value: "раз в 10–14 дней", label: "стрижка газона" },
          { value: "5 лет", label: "опыт в уходе за участками" },
        ]}
      />

      {/* ── SECTION 2: СЕЗОННЫЙ ПЛАН ─────────────────────────────────── */}
      <section className="section-padding bg-[#f0fdf4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Сезонный план
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Что делаем в каждый сезон
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SEASONS.map((season, i) => (
              <div
                key={season.name}
                className={`-delay-${i + 1} rounded-2xl border p-7 ${season.bg} ${season.border}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`h-3 w-3 rounded-full flex-shrink-0 ${season.dot}`} />
                  <div>
                    <span className={`font-raleway font-black text-lg ${season.label}`}>
                      {season.name}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">{season.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {season.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <svg
                        className="h-4 w-4 flex-shrink-0 mt-0.5"
                        style={{ color: ACCENT }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ПОЛНЫЙ СПИСОК РАБОТ ───────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Состав услуги
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Полный список работ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORK_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className={`-delay-${(i % 3) + 1} bg-white rounded-2xl shadow-sm border border-gray-100 p-7`}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-raleway font-bold text-base text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ПОЧЕМУ РЕГУЛЯРНОСТЬ ВАЖНА ────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Регулярность
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Почему нельзя косить раз в месяц
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT — Без системы */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-red-100 flex-shrink-0">
                  <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <h3 className="font-raleway font-bold text-base text-gray-900">Без системы</h3>
              </div>
              <ul className="space-y-3">
                {PROBLEMS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT — С Domas */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center h-7 w-7 rounded-full flex-shrink-0" style={{ backgroundColor: "#059669" + "1A" }}>
                  <svg className="h-3.5 w-3.5" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="font-raleway font-bold text-base text-gray-900">С Domas</h3>
              </div>
              <ul className="space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-gray-700">
                    <span
                      className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: КАК РАБОТАЕМ БЕЗ ПРИСУТСТВИЯ ─────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* LEFT — текст */}
            <div className="">
              <span
                className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: ACCENT }}
              >
                Без вашего присутствия
              </span>
              <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900 mb-5">
                Как мы работаем без вашего присутствия
              </h2>
              <p className="text-gray-500 text-base leading-relaxed">
                Большинство наших клиентов не присутствуют при работах — они
                уведомляются по SMS и видят результат при следующем визите.
              </p>
            </div>

            {/* RIGHT — шаги */}
            <div className="space-y-5">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="flex items-start gap-5 bg-surface-secondary rounded-2xl p-6"
                >
                  <div
                    className="flex items-center justify-center h-11 w-11 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: ACCENT + "1A" }}
                  >
                    <span
                      className="font-raleway font-black text-sm"
                      style={{ color: ACCENT }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-raleway font-bold text-sm text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
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
      <RelatedServices currentId="lawn_care" />
    </>
  );
}
