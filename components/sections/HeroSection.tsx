interface HeroSectionProps {
  videoEnabled?: boolean;
}

export function HeroSection({ videoEnabled = true }: HeroSectionProps) {
  return (
    <section style={{ position: "relative", minHeight: "100vh", background: "#0F1A16" }}>
      {videoEnabled && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src="/video/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </section>
  );
}
