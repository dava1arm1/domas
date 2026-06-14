import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description: "Политика хранения и обработки персональных данных сервиса Domas",
  robots: { index: false, follow: false },
};

export default function PersonalDataPage() {
  return (
    <>
      <Header />
      <main className="bg-brand-dark min-h-screen">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/"
              className="text-brand-green-light text-sm hover:underline mb-8 inline-block"
            >
              ← На главную
            </Link>

            <h1 className="font-raleway font-black text-4xl text-white mb-2">
              Политика обработки персональных данных
            </h1>
            <p className="text-white/40 text-sm mb-12">
              Последнее обновление: июнь 2025 г.
            </p>

            <div className="space-y-10 text-white/80 leading-relaxed">

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">1. Оператор персональных данных</h2>
                <p>
                  Оператором персональных данных является Domas (далее — «Оператор»),
                  осуществляющий деятельность по адресу: Москва и Московская область.
                </p>
                <p className="mt-3">
                  Контактные данные Оператора по вопросам обработки персональных данных:<br />
                  Email:{" "}
                  <a href="mailto:hello@domas.ru" className="text-brand-green-light hover:underline">
                    hello@domas.ru
                  </a><br />
                  Телефон:{" "}
                  <a href="tel:+74950000000" className="text-brand-green-light hover:underline">
                    +7 (495) 000-00-00
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">2. Правовые основания обработки</h2>
                <p>Обработка персональных данных осуществляется на основании:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li>Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
                  <li>Согласия субъекта персональных данных</li>
                  <li>Договора, стороной которого является субъект персональных данных</li>
                  <li>Законных интересов Оператора в части обеспечения деятельности сервиса</li>
                </ul>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">3. Состав обрабатываемых данных</h2>
                <p>Оператор обрабатывает следующие категории персональных данных:</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-white font-medium mb-1">Идентификационные данные:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
                      <li>Фамилия, имя, отчество</li>
                      <li>Номер телефона</li>
                      <li>Адрес электронной почты</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Данные об объекте обслуживания:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
                      <li>Адрес объекта</li>
                      <li>Описание выполненных и запрашиваемых работ</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Технические данные:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
                      <li>IP-адрес устройства</li>
                      <li>Тип и версия браузера</li>
                      <li>Дата и время посещений страниц Сайта</li>
                      <li>Файлы cookie сессии</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">4. Цели обработки персональных данных</h2>
                <div className="mt-2 space-y-4">
                  {[
                    {
                      goal: "Исполнение договора оказания услуг",
                      data: "Имя, телефон, адрес объекта",
                      basis: "Договор с субъектом",
                    },
                    {
                      goal: "Обратная связь и поддержка клиентов",
                      data: "Имя, телефон, email",
                      basis: "Согласие / законный интерес",
                    },
                    {
                      goal: "Уведомления о статусе заявки",
                      data: "Телефон, email",
                      basis: "Договор с субъектом",
                    },
                    {
                      goal: "Ведение личного кабинета",
                      data: "Email, история заказов",
                      basis: "Согласие субъекта",
                    },
                    {
                      goal: "Маркетинговые коммуникации",
                      data: "Email, телефон",
                      basis: "Согласие субъекта",
                    },
                    {
                      goal: "Улучшение работы сервиса",
                      data: "Технические данные, cookie",
                      basis: "Законный интерес",
                    },
                  ].map((row) => (
                    <div key={row.goal} className="border border-white/10 rounded-lg p-4">
                      <p className="text-white font-medium">{row.goal}</p>
                      <p className="text-white/50 text-sm mt-1">Данные: {row.data}</p>
                      <p className="text-white/50 text-sm">Основание: {row.basis}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">5. Порядок и сроки хранения данных</h2>
                <div className="mt-3 space-y-3">
                  {[
                    { category: "Данные учётной записи", period: "До момента удаления аккаунта пользователем, затем 30 дней до окончательного удаления" },
                    { category: "История заказов", period: "5 лет с момента последнего заказа (требования налогового законодательства)" },
                    { category: "Переписка и обращения", period: "3 года с момента последнего обращения" },
                    { category: "Технические логи", period: "До 12 месяцев" },
                    { category: "Данные маркетинговых рассылок", period: "До отзыва согласия" },
                  ].map((row) => (
                    <div key={row.category} className="flex flex-col sm:flex-row sm:gap-6 border-b border-white/10 pb-3">
                      <p className="text-white font-medium sm:w-48 shrink-0">{row.category}</p>
                      <p className="text-white/60 text-sm">{row.period}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-white/50 text-sm">
                  По истечении сроков хранения данные уничтожаются или обезличиваются без возможности восстановления.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">6. Передача данных</h2>
                <p>
                  Персональные данные не передаются третьим лицам без согласия субъекта, за исключением:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li>Технических партнёров, обеспечивающих инфраструктуру Сайта (хостинг, база данных) — только в объёме, необходимом для оказания услуг</li>
                  <li>Случаев, предусмотренных законодательством РФ (по запросу уполномоченных органов)</li>
                </ul>
                <p className="mt-3">
                  Трансграничная передача персональных данных не осуществляется.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">7. Меры защиты данных</h2>
                <p>Для защиты персональных данных Оператор применяет:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li>Шифрование передачи данных по протоколу HTTPS/TLS</li>
                  <li>Ограничение доступа к данным — только уполномоченные сотрудники</li>
                  <li>Хранение паролей в хешированном виде</li>
                  <li>Регулярный аудит прав доступа</li>
                  <li>Использование защищённых облачных сервисов</li>
                </ul>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">8. Права субъекта персональных данных</h2>
                <p>В соответствии с Федеральным законом № 152-ФЗ вы вправе:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li><strong className="text-white/90">Получить информацию</strong> — об объёме и составе хранящихся данных, целях и сроках обработки</li>
                  <li><strong className="text-white/90">Исправить данные</strong> — потребовать уточнения неполных или неточных сведений</li>
                  <li><strong className="text-white/90">Удалить данные</strong> — потребовать прекращения обработки и уничтожения данных</li>
                  <li><strong className="text-white/90">Отозвать согласие</strong> — в любой момент, без объяснения причин</li>
                  <li><strong className="text-white/90">Обжаловать действия Оператора</strong> — в Роскомнадзоре (rkn.gov.ru)</li>
                </ul>
                <p className="mt-4">
                  Для реализации прав направьте запрос на{" "}
                  <a href="mailto:hello@domas.ru" className="text-brand-green-light hover:underline">
                    hello@domas.ru
                  </a>
                  . Срок ответа — не более 30 дней.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">9. Согласие и его отзыв</h2>
                <p>
                  Оставляя заявку или регистрируясь на Сайте, вы даёте согласие на обработку
                  персональных данных в соответствии с настоящей Политикой.
                </p>
                <p className="mt-3">
                  Вы можете отозвать согласие в любое время, направив письмо на{" "}
                  <a href="mailto:hello@domas.ru" className="text-brand-green-light hover:underline">
                    hello@domas.ru
                  </a>
                  {" "}или через настройки личного кабинета. Отзыв согласия не влияет на
                  законность обработки данных, осуществлённой до его отзыва.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">10. Изменения Политики</h2>
                <p>
                  Оператор вправе вносить изменения в настоящую Политику. Актуальная версия
                  публикуется на странице{" "}
                  <span className="text-white">domas-mo.ru/personal-data</span>.
                  При существенных изменениях пользователи уведомляются по электронной почте.
                </p>
              </section>

              <div className="border-t border-white/10 pt-8 text-white/40 text-sm">
                <p>
                  Также ознакомьтесь с{" "}
                  <Link href="/privacy" className="text-brand-green-light hover:underline">
                    Политикой конфиденциальности
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
