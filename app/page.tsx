// Главная страница — собирает все секции
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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Ticker />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <ReviewsSection />
        <DashboardPreviewSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
