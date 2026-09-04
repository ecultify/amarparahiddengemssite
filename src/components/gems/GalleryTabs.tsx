"use client";

import { useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { MapPin } from "@/components/ui/icons";
import { categoryTone, quoteTone } from "@/lib/tokens";
import type { GalleryGem, QuoteCard } from "@/data/site";

const TABS = ["Written Tales", "Photo Gems", "Video Stories"] as const;
type Tab = (typeof TABS)[number];

const PAGE = 3;

function GemMeta({ gem }: { gem: GalleryGem }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between p-5">
      <div className="flex flex-col items-start gap-1.5">
        <span
          className={`inline-flex rounded-[6px] px-[10px] py-[4px] font-ui text-[11px] font-bold uppercase ${categoryTone(gem.category)}`}
        >
          {gem.category}
        </span>
        <h3 className="font-body text-[18px] leading-tight font-bold text-navy">
          {gem.title}
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 shrink-0 text-pink" />
          <span className="font-ui text-[13px] font-semibold text-slate">
            {gem.location}
          </span>
        </div>
        <span className="font-ui text-[13px] font-semibold text-grey">
          Submitted by: {gem.submittedBy}
        </span>
      </div>
    </div>
  );
}

function PhotoCard({ gem, index }: { gem: GalleryGem; index: number }) {
  return (
    <article data-reveal={String(index % 3)} className="flex h-[320px] w-full max-w-[304px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-cream shadow-[0_8px_16px_0_rgba(27,42,74,0.07)]">
      <Asset
        src={gem.image}
        alt={gem.title}
        className="h-[180px] w-full shrink-0 object-cover"
      />
      <GemMeta gem={gem} />
    </article>
  );
}

function VideoCard({ gem, index }: { gem: GalleryGem; index: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article data-reveal={String(index % 2)} className="flex h-[360px] w-full max-w-[628px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-cream shadow-[0_8px_16px_0_rgba(27,42,74,0.07)]">
      <div className="relative flex h-[180px] w-full items-center justify-center bg-navy">
        {playing && gem.video ? (
          <video
            src={gem.video}
            poster={gem.image}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 size-full bg-navy object-contain"
          />
        ) : (
          <>
            <Asset
              src={gem.image}
              alt={gem.title}
              className="absolute inset-0 size-full object-cover"
            />
            <button
              type="button"
              aria-label={
                gem.video
                  ? `Play ${gem.title}`
                  : `${gem.title} — video coming soon`
              }
              onClick={() => setPlaying(true)}
              disabled={!gem.video}
              className="btn-3d relative flex size-12 items-center justify-center rounded-full bg-yellow text-navy disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </>
        )}
      </div>
      <GemMeta gem={gem} />
    </article>
  );
}

/** Tabbed gallery — Written Tales / Photo Gems / Video Stories, each with its own "load more". */
type Props = {
  photoGems: GalleryGem[];
  videoGems: GalleryGem[];
  streetStories: QuoteCard[];
};

export function GalleryTabs({ photoGems, videoGems, streetStories }: Props) {
  const [tab, setTab] = useState<Tab>("Written Tales");
  const [shown, setShown] = useState<Record<Tab, number>>({
    "Written Tales": PAGE,
    "Photo Gems": PAGE,
    "Video Stories": PAGE,
  });

  const total = {
    "Written Tales": streetStories.length,
    "Photo Gems": photoGems.length,
    "Video Stories": videoGems.length,
  }[tab];
  const limit = shown[tab];

  return (
    <div className="flex w-full max-w-[1280px] flex-col items-center gap-8">
      <div
        data-reveal
        role="tablist"
        className="flex w-full max-w-full flex-wrap justify-center gap-1.5 rounded-[12px] border border-line bg-white p-1.5 sm:w-auto sm:gap-3"
      >
        {TABS.map((name) => (
          <button
            key={name}
            role="tab"
            type="button"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`flex-1 rounded-[8px] px-4 py-2.5 font-display text-[14px] font-extrabold uppercase tracking-[0.04em] transition sm:flex-none sm:px-7 sm:text-[15px] ${
              tab === name ? "bg-navy text-white" : "text-slate hover:text-navy"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {tab === "Written Tales" && (
        <div className="flex w-full flex-wrap justify-center gap-6 sm:justify-start">
          {streetStories.slice(0, limit).map((story, index) => (
            <article
              key={story.title}
              data-reveal={String(index % 3)}
              className={`flex w-full max-w-[304px] shrink-0 flex-col justify-between gap-8 rounded-[8px] border p-6 shadow-[0_8px_8px_rgba(27,42,74,0.07)] sm:h-[360px] sm:gap-0 ${quoteTone(index).card}`}
            >
              <div className="flex flex-col gap-3">
                <span
                  className={`font-display text-[48px] leading-[20px] font-black ${quoteTone(index).mark}`}
                >
                  &ldquo;
                </span>
                <p className="font-display text-[16px] leading-[1.5] font-semibold text-navy">
                  {story.quote}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-body text-[16px] font-bold text-navy">
                  {story.title}
                </h3>
                <p className="font-ui text-[13px] font-semibold text-grey">
                  {story.meta}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "Photo Gems" && (
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-[repeat(auto-fit,304px)] sm:justify-items-start">
          {photoGems.slice(0, limit).map((gem, index) => (
            <PhotoCard key={gem.title} gem={gem} index={index} />
          ))}
        </div>
      )}

      {tab === "Video Stories" && (
        <div className="flex w-full flex-wrap justify-center gap-6 sm:justify-start">
          {videoGems.slice(0, limit).map((gem, index) => (
            <VideoCard key={gem.title} gem={gem} index={index} />
          ))}
        </div>
      )}

      {limit < total && (
        <button
          type="button"
          onClick={() => setShown({ ...shown, [tab]: limit + PAGE })}
          className="btn-3d inline-flex h-14 items-center justify-center rounded-[8px] bg-yellow px-8 font-display text-[16px] font-extrabold uppercase text-navy"
        >
          Load more gems
        </button>
      )}
    </div>
  );
}
