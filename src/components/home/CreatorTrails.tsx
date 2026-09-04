"use client";

import { Asset } from "@/components/ui/Asset";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { useAutoRail } from "@/hooks/use-auto-rail";
import { HOME_ACCENT, IMG } from "@/lib/assets";
import type { Trail } from "@/lib/content";

/** Instagram's own embed endpoint for a reel or post URL. Returns null for
 *  anything that isn't a recognisable permalink, so a typo falls back to the
 *  card's image rather than rendering a broken frame. */
function reelEmbed(url: string | undefined) {
  const code = url?.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/)?.[1];
  return code ? `https://www.instagram.com/reel/${code}/embed/` : null;
}

/** The embed is rendered at its natural width and scaled into the card, so
 *  the mosaic keeps the exact 240x380 tiles the section is built around. */
const EMBED_W = 320;
const EMBED_H = 507;
const SCALE = 240 / EMBED_W;

/** Creator Trails — Figma 49:2139. Five-up 240x380 mosaic. */
export function CreatorTrails({ trails }: { trails: Trail[] }) {
  const { ref: trackRef, index: active, pages, step, pause } = useAutoRail(1);

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
          title={
            <>
              Fresh Finds From
              <br className="sm:hidden" /> the Paras
            </>
          }
          blurb="See creators uncover lesser-known places, people and local favourites from across Kolkata."
        />

        {/* Arrows flank the rail on both sides, as on every other carousel.
            Below sm the track pads out so one card sits centred with its
            neighbours peeking in; the 240px tile is fixed by the embed scale. */}
        <div data-reveal="1" className="relative mt-10 lg:mt-14" {...pause}>
          <button
            type="button"
            aria-label="Previous trails"
            onClick={() => step(-1)}
            className="icon-btn absolute top-1/2 left-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pink bg-white text-pink shadow-[0_4px_10px_rgba(27,42,74,0.18)]"
          >
            <ChevronLeft />
          </button>

          <div
            ref={trackRef}
            className="no-scrollbar flex h-[380px] snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-120px)] sm:px-0 lg:mx-16"
          >
            {trails.map((trail, index) => {
              const embed = reelEmbed(trail.reel);
              if (!embed) {
                return (
                  <Asset
                    key={index}
                    src={trail.image}
                    alt={trail.caption}
                    className="h-[380px] w-[240px] shrink-0 snap-center rounded-[16px] object-cover sm:snap-start"
                  />
                );
              }
              return (
                <div
                  key={index}
                  className="h-[380px] w-[240px] shrink-0 snap-center overflow-hidden rounded-[16px] bg-navy/5 sm:snap-start"
                >
                  <iframe
                    src={embed}
                    title={trail.caption}
                    loading="lazy"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="origin-top-left border-0"
                    style={{
                      width: EMBED_W,
                      height: EMBED_H,
                      transform: `scale(${SCALE})`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next trails"
            onClick={() => step(1)}
            className="icon-btn absolute top-1/2 right-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pink bg-white text-pink shadow-[0_4px_10px_rgba(27,42,74,0.18)]"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 lg:mt-14">
          {Array.from({ length: pages }).map((_, index) => (
            <span
              key={index}
              className={`size-2 rounded-full ${index === active ? "bg-pink" : "bg-navy/15"}`}
            />
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
