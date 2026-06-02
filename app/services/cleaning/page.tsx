import type { Metadata } from "next";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { getServicePageData } from "@/lib/service-page-content";

export const dynamic = "force-dynamic";

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

export default async function CleaningPage() {
  const data = await getServicePageData("cleaning");
  return <ServicePageLayout data={data} />;
}
