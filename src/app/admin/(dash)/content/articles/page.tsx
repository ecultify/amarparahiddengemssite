import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticlesList } from "@/components/admin/ArticlesList";
import { isDraft, slugOf } from "@/data/site";
import { getContent } from "@/lib/content";

/** Articles list. A static segment, so it shadows the generic
 *  /admin/content/[collection] editor for this one collection. */
export default async function ArticlesPage() {
  const { articles } = await getContent();
  const rows = articles.map((article) => ({ ...article, slug: slugOf(article) }));
  const drafts = rows.filter(isDraft).length;
  const live = rows.length - drafts;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-sm text-muted-foreground">
            {live} live on the site{drafts > 0 ? `, ${drafts} saved as ${drafts === 1 ? "a draft" : "drafts"}` : ""}.
            Click a piece to edit it.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/content/articles/new">
            <Plus className="size-3.5" /> New article
          </Link>
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No articles yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The homepage rows stay hidden until you publish one.
          </p>
        </div>
      ) : (
        <ArticlesList initialArticles={rows} />
      )}
    </div>
  );
}
