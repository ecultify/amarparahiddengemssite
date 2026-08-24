/** Tag and quote-card colourways, derived from the entry rather than stored. */
const CATEGORY_TONES: Record<string, string> = {
  Food: "bg-pink/8 text-pink",
  Places: "bg-cyan/8 text-cyan",
  Traditions: "bg-yellow/13 text-amber",
  Customs: "bg-yellow/13 text-amber",
  Events: "bg-grass/8 text-grass",
  Cuisines: "bg-cyan/8 text-cyan",
  Institutions: "bg-pink/8 text-pink",
  Stories: "bg-sage/20 text-sage",
  // Categories the public form offers. Toned here too so a published
  // submission gets a brand colour rather than the navy fallback.
  "Food & Mishti": "bg-pink/8 text-pink",
  "Culture & Craft": "bg-sage/20 text-sage",
  Heritage: "bg-yellow/13 text-amber",
  "Nature Spot": "bg-grass/8 text-grass",
  Landmarks: "bg-cyan/8 text-cyan",
  Markets: "bg-cyan/8 text-cyan",
};

/** Everything an admin may tag content with, new vocabulary and legacy alike. */
export const CATEGORIES = Object.keys(CATEGORY_TONES);

/** What the public submission form offers, in the order the form lists them. */
export const SUBMISSION_CATEGORIES = [
  "Food & Mishti",
  "Culture & Craft",
  "Heritage",
  "Nature Spot",
  "Landmarks",
  "Traditions",
  "Markets",
];

export function categoryTone(category: string) {
  return CATEGORY_TONES[category] ?? "bg-navy/8 text-navy";
}

const QUOTE_TONES = [
  { card: "bg-butter border-yellow", mark: "text-yellow" },
  { card: "bg-blush border-pink", mark: "text-pink" },
  { card: "bg-moss border-sage", mark: "text-sage" },
];

export const quoteTone = (index: number) => QUOTE_TONES[index % QUOTE_TONES.length];
