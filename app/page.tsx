// Главная страница — читает CMS-контент из Settings таблицы
export const dynamic = "force-dynamic"; // всегда рендерится на сервере, не кешируется
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { Ticker } from "@/components/sections/Ticker";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { DashboardPreviewSection } from "@/components/sections/DashboardPreviewSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DomoCoinSection } from "@/components/sections/DomoCoinSection";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const settings = await getSettings([
    "hero.heading",
    "hero.subtitle",
    "hero.badge",
    "hero.cta_primary",
    "hero.cta_secondary",
    "hero.video_enabled",
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection
          heading={settings["hero.heading"]}
          subtitle={settings["hero.subtitle"]}
          badge={settings["hero.badge"]}
          ctaPrimary={settings["hero.cta_primary"]}
          ctaSecondary={settings["hero.cta_secondary"]}
          videoEnabled={settings["hero.video_enabled"] !== "false"}
        />
        <Ticker />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <DomoCoinSection />
        <ReviewsSection />
        <DashboardPreviewSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
