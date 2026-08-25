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

export type Article = {
  title: string;
  image: string;
  /** Dateline shown above the headline on the article page. */
  date?: string;
  /** Body copy, one string per paragraph. */
  body?: string[];
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

/** Articles & Features staggered rows — homepage (Figma 49:2096). */
export const ARTICLES_ROW_ONE: Article[] = [
  {
    title: "The Royal Sweets of Bowbazar",
    image: "/images/article-1.png",
    date: "March 4, 2024",
    body: [
      "Bowbazar keeps its sweetest secrets behind marble counters that have not moved in a century. The shops here still work to the rhythm of the milk cart, and the men at the karai still judge a batch by the way it catches the light rather than by a thermometer.",
      "Ask for the sandesh and you will be handed something that tastes of restraint: less sugar than you expect, more chhena than you thought possible. It is a recipe that survived Partition, three generations of family argument, and the arrival of the refrigerator.",
    ],
  },
  {
    title: "British Era Architecture in Dalhousie",
    image: "/images/article-2.png",
    date: "January 22, 2024",
    body: [
      "Dalhousie Square was built to look like somewhere else, and failed in the most interesting way. The porticos and pediments came from a pattern book, but the shutters, the courtyards and the deep verandahs are pure Bengal, added by builders who knew what the monsoon does to a facade.",
      "Walk it early, before the offices fill. The light comes off the wet stone and for a moment you can see the whole argument the city has been having with itself for two hundred years.",
    ],
  },
  {
    title: "Evolution of Bengali Rock Music",
    image: "/images/article-3.png",
    date: "November 11, 2023",
    body: [
      "It began in living rooms in the eighties, with borrowed guitars and lyrics that refused to be polite. Jibonmukhi took the Bengali song off the concert stage and put it on the street, where it argued with the traffic and usually won.",
      "The paras were the circuit. A band could play a puja pandal in October and a college social in February, and somewhere between the two it would find the song that made it.",
    ],
  },
  {
    title: "Tram Routes of North Kolkata",
    image: "/images/article-4.png",
    date: "August 30, 2023",
    body: [
      "The tram does not hurry, which is the point. It moves at the speed of a conversation, and North Kolkata built itself around that pace: the tea stall at the stop, the bookshop that knows the timetable, the queue that forms without anyone organising it.",
      "Routes have closed and the network is a fraction of what it was, but the rails are still there under the tar. On a quiet morning you can hear one coming three streets away.",
    ],
  },
  {
    title: "The Handloom Weavers of Bengal",
    image: "/images/article-5.png",
    date: "June 18, 2023",
    body: [
      "A Bengal handloom is a machine made almost entirely of judgement. The weaver counts in threads and thinks in weeks, and the loom itself is tuned by ear, tightened and slackened until the shuttle sounds right.",
      "The saris that come off it carry the weaver's hand in the selvedge, which is how the old buyers used to tell one village from another without being told.",
    ],
  },];

export const ARTICLES_ROW_TWO: Article[] = [
  {
    title: "Durga Puja Artisan Chronicles",
    image: "/images/article-6.png",
    date: "September 10, 2023",
    body: [
      "In Kumartuli the year is measured backwards from Mahalaya. The straw comes first, then the clay from the river, then the long patient weeks of drying that no one can hurry and every artisan complains about.",
      "The faces are painted last and always in one sitting. The eyes go on at dawn, in a room that has gone very quiet, and the figure stops being an object somewhere in the middle of that stroke.",
    ],
  },
  {
    title: "Cabins of College Street",
    image: "/images/article-7.png",
    date: "May 2, 2023",
    body: [
      "The cabin is an institution disguised as a restaurant. Wooden partitions, a curtain that does not quite close, and a waiter who has heard every argument that Presidency and Scottish Church have ever had over a plate of kabiraji.",
      "Nobody comes for the food alone. They come because a cabin is the only place in the city where you can occupy a table for four hours on the strength of one order of coffee.",
    ],
  },
  {
    title: "Legacy of Satyajit Ray in South Calcutta",
    image: "/images/article-8.png",
    date: "February 14, 2024",
    body: [
      "Ray wrote, drew, scored and storyboarded from a flat in Bishop Lefroy Road, and South Calcutta has never entirely stopped behaving like one of his sets. The wrought iron, the shuttered light, the particular silence of an afternoon staircase — all of it is still there to be walked through.",
      "His notebooks are the real monument: every frame drawn before it was shot, in a hand that never seems to hesitate.",
    ],
  },
  {
    title: "Ghats of Hooghly River at Dawn",
    image: "/images/article-9.png",
    date: "July 7, 2023",
    body: [
      "The river gets its own hour before the city claims the day. Wrestlers at Mallick Ghat, priests at Nimtala, and the flower market already three hours into its work, unloading marigold by the sackful onto wet stone.",
      "By eight it is over. The light hardens, the crowds arrive, and the ghats go back to being a place people pass through rather than a place people are.",
    ],
  },
  {
    title: "Hidden Art Deco Mansions of Ballygunge",
    image: "/images/article-10.png",
    date: "December 5, 2023",
    body: [
      "Between the war years Ballygunge went modern, and it did so in curves. Rounded balconies, porthole windows, stair towers with vertical glazing that lit the landing like a lantern — Deco arrived in Kolkata as a statement about the future.",
      "Most are subdivided now, and the terrazzo is patched. But look above the first floor, where nobody has had a reason to renovate, and the original building is still making its case.",
    ],
  },];

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
