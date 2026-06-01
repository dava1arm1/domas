import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero } from "@/components/sections/service/ServiceHero";
import { ServiceFaq } from "@/components/sections/service/ServiceFaq";
import { RelatedServices } from "@/components/sections/service/RelatedServices";

export const metadata: Metadata = {
  title: "Вывоз мусора в Подмосковье по подписке | Domas",
  description:
    "Регулярный вывоз ТКО с частного дома по расписанию. Без контейнеров, без звонков, без хлопот. Работаем в радиусе 80 км от МКАД.",
  openGraph: {
    title: "Вывоз мусора в Подмосковье по подписке | Domas",
    description:
      "Регулярный вывоз ТКО с частного дома по расписанию. Без контейнеров, без звонков, без хлопот. Работаем в радиусе 80 км от МКАД.",
    images: [{ url: "/og/waste-removal.jpg" }],
  },
};

const FAQ_ITEMS = [
  {
    q: "Что именно вывозите?",
    a: "Твёрдые коммунальные отходы: пищевые отходы, упаковка, пластик, бумага, стекло. Строительный мусор, ветки и крупногабаритные предметы вывозятся отдельно.",
  },
  {
    q: "Как часто приезжаете?",
    a: "Стандартно — еженедельно. По запросу настраиваем 2 раза в неделю в активный сезон или раз в 2 недели для редко посещаемых домов.",
  },
  {
    q: "Нужен ли контейнер на участке?",
    a: "Нет. Мы забираем мешки и пакеты. Если хотите — поможем организовать временное место хранения.",
  },
  {
    q: "Что если я нахожусь не дома в день вывоза?",
    a: "Достаточно оставить мусор в условленном месте. Мы приедем и заберём без вашего присутствия. Уведомление придёт по итогу.",
  },
  {
    q: "Можно отменить подписку?",
    a: "Да, в любой момент без штрафов из личного кабинета. Оплаченный период работает до конца.",
  },
];

export default function WasteRemovalPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow="Основная подписка Domas"
        h1="Вывоз мусора — без контейнеров, очередей и звонков"
        subtitle="Мы приезжаем по согласованному расписанию и забираем всё. Вам не нужно ничего контролировать."
        badge="Работаем в 80 км от МКАД"
        stats={[
          { value: "500+", label: "домов обслуживаем" },
          { value: "5 лет", label: "на рынке" },
          { value: "100%", label: "без опозданий" },
        ]}
        accentColor="#1D9E75"
      />

      {/* ── SECTION 2: ПРОБЛЕМА ──────────────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-green mb-3">
              Знакомая картина
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Как выглядит вывоз мусора сейчас
            </h2>
            <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto">
              В большинстве посёлков Подмосковья своей организованной вывозки нет.
              Всё — на плечах жильца.
            </p>
          </div>

          {/* Сценарий — горизонтальная лента */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px border-t-2 border-dashed border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className=" relative flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl mb-4 relative z-10">
                  🛍
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Мусор накапливается</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Пакеты, пищевые отходы, упаковка — за неделю набирается 3–4 мешка
                </p>
              </div>

              <div className=" relative flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl mb-4 relative z-10">
                  🚶
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Идёте или едете</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Общая помойка — в 300–600 метрах. Пешком с мешками или в багажнике машины
                </p>
              </div>

              <div className=" relative flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl mb-4 relative z-10">
                  ♻️
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Контейнеры переполнены</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Мусор стоит рядом с контейнерами, запах, разлетается по округе
                </p>
              </div>

              <div className=" relative flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl mb-4 relative z-10">
                  🔁
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Повторяется каждую неделю</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Это не чрезвычайная ситуация — это просто норма. Которая не должна быть нормой.
                </p>
              </div>
            </div>
          </div>

          {/* Callout */}
          <div className=" mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">С Domas этого не происходит</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Наш сотрудник приезжает к вашему участку по расписанию и забирает мешки прямо от ворот.
                Общие помойки, переполненные контейнеры и поездки с мусором в багажнике — остаются в прошлом.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: КАК РАБОТАЕТ ──────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-green mb-3">
              Процесс
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Как работает регулярный вывоз
            </h2>
          </div>

          <div className="relative">
            {/* Timeline connector — desktop */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gray-100 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  num: "01",
                  title: "Регистрация",
                  desc: "Оформляете подписку и указываете адрес. Занимает 2 минуты.",
                },
                {
                  num: "02",
                  title: "Согласование",
                  desc: "Менеджер связывается в течение 5 минут, обсуждает расписание.",
                },
                {
                  num: "03",
                  title: "Первый визит",
                  desc: "Бригада приезжает в согласованное время и проводит вывоз.",
                },
                {
                  num: "04",
                  title: "Регулярный режим",
                  desc: "С этого момента всё происходит автоматически по расписанию.",
                },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className={`-delay-${i + 1} flex flex-col items-start md:items-center text-left md:text-center`}
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-green/10 mb-5 flex-shrink-0">
                    <span className="font-raleway font-black text-xl text-brand-green">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-raleway font-bold text-base text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Уведомление придёт за час до приезда — вам не нужно ждать у ворот
              весь день
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ЧТО ВХОДИТ ────────────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-green mb-3">
              Состав подписки
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Что входит в подписку
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Included list */}
            <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="font-raleway font-bold text-lg text-gray-900 mb-6">
                В каждый визит
              </h3>
              <ul className="space-y-4">
                {[
                  "Еженедельный вывоз ТКО",
                  "Вывоз пакетов и мешков с мусором",
                  "Приём крупногабаритных предметов (по заявке)",
                  "Уведомления до и после каждого визита",
                  "Личный кабинет с историей визитов",
                  "Скидка 10% на все остальные услуги Domas",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-brand-green/10 flex items-center justify-center">
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
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price callout */}
            <div className=" bg-brand-dark rounded-2xl p-8 text-white">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
                Основная подписка
              </p>
              <div className="mb-1">
                <span className="font-raleway font-black text-4xl md:text-5xl text-white leading-none">
                  от 1 490 ₽
                </span>
                <span className="text-white/40 text-base ml-1">/мес</span>
              </div>
              <p className="text-brand-green-light text-sm mb-8">
                или 14 900 ₽/год — экономия 2 месяца
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Фиксированное расписание",
                  "Без поиска исполнителей",
                  "Отмена в любой момент",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <svg
                      className="h-4 w-4 text-brand-green flex-shrink-0"
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

              <Link
                href="/register"
                className="block text-center bg-brand-green text-white font-semibold px-8 py-4 rounded-xl hover:bg-brand-green/90 transition-colors duration-200 active:scale-95"
              >
                Подключить
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: СРАВНЕНИЕ ─────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-green mb-3">
              Сравнение
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Почему подписка выгоднее разового вывоза
            </h2>
          </div>

          <div className=" bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 font-inter w-1/3">
                    &nbsp;
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 font-inter text-center">
                    Разово
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-green font-inter text-center bg-brand-green/5">
                    Подписка Domas
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Поиск исполнителя",
                    once: "Каждый раз",
                    sub: "Не нужен",
                  },
                  {
                    label: "Стабильность",
                    once: "Нет",
                    sub: "Фиксированное расписание",
                  },
                  {
                    label: "Цена",
                    once: "Выше",
                    sub: "Ниже в пересчёте",
                  },
                  {
                    label: "Контроль",
                    once: "Ваш",
                    sub: "Наш",
                  },
                  {
                    label: "Уведомления",
                    once: "Нет",
                    sub: "За час до приезда",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {row.once}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-brand-green bg-brand-green/5">
                      {row.sub}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: СЦЕНАРИИ ──────────────────────────────────────── */}
      <section className="section-padding bg-surface-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-green mb-3">
              Для кого
            </span>
            <h2 className="font-raleway font-black text-3xl md:text-4xl text-gray-900">
              Кому это подходит
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏡",
                title: "Постоянное проживание",
                desc: "Семья из 3–4 человек производит 2–3 мешка мусора в неделю. Подписка закрывает вопрос вывоза полностью.",
                delay: "",
              },
              {
                icon: "🏖",
                title: "Сезонный дом",
                desc: "Приезжаете на выходные? Настраиваем вывоз на выходные дни. Приедете — чисто.",
                delay: "",
              },
              {
                icon: "🔨",
                title: "После ремонта",
                desc: "Строительный мусор не входит в подписку, но наши клиенты получают скидку 10% на разовый вывоз стройотходов.",
                delay: "",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={` ${card.delay} bg-white rounded-2xl shadow-sm border border-gray-100 p-8`}
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-raleway font-bold text-base text-gray-900 mb-2">
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

      {/* ── CALLOUT BANNER ───────────────────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container-custom text-center">
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Domas обслуживает частные дома в Москве и Московской области в
            радиусе 80 км от МКАД
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <ServiceFaq items={FAQ_ITEMS} accentColor="#1D9E75" />

      {/* ── RELATED SERVICES ─────────────────────────────────────────── */}
      <RelatedServices currentId="waste_removal" />
    </>
  );
}
