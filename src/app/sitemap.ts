import type { MetadataRoute } from "next";
import { isDraft, slugOf } from "@/data/site";
import { getContent } from "@/lib/content";

const BASE = "https://amarpara.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles } = await getContent();
  return [
    { url: `${BASE}/`, priority: 1 },
    ...["/500-gems", "/participate", "/submit", "/guess-the-para", "/terms"].map((path) => ({
      url: `${BASE}${path}`,
      priority: 0.7,
    })),
    ...articles
      .filter((a) => !isDraft(a))
      .map((a) => ({ url: `${BASE}/articles/${slugOf(a)}`, priority: 0.8 })),
  ];
}
