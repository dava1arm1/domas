import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SERVICE_PAGE_DATA } from "@/constants/service-pages";

export const metadata: Metadata = {
  title: "Уход за участком в Подмосковье | Домас",
  description:
    "Стрижка газона, обрезка кустарников, уборка листьев по подписке. Профессиональная команда по расписанию с мая по октябрь.",
  openGraph: {
    title: "Уход за участком в Подмосковье | Домас",
    description:
      "Стрижка газона, обрезка кустарников, уборка листьев по подписке. Профессиональная команда по расписанию.",
    images: [{ url: "/og/lawn-care.jpg" }],
  },
};

export default function LawnCarePage() {
  return <ServicePageLayout data={SERVICE_PAGE_DATA.lawn_care} />;
}
