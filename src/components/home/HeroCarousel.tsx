"use client";

import { useEffect, useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";

const SLIDE_MS = 5000;

const CAPTIONS = [
  "From a gigantic tower that fed signals to tree-lined avenues that serve global fare",
  "From the sound of silence in an ancient cemetery to the sound of music playing out at resto bars",
  "From the oldest Jagaddhatri temple in Kolkata to 'Golakata Gali' where robbers slit their victim's throat",
];

/** Hero collage carousel — one panel at a time, auto-advancing, dots below. */
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % IMG.heroSlides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="flex w-full flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-square w-full max-w-[680px]">
        {IMG.heroSlides.map((src, i) => (
          <Asset
            key={src}
            src={src}
            alt={i === index ? CAPTIONS[i] : ""}
            className={`absolute inset-0 size-full object-contain transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
