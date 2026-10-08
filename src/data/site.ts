import articles from "@/data/articles.json";
import gems from "@/data/gems.json";
import stories from "@/data/stories.json";
import streetStories from "@/data/street-stories.json";
import discoveredPicks from "@/data/discovered-picks.json";

export type Gem = {
  title: string;
  category: string;
  location: string;
  image: string;
  /** A resident's line about the place. Shown on the card under the name. */
  description?: string;
  /** Directory cards credit the citizen who submitted the gem. */
  submittedBy?: string;
  /** Set for a video entry: the MP4 that plays when the poster is clicked.
   *  `image` is then the poster. Video entries lead the gallery tab. */
  video?: string;
};

/** Explore the Gems carousel — homepage (Figma 49:1961). */
export const GEMS: Gem[] = gems;

/** Gems Already Discovered carousel — participate & submit pages (Figma 95:376).
 *  Pulled straight from the gallery so the teaser shows real submissions:
 *  photo stories and written tales interleaved, one para each. Tales carry no
 *  photo, so their card drops the image strip. */
export const DISCOVERED_GEMS: Gem[] = discoveredPicks.map((title) => {
  const entry = [...gems, ...streetStories].find((e) => e.title === title);
  // Rename an entry in the gallery and the build says so, rather than the
  // carousel quietly losing a card.
  if (!entry) throw new Error(`Discovered gem is not in the gallery: ${title}`);
  return { image: "", ...entry };
});

export type Story = {
  name: string;
  para: string;
  /** Still shown on the side cards, and the poster behind the clip. */
  image: string;
  /** The clip the centre card plays, trimmed to the moment that matters. */
  video?: string;
  quote: string;
  attribution: string;
};

/** Stories from the Paras coverflow — homepage (Figma 49:2032). */
export const STORIES: Story[] = stories;

export type Article = {
  title: string;
  /** URL segment. Editable in the admin; older entries without one fall back
   *  to a slug derived from the headline. */
  slug?: string;
  /** Featured image — the cover on the article page and every card. */
  image: string;
  /** Dateline shown above the headline on the article page. */
  date?: string;
  /** Rich body HTML from the admin editor (admin-only input). Wins over
   *  the legacy `body` paragraphs when set. */
  html?: string;
  /** SEO overrides — fall back to the headline / nothing. */
  seoTitle?: string;
  seoDescription?: string;
  /** Draft articles stay off the live site. Absent means published, so the
   *  shipped articles need no migration. */
  status?: "draft" | "published";
  /** Body copy — one string per paragraph, or (from the admin editor) a
   *  single string with blank lines between paragraphs. */
  body?: string[] | string;
};

/** URL segment for an article. Derived from the headline so an editor adding a
 *  row in the admin gets a working link without having to invent a slug. */
export function articleSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The URL segment an article actually lives at. */
export const slugOf = (article: Pick<Article, "title" | "slug">) =>
  article.slug || articleSlug(article.title);

export const isDraft = (article: Pick<Article, "status">) => article.status === "draft";

/** Articles & Features staggered rows — homepage (Figma 49:2096). The copy is
 *  the Amar Para archive lifted from the campaign's WordPress site; the rows
 *  alternate so both homepage rails span the whole run of paras. */
const ARCHIVE = articles as (Article & { row: "1" | "2" })[];

export const ARTICLES_ROW_ONE: Article[] = ARCHIVE.filter((a) => a.row === "1");
export const ARTICLES_ROW_TWO: Article[] = ARCHIVE.filter((a) => a.row === "2");

/** Creator Trails mosaic — homepage (Figma 49:2147). */
export const CREATOR_TRAILS = [
  "/images/trail-1.png",
  "/images/trail-1.png",
  "/images/trail-1.png",
  "/images/trail-1.png",
  "/images/trail-1.png",
];

/** Creator reels shown in the Creator Trails mosaic, one per card. */
export const CREATOR_REELS = [
  "https://www.instagram.com/reel/DNvDM92Yj1H/",
  "https://www.instagram.com/reel/DM2v8uzPT-R/",
  "https://www.instagram.com/reel/DM_6hh8zyUU/",
  "https://www.instagram.com/reel/DMSoydCP1AD/",
  "https://www.instagram.com/reel/DLtrKCETcpG/",
];

/** Campaign counter shown in the hero and on the progress card. */
export const GEM_COUNT = { discovered: 236, total: 500 };

/* ------------------------------------------------------------------ */
/* 500 Gems gallery page — Figma 106:272                               */
/* ------------------------------------------------------------------ */

/** A tale is a gem without a photo: same card fields, text-only. */
export type Tale = Omit<Gem, "image">;

/** Written Tales — two lesser-known finds from each of the 27 paras in the
 *  Amar Para 2 deck, written up the way a resident would submit them. */
export const STREET_STORIES: Tale[] = streetStories;
