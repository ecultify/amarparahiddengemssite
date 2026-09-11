"use client";

import { useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { MapPin } from "@/components/ui/icons";
import { categoryTone, quoteTone } from "@/lib/tokens";
import type { Gem, Tale } from "@/data/site";

const TABS = ["Written Tales", "Photo & Video Stories"] as const;
type Tab = (typeof TABS)[number];

// Four cards to a row; the written tales run to three figures, so a
// click loads two rows rather than one.
const PAGE = 8;   // two full rows of four

/** The tales arrive grouped two to a para. Dealing them round-robin turns
 *  a run of one neighbourhood into a mosaic of many. */
function mosaic<T extends { location: string }>(items: T[]) {
  const byPara = new Map<string, T[]>();
  for (const item of items) byPara.set(item.location, [...(byPara.get(item.location) ?? []), item]);
  const rounds = [...byPara.values()];
  const out: T[] = [];
  for (let i = 0; rounds.some((r) => r[i]); i++) for (const r of rounds) if (r[i]) out.push(r[i]);
  return out;
}

/** Every card reads the same way: category, who found it, the gem, their
 *  line about it, and the para. Tales are the same card without a photo. */
type Card = Gem | Tale;

function GemMeta({ gem, clamp = true }: { gem: Card; clamp?: boolean }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 p-5">
      <div className="flex flex-col items-start gap-1.5">
        <span
          className={`inline-flex rounded-[6px] px-[10px] py-[4px] font-ui text-[11px] font-bold uppercase ${categoryTone(gem.category)}`}
        >
          {gem.category}
        </span>
        {gem.submittedBy ? (
          <span className="font-ui text-[13px] font-semibold text-grey">
            Submitted by: {gem.submittedBy}
          </span>
        ) : null}
        <h3 className="font-body text-[18px] leading-tight font-bold text-navy">
          {gem.title}
        </h3>
        {gem.description ? (
          <p className={`${clamp ? "line-clamp-3 " : ""}font-body text-[13px] leading-[1.45] text-slate`}>
            {gem.description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="size-3.5 shrink-0 text-pink" />
        <span className="font-ui text-[13px] font-semibold text-slate">
          {gem.location}
        </span>
      </div>
    </div>
  );
}

function PhotoCard({ gem, index }: { gem: Gem; index: number }) {
  return (
    <article data-reveal={String(index % 3)} className="flex h-full min-h-[360px] w-full flex-col overflow-hidden rounded-[8px] bg-cream shadow-[0_8px_16px_0_rgba(27,42,74,0.07)]">
      <Asset
        src={gem.image}
        alt={gem.title}
        className="h-[180px] w-full shrink-0 object-cover"
      />
      <GemMeta gem={gem} />
    </article>
  );
}

function VideoCard({ gem, index }: { gem: Gem; index: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article data-reveal={String(index % 2)} className="flex h-full min-h-[400px] w-full flex-col xl:col-span-2 overflow-hidden rounded-[8px] bg-cream shadow-[0_8px_16px_0_rgba(27,42,74,0.07)]">
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
  gems: Gem[];
  streetStories: Tale[];
};

export function GalleryTabs({ gems, streetStories }: Props) {
  // One collection feeds the tab: entries with a video lead, photos follow.
  const videos = gems.filter((gem) => gem.video);
  const photos = gems.filter((gem) => !gem.video);
  const [tab, setTab] = useState<Tab>("Written Tales");
  const [shown, setShown] = useState<Record<Tab, number>>({
    "Written Tales": PAGE,
    "Photo & Video Stories": PAGE,
  });

  const total = {
    "Written Tales": streetStories.length,
    "Photo & Video Stories": gems.length,
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
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mosaic(streetStories).slice(0, limit).map((tale, index) => (
            <article
              key={tale.title}
              data-reveal={String(index % 3)}
              className={`flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-[8px] border shadow-[0_8px_8px_rgba(27,42,74,0.07)] ${quoteTone(index).card}`}
            >
              <GemMeta gem={tale} clamp={false} />
            </article>
          ))}
        </div>
      )}

      {tab === "Photo & Video Stories" && (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Videos lead, then the community gems from the homepage rail. */}
          {videos.slice(0, limit).map((gem, index) => (
            <VideoCard key={gem.title} gem={gem} index={index} />
          ))}
          {photos.slice(0, Math.max(0, limit - videos.length)).map((gem, index) => (
            <PhotoCard key={gem.title} gem={gem} index={index} />
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
