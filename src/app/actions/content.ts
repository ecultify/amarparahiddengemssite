"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { articleSlug, slugOf } from "@/data/site";
import { getContent, saveContent, type ArticleEntry, type SiteContent } from "@/lib/content";
import type { CollectionKey } from "@/lib/schema";

const PUBLIC_PATHS = ["/", "/500-gems", "/participate", "/submit", "/guess-the-para"];

async function commit(next: SiteContent) {
  await saveContent(next);
  for (const path of PUBLIC_PATHS) revalidatePath(path);
  revalidatePath("/articles/[slug]", "page");
}

// ponytail: last write wins between two editors saving the same collection at
// the same time. Add an ETag check (blob ifMatch) if the team grows.
export async function saveCollection(key: CollectionKey, items: unknown[]) {
  await requireAdmin();
  const content = await getContent();
  await commit({ ...content, [key]: items } as SiteContent);
  revalidatePath(`/admin/content/${key}`);
}

export type SaveArticleResult = { ok: true; slug: string } | { ok: false; error: string };

/** Upsert one article. `originalSlug` null means create. Returns the final
 *  slug — normalised, and de-duplicated if it collides with another piece. */
export async function saveArticle(
  originalSlug: string | null,
  input: ArticleEntry,
): Promise<SaveArticleResult> {
  await requireAdmin();
  if (!input.title.trim()) return { ok: false, error: "Give the article a headline." };

  const content = await getContent();
  const articles = [...content.articles];
  const index = originalSlug === null ? -1 : articles.findIndex((a) => slugOf(a) === originalSlug);
  if (originalSlug !== null && index === -1) {
    return { ok: false, error: "That article no longer exists. Go back to the list." };
  }

  let slug = articleSlug(input.slug || input.title);
  if (!slug) return { ok: false, error: "That slug has no usable characters." };
  const taken = (s: string) => articles.some((a, i) => i !== index && slugOf(a) === s);
  if (taken(slug)) {
    let n = 2;
    while (taken(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }

  // `html` becomes the body of record; drop any legacy paragraph body.
  const next: ArticleEntry = { ...input, slug, body: undefined };
  if (index === -1) articles.push(next);
  else articles[index] = next;

  await commit({ ...content, articles });
  revalidatePath("/admin/content/articles");
  return { ok: true, slug };
}

export async function deleteArticle(slug: string) {
  await requireAdmin();
  const content = await getContent();
  await commit({ ...content, articles: content.articles.filter((a) => slugOf(a) !== slug) });
  revalidatePath("/admin/content/articles");
}

/** Swap an article with its neighbour — order decides its place in its row. */
export async function moveArticle(slug: string, direction: -1 | 1) {
  await requireAdmin();
  const content = await getContent();
  const articles = [...content.articles];
  const index = articles.findIndex((a) => slugOf(a) === slug);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= articles.length) return;
  [articles[index], articles[target]] = [articles[target], articles[index]];
  await commit({ ...content, articles });
  revalidatePath("/admin/content/articles");
}

export async function saveGemCount(discovered: number, total: number) {
  await requireAdmin();
  const content = await getContent();
  await commit({ ...content, gemCount: { discovered, total } });
  revalidatePath("/admin/settings");
}
