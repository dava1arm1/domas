import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SERVICE_PAGE_DATA } from "@/constants/service-pages";

export const metadata: Metadata = {
  title: "Клининг загородного дома | Домас",
  description:
    "Регулярная и генеральная уборка загородного дома. Профессиональная команда со своей химией и оборудованием.",
  openGraph: {
    title: "Клининг загородного дома | Домас",
    description:
      "Регулярная и генеральная уборка загородного дома. Профессиональная команда.",
    images: [{ url: "/og/cleaning.jpg" }],
  },
};

export default function CleaningPage() {
  return <ServicePageLayout data={SERVICE_PAGE_DATA.cleaning} />;
}
