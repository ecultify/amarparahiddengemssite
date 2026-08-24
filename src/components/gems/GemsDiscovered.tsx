"use client";

import { useRef } from "react";
import { Asset } from "@/components/ui/Asset";
import { Button3D } from "@/components/ui/Button3D";
import { IMG, PARTICIPATE_ACCENT } from "@/lib/assets";
import { GemCard } from "@/components/home/GemCard";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import type { Gem } from "@/data/site";

type Theme = "cream" | "cyan";

const THEMES: Record<
  Theme,
  { section: string; title: string; arrow: string; kite: string }
> = {
  // Participate page — Figma 95:124 (golfer 95:125, kite 95:126).
  cream: {
    section: "bg-cream",
    title: "text-black",
    arrow: "border-yellow text-navy",
    kite: "top-[80px]",
  },
  // Submission page — Figma 95:362 (golfer 95:426, kite 95:425).
  cyan: {
    section: "bg-cyan",
    title: "text-white",
    arrow: "border-white text-navy",
    kite: "top-[228px]",
  },
};

const CARD_STRIDE = 304;

/**
 * "Gems Already Discovered" — the community directory block shared by the
 * participate and submit pages. Identical structure, two colourways.
 */
type Props = {
  theme?: Theme;
  gems: Gem[];
  gemCount: { discovered: number; total: number };
};

export function GemsDiscovered({ theme = "cream", gems, gemCount }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tone = THEMES[theme];
  const percent = Math.round((gemCount.discovered / gemCount.total) * 100);

  const scroll = (direction: -1 | 1) =>
    trackRef.current?.scrollBy({ left: direction * CARD_STRIDE, behavior: "smooth" });

  return (
    <div className="relative w-full">
      {/* The playground stands in the cream division below the cyan, so it is
          anchored to the wrapper floor — the division's own bottom edge. */}
      {theme === "cyan" ? (
        <Asset
          src={IMG.gemsPlayground}
          className="pointer-events-none hidden lg:block absolute right-0 bottom-0 z-10 h-[172px] w-[165px] object-contain"
        />
      ) : null}
    <section className={`relative w-full overflow-hidden ${tone.section} pt-[53px] pb-[80px]`}>
      {/* Kite mirrored onto the left wall. The box uses the PNG's own 0.778
          aspect so object-contain adds no letterbox, and the mirror puts the
          artwork's zero-padding edge on the left - together that is what makes
          it sit flush with no gap. */}
      <Asset
        src={IMG.accentKiteCreator}
        className={`pointer-events-none hidden lg:block absolute ${tone.kite} left-0 h-[153px] w-[119px] scale-x-[-1] object-contain opacity-85`}
      />
      {theme === "cyan" ? (
        <>
          {/* Heron 95:x — top right, tucked 5px in from the canvas edge. */}
          <Asset
            src={IMG.gemsHeron}
            className="pointer-events-none hidden lg:block absolute top-[121px] right-0 h-[140px] w-[134px] object-contain"
          />
          {/* Derozio statue standing at the cyan floor, bottom left. */}
          <Asset
            src={PARTICIPATE_ACCENT.statue}
            className="pointer-events-none hidden lg:block absolute bottom-[20px] left-[24px] z-10 h-[260px] w-[107px] object-contain"
          />
          {/* Pale streaks sitting in the gap above the first gem card. */}
          <Asset
            src={IMG.gemsStreaks}
            className="pointer-events-none hidden lg:block absolute top-[209px] left-[calc(50%-466px)] h-[104px] w-[76px] object-contain"
          />
        </>
      ) : null}
      {theme === "cream" ? (
        <>
          {/* Figma 178:166 — kite trailing its string, at (472, 83) 682x403. */}
          <Asset
            src={PARTICIPATE_ACCENT.kiteString}
            className="pointer-events-none hidden lg:block absolute top-[83px] left-[calc(50%-248px)] h-[403px] w-[682px] object-contain"
          />
          {/* Figma 164:68 — pink playground on the section floor, right. */}
          <Asset
            src={PARTICIPATE_ACCENT.playground}
            className="pointer-events-none hidden lg:block absolute right-0 bottom-0 h-[161px] w-[235px] object-contain mix-blend-multiply"
          />
        </>
      ) : null}

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <p className="font-body text-[14px] font-bold uppercase tracking-[0.08em] text-yellow">
              Community Discoveries
            </p>
            <h2 className={`font-title text-[42px] leading-tight font-black sm:text-[50px] lg:text-[58px] ${tone.title}`}>
              Hidden Gems Discovered So Far
            </h2>
          </div>

          <div className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-[16px] border border-white/10 bg-red p-5 sm:p-6">
            <div className="flex w-full items-center justify-between">
              <span className="font-display text-[14px] font-extrabold text-yellow sm:text-[16px]">Mapping progress</span>
              <span className="font-display text-[15px] font-black text-white sm:text-[18px]">
                {gemCount.discovered} / {gemCount.total} GEMS
              </span>
            </div>
            <div className="h-[10px] w-full overflow-hidden rounded-full bg-white/40">
              <div className="h-full rounded-full bg-yellow" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-6 lg:mt-14">
          <button
            type="button"
            aria-label="Previous gems"
            onClick={() => scroll(-1)}
            className={`icon-btn hidden size-12 shrink-0 items-center justify-center rounded-full border-2 bg-white lg:flex ${tone.arrow}`}
          >
            <ChevronLeft className="size-5" />
          </button>

          <div ref={trackRef} className="no-scrollbar flex w-full flex-1 gap-6 overflow-x-auto">
            {gems.map((gem) => (
              <GemCard key={gem.title} gem={gem} titleTone="navy" />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next gems"
            onClick={() => scroll(1)}
            className={`icon-btn hidden size-12 shrink-0 items-center justify-center rounded-full border-2 bg-white lg:flex ${tone.arrow}`}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-10 flex justify-center lg:mt-14">
          <Button3D href="/500-gems">View all gems</Button3D>
        </div>
      </div>
    </section>
      {/* The design breaks the cyan with a cream division before the footer.
          172px is the playground's overhang, and it leaves the footer's
          102px "i am Kolkata" pull-up sitting on cream rather than on cyan. */}
      {theme === "cyan" ? <div className="h-[172px] w-full bg-cream" /> : null}
    </div>
  );
}
