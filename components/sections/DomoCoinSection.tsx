import Link from "next/link";
import { DomoCoinIcon } from "@/components/ui/DomoCoinIcon";

const BENEFITS = [
  {
    title: "Копите с каждого заказа",
    description: "5% от суммы любого заказа возвращается вам в ДомоКоинах — автоматически, без заявок.",
    icon: (
      <svg className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Тратьте как рубли",
    description: "1 ДомоКоин = 1 рубль скидки. Оплачивайте монетами до 30% от стоимости следующего заказа.",
    icon: (
      <svg className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: "Бонусы за активность",
    description: "500 монет за первый заказ, 100 за отзыв, 1 000 за приглашённого друга. Каждое действие в плюс.",
    icon: (
      <svg className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
];

export function DomoCoinSection() {
  return (
    <section className="section-padding bg-brand-dark">
      <div className="container-custom">

        {/* Заголовок */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-brand-green-light font-semibold text-sm uppercase tracking-wider mb-4">
            <DomoCoinIcon size={16} />
            Программа лояльности
          </span>
          <h2 className="font-raleway font-black text-3xl md:text-4xl text-white mb-4">
            ДомоКоин — награда<br className="hidden sm:block" /> за каждый заказ
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Копите монеты и тратьте их как рубли на любые услуги Domas
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto text-center">
          <div>
            <p className="font-raleway font-black text-3xl text-white">5%</p>
            <p className="text-white/40 text-sm mt-1">от суммы заказа</p>
          </div>
          <div>
            <p className="font-raleway font-black text-3xl text-white">1 = 1₽</p>
            <p className="text-white/40 text-sm mt-1">монета = рубль</p>
          </div>
          <div>
            <p className="font-raleway font-black text-3xl text-white">12 мес</p>
            <p className="text-white/40 text-sm mt-1">срок действия</p>
          </div>
        </div>

        {/* Три колонки преимуществ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.08] transition-colors"
            >
              <div className="h-11 w-11 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                {b.icon}
              </div>
              <h3 className="font-raleway font-bold text-white text-base mb-2">{b.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-block bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-green/25 active:scale-95"
          >
            Начать копить монеты
          </Link>
          <Link
            href="/dashboard/coins"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Уже зарегистрированы? Ваши монеты ждут →
          </Link>
        </div>

      </div>
    </section>
  );
}
