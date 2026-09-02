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
  slugOf,
  type QuoteCard,
  type Story,
} from "@/data/site";

export const CONTENT_PATH = "content.json";

export type Trail = { image: string; caption: string };
export type ArticleEntry = Article & { row: "1" | "2" };

/** One Guess the Para question. Flat strings so the generic admin editor
 *  can manage the collection without a custom form. */
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
  photoGems: GalleryGem[];
  videoGems: GalleryGem[];
  streetStories: QuoteCard[];
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
  })),
  photoGems: PHOTO_GEMS,
  videoGems: VIDEO_GEMS,
  streetStories: STREET_STORIES,
  quiz: [
    {
      question: "Marigolds arrive by the sackful before dawn at this market under a famous bridge. Which para is it?",
      image: "/images/gem-mallick-ghat.png",
      option1: "Gariahat",
      option2: "Mallick Ghat",
      option3: "Shyambazar",
      option4: "Ballygunge",
      answer: "2",
    },
    {
      question: "River clay becomes the goddess every year in these lanes of idol makers. Name the para.",
      image: "/images/gem-kumartuli.png",
      option1: "Kumartuli",
      option2: "Bagbazar",
      option3: "College Street",
      option4: "Bowbazar",
      answer: "1",
    },
    {
      question: "A century-old sherbet counter still serves daab sherbet a few steps from the boi para. Where are you?",
      image: "/images/gem-paramount.png",
      option1: "Dalhousie",
      option2: "Maidan",
      option3: "College Street",
      option4: "Kumartuli",
      answer: "3",
    },
    {
      question: "The tram bell at dawn is the alarm clock of this North Kolkata para. Which one?",
      image: "/images/gem-heritage-library.png",
      option1: "Gariahat",
      option2: "Ballygunge",
      option3: "Behala",
      option4: "Shyambazar",
      answer: "4",
    },
  ],
};

export async function getContent(): Promise<SiteContent> {
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

export async function saveContent(content: SiteContent) {
  await writeJson(CONTENT_PATH, content);
}
