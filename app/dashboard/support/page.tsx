import { CONTACT_INFO } from "@/constants/navigation";

export const metadata = { title: "Поддержка" };

const items = [
  {
    href: `mailto:${CONTACT_INFO.email}`,
    label: "Написать менеджеру",
    sub: `${CONTACT_INFO.email} · ответ в течение часа`,
    external: false,
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    href: `tel:${CONTACT_INFO.phone}`,
    label: "Позвонить",
    sub: `${CONTACT_INFO.phone} · ${CONTACT_INFO.workingHours}`,
    external: false,
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  },
  {
    href: CONTACT_INFO.telegram,
    label: "Telegram-бот",
    sub: "Ответ за 10 минут · @domas_support",
    external: true,
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
];

export default function SupportPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-raleway font-black text-2xl text-gray-900 mb-2">Поддержка</h1>
        <p className="text-gray-400 text-sm mb-8">Выберите удобный способ связи — мы всегда на связи</p>

        <div className="space-y-3">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-5 p-6 bg-white rounded-2xl border border-gray-100 hover:border-brand-green hover:shadow-sm transition-all duration-200"
            >
              <div className="h-12 w-12 rounded-2xl bg-brand-green-pale flex items-center justify-center flex-shrink-0 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-200">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.label}</p>
                <p className="text-gray-400 text-sm mt-0.5">{item.sub}</p>
              </div>
              <svg className="h-5 w-5 text-gray-300 group-hover:text-brand-green ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
