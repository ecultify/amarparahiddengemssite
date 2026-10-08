"use client";

import { useEffect, useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";

const SLIDE_MS = 4000;

/** Hero collage — the posters cross-fade one at a time, holding while hovered. */
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % IMG.heroSlides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[680px] lg:aspect-auto lg:h-full lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {IMG.heroSlides.map((slide, i) => (
        <Asset
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i !== index || undefined}
          className={`absolute inset-0 size-full object-contain transition-opacity duration-700 lg:object-right-bottom ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
