import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { getServicePageData } from "@/lib/service-page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вывоз строительного мусора в Подмосковье | Домас",
  description:
    "Вывоз строительных отходов после ремонта: битый кирпич, доски, плитка, ветки. Любой объём, выезд в день заявки.",
  openGraph: {
    title: "Вывоз строительного мусора в Подмосковье | Домас",
    description:
      "Вывоз строительных отходов после ремонта. Любой объём, выезд в день заявки.",
    images: [{ url: "/og/construction-waste.jpg" }],
  },
};

export default async function ConstructionWastePage() {
  const data = await getServicePageData("construction_waste");
  return <ServicePageLayout data={data} />;
}
