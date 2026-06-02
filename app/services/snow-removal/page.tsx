import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { getServicePageData } from "@/lib/service-page-content";

export const dynamic = "force-dynamic";

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

export default async function SnowRemovalPage() {
  const data = await getServicePageData("snow_removal");
  return <ServicePageLayout data={data} />;
}
