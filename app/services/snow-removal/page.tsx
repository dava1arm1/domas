import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SERVICE_PAGE_DATA } from "@/constants/service-pages";

export const metadata: Metadata = {
  title: "Уборка снега в Подмосковье | Домас",
  description:
    "Уборка снега с участка, дорожек и кровли по подписке. Приедем рано утром до вашего выхода из дома.",
  openGraph: {
    title: "Уборка снега в Подмосковье | Домас",
    description:
      "Уборка снега с участка, дорожек и кровли по подписке.",
    images: [{ url: "/og/snow-removal.jpg" }],
  },
};

export default function SnowRemovalPage() {
  return <ServicePageLayout data={SERVICE_PAGE_DATA.snow_removal} />;
}
