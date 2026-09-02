"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getContent, saveContent, type SiteContent } from "@/lib/content";
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

export async function saveGemCount(discovered: number, total: number) {
  await requireAdmin();
  const content = await getContent();
  await commit({ ...content, gemCount: { discovered, total } });
  revalidatePath("/admin/settings");
}
