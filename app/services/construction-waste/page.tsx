import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SERVICE_PAGE_DATA } from "@/constants/service-pages";

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

export default function ConstructionWastePage() {
  return <ServicePageLayout data={SERVICE_PAGE_DATA.construction_waste} />;
}
