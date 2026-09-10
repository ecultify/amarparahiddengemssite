"use client";

import { useEffect, useRef, useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { Button3D } from "@/components/ui/Button3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import type { Story } from "@/data/site";
import { HOME_ACCENT, IMG } from "@/lib/assets";

/**
 * Stories from the Paras — Figma 49:2023.
 * A three-up coverflow: the centre card is large with a pink border and plays
 * that story's clip, flanked by two smaller stills at reduced opacity.
 */
const SLOT_STYLES = [
  { width: 220, height: 300, radius: 16, opacity: 0.85, scrim: 0.22, pad: 12, name: 16, para: 12 },
  { width: 280, height: 360, radius: 20, opacity: 1, scrim: 0.14, pad: 14, name: 20, para: 13 },
  { width: 220, height: 300, radius: 16, opacity: 0.85, scrim: 0.22, pad: 12, name: 16, para: 12 },
];
const CENTRE = 1;

function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function StoriesFromParas({ stories }: { stories: Story[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  /** The visitor asked for sound. Only the button sets this — nothing else. */
  const [watching, setWatching] = useState(false);
  const [inView, setInView] = useState(false);
  const featured = stories[active];
  const clip = useRef<HTMLVideoElement>(null);
  const deck = useRef<HTMLDivElement>(null);

  // The clip only runs while the cards are actually on screen.
  useEffect(() => {
    const element = deck.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.8] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Scrolling away gives the sound back up, so it never plays off screen.
  useEffect(() => {
    if (!inView) setWatching(false);
  }, [inView]);

  // Play and mute follow the two things that decide them: whether the section
  // is on screen, and whether the visitor asked to hear it. Unmuted playback
  // can still be refused, in which case it carries on silently.
  useEffect(() => {
    const video = clip.current;
    if (!video) return;
    if (!inView) {
      video.pause();
      return;
    }
    video.muted = !watching;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [inView, watching, active]);

  // Each clip starts from the top when its card reaches the centre.
  useEffect(() => {
    if (clip.current) clip.current.currentTime = 0;
  }, [active]);

  // The deck holds still while someone is listening to a story, or hovering,
  // or while the section is off screen.
  useEffect(() => {
    if (hovered || watching || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((current) => (current - 1 + stories.length) % stories.length);
    }, 9000);
    return () => clearInterval(id);
  }, [hovered, watching, inView, active, stories.length]);

  // Rotate the deck so the active story always sits in the centre slot.
  const ordered = SLOT_STYLES.map((slot, index) => ({
    slot,
    story: stories[(active + index - CENTRE + stories.length) % stories.length],
    isCentre: index === CENTRE,
  }));

  const step = (direction: -1 | 1) =>
    setActive((current) => (current + direction + stories.length) % stories.length);

  return (
    <div className="relative w-full">
      {/* Saxophone 164:22 ends at y=2526 while this section stops at 2473, so
          Figma has it overhanging the yellow by 53px. Bottom-anchored and
          outside the clip so the overhang is exact at any section height. */}
      <Asset
          data-reveal
        src={HOME_ACCENT.saxophone}
        className="pointer-events-none hidden lg:block absolute bottom-[-53px] left-[calc(50%+203px)] z-10 h-[244px] w-[185px] object-contain"
      />
    <section id="stories" className="relative w-full overflow-hidden bg-cream-alt">
      {/* Figma 49:2023 — flowers 178:231, statue 178:224, saxophone 164:22
          (page-level). No accent sits bottom-right in the current design. */}
      <Asset
          data-reveal
        src={IMG.accentBirds}
        className="pointer-events-none hidden lg:block absolute top-[41px] left-[calc(50%+234px)] h-[77px] w-[154px] object-contain opacity-70"
      />
      <Asset
          data-reveal
        src={HOME_ACCENT.flowers}
        className="pointer-events-none hidden lg:block absolute top-[57px] right-[-68px] h-[219px] w-[232px] object-contain"
      />
      <Asset
          data-reveal
        src={HOME_ACCENT.statue}
        className="pointer-events-none hidden lg:block absolute bottom-0 left-[-13px] h-[262px] w-[128px] object-contain object-bottom"
      />
      {/* Auto rickshaw in the section's top-left corner, as the Figma places
          it — just inside the cream, under the green band above. */}
      <Asset
          data-reveal
        src={IMG.accentAutoRickshaw}
        className="pointer-events-none hidden lg:block absolute top-[18px] left-[30px] z-10 h-[104px] w-[150px] scale-x-[-1] object-contain opacity-90"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-12 pb-12 md:px-10 lg:px-20 lg:pt-[56px] lg:pb-[64px]">
        <SectionHeading
          eyebrow="Chronicles of Kolkata"
          eyebrowClassName="text-cyan"
          title="Stories from the Paras"
          blurb="Real people. Real memories. Authentic life snippets that breathe soul into the historic streets."
          blurbWidth={860}
        />

        <div
          data-reveal="1"
          className="relative mt-5 flex w-full items-center justify-center gap-3 sm:gap-6"
          ref={deck}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => step(-1)}
            className="icon-btn flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-pink bg-white text-pink sm:size-12"
          >
            <ArrowLeft />
          </button>

          <div className="flex min-w-0 items-center justify-center gap-4">
            {ordered.map(({ slot, story, isCentre }, index) => (
              <div
                key={`${story.name}-${index}`}
                className={`relative shrink lg:shrink-0 ${isCentre ? "" : "hidden md:block"}`}
                style={{ width: slot.width, height: slot.height }}
              >
              <button
                type="button"
                onClick={() => setActive(stories.indexOf(story))}
                style={{
                  width: slot.width,
                  height: slot.height,
                  borderRadius: slot.radius,
                  opacity: slot.opacity,
                }}
                className={`relative flex flex-col justify-between overflow-hidden text-left ${
                  isCentre
                    ? "border-4 border-pink shadow-[0_16px_32px_0_rgba(27,42,74,0.25)]"
                    : ""
                }`}
              >
                {isCentre && story.video ? (
                  <video
                    ref={clip}
                    key={story.video}
                    src={story.video}
                    poster={story.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <Asset src={story.image} alt={story.name} className="absolute inset-0 size-full object-cover" />
                )}
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(27,42,74,${slot.scrim})` }}
                />
                {/* The clip keeps moving under the caption, so the caption
                    carries its own ground rather than relying on the wash. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/85 to-transparent" />
                <span className="relative flex h-full w-full flex-col justify-between" style={{ padding: slot.pad }}>
                  <span className="block h-[10px]" />
                  <span className="flex w-full flex-col gap-0.5 rounded-[10px] bg-navy/70 px-3 py-2 backdrop-blur-[3px]">
                    <span
                      className="font-display font-black leading-tight text-white"
                      style={{ fontSize: slot.name }}
                    >
                      {story.name}
                    </span>
                    <span
                      className="font-ui font-bold leading-tight text-yellow"
                      style={{ fontSize: slot.para }}
                    >
                      {story.para}
                    </span>
                  </span>
                </span>
              </button>
              {isCentre && story.video ? (
                <button
                  type="button"
                  aria-label={watching ? "Mute this story" : "Listen to this story"}
                  aria-pressed={watching}
                  title={watching ? "Mute — the stories start moving again" : "Listen — the stories hold still"}
                  onClick={() => setWatching((on) => !on)}
                  className="icon-btn absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-navy/60 text-white backdrop-blur-sm"
                >
                  {watching ? <SpeakerOn /> : <SpeakerOff />}
                </button>
              ) : null}
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next story"
            onClick={() => step(1)}
            className="icon-btn flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-pink bg-white text-pink sm:size-12"
          >
            <ArrowRight />
          </button>
        </div>

        <blockquote data-reveal="2" className="mx-auto mt-5 flex w-full max-w-[680px] flex-col items-center gap-3 text-center">
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

        <div data-reveal="3" className="mt-5 flex justify-center">
          <Button3D href="/submit" className="w-full px-0 sm:w-[320px]">
            Submit a hidden gem
          </Button3D>
        </div>
      </div>
    </section>
    </div>
  );
}
