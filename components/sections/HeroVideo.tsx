"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // autoplay blocked by browser — silent fail
    });
  }, []);

  return (
    <video
      ref={ref}
      src="/video/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      aria-hidden="true"
    />
  );
}
