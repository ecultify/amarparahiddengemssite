import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoveArticleButtons } from "@/components/admin/MoveArticleButtons";
import { slugOf } from "@/data/site";
import { getContent } from "@/lib/content";

/** Articles list — static segment, so it shadows the generic
 *  /admin/content/[collection] editor for this one collection. */
export default async function ArticlesPage() {
  const { articles } = await getContent();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-sm text-muted-foreground">
            Home — “Articles &amp; Features” rows. Click a piece to edit it.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/content/articles/new">
            <Plus className="size-3.5" /> New article
          </Link>
        </Button>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No articles yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The homepage rows stay hidden until you publish one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y rounded-lg border bg-card">
          {articles.map((article, index) => {
            const slug = slugOf(article);
            return (
              <div key={slug} className="flex items-center gap-3 px-4 py-3">
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
                  href={`/admin/content/articles/${slug}`}
                  className="flex min-w-0 flex-1 flex-col gap-0.5 hover:underline"
                >
                  <span className="truncate text-sm font-semibold">
                    {article.title || "Untitled article"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    /articles/{slug}
                    {article.date ? ` · ${article.date}` : ""}
                  </span>
                </Link>
                <Badge variant="outline" className="shrink-0">
                  Row {article.row}
                </Badge>
                <MoveArticleButtons
                  slug={slug}
                  first={index === 0}
                  last={index === articles.length - 1}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
