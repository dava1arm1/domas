import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import { ServiceFaq } from "@/components/sections/service/ServiceFaq";
import { RelatedServices } from "@/components/sections/service/RelatedServices";

export const metadata: Metadata = {
  title: "Откачка септика в Подмосковье — плановая и аварийная | Domas",
  description:
    "Профессиональная откачка септиков любого типа в Московской области. Специализированная техника, без запаха, уборка после работ. Выезд в день обращения.",
  openGraph: {
    title: "Откачка септика в Подмосковье — плановая и аварийная | Domas",
    description:
      "Профессиональная откачка септиков любого типа в Московской области. Специализированная техника, без запаха, уборка после работ. Выезд в день обращения.",
  },
};

const ACCENT = "#0284C7";

const FAQ_ITEMS = [
  {
    q: "Сколько стоит откачка?",
    a: "Стоимость зависит от объёма септика и удалённости от МКАД. Уточните цену по телефону или оставьте заявку — перезвоним в течение 5 минут.",
  },
  {
    q: "Нужно ли присутствовать при откачке?",
    a: "Желательно, чтобы кто-то открыл доступ к септику. Если нет возможности — заранее договоримся как организовать доступ.",
  },
  {
    q: "Куда вывозятся стоки?",
    a: "На лицензированные полигоны и очистные сооружения. По запросу выдаём документ о вывозе.",
  },
  {
    q: "Работаете зимой?",
    a: "Да. Откачиваем септики круглый год. Зимой время работ может быть немного больше из-за промерзания.",
  },
  {
    q: "Что входит в плановое обслуживание?",
    a: "Откачка содержимого, визуальный осмотр люков и горловины, промывка при необходимости. Документ о вывозе — всегда.",
  },
];

export default function SepticPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow="Услуга Domas"
        h1="Откачка септика"
        highlight="без аварий"
        subtitle="Плановое обслуживание обходится в 3–4 раза дешевле аварийного. Мы работаем со всеми типами септиков и приезжаем в день обращения."
        accentColor={ACCENT}
        stats={[
          { value: "24/7", label: "аварийный выезд" },
          { value: "1 день", label: "срок выезда" },
          { value: "100%", label: "без запаха и грязи" },
        ]}
      />

      {/* ── SECTION 2: 5 ПРИЗНАКОВ ───────────────────────────────────── */}
      <section className="section-padding bg-[#F0F9FF]">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-4 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Сигналы
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900 mb-3">
              5 признаков что пора вызвать ассенизатора
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Не ждите когда станет хуже. Эти сигналы говорят о 70–80%
              заполнении септика.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                num: "1",
                icon: "🔔",
                title: "Запах в доме или на участке",
                desc: "Неприятный запах в ванной или из унитаза без видимых причин.",
                delay: "reveal-delay-1",
              },
              {
                num: "2",
                icon: "🐌",
                title: "Медленный слив",
                desc: "Вода уходит медленнее обычного в раковинах и душе.",
                delay: "reveal-delay-2",
              },
              {
                num: "3",
                icon: "💧",
                title: "Лужи на участке",
                desc: "Влажные пятна над септиком даже в сухую погоду.",
                delay: "reveal-delay-3",
              },
              {
                num: "4",
                icon: "📅",
                title: "Прошло больше года",
                desc: "При постоянном проживании семьи из 3–4 человек рекомендованный интервал — 12 месяцев.",
                delay: "reveal-delay-4",
              },
              {
                num: "5",
                icon: "🚨",
                title: "Обратный слив",
                desc: "Самый серьёзный признак. Требует немедленного вызова.",
                delay: "reveal-delay-5",
                urgent: true,
              },
            ].map((item) => (
              <div
                key={item.num}
                className={`reveal ${item.delay} flex items-start gap-5 bg-white rounded-2xl shadow-sm border p-6 ${
                  item.urgent
                    ? "border-red-100 bg-red-50/30"
                    : "border-gray-100"
                }`}
              >
                <div
                  className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: ACCENT + "18" }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold"
                      style={{ color: ACCENT }}
                    >
                      #{item.num}
                    </span>
                    <h3
                      className={`font-raleway font-bold text-base ${
                        item.urgent ? "text-red-700" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: КАК ПРОХОДИТ ──────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-14 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Процесс
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Как мы работаем
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                num: "01",
                title: "Звонок или заявка",
                desc: "Принимаем в любое время. Уточняем тип и объём септика, расположение.",
                delay: "reveal-delay-1",
              },
              {
                num: "02",
                title: "Выезд",
                desc: "Приезжаем в согласованное время с ассенизаторской машиной нужного объёма.",
                delay: "reveal-delay-2",
              },
              {
                num: "03",
                title: "Откачка",
                desc: "Ил, осадок и жидкая фракция полностью откачиваются. Среднее время — 40–60 минут.",
                delay: "reveal-delay-3",
              },
              {
                num: "04",
                title: "Промывка",
                desc: "При необходимости промываем стенки камер напорной струёй.",
                delay: "reveal-delay-4",
              },
              {
                num: "05",
                title: "Уборка и документ",
                desc: "Убираем за собой, выдаём документ о вывозе стоков.",
                delay: "reveal-delay-5",
              },
            ].map((step) => (
              <div
                key={step.num}
                className={`reveal ${step.delay} flex items-start gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6`}
              >
                <div
                  className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: ACCENT + "12" }}
                >
                  <span
                    className="font-raleway font-black text-sm"
                    style={{ color: ACCENT }}
                  >
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-raleway font-bold text-base text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ЧАСТОТА (ТАБЛИЦА) ─────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-4 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Рекомендации
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900 mb-3">
              Как часто нужна откачка
            </h2>
            <p className="text-gray-500 text-base">
              Зависит от объёма септика и числа проживающих
            </p>
          </div>

          <div className="mt-10 reveal reveal-delay-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: ACCENT + "10" }}>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600 font-inter">
                    Объём септика
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600 font-inter text-center">
                    2 человека
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600 font-inter text-center">
                    3–4 человека
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600 font-inter text-center">
                    5+ человек
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    volume: "До 1 500 л",
                    p2: "раз в год",
                    p34: "2 раза в год",
                    p5: "3 раза в год",
                  },
                  {
                    volume: "1 500–3 000 л",
                    p2: "раз в 1.5 года",
                    p34: "раз в год",
                    p5: "2 раза в год",
                    alt: true,
                  },
                  {
                    volume: "Более 3 000 л",
                    p2: "раз в 2 года",
                    p34: "раз в 1.5 года",
                    p5: "раз в год",
                  },
                ].map((row) => (
                  <tr
                    key={row.volume}
                    className={`border-t border-gray-50 ${row.alt ? "bg-gray-50/60" : ""}`}
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {row.volume}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500">
                      {row.p2}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500">
                      {row.p34}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-500">
                      {row.p5}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-gray-400 text-xs reveal reveal-delay-2">
            Данные приблизительные. Итоговый интервал зависит от типа грунта,
            сезона и состава стоков.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: ТИПЫ СЕПТИКОВ ─────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 reveal">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT }}
            >
              Совместимость
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Работаем со всеми типами септиков
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Однокамерный",
                desc: "Классический септик-яма. Самый распространённый тип в Подмосковье.",
                delay: "reveal-delay-1",
              },
              {
                title: "Двухкамерный",
                desc: "Механическая очистка в первой камере, доочистка во второй.",
                delay: "reveal-delay-2",
              },
              {
                title: "Биосептик",
                desc: "ТОП, Тополь, Евролос и аналоги. Работаем аккуратно, не повреждая биосистему.",
                delay: "reveal-delay-3",
              },
              {
                title: "Накопительная ёмкость",
                desc: "Пластиковые кубы, еврокубы. Без откачки не работают.",
                delay: "reveal-delay-4",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`reveal ${card.delay} bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3`}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: ACCENT + "12" }}
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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

      {/* ── SECTION 6: АВАРИЙНЫЙ ВЫЕЗД ───────────────────────────────── */}
      <section className="section-padding bg-brand-dark">
        <div className="container-custom max-w-3xl text-center">
          <div className="reveal">
            <div
              className="inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-6 mx-auto"
              style={{ backgroundColor: ACCENT + "25" }}
            >
              <svg
                className="h-7 w-7"
                style={{ color: ACCENT }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="font-raleway font-black text-3xl md:text-4xl text-white mb-4">
              Аварийная ситуация?
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Если септик переполнен прямо сейчас — звоните. Аварийный выезд
              доступен 24/7, приедем в течение 2–4 часов.
            </p>

            <a
              href="tel:+74950000000"
              className="inline-flex items-center justify-center gap-3 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: ACCENT }}
            >
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Позвонить сейчас
            </a>

            <p className="mt-5 text-white/30 text-xs">
              Аварийный вызов стоит дороже планового. Подписка на обслуживание
              позволяет избежать аварий.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <ServiceFaq items={FAQ_ITEMS} accentColor={ACCENT} />

      {/* ── RELATED SERVICES ─────────────────────────────────────────── */}
      <RelatedServices currentId="septic_pumping" />
    </>
  );
}
