"use client";

import { useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { Button3D } from "@/components/ui/Button3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import type { Story } from "@/data/site";
import { HOME_ACCENT, IMG } from "@/lib/assets";

/**
 * Stories from the Paras — Figma 49:2023.
 * A five-up coverflow: the centre card is large with a pink border and a
 * FEATURED STORY badge, flanked by 220px and 180px cards at reduced opacity.
 */
const SLOT_STYLES = [
  { width: 180, height: 260, radius: 12, opacity: 0.5, scrim: 0.4, pad: 16, name: 16, para: 12 },
  { width: 220, height: 300, radius: 16, opacity: 0.8, scrim: 0.3, pad: 20, name: 18, para: 13 },
  { width: 280, height: 360, radius: 20, opacity: 1, scrim: 0.25, pad: 24, name: 22, para: 14 },
  { width: 220, height: 300, radius: 16, opacity: 0.8, scrim: 0.3, pad: 20, name: 18, para: 13 },
  { width: 180, height: 260, radius: 12, opacity: 0.5, scrim: 0.4, pad: 16, name: 16, para: 12 },
];

export function StoriesFromParas({ stories }: { stories: Story[] }) {
  const [active, setActive] = useState(0);
  const featured = stories[active];

  // Rotate the deck so the active story always sits in the centre slot.
  const ordered = SLOT_STYLES.map((slot, index) => ({
    slot,
    story: stories[(active + index - 2 + stories.length) % stories.length],
    isCentre: index === 2,
  }));

  const step = (direction: -1 | 1) =>
    setActive((current) => (current + direction + stories.length) % stories.length);

  return (
    <div className="relative w-full">
      {/* Saxophone 164:22 ends at y=2526 while this section stops at 2473, so
          Figma has it overhanging the yellow by 53px. Bottom-anchored and
          outside the clip so the overhang is exact at any section height. */}
      <Asset
        src={HOME_ACCENT.saxophone}
        className="pointer-events-none hidden lg:block absolute bottom-[-53px] left-[calc(50%+203px)] z-10 h-[244px] w-[185px] object-contain"
      />
    <section id="stories" className="relative w-full overflow-hidden bg-cream-alt">
      {/* Figma 49:2023 — flowers 178:231, statue 178:224, saxophone 164:22
          (page-level). No accent sits bottom-right in the current design. */}
      <Asset
        src={IMG.accentBirds}
        className="pointer-events-none hidden lg:block absolute top-[41px] left-[calc(50%+234px)] h-[77px] w-[154px] object-contain opacity-70"
      />
      <Asset
        src={HOME_ACCENT.flowers}
        className="pointer-events-none hidden lg:block absolute top-[57px] right-[-68px] h-[219px] w-[232px] object-contain"
      />
      <Asset
        src={HOME_ACCENT.statue}
        className="pointer-events-none hidden lg:block absolute bottom-0 left-[-13px] h-[262px] w-[128px] object-contain object-bottom"
      />
      {/* Auto rickshaw in the section's top-left corner, as the Figma places
          it — just inside the cream, under the green band above. */}
      <Asset
        src={IMG.accentAutoRickshaw}
        className="pointer-events-none hidden lg:block absolute top-[18px] left-[30px] z-10 h-[104px] w-[150px] scale-x-[-1] object-contain opacity-90"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-12 pb-12 md:px-10 lg:px-20 lg:pt-[56px] lg:pb-[64px]">
        <SectionHeading
          eyebrow="Chronicles of Kolkata"
          eyebrowClassName="text-cyan"
          title="Stories from the Paras"
          blurb="Real people. Real memories. Authentic life snippets that breathe soul into the historic streets."
        />

        <div className="relative mt-5 flex w-full items-center justify-center gap-3 sm:gap-6">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => step(-1)}
            className="icon-btn absolute left-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-pink bg-white text-pink shadow-[0_4px_10px_rgba(27,42,74,0.18)] sm:static sm:size-12 sm:shadow-none"
          >
            <ArrowLeft />
          </button>

          <div className="flex items-center justify-center gap-4">
            {ordered.map(({ slot, story, isCentre }, index) => (
              <button
                key={`${story.name}-${index}`}
                type="button"
                onClick={() => setActive(stories.indexOf(story))}
                style={{
                  width: slot.width,
                  height: slot.height,
                  borderRadius: slot.radius,
                  opacity: slot.opacity,
                }}
                className={`relative flex shrink flex-col justify-between overflow-hidden text-left lg:shrink-0 ${
                  isCentre ? "" : "hidden xl:flex"
                } ${
                  isCentre
                    ? "border-4 border-pink shadow-[0_16px_32px_0_rgba(27,42,74,0.25)]"
                    : ""
                }`}
              >
                <Asset src={story.image} alt={story.name} className="absolute inset-0 size-full object-cover" />
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(27,42,74,${slot.scrim})` }}
                />
                <span className="relative flex h-full w-full flex-col justify-between" style={{ padding: slot.pad }}>
                  <span className="block h-[10px]" />
                  <span className="flex flex-col gap-1">
                    <span
                      className="font-display font-black text-white"
                      style={{ fontSize: slot.name }}
                    >
                      {story.name}
                    </span>
                    <span className="font-ui font-bold text-pink" style={{ fontSize: slot.para }}>
                      {story.para}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next story"
            onClick={() => step(1)}
            className="icon-btn absolute right-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-pink bg-white text-pink shadow-[0_4px_10px_rgba(27,42,74,0.18)] sm:static sm:size-12 sm:shadow-none"
          >
            <ArrowRight />
          </button>
        </div>

        <blockquote className="mx-auto mt-5 flex w-full max-w-[680px] flex-col items-center gap-3 text-center">
          <p className="font-ui text-[16px] leading-[26px] text-slate">{featured.quote}</p>
          <footer className="font-display text-[16px] font-bold text-red">{featured.attribution}</footer>
        </blockquote>

        <div className="mt-5 flex items-center justify-center gap-2">
          {stories.map((_, index) => (
            <span
              key={index}
              className={`size-2 rounded-full ${index === active ? "bg-pink" : "bg-navy/15"}`}
            />
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <Button3D href="/submit" className="w-full px-0 sm:w-[320px]">
            Show us your hidden gem
          </Button3D>
        </div>
      </div>
    </section>
    </div>
  );
}
