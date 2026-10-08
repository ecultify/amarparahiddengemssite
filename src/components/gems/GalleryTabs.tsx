"use client";

import { useState } from "react";
import { Asset } from "@/components/ui/Asset";
import { ChevronLeft, ChevronRight, MapPin } from "@/components/ui/icons";
import { pageList } from "@/lib/paginate";
import { categoryTone, quoteTone } from "@/lib/tokens";
import { track } from "@/lib/track";
import type { Gem, Tale } from "@/data/site";

const TABS = ["Written Tales", "Photo & Video Stories"] as const;
type Tab = (typeof TABS)[number];

// Four cards to a row, five rows to a page.
const PAGE = 20;

const ALL = "All";

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
                  : `${gem.title}: video coming soon`
              }
              onClick={() => {
                track({ event: "video_play", video_title: gem.title });
                setPlaying(true);
              }}
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
  const [tab, setTab] = useState<Tab>("Written Tales");
  const [category, setCategory] = useState(ALL);
  const [page, setPage] = useState(1);

  // One collection feeds each tab. Video entries lead the photo tab; the
  // tales arrive grouped by para, so they get dealt out into a mosaic.
  const all: Card[] =
    tab === "Written Tales"
      ? mosaic(streetStories)
      : [...gems.filter((gem) => gem.video), ...gems.filter((gem) => !gem.video)];

  // Only offer categories that actually have entries in this tab, so a
  // filter can never lead to an empty grid.
  const categories = [ALL, ...new Set(all.map((entry) => entry.category))];
  const shown = category === ALL ? all : all.filter((entry) => entry.category === category);

  const last = Math.max(1, Math.ceil(shown.length / PAGE));
  // A filter that shrinks the list can strand you past the end.
  const current = Math.min(page, last);
  const slice = shown.slice((current - 1) * PAGE, current * PAGE);

  /** Paging while scrolled down lands you mid-grid, so every move returns to the top. */
  function goTo(next: number) {
    setPage(Math.min(Math.max(1, next), last));
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  }

  function pickTab(name: Tab) {
    setTab(name);
    setCategory(ALL);
    setPage(1);
  }

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
            onClick={() => pickTab(name)}
            className={`flex-1 rounded-[8px] px-4 py-2.5 font-display text-[14px] font-extrabold uppercase tracking-[0.04em] transition sm:flex-none sm:px-7 sm:text-[15px] ${
              tab === name ? "bg-navy text-white" : "text-slate hover:text-navy"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Category filter — the same tags that sit on the cards, made clickable. */}
      <div data-reveal className="flex w-full flex-wrap items-center justify-center gap-2">
        {categories.map((name) => {
          const active = category === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setCategory(name);
                setPage(1);
              }}
              className={`rounded-[6px] px-[14px] py-[7px] font-ui text-[11px] font-bold uppercase tracking-[0.04em] transition ${
                active
                  ? "bg-navy text-white"
                  : `${categoryTone(name)} hover:opacity-70`
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {tab === "Written Tales" ? (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slice.map((tale, index) => (
            <article
              key={tale.title}
              data-reveal={String(index % 3)}
              className={`flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-[8px] border shadow-[0_8px_8px_rgba(27,42,74,0.07)] ${quoteTone(index).card}`}
            >
              <GemMeta gem={tale} clamp={false} />
            </article>
          ))}
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slice.map((gem, index) =>
            (gem as Gem).video ? (
              <VideoCard key={gem.title} gem={gem as Gem} index={index} />
            ) : (
              <PhotoCard key={gem.title} gem={gem as Gem} index={index} />
            ),
          )}
        </div>
      )}

      {last > 1 && (
        <nav
          data-reveal
          aria-label="Gallery pages"
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={current === 1}
            onClick={() => goTo(current - 1)}
            className="icon-btn flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-line bg-white text-navy disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>

          {pageList(current, last).map((entry, index) =>
            entry === "gap" ? (
              <span key={`gap-${index}`} className="px-1 font-display text-[16px] text-slate">
                &hellip;
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                aria-label={`Page ${entry}`}
                aria-current={entry === current ? "page" : undefined}
                onClick={() => goTo(entry)}
                className={`icon-btn flex size-11 shrink-0 items-center justify-center rounded-[8px] border-2 font-display text-[16px] font-extrabold transition ${
                  entry === current
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-navy"
                }`}
              >
                {entry}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={current === last}
            onClick={() => goTo(current + 1)}
            className="btn-3d inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-yellow px-5 font-display text-[15px] font-extrabold uppercase text-navy"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
