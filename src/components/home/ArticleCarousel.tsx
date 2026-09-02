"use client";

import { useRef } from "react";
import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { slugOf, type Article } from "@/data/site";

/** One card stride: 320px card + 20px gap, matching the homepage rows. */
const STRIDE = 340;

/** The rail of other pieces at the foot of an article — Figma 178:663. */
export function ArticleCarousel({ articles }: { articles: Article[] }) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) =>
    track.current?.scrollBy({ left: direction * STRIDE, behavior: "smooth" });

  if (articles.length === 0) return null;

  return (
    // Arrows overlay the rail's edges rather than sitting beside it: at 375px
    // a card plus two arrows plus gaps does not fit, and they would be clipped.
    <div className="relative flex w-full items-center lg:gap-5">
      <button
        type="button"
        aria-label="Previous articles"
        onClick={() => scroll(-1)}
        className="icon-btn absolute left-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white text-navy shadow-[0_4px_10px_rgba(27,42,74,0.2)] lg:static lg:size-12 lg:shadow-none"
      >
        <ChevronLeft className="size-5" />
      </button>

      <div
        ref={track}
        className="no-scrollbar flex w-full flex-1 gap-5 overflow-x-auto scroll-smooth px-12 lg:px-0"
      >
        {articles.map((article) => (
          <Link
            key={article.title}
            href={`/articles/${slugOf(article)}`}
            className="group relative block h-[150px] w-[240px] shrink-0 overflow-hidden rounded-[10px] transition-transform duration-150 ease-[var(--ease-out-quart)] sm:h-[180px] sm:w-[300px] hover:-translate-y-[3px] active:translate-y-0"
          >
            <Asset
              src={article.image}
              alt={article.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/50 transition-colors duration-150 group-hover:bg-black/40" />
            <h3 className="relative flex h-full items-end p-4 font-display text-[15px] leading-tight font-extrabold text-white sm:text-[17px]">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next articles"
        onClick={() => scroll(1)}
        className="icon-btn absolute right-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white text-navy shadow-[0_4px_10px_rgba(27,42,74,0.2)] lg:static lg:size-12 lg:shadow-none"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
