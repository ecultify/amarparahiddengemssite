"use client";

import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { slugOf, type Article } from "@/data/site";
import { useAutoRail } from "@/hooks/use-auto-rail";

/** article-card — Figma 49:2098. 320x200, 50% black scrim, title bottom-left. */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${slugOf(article)}`}
      className="group relative block h-[180px] w-[280px] shrink-0 overflow-hidden rounded-[12px] transition-transform duration-150 ease-[var(--ease-out-quart)] sm:h-[200px] sm:w-[320px] hover:-translate-y-[3px] active:translate-y-0"
    >
      <Asset
        src={article.image}
        alt={article.title}
        className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-black/50 transition-colors duration-150 group-hover:bg-black/40" />
      <div className="relative flex h-full flex-col justify-end p-5">
        <h3 className="font-display text-[18px] leading-tight font-extrabold text-white">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

/** One Articles & Features row. The list is printed twice so the hook can
 *  loop it seamlessly as a slow crawl; `direction` -1 runs it right to left. */
export function ArticleRow({ articles, direction }: { articles: Article[]; direction: 1 | -1 }) {
  const { ref, pause } = useAutoRail(direction, true, 28);
  return (
    <div ref={ref} {...pause} className="no-scrollbar flex gap-5 overflow-x-auto py-2">
      {[...articles, ...articles].map((article, index) => (
        <ArticleCard key={`${article.title}-${index}`} article={article} />
      ))}
    </div>
  );
}
