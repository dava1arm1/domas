import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SERVICE_PAGE_DATA } from "@/constants/service-pages";

export const metadata: Metadata = {
  title: "Откачка септика в Подмосковье | Домас",
  description:
    "Плановая и аварийная откачка септиков любого типа. Выезд в день обращения, работа без следов, документы о вывозе.",
  openGraph: {
    title: "Откачка септика в Подмосковье | Домас",
    description:
      "Плановая и аварийная откачка септиков любого типа. Выезд в день обращения.",
    images: [{ url: "/og/septic.jpg" }],
  },
};

export default function SepticPage() {
  return <ServicePageLayout data={SERVICE_PAGE_DATA.septic_pumping} />;
}
