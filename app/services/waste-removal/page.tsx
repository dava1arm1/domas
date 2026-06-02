import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SERVICE_PAGE_DATA } from "@/constants/service-pages";

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

export default function WasteRemovalPage() {
  return <ServicePageLayout data={SERVICE_PAGE_DATA.waste_removal} />;
}
