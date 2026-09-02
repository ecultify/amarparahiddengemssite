"use client";

import { useRef, useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { GemCard } from "@/components/home/GemCard";
import type { Gem } from "@/data/site";
import { HOME_ACCENT, IMG } from "@/lib/assets";

const CARD_STRIDE = 304; // 280px card + 24px gap

/** Explore the Gems of Kolkata — Figma 49:1946 + 49:1950. */
export function ExploreGems({ gems }: { gems: Gem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, gems.length - 3);

  const scrollBy = (direction: -1 | 1) => {
    const next = Math.min(Math.max(page + direction, 0), pages - 1);
    setPage(next);
    trackRef.current?.scrollTo({ left: next * CARD_STRIDE, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <section id="explore" className="relative w-full overflow-hidden bg-green">
        <Asset
          src={IMG.accentKites}
          className="pointer-events-none absolute top-[10px] left-[-56px] h-[110px] w-[96px] lg:top-[19px] lg:left-[-46px] lg:h-[199px] lg:w-[174px] object-contain opacity-90"
        />

        {/* Yellow bleed tab on the right edge — Figma 178:29 (x=1286, y=908,
            162x72). Sits 107px below the green edge and runs 8px past the
            1440 canvas, so overflow-hidden clips it to the 154px Figma renders. */}
        <div
          aria-hidden
          className="pointer-events-none hidden lg:block absolute top-[107px] right-[-8px] h-[72px] w-[162px] bg-[rgba(246,217,0,0.75)]"
        />

        {/* Busker silhouette straddling that tab — Figma 164:28 (x=1270,
            y=880, 102x132). Page-level in Figma, so it overhangs the tab by
            28px above and 32px below. Renders after it to sit on top. */}
        <Asset
          src={HOME_ACCENT.busker}
          className="pointer-events-none hidden lg:block absolute top-[79px] right-[68px] h-[132px] w-[102px] object-contain"
        />

        <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-10 md:px-10 lg:px-20 lg:pt-10 lg:pb-12">
        <SectionHeading
          eyebrow="Community Submissions"
          eyebrowClassName="text-yellow"
          title="Explore the Gems of Kolkata"
          titleClassName="text-white"
          blurb="Submissions may come in these categories: Food & Mishti, Heritage & History, Culture & Craft, Green & Hidden Corners."
          blurbClassName="text-white"
        />

        {/* Arrows flank the cards on both sides, matching every other rail. */}
        <div className="relative mt-6">
          <button
            type="button"
            aria-label="Previous gems"
            onClick={() => scrollBy(-1)}
            className="icon-btn absolute top-1/2 left-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-[0_4px_10px_rgba(27,42,74,0.2)]"
            disabled={page === 0}
          >
            <ChevronLeft />
          </button>
          <div ref={trackRef} className="no-scrollbar flex gap-6 overflow-x-auto lg:mx-16">
            {gems.map((gem) => (
              <GemCard key={gem.title} gem={gem} />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next gems"
            onClick={() => scrollBy(1)}
            className="icon-btn absolute top-1/2 right-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-[0_4px_10px_rgba(27,42,74,0.2)]"
            disabled={page >= pages - 1}
          >
            <ChevronRight />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={`size-2 rounded-full ${index === page ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
