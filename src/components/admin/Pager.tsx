"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageList } from "@/lib/paginate";

/**
 * Page control for the admin lists. Two modes, same look:
 * `href` is the list's URL, filter query included, and each page link adds
 * `page=N` to it (server-rendered lists); `onChange` flips local state
 * (client lists). A string, not a function, because a server component
 * cannot hand a function across to a client one. Renders nothing when
 * everything already fits on one page.
 */
type Props = {
  page: number;
  pageCount: number;
  /** Row count across all pages, for the "showing x-y of z" line. */
  total: number;
  perPage: number;
  noun: string;
  href?: string;
  onChange?: (page: number) => void;
};

export function Pager({ page, pageCount, total, perPage, noun, href, onChange }: Props) {
  if (pageCount <= 1) return null;

  // Page 1 is the bare URL, so the first page never carries a stale ?page=.
  const linkTo = (to: number) => {
    const url = new URL(href ?? "/", "http://x");
    if (to > 1) url.searchParams.set("page", String(to));
    else url.searchParams.delete("page");
    return url.pathname + url.search;
  };

  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);

  const step = (to: number, children: React.ReactNode, label: string, disabled: boolean) => {
    const className = "size-8 p-0";
    if (disabled) {
      return (
        <Button variant="outline" size="sm" className={className} disabled aria-label={label}>
          {children}
        </Button>
      );
    }
    return href ? (
      <Button variant="outline" size="sm" className={className} asChild>
        <Link href={linkTo(to)} aria-label={label} scroll>
          {children}
        </Link>
      </Button>
    ) : (
      <Button variant="outline" size="sm" className={className} onClick={() => onChange?.(to)} aria-label={label}>
        {children}
      </Button>
    );
  };

  return (
    <nav
      aria-label={`${noun} pages`}
      className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {first}&ndash;{last} of {total} {noun}
      </p>

      <div className="flex items-center gap-1">
        {step(page - 1, <ChevronLeft className="size-4" />, "Previous page", page === 1)}

        {pageList(page, pageCount).map((entry, index) =>
          entry === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-sm text-muted-foreground">
              &hellip;
            </span>
          ) : entry === page ? (
            <Button key={entry} size="sm" className="size-8 p-0 tabular-nums" aria-current="page">
              {entry}
            </Button>
          ) : href ? (
            <Button key={entry} variant="outline" size="sm" className="size-8 p-0 tabular-nums" asChild>
              <Link href={linkTo(entry)} aria-label={`Page ${entry}`} scroll>
                {entry}
              </Link>
            </Button>
          ) : (
            <Button
              key={entry}
              variant="outline"
              size="sm"
              className="size-8 p-0 tabular-nums"
              aria-label={`Page ${entry}`}
              onClick={() => onChange?.(entry)}
            >
              {entry}
            </Button>
          ),
        )}

        {step(page + 1, <ChevronRight className="size-4" />, "Next page", page === pageCount)}
      </div>
    </nav>
  );
}
