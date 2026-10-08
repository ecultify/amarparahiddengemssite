import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnalyticsKpis, AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { GoogleAnalyticsPanel } from "@/components/admin/GoogleAnalyticsPanel";
import { collectionIcon } from "@/components/admin/collectionIcons";
import { computeAnalytics } from "@/lib/analytics";
import { listUsers } from "@/lib/users";
import { isDraft } from "@/data/site";
import { getContent } from "@/lib/content";
import { COLLECTIONS } from "@/lib/schema";
import { listSubmissions } from "@/lib/submissions";
import { formatDate, STATUS_LABEL, STATUS_TONE } from "@/components/admin/format";

/** Always fresh: the analytics panel refreshes this page every 30s. */
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [content, submissions, users] = await Promise.all([getContent(), listSubmissions(), listUsers()]);
  const analytics = computeAnalytics(submissions, users);
  const pending = submissions.filter((entry) => entry.status === "new");
  const counted = submissions.filter((entry) => entry.status === "counted").length;
  const recent = submissions.slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-xs text-muted-foreground">
          {content.gemCount.discovered} of {content.gemCount.total} gems mapped ·{" "}
          {submissions.length} {submissions.length === 1 ? "submission" : "submissions"} received
          {counted > 0 ? ` · ${counted} pushed into the 500` : ""}
        </p>
      </header>

      {/* Vercel-style split: a narrow rail of numbers and the inbox, the wide
          column for charts and content. Stacks below lg. */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-5">
          <AnalyticsKpis data={analytics} />

          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Latest submissions</h2>
              <Link
                href="/admin/submissions"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Open inbox <ArrowRight className="size-3" />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed bg-card p-5 text-center">
                <Inbox className="size-4 text-muted-foreground" />
                <p className="text-[13px] font-medium">No submissions yet</p>
                <p className="text-xs text-muted-foreground">
                  Entries from the public form land here the moment someone hits submit.
                </p>
              </div>
            ) : (
              <ul className="divide-y rounded-lg border bg-card">
                {recent.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/admin/submissions/${entry.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 transition-colors hover:bg-muted/60"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">{entry.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {entry.para} · {formatDate(entry.createdAt)}
                        </p>
                      </div>
                      <Badge variant="outline" className={STATUS_TONE[entry.status]}>
                        {STATUS_LABEL[entry.status]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {pending.length > 0 ? (
              <p className="text-xs text-muted-foreground">{pending.length} waiting on review.</p>
            ) : null}
          </section>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <AnalyticsPanel data={analytics} />

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold">Site content</h2>
            <ul className="divide-y rounded-lg border bg-card">
              {COLLECTIONS.map((collection) => {
                const entries = content[collection.key] as unknown[];
                // Articles get a live/draft split; every other collection is a count.
                const drafts =
                  collection.key === "articles" ? content.articles.filter(isDraft).length : 0;
                const count =
                  collection.key === "articles"
                    ? `${entries.length - drafts} live${drafts > 0 ? ` · ${drafts} draft${drafts === 1 ? "" : "s"}` : ""}`
                    : String(entries.length);
                const Icon = collectionIcon(collection.key);
                return (
                  <li key={collection.key}>
                    <Link
                      href={`/admin/content/${collection.key}`}
                      className="group flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/60">
                        <Icon className="size-3.5 text-muted-foreground" />
                      </span>
                      <p className="w-40 shrink-0 truncate text-[13px] font-medium">{collection.label}</p>
                      <p className="hidden min-w-0 flex-1 truncate text-xs text-muted-foreground sm:block">
                        {collection.where}
                      </p>
                      <span className="ml-auto shrink-0 text-[13px] tabular-nums text-muted-foreground">{count}</span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      {/* Full width: its charts and breakdowns need the room, and it keeps the
          rail above from ending in a tall empty column. */}
      <GoogleAnalyticsPanel settings={content.analytics} />
    </div>
  );
}
