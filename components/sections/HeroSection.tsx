import { HeroVideo } from "./HeroVideo";

interface HeroSectionProps {
  heading?:      string;
  subtitle?:     string;
  badge?:        string;
  ctaPrimary?:   string;
  ctaSecondary?: string;
  videoEnabled?: boolean;
}

export function HeroSection({ videoEnabled = true }: HeroSectionProps) {
  return (
    <section style={{ position: "relative", minHeight: "100vh", background: "red" }}>
      {videoEnabled && <HeroVideo />}
    </section>
  );
}
