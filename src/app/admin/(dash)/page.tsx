import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collectionIcon } from "@/components/admin/collectionIcons";
import { isDraft } from "@/data/site";
import { getContent } from "@/lib/content";
import { COLLECTIONS } from "@/lib/schema";
import { listSubmissions } from "@/lib/submissions";
import { formatDate, STATUS_TONE } from "@/components/admin/format";

export default async function AdminHome() {
  const [content, submissions] = await Promise.all([getContent(), listSubmissions()]);
  const pending = submissions.filter((entry) => entry.status === "new");
  const recent = submissions.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          {content.gemCount.discovered} of {content.gemCount.total} gems mapped ·{" "}
          {submissions.length} {submissions.length === 1 ? "submission" : "submissions"} received
        </p>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-2">
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Latest submissions</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/submissions">
              Open inbox <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
            <Inbox className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium">No submissions yet</p>
            <p className="text-sm text-muted-foreground">
              Entries from the public form land here the moment someone hits submit.
            </p>
          </div>
        ) : (
          <ul className="divide-y rounded-lg border bg-card">
            {recent.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/admin/submissions/${entry.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {entry.para} · {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className={STATUS_TONE[entry.status]}>
                    {entry.status}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pending.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {pending.length} waiting on review.
          </p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3">
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
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/60">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{collection.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{collection.where}</p>
                  </div>
                  <span className="text-sm tabular-nums text-muted-foreground">{count}</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      </div>
    </div>
  );
}
