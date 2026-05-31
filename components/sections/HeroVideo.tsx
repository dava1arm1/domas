"use client";

export function HeroVideo() {
  return (
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
  );
}
