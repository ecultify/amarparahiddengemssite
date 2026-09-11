import { cache } from "react";
import { readJson, writeJson } from "@/lib/blob-store";
import {
  ARTICLES_ROW_ONE,
  ARTICLES_ROW_TWO,
  CREATOR_REELS,
  CREATOR_TRAILS,
  DISCOVERED_GEMS,
  GEMS,
  GEM_COUNT,
  STORIES,
  STREET_STORIES,
  VIDEO_GEMS,
  type Article,
  type GalleryGem,
  type Gem,
  slugOf,
  type Tale,
  type Story,
} from "@/data/site";

export const CONTENT_PATH = "content.json";

export type Trail = {
  image: string;
  caption: string;
  /** Instagram reel URL. When set, the card plays the reel instead of the
   *  still, at exactly the same size. */
  reel?: string;
};
export type ArticleEntry = Article & { row: "1" | "2" };

/** One Guess the Para question. Flat strings so the generic admin editor
 *  can manage the collection without a custom form. `question` is only a
 *  label for the CMS list — the poster carries the ask, so it isn't shown. */
export type QuizEntry = {
  question: string;
  image?: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: "1" | "2" | "3" | "4";
};

export type SiteContent = {
  gemCount: { discovered: number; total: number };
  gems: Gem[];
  discoveredGems: Gem[];
  stories: Story[];
  articles: ArticleEntry[];
  creatorTrails: Trail[];
  videoGems: GalleryGem[];
  streetStories: Tale[];
  quiz: QuizEntry[];
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
    reel: CREATOR_REELS[index],
  })),
  videoGems: VIDEO_GEMS,
  streetStories: STREET_STORIES,
  quiz: [
    {
      question: "Park Street poster",
      image: "/images/quiz-park-street.jpg",
      option1: "Sudder Street",
      option2: "Park Street",
      option3: "Bow Barracks",
      option4: "Camac Street",
      answer: "2",
    },
  ],
};

async function fetchContent(): Promise<SiteContent> {
  const stored = await readJson<Partial<SiteContent>>(CONTENT_PATH);
  const content = { ...DEFAULT_CONTENT, ...(stored ?? {}) };
  // The old articles editor only knew title/image/row, so its saves stripped
  // body and date. Backfill those from the shipped copy (matched by slug)
  // until the article is re-published from the rich editor.
  content.articles = content.articles.map((article) => {
    if (article.html || article.body) return article;
    const shipped = DEFAULT_CONTENT.articles.find((d) => slugOf(d) === slugOf(article));
    return shipped ? { ...shipped, ...article } : article;
  });
  return content;
}

/** cache() dedupes the read when several components ask during one render. */
export const getContent = cache(fetchContent);

export async function saveContent(content: SiteContent) {
  await writeJson(CONTENT_PATH, content);
}
