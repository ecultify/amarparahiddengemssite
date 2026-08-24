export type Gem = {
  title: string;
  category: string;
  location: string;
  image: string;
  /** Directory cards credit the citizen who submitted the gem. */
  submittedBy?: string;
};

/** Explore the Gems carousel — homepage (Figma 49:1961). */
export const GEMS: Gem[] = [
  {
    title: "Paramount Sherbets",
    category: "Food",
    location: "College Street",
    image: "/images/gem-paramount.png",
  },
  {
    title: "Mallick Ghat Flower Market",
    category: "Places",
    location: "Howrah Bridge",
    image: "/images/gem-mallick-ghat.png",
  },
  {
    title: "Kumartuli Idol Makers",
    category: "Traditions",
    location: "North Kolkata",
    image: "/images/gem-kumartuli.png",
  },
  {
    title: "Durga Puja Festival",
    category: "Events",
    location: "Kolkata",
    image: "/images/gem-durga-puja.png",
  },
  {
    title: "Puchka",
    category: "Cuisines",
    location: "Bengal Street Food",
    image: "/images/gem-mallick-ghat.png",
  },
];

/** Gems Already Discovered carousel — participate & submit pages (Figma 95:376). */
export const DISCOVERED_GEMS: Gem[] = [
  {
    title: "Paramount Sherbets",
    category: "Food",
    location: "College Street",
    image: "/images/gem-paramount.png",
    submittedBy: "Souvik Banerjee",
  },
  {
    title: "Mallick Ghat Market",
    category: "Places",
    location: "Howrah Bridge",
    image: "/images/gem-mallick-ghat-2.png",
    submittedBy: "Sagnik D.",
  },
  {
    title: "Kumartuli Idol Makers",
    category: "Traditions",
    location: "North Kolkata",
    image: "/images/gem-kumartuli-2.png",
    submittedBy: "Rimi Sen",
  },
  {
    title: "Heritage Library",
    category: "Events",
    location: "Shyambazar",
    image: "/images/gem-heritage-library.png",
    submittedBy: "Arpita B.",
  },
];

export type Story = {
  name: string;
  para: string;
  image: string;
  quote: string;
  attribution: string;
};

/** Stories from the Paras coverflow — homepage (Figma 49:2032). */
export const STORIES: Story[] = [
  {
    name: "Haripada Da",
    para: "Shyambazar",
    image: "/images/story-haripada.png",
    quote:
      "The tram bell at dawn is our alarm clock. Three generations of my family have opened the shutter to that same sound.",
    attribution: "— Haripada Da, Shyambazar",
  },
  {
    name: "Riya Sen",
    para: "Gariahat",
    image: "/images/story-riya.png",
    quote:
      "Gariahat after sundown is a different city. The pavement stalls light up and the whole para comes out to bargain, gossip and eat.",
    attribution: "— Riya Sen, Gariahat",
  },
  {
    name: "Sourav Das",
    para: "Bagbazar",
    image: "/images/story-sourav.png",
    quote:
      "“Every Sunday morning, the adda at our local tea stall in Bagbazar represents more than just gossip. It is the living, breathing chronicle of our neighborhood. From standard updates to deep-rooted community debates, these lanes hold centuries of legacy.”",
    attribution: "— Sourav Das, Resident since 1974",
  },
  {
    name: "Animesh Pal",
    para: "Kumartuli",
    image: "/images/story-animesh.png",
    quote:
      "We shape the goddess with river clay every year and let her go every year. Kumartuli teaches you that nothing beautiful is meant to be kept.",
    attribution: "— Animesh Pal, Kumartuli",
  },
  {
    name: "Subrata Paul",
    para: "Maidan",
    image: "/images/story-subrata.png",
    quote:
      "The Maidan belongs to no one, so it belongs to everyone. Footballers, phuchka carts, lovers and lost dogs all get the same grass.",
    attribution: "— Subrata Paul, Maidan",
  },
];

export type Article = { title: string; image: string };

/** Articles & Features staggered rows — homepage (Figma 49:2096). */
export const ARTICLES_ROW_ONE: Article[] = [
  { title: "The Royal Sweets of Bowbazar", image: "/images/article-1.png" },
  { title: "British Era Architecture in Dalhousie", image: "/images/article-2.png" },
  { title: "Evolution of Bengali Rock Music", image: "/images/article-3.png" },
  { title: "Tram Routes of North Kolkata", image: "/images/article-4.png" },
  { title: "The Handloom Weavers of Bengal", image: "/images/article-5.png" },
];

export const ARTICLES_ROW_TWO: Article[] = [
  { title: "Durga Puja Artisan Chronicles", image: "/images/article-6.png" },
  { title: "Cabins of College Street", image: "/images/article-7.png" },
  { title: "Legacy of Satyajit Ray in South Calcutta", image: "/images/article-8.png" },
  { title: "Ghats of Hooghly River at Dawn", image: "/images/article-9.png" },
  { title: "Hidden Art Deco Mansions of Ballygunge", image: "/images/article-10.png" },
];

/** Creator Trails mosaic — homepage (Figma 49:2147). */
export const CREATOR_TRAILS = [
  "/images/trail-1.png",
  "/images/trail-1.png",
  "/images/trail-1.png",
  "/images/trail-1.png",
  "/images/trail-1.png",
];

/** Campaign counter shown in the hero and on the progress card. */
export const GEM_COUNT = { discovered: 236, total: 500 };

/* ------------------------------------------------------------------ */
/* 500 Gems gallery page — Figma 106:272                               */
/* ------------------------------------------------------------------ */

export type GalleryGem = {
  title: string;
  category: string;
  location: string;
  submittedBy: string;
  image: string;
  /** Videos only: the file that plays when the poster is clicked. */
  video?: string;
};

export const PHOTO_GEMS: GalleryGem[] = [
  {
    title: "Paramount Sherbets",
    category: "Food",
    location: "College Street",
    submittedBy: "Souvik Banerjee",
    image: "/images/gallery-paramount.png",
  },
  {
    title: "Kumartuli Idol Makers",
    category: "Traditions",
    location: "North Kolkata",
    submittedBy: "Rimi Sen",
    image: "/images/gallery-kumartuli.png",
  },
  {
    title: "Mallick Ghat Flower Market",
    category: "Places",
    location: "Howrah Bridge",
    submittedBy: "Sagnik D.",
    image: "/images/gallery-mallick-ghat.png",
  },
  {
    title: "Victoria Memorial at Dawn",
    category: "Places",
    location: "Maidan",
    submittedBy: "Arpita B.",
    image: "/images/gallery-victoria.png",
  },
  {
    title: "Durga Puja Pandal Art",
    category: "Events",
    location: "Kolkata",
    submittedBy: "Rohan S.",
    image: "/images/gallery-durga-pandal.png",
  },
  {
    title: "Princep Ghat at Sunset",
    category: "Places",
    location: "Princep Ghat",
    submittedBy: "Amar Para 2.0",
    image: "/images/gallery-princep-ghat.png",
  },
];

export const VIDEO_GEMS: GalleryGem[] = [
  {
    title: "Morning Chai at Bagbazar Ghat",
    category: "Customs",
    location: "Bagbazar",
    submittedBy: "Ananya D.",
    image: "/images/video-bagbazar.png",
  },
  {
    title: "Tram Ride through Esplanade",
    category: "Places",
    location: "Esplanade, Central Kolkata",
    submittedBy: "Nandini G.",
    image: "/images/video-tram.png",
  },
];

export type QuoteCard = {
  quote: string;
  title: string;
  meta: string;
};

export const STREET_STORIES: QuoteCard[] = [
  {
    quote:
      "Every Sunday, the addas at our local tea stall represent more than gossip - they are the living, breathing chronicle of Bagbazar.",
    title: "Bagbazar Adda",
    meta: "Customs • Bagbazar • Contributed by: Ananya D.",
  },
  {
    quote:
      "The narrow lane behind College Street has a 90-year-old sweet shop that only locals know.",
    title: "Hidden Sweet Lane",
    meta: "Food • College Street • Contributed by: Amit K.",
  },
  {
    quote:
      "My grandmother says the ghats looked different 50 years ago - now only the memories remain.",
    title: "Ghats of Memory",
    meta: "Stories • Princep Ghat • Contributed by: Debarati P.",
  },
];
