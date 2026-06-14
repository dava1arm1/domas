import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности сервиса Domas",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
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
              Политика конфиденциальности
            </h1>
            <p className="text-white/40 text-sm mb-12">
              Последнее обновление: июнь 2025 г.
            </p>

            <div className="prose prose-invert prose-green max-w-none space-y-10 text-white/80 leading-relaxed">

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">1. Общие положения</h2>
                <p>
                  Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки
                  и защиты персональных данных пользователей сайта <strong className="text-white">domas-mo.ru</strong> (далее — «Сайт»),
                  принадлежащего Domas (далее — «Оператор»).
                </p>
                <p className="mt-3">
                  Используя Сайт или оставляя заявку, вы соглашаетесь с условиями настоящей Политики.
                  Если вы не согласны с какими-либо условиями, пожалуйста, прекратите использование Сайта.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">2. Какие данные мы собираем</h2>
                <p>При оформлении заявки или регистрации мы можем запрашивать:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li>Имя и фамилию</li>
                  <li>Номер телефона</li>
                  <li>Адрес электронной почты</li>
                  <li>Адрес объекта обслуживания</li>
                  <li>Сообщения, оставленные через форму обратной связи</li>
                </ul>
                <p className="mt-3">
                  Также автоматически собираются технические данные: IP-адрес, тип браузера, страницы посещения,
                  время и дата визита — в целях улучшения работы Сайта.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">3. Цели обработки данных</h2>
                <p>Мы используем ваши данные исключительно для:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li>Обработки заявок и организации выезда специалистов</li>
                  <li>Связи с вами по вопросам оказания услуг</li>
                  <li>Уведомлений о статусе заказа</li>
                  <li>Улучшения качества сервиса</li>
                  <li>Информирования об акциях и новых услугах (при наличии согласия)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">4. Передача данных третьим лицам</h2>
                <p>
                  Мы не продаём и не передаём ваши персональные данные третьим лицам без вашего согласия,
                  за исключением случаев, предусмотренных законодательством Российской Федерации.
                </p>
                <p className="mt-3">
                  Для обеспечения работы Сайта и личного кабинета используются технические партнёры
                  (хостинг, аналитика), которые обрабатывают данные в соответствии с их собственными
                  политиками конфиденциальности и только в рамках оказания нам технических услуг.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">5. Защита данных</h2>
                <p>
                  Мы принимаем разумные меры для защиты ваших данных от несанкционированного доступа,
                  изменения, раскрытия или уничтожения. Доступ к персональным данным имеют только
                  сотрудники, которым это необходимо для выполнения их рабочих обязанностей.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">6. Хранение данных</h2>
                <p>
                  Персональные данные хранятся не дольше, чем это необходимо для достижения целей их
                  обработки, либо в течение сроков, установленных законодательством РФ.
                  После завершения оказания услуг данные могут храниться в архивных целях в соответствии
                  с требованиями законодательства.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">7. Ваши права</h2>
                <p>Вы имеете право:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 text-white/70">
                  <li>Запросить информацию о хранящихся у нас ваших данных</li>
                  <li>Потребовать исправления неточных данных</li>
                  <li>Потребовать удаления ваших данных</li>
                  <li>Отозвать согласие на обработку персональных данных</li>
                  <li>Отказаться от получения маркетинговых сообщений</li>
                </ul>
                <p className="mt-3">
                  Для реализации ваших прав обратитесь к нам по адресу:{" "}
                  <a href="mailto:hello@domas.ru" className="text-brand-green-light hover:underline">
                    hello@domas.ru
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">8. Файлы cookie</h2>
                <p>
                  Сайт использует файлы cookie для обеспечения авторизации в личном кабинете и корректной
                  работы сервиса. Cookie не содержат личных данных в открытом виде.
                  Вы можете отключить cookie в настройках браузера, однако это может повлиять
                  на функциональность Сайта.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">9. Изменения Политики</h2>
                <p>
                  Мы оставляем за собой право обновлять настоящую Политику. Актуальная версия
                  всегда доступна на этой странице. При существенных изменениях мы уведомим вас
                  по электронной почте или через личный кабинет.
                </p>
              </section>

              <section>
                <h2 className="font-raleway font-bold text-xl text-white mb-3">10. Контакты</h2>
                <p>По вопросам, связанным с обработкой персональных данных, обращайтесь:</p>
                <div className="mt-3 space-y-1 text-white/70">
                  <p>Email: <a href="mailto:hello@domas.ru" className="text-brand-green-light hover:underline">hello@domas.ru</a></p>
                  <p>Телефон: <a href="tel:+74950000000" className="text-brand-green-light hover:underline">+7 (495) 000-00-00</a></p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
