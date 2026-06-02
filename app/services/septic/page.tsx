import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { getServicePageData } from "@/lib/service-page-content";

export const dynamic = "force-dynamic";

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

export default async function SepticPage() {
  const data = await getServicePageData("septic_pumping");
  return <ServicePageLayout data={data} />;
}
