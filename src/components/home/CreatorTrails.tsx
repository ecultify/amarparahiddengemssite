"use client";

import { useRef, useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { HOME_ACCENT, IMG } from "@/lib/assets";

/** One card stride: 240px image + 16px gap. */
const STRIDE = 256;

/** Creator Trails — Figma 49:2139. Five-up 240x380 mosaic. */
export function CreatorTrails({ trails }: { trails: { image: string; caption: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const scroll = (direction: -1 | 1) => {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * STRIDE, behavior: "smooth" });
    setPage((current) =>
      Math.min(Math.max(current + direction, 0), Math.max(trails.length - 1, 0)),
    );
  };

  return (
    <div className="relative w-full">
      {/* Figma 49:2141 puts the kite at y=-30, i.e. riding up into the yellow
          Articles section, so it has to live outside this section's clip. */}
      <Asset
        src={IMG.accentKiteCreator}
        className="pointer-events-none hidden lg:block absolute top-[-30px] right-[-15px] z-10 h-[183px] w-[163px] object-contain opacity-85"
      />
    <section id="creator-trails" className="relative w-full overflow-hidden bg-cream pt-10 pb-16 lg:pt-[44px] lg:pb-[100px]">
      {/* Figma 49:2139 — caddie 178:287, kite 49:2141, golfer 178:33 and its
          flag 178:31 (page-level in Figma, anchored to this section's floor). */}
      <Asset
        src={HOME_ACCENT.caddie}
        className="pointer-events-none hidden lg:block absolute top-[110px] left-[calc(50%-651px)] h-[136px] w-[89px] object-contain"
      />
      <Asset
        src={HOME_ACCENT.flag}
        className="pointer-events-none hidden lg:block absolute bottom-0 left-[calc(50%+457px)] h-[56px] w-[25px] object-contain"
      />
      <Asset
        src={HOME_ACCENT.golfer}
        className="pointer-events-none hidden lg:block absolute bottom-0 left-[calc(50%+604px)] h-[125px] w-[63px] object-contain"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-20">
        <SectionHeading
          eyebrow="Creator Discoveries"
          eyebrowClassName="text-pink"
          title="Fresh Finds From the Paras"
          blurb="See creators uncover lesser-known places, people and local favourites from across Kolkata."
        />

        {/* Arrows flank the rail on both sides, as on every other carousel. */}
        <div className="relative mt-10 lg:mt-14">
          <button
            type="button"
            aria-label="Previous trails"
            onClick={() => scroll(-1)}
            className="icon-btn absolute top-1/2 left-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pink bg-white text-pink shadow-[0_4px_10px_rgba(27,42,74,0.18)]"
          >
            <ChevronLeft />
          </button>

          <div ref={track} className="no-scrollbar flex h-[380px] gap-4 overflow-x-auto lg:mx-16">
            {trails.map((trail, index) => (
              <Asset
                key={index}
                src={trail.image}
                alt={trail.caption}
                className="h-[380px] w-[240px] shrink-0 rounded-[16px] object-cover"
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next trails"
            onClick={() => scroll(1)}
            className="icon-btn absolute top-1/2 right-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pink bg-white text-pink shadow-[0_4px_10px_rgba(27,42,74,0.18)]"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 lg:mt-14">
          {trails.map((_, index) => (
            <span
              key={index}
              className={`size-2 rounded-full ${index === page ? "bg-pink" : "bg-navy/15"}`}
            />
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
