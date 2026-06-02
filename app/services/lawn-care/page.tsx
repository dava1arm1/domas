import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { getServicePageData } from "@/lib/service-page-content";

export const dynamic = "force-dynamic";

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

export default async function LawnCarePage() {
  const data = await getServicePageData("lawn_care");
  return <ServicePageLayout data={data} />;
}
