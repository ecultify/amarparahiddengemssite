import { CATEGORIES } from "@/lib/tokens";
import type { SiteContent } from "@/lib/content";

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "image" | "video";
  options?: string[];
  help?: string;
};

export type Collection = {
  key: CollectionKey;
  label: string;
  /** Where it shows up on the public site — printed in the editor header. */
  where: string;
  singular: string;
  /** Field rendered as the row title in the list. */
  titleKey: string;
  fields: Field[];
};

export type CollectionKey = Exclude<keyof SiteContent, "gemCount">;

const CATEGORY_FIELD: Field = { key: "category", label: "Category", type: "select", options: CATEGORIES };

export const COLLECTIONS: Collection[] = [
  {
    key: "gems",
    label: "Explore gems",
    where: "Shows on the homepage, in the Explore the Gems of Kolkata carousel",
    singular: "Gem",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      CATEGORY_FIELD,
      { key: "location", label: "Location", type: "text" },
      { key: "image", label: "Photo", type: "image" },
    ],
  },
  {
    key: "stories",
    label: "Para stories",
    where: "Shows on the homepage, in the Stories from the Paras coverflow",
    singular: "Story",
    titleKey: "name",
    fields: [
      { key: "name", label: "Person", type: "text" },
      { key: "para", label: "Para", type: "text" },
      { key: "image", label: "Portrait", type: "image" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "attribution", label: "Attribution", type: "text", help: "Shown under the quote, like: Riya Sen, Gariahat." },
    ],
  },
  {
    // Articles get their own list + rich-text editor at /admin/content/articles
    // (a static route that shadows the generic one) — this entry only feeds
    // the admin nav, so it carries no fields.
    key: "articles",
    label: "Articles",
    where: "Shows on the homepage, in the Articles and Features rows",
    singular: "Article",
    titleKey: "title",
    fields: [],
  },
  {
    key: "creatorTrails",
    label: "Creator trails",
    where: "Shows on the homepage, in the Creator Trails mosaic",
    singular: "Trail",
    titleKey: "caption",
    fields: [
      { key: "caption", label: "Caption", type: "text", help: "Describes the card for screen readers." },
      { key: "reel", label: "Instagram reel", type: "text", help: "Paste the reel link. The card plays it; leave blank to show the image instead." },
      { key: "image", label: "Image", type: "image", help: "Shown when there is no reel link." },
    ],
  },
  {
    key: "discoveredGems",
    label: "Discovered gems",
    where: "Shows on the Participate and Submit pages, in the Gems Already Discovered carousel",
    singular: "Gem",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      CATEGORY_FIELD,
      { key: "location", label: "Location", type: "text" },
      { key: "submittedBy", label: "Uncovered by", type: "text" },
      { key: "image", label: "Photo", type: "image" },
    ],
  },
  {
    key: "photoGems",
    label: "Image gallery",
    where: "Shows on the 500 Gems page, under the Images tab",
    singular: "Photo gem",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      CATEGORY_FIELD,
      { key: "location", label: "Location", type: "text" },
      { key: "submittedBy", label: "Submitted by", type: "text" },
      { key: "image", label: "Photo", type: "image" },
    ],
  },
  {
    key: "videoGems",
    label: "Video gallery",
    where: "Shows on the 500 Gems page, under the Videos tab",
    singular: "Video gem",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      CATEGORY_FIELD,
      { key: "location", label: "Location", type: "text" },
      { key: "submittedBy", label: "Submitted by", type: "text" },
      { key: "image", label: "Poster image", type: "image" },
      { key: "video", label: "Video file", type: "video", help: "MP4 file. It plays right on the page when a visitor hits play." },
    ],
  },
  {
    key: "quiz",
    label: "Guess the Para",
    where: "The daily quiz, reached from the thank you page. It is not linked anywhere in the site menu.",
    singular: "Question",
    titleKey: "question",
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "image", label: "Photo clue", type: "image", help: "Optional. A photo of the para to identify." },
      { key: "option1", label: "Option 1", type: "text" },
      { key: "option2", label: "Option 2", type: "text" },
      { key: "option3", label: "Option 3", type: "text" },
      { key: "option4", label: "Option 4", type: "text" },
      { key: "answer", label: "Correct answer", type: "select", options: ["1", "2", "3", "4"], help: "Which option is right." },
    ],
  },
  {
    key: "streetStories",
    label: "Written tales",
    where: "Shows on the 500 Gems page, under the Text tab",
    singular: "Written tale",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "meta", label: "Meta line", type: "text", help: "For example: Food, College Street, contributed by Amit K." },
    ],
  },
];

export const collectionByKey = (key: string) => COLLECTIONS.find((c) => c.key === key);

export const emptyItem = (collection: Collection) =>
  Object.fromEntries(
    collection.fields.map((field) => [field.key, field.type === "select" ? (field.options?.[0] ?? "") : ""]),
  ) as Record<string, string>;
