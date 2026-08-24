import { readJson, writeJson } from "@/lib/blob-store";
import {
  ARTICLES_ROW_ONE,
  ARTICLES_ROW_TWO,
  CREATOR_TRAILS,
  DISCOVERED_GEMS,
  GEMS,
  GEM_COUNT,
  PHOTO_GEMS,
  STORIES,
  STREET_STORIES,
  VIDEO_GEMS,
  type Article,
  type GalleryGem,
  type Gem,
  type QuoteCard,
  type Story,
} from "@/data/site";

export const CONTENT_PATH = "content.json";

export type Trail = { image: string; caption: string };
export type ArticleEntry = Article & { row: "1" | "2" };

export type SiteContent = {
  gemCount: { discovered: number; total: number };
  gems: Gem[];
  discoveredGems: Gem[];
  stories: Story[];
  articles: ArticleEntry[];
  creatorTrails: Trail[];
  photoGems: GalleryGem[];
  videoGems: GalleryGem[];
  streetStories: QuoteCard[];
};

/** Shipped copy — used until an editor saves for the first time, and as the
 *  fallback whenever the blob store is unreachable. */
export const DEFAULT_CONTENT: SiteContent = {
  gemCount: GEM_COUNT,
  gems: GEMS,
  discoveredGems: DISCOVERED_GEMS,
  stories: STORIES,
  articles: [
    ...ARTICLES_ROW_ONE.map((article) => ({ ...article, row: "1" as const })),
    ...ARTICLES_ROW_TWO.map((article) => ({ ...article, row: "2" as const })),
  ],
  creatorTrails: CREATOR_TRAILS.map((image, index) => ({
    image,
    caption: `Creator trail ${index + 1}`,
  })),
  photoGems: PHOTO_GEMS,
  videoGems: VIDEO_GEMS,
  streetStories: STREET_STORIES,
};

export async function getContent(): Promise<SiteContent> {
  const stored = await readJson<Partial<SiteContent>>(CONTENT_PATH);
  return { ...DEFAULT_CONTENT, ...(stored ?? {}) };
}

export async function saveContent(content: SiteContent) {
  await writeJson(CONTENT_PATH, content);
}
