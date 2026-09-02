import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { slugOf } from "@/data/site";
import { getContent, type ArticleEntry } from "@/lib/content";

const EMPTY: ArticleEntry = { title: "", slug: "", image: "", row: "1", html: "" };

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "new") {
    return <ArticleEditor initial={EMPTY} originalSlug={null} />;
  }

  const { articles } = await getContent();
  const article = articles.find((a) => slugOf(a) === slug);
  if (!article) notFound();

  return <ArticleEditor initial={{ ...article, slug: slugOf(article) }} originalSlug={slug} />;
}
