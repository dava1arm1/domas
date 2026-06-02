import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { getServicePageData } from "@/lib/service-page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вывоз мусора в Подмосковье по подписке | Домас",
  description:
    "Регулярный вывоз ТКО с частного дома по расписанию. Без контейнеров, без звонков, без хлопот. Работаем в радиусе 80 км от МКАД.",
  openGraph: {
    title: "Вывоз мусора в Подмосковье по подписке | Домас",
    description:
      "Регулярный вывоз ТКО с частного дома по расписанию. Без контейнеров, без звонков, без хлопот.",
    images: [{ url: "/og/waste-removal.jpg" }],
  },
};

export default async function WasteRemovalPage() {
  const data = await getServicePageData("waste_removal");
  return <ServicePageLayout data={data} />;
}
