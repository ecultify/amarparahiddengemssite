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
    where: "Home — “Explore the Gems of Kolkata” carousel",
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
    where: "Home — “Stories from the Paras” coverflow",
    singular: "Story",
    titleKey: "name",
    fields: [
      { key: "name", label: "Person", type: "text" },
      { key: "para", label: "Para", type: "text" },
      { key: "image", label: "Portrait", type: "image" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "attribution", label: "Attribution", type: "text", help: "Shown under the quote, e.g. “— Riya Sen, Gariahat”." },
    ],
  },
  {
    key: "articles",
    label: "Articles",
    where: "Home — “Articles & Features” rows",
    singular: "Article",
    titleKey: "title",
    fields: [
      { key: "title", label: "Headline", type: "text" },
      { key: "image", label: "Cover", type: "image" },
      { key: "row", label: "Row", type: "select", options: ["1", "2"] },
    ],
  },
  {
    key: "creatorTrails",
    label: "Creator trails",
    where: "Home — “Creator Trails” mosaic",
    singular: "Trail",
    titleKey: "caption",
    fields: [
      { key: "caption", label: "Caption", type: "text", help: "Used as the image’s alt text." },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  {
    key: "discoveredGems",
    label: "Discovered gems",
    where: "Participate & Submit — “Gems Already Discovered” carousel",
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
    label: "Gallery — images",
    where: "500 Gems — Images tab",
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
    label: "Gallery — videos",
    where: "500 Gems — Videos tab",
    singular: "Video gem",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      CATEGORY_FIELD,
      { key: "location", label: "Location", type: "text" },
      { key: "submittedBy", label: "Submitted by", type: "text" },
      { key: "image", label: "Poster image", type: "image" },
      { key: "video", label: "Video file", type: "video", help: "MP4. Plays inline when a visitor hits play." },
    ],
  },
  {
    key: "streetStories",
    label: "Gallery — text",
    where: "500 Gems — Text tab",
    singular: "Written tale",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "meta", label: "Meta line", type: "text", help: "e.g. “Food • College Street • Contributed by: Amit K.”" },
    ],
  },
];

export const collectionByKey = (key: string) => COLLECTIONS.find((c) => c.key === key);

export const emptyItem = (collection: Collection) =>
  Object.fromEntries(
    collection.fields.map((field) => [field.key, field.type === "select" ? (field.options?.[0] ?? "") : ""]),
  ) as Record<string, string>;
