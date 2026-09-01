"use client";

import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 760px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function HeroVideo() {
  const [source, setSource] = useState<string>();

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const updateSource = () => {
      setSource(reducedMotion.matches ? undefined : mobile.matches
        ? "/hero/nashd-hero-mobile.mp4"
        : "/hero/nashd-hero-desktop.mp4");
    };

    updateSource();
    mobile.addEventListener("change", updateSource);
    reducedMotion.addEventListener("change", updateSource);
    return () => {
      mobile.removeEventListener("change", updateSource);
      reducedMotion.removeEventListener("change", updateSource);
    };
  }, []);

  if (!source) return null;

  return (
    <video
      key={source}
      className="hero-video"
      src={source}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/hero.jpg"
      aria-hidden="true"
    />
  );
}
