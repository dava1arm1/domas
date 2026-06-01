import Link from "next/link";
import { SERVICES } from "@/constants/services";
import { SERVICE_ICONS } from "@/constants/icons";

const SERVICE_SLUGS: Record<string, string> = {
  waste_removal: "/services/waste-removal",
  construction_waste: "/services/construction-waste",
  lawn_care: "/services/lawn-care",
  septic_pumping: "/services/septic",
  snow_removal: "/services/snow-removal",
  cleaning: "/services/cleaning",
};

interface RelatedServicesProps {
  currentId: string;
  title?: string;
}

export function RelatedServices({
  currentId,
  title = "Другие услуги Domas",
}: RelatedServicesProps) {
  const related = SERVICES.filter((s) => s.id !== currentId).slice(0, 3);

  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Единый сервис для дома
          </span>
          <h2 className="font-raleway font-black text-2xl md:text-3xl text-white">{title}</h2>
          <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
            Domas — это не отдельные услуги. Это единая система обслуживания вашего дома.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {related.map((service) => {
            const href = SERVICE_SLUGS[service.id] ?? "/#services";
            return (
              <Link
                key={service.id}
                href={href}
                className="group block bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-xl text-2xl mb-4"
                  style={{ backgroundColor: service.bgColor + "20" }}
                >
                  {SERVICE_ICONS[service.id] ?? service.icon}
                </div>
                <h3 className="font-raleway font-bold text-white text-base mb-2 leading-snug group-hover:text-brand-green-light transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-3">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green">
                  Подробнее
                  <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors"
          >
            Посмотреть все услуги →
          </Link>
        </div>
      </div>
    </section>
  );
}
