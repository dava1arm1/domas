import Link from "next/link";
import { FOOTER_LINKS, CONTACT_INFO } from "@/constants/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacts" className="bg-brand-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Бренд */}
          <div className="md:col-span-1">
            <Link href="/" className="font-raleway font-black text-2xl">
              <span className="text-brand-green-light">Dom</span>
              <span className="text-white">as</span>
            </Link>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              Премиальный сервис по обслуживанию частных домов в Москве и МО
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={CONTACT_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-brand-green-light transition-colors"
                aria-label="Telegram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Услуги */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Сервис
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Компания
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Контакты
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="text-white font-semibold hover:text-brand-green-light transition-colors block"
              >
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-white/70 hover:text-white text-sm transition-colors block"
              >
                {CONTACT_INFO.email}
              </a>
              <p className="text-white/40 text-sm">{CONTACT_INFO.workingHours}</p>
              <p className="text-white/40 text-sm">{CONTACT_INFO.address}</p>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} Domas. Все права защищены.
          </p>
          <p className="text-white/40 text-sm">
            ИП Иванов И.И. · ОГРНИП 0000000000000
          </p>
        </div>
      </div>
    </footer>
  );
}
