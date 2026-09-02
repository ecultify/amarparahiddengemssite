import {
  FileImage,
  Images,
  MessageSquareQuote,
  Newspaper,
  Puzzle,
  Sparkles,
  Video,
  Footprints,
} from "lucide-react";

/** One icon per collection, shared by the sidebar and the overview list. */
export const COLLECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  gems: Sparkles,
  stories: MessageSquareQuote,
  articles: Newspaper,
  creatorTrails: Footprints,
  discoveredGems: Images,
  photoGems: FileImage,
  videoGems: Video,
  streetStories: MessageSquareQuote,
  quiz: Puzzle,
};

export const collectionIcon = (key: string) => COLLECTION_ICONS[key] ?? Images;
