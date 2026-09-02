"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moveArticle } from "@/app/actions/content";
import type { ArticleEntry } from "@/lib/content";

type Row = ArticleEntry & { slug: string };

/** The articles list. Reordering swaps rows instantly and saves in the
 *  background; a failed save puts the row back and says so. */
export function ArticlesList({ initialArticles }: { initialArticles: Row[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [pending, startTransition] = useTransition();

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= articles.length) return;
    const previous = articles;
    const next = [...articles];
    [next[index], next[target]] = [next[target], next[index]];
    setArticles(next);
    startTransition(async () => {
      try {
        await moveArticle(previous[index].slug, direction);
      } catch {
        setArticles(previous);
        toast.error("Couldn't reorder", { description: "Check your connection and try again." });
      }
    });
  };

  return (
    <div className="flex flex-col divide-y rounded-lg border bg-card">
      {articles.map((article, index) => (
        <div key={article.slug} className="flex items-center gap-3 px-4 py-3">
          {article.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt=""
              className="size-12 shrink-0 rounded-md border object-cover"
            />
          ) : (
            <div className="size-12 shrink-0 rounded-md border bg-muted" />
          )}
          <Link
            href={`/admin/content/articles/${article.slug}`}
            className="flex min-w-0 flex-1 flex-col gap-0.5 hover:underline"
          >
            <span className="truncate text-sm font-semibold">
              {article.title || "Untitled article"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              /articles/{article.slug}
              {article.date ? ` · ${article.date}` : ""}
            </span>
          </Link>
          <Badge
            variant="outline"
            className={`shrink-0 ${
              article.status === "draft"
                ? "border-yellow/60 bg-yellow/15 text-navy"
                : "border-grass/30 bg-grass/10 text-grass"
            }`}
          >
            {article.status === "draft" ? "Draft" : "Live"}
          </Badge>
          <Badge variant="outline" className="shrink-0">
            Row {article.row}
          </Badge>
          <div className="flex shrink-0 items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Move up"
              disabled={index === 0 || pending}
              onClick={() => move(index, -1)}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Move down"
              disabled={index === articles.length - 1 || pending}
              onClick={() => move(index, 1)}
            >
              <ArrowDown className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
