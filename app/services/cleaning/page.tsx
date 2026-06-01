import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import { ServiceFaq } from "@/components/sections/service/ServiceFaq";
import { RelatedServices } from "@/components/sections/service/RelatedServices";

export const metadata: Metadata = {
  title: "Клининг загородного дома в Подмосковье | Domas",
  description:
    "Генеральная и поддерживающая уборка загородного дома. Профессиональное оборудование, экологичная химия. Работаем по чек-листу. 80 км от МКАД.",
  openGraph: {
    title: "Клининг | Domas",
    description: "Дом чистый без вашего участия.",
    url: "https://domas-mo.ru/services/cleaning",
  },
};

const ACCENT = "#DC2626";

const FAQ_ITEMS = [
  {
    q: "Нужно ли мне присутствовать?",
    a: "Нет. Большинство клиентов уезжают на время уборки. Мы получаем доступ по согласованной схеме и закрываем дом по окончании.",
  },
  {
    q: "Берёте ли вы свою химию и оборудование?",
    a: "Да, всё своё. Вам не нужно ничего покупать или готовить.",
  },
  {
    q: "Убираете ли окна снаружи?",
    a: "Изнутри — в стандарте генеральной уборки. Снаружи — по отдельному запросу, зависит от этажности и доступа.",
  },
  {
    q: "Как часто нужна генеральная уборка?",
    a: "1–2 раза в год: весна (после зимы) и осень (до закрытия дачи). Для постоянно используемого дома — по необходимости.",
  },
  {
    q: "Что если уборщики что-то повредят?",
    a: "Работаем аккуратно и несём ответственность за ущерб по договорённости. Ничего хрупкого не трогаем без отдельной просьбы.",
  },
];

const ROOMS = [
  {
    name: "Кухня",
    items: [
      "Мытьё всех поверхностей и фасадов",
      "Чистка варочной панели и духовки",
      "Холодильник снаружи и внутри (по запросу)",
      "Мытьё раковины и смесителей до блеска",
      "Вытяжка снаружи и жировой фильтр",
    ],
  },
  {
    name: "Санузлы",
    items: [
      "Дезинфекция унитаза, ванны, душевой",
      "Мытьё плитки и затирки",
      "Зеркала без разводов",
      "Полки, полотенцесушитель, розетки",
      "Пол — мытьё с дезинфицирующим средством",
    ],
  },
  {
    name: "Жилые комнаты",
    items: [
      "Пылесосим мягкую мебель и ковры",
      "Протираем все горизонтальные поверхности",
      "Плинтусы, подоконники, батареи",
      "Мытьё полов с подходящим средством",
      "Окна изнутри (по запросу)",
    ],
  },
];

const CHEMISTRY_ITEMS = [
  "Экологичные средства без хлора",
  "Безопасны при наличии детей и животных",
  "Не оставляют химического запаха",
  "Эффективны против бактерий и плесени",
];

const EQUIPMENT_ITEMS = [
  "Промышленные пылесосы с HEPA-фильтром",
  "Пароочиститель для труднодоступных мест",
  "Микрофибровые тряпки (не оставляют ворса)",
  "Профессиональный инструмент для окон",
];

const PREP_STEPS = [
  {
    num: "01",
    title: "Уберите ценные вещи",
    desc: "Документы, украшения лучше убрать или указать нам что не трогать.",
  },
  {
    num: "02",
    title: "Обеспечьте доступ",
    desc: "Горячая и холодная вода, розетки для оборудования.",
  },
  {
    num: "03",
    title: "Сообщите об особенностях",
    desc: "Аллергии, материалы полов и мебели, домашние животные.",
  },
];

const QUALITY_ITEMS = [
  {
    title: "Чек-лист",
    desc: "Работаем по 80-пунктному списку. Каждый пункт отмечается по факту выполнения.",
  },
  {
    title: "Фотоотчёт",
    desc: "После уборки делаем фото контрольных точек. Вы видите результат ещё до возвращения домой.",
  },
  {
    title: "Обратная связь",
    desc: "Если что-то не понравилось — скажите нам. Вернёмся и переделаем бесплатно.",
  },
];

export default function CleaningPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow="Услуга Domas"
        h1="Клининг загородного дома"
        highlight="по чек-листу"
        subtitle="Генеральная уборка после зимы или ремонта, поддерживающая уборка по расписанию. Профессиональное оборудование и экологичная химия."
        accentColor={ACCENT}
        stats={[
          { value: "Чек-лист 80 пунктов", label: "стандарт качества" },
          { value: "экологичная химия", label: "безопасно для детей и животных" },
          { value: "от 3 часов", label: "генеральная уборка" },
        ]}
      />

      {/* ── SECTION 2: ДВА ВИДА УБОРКИ ──────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Виды уборки
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Генеральная или поддерживающая — что вам нужно?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT — генеральная */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 text-white"
                style={{ backgroundColor: ACCENT }}
              >
                Генеральная уборка
              </div>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Когда нужна</span>
                  <span className="text-gray-500">После зимы, после ремонта, при заезде в новый дом</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Что делаем</span>
                  <span className="text-gray-500">
                    Полный цикл от потолка до пола, мытьё окон, духовки, холодильника, труднодоступных мест
                  </span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Время</span>
                  <span className="text-gray-500">4–8 часов в зависимости от площади</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Рекомендованная частота</span>
                  <span className="text-gray-500">1–2 раза в год</span>
                </li>
              </ul>
            </div>

            {/* RIGHT — поддерживающая */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: ACCENT + "15", color: ACCENT }}
              >
                Поддерживающая уборка
              </div>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Когда нужна</span>
                  <span className="text-gray-500">Регулярное поддержание чистоты</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Что делаем</span>
                  <span className="text-gray-500">
                    Пылесос, мытьё полов, санузлы, кухонные поверхности, вынос мусора
                  </span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Время</span>
                  <span className="text-gray-500">2–3 часа</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-900">Рекомендованная частота</span>
                  <span className="text-gray-500">1–2 раза в месяц или еженедельно</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ЧЕК-ЛИСТ ПО КОМНАТАМ ────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-4">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Стандарт уборки
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Что входит в генеральную уборку
            </h2>
          </div>
          <p className="text-center text-gray-500 text-base max-w-lg mx-auto mb-12">
            Мы работаем по стандартизированному чек-листу. Ничего не забыто.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROOMS.map((room, i) => (
              <div
                key={room.name}
                className={`-delay-${i + 1} bg-surface-secondary rounded-2xl p-7`}
              >
                <h3
                  className="font-raleway font-bold text-base mb-5"
                  style={{ color: ACCENT }}
                >
                  {room.name}
                </h3>
                <ul className="space-y-2.5">
                  {room.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ХИМИЯ И ОБОРУДОВАНИЕ ─────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Стандарты работы
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Профессиональные средства и оборудование
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT — Химия */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="font-raleway font-bold text-base text-gray-900 mb-5">Химия</h3>
              <ul className="space-y-3">
                {CHEMISTRY_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ACCENT + "15" }}
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

            {/* RIGHT — Оборудование */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="font-raleway font-bold text-base text-gray-900 mb-5">Оборудование</h3>
              <ul className="space-y-3">
                {EQUIPMENT_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ACCENT + "15" }}
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

      {/* ── SECTION 5: КАК ПОДГОТОВИТЬСЯ ────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Подготовка
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Нам нужно совсем немного
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {PREP_STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`-delay-${i + 1} flex flex-col bg-surface-secondary rounded-2xl p-7`}
              >
                <div
                  className="flex items-center justify-center h-11 w-11 rounded-xl mb-5 font-raleway font-black text-sm text-white flex-shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  {step.num}
                </div>
                <h3 className="font-raleway font-bold text-base text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-600 font-medium">
              <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Большинство клиентов уезжают во время уборки. Мы сами закроем дом по окончании работ.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: КОНТРОЛЬ КАЧЕСТВА ─────────────────────────────── */}
      <section className="section-padding bg-[#0F1A16]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Контроль
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-white">
              Как мы контролируем качество
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUALITY_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className={`-delay-${i + 1} bg-white/[0.04] border border-white/10 rounded-2xl p-8`}
              >
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-xl mb-5 font-raleway font-black text-sm text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </div>
                <h3 className="font-raleway font-bold text-base text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: ACCENT }}
            >
              Заказать уборку
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
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
      <RelatedServices currentId="cleaning" />
    </>
  );
}
