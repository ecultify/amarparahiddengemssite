/**
 * Every image in the design lives in /public/images and is downloaded by
 * `npm run assets` from figma-assets.json. Reference images through this map so
 * a renamed or missing asset is a compile error rather than a silent 404.
 */
export const IMG = {
  heroCollage: "/images/hero-collage.png",

  /** Hero carousel — one editorial collage panel per slide. */
  heroSlides: [
    "/images/hero-section/carousel1.png",
    "/images/hero-section/carousel2.png",
    "/images/hero-section/carousel3.png",
  ],

  accentKites: "/images/accent-kites.png",
  accentStatue: "/images/accent-statue.png",
  accentTemple: "/images/accent-temple.png",
  accentBirds: "/images/accent-birds.png",
  accentArch: "/images/accent-arch.png",
  accentGolfer: "/images/accent-golfer.png",
  accentKiteCreator: "/images/accent-kite-creator.png",
  accentAuto: "/images/accent-auto.png",
  accentAutoRickshaw: "/images/accent-auto-rickshaw.png",
  /** Rainbow kite — hand-supplied; gallery hero and participate hero. */
  accentKiteRainbow: "/accent-kite-rainbow.png",

  /** Article page — Figma 178:296. Hand-supplied plus a few node exports. */
  blogSprout: "/blog-sprout.png",
  blogDhol: "/blog-dhol.png",
  blogKite: "/blog-kite.png",
  blogWalkers: "/blog-walkers.png",
  blogCouple: "/blog-couple.png",
  accentHeritageWatermark: "/images/accent-heritage-watermark.png",

  /** Gems Already Discovered accents — hand-supplied, not from figma sync. */
  gemsHeron: "/gems-heron.png",
  gemsPlayground: "/gems-playground.png",
  gemsStreaks: "/gems-streaks.png",

  logoToi: "/images/logo-toi.png",
  logoIAmKolkata: "/images/logo-i-am-kolkata.png",
  logoMark: "/images/logo-mark.svg",
  logoHiddenGems: "/images/logo-hidden-gems.png",
} as const;

/**
 * Homepage decorative accents, exported from Figma 49:1939 at 3x and knocked
 * out of their baked section-colour backgrounds. Node ids in the comments so
 * the next design pass can be diffed against the file.
 */
export const HOME_ACCENT = {
  flowers: "/images/home-accents/flowers.png", // 178:231
  statue: "/images/home-accents/statue.png", // 178:224
  saxophone: "/images/home-accents/saxophone.png", // 164:22
  horn: "/images/home-accents/horn.png", // 178:245
  caddie: "/images/home-accents/caddie.png", // 178:287
  golfer: "/images/home-accents/golfer.png", // 178:33
  flag: "/images/home-accents/flag.png", // 178:31
  /** White busker silhouette over the Explore yellow tab. */
  busker: "/images/home-accents/busker.png", // 164:28
  /** Seekh kebabs bleeding off the Articles right edge. */
  kebab: "/images/home-accents/kebab.png", // 178:549 (Group_23)
} as const;

/**
 * Participate page accents, Figma frame 95:4 (1440x2599). Node ids in the
 * comments; Figma exports these matted on the cream canvas, so each was
 * knocked out to a real cutout before being committed.
 */
export const PARTICIPATE_ACCENT = {
  golfPouch: "/images/participate/golf-pouch.png", // 164:34
  saxophone: "/images/participate/saxophone.png", // 178:250
  /** Opaque on purpose: the Figma matte is exactly bg-cream, and knocking
   *  it out ate the plate rim. */
  plate: "/participate-mishti-plate.png", // hand-supplied, not from figma sync
  tower: "/images/participate/tower.png", // 178:234
  kingfisher: "/images/participate/kingfisher.png", // 164:42
  /** Green caddie that stands on the headline full stop. */
  caddie: "/images/participate/layer113.png", // 164:32
  shell: "/images/participate/shell.png", // 164:59
  /** Lavender panel + figures baked together, as Figma composites them. */
  dancers: "/images/participate/dancers.png", // 178:17
  /** Rotation (-29.3deg) is baked into the Figma render, so no CSS rotate. */
  dhol: "/images/participate/dhol.png", // 164:62
  statue: "/participate-statue.png", // 178:226 — hand-supplied, not from figma sync
  /** Kite trailing its string across the Gems block. */
  kiteString: "/images/participate/kitestring.png", // 178:166
  playground: "/images/participate/cityscape.png", // 164:68 (mix-blend-multiply)
} as const;

/**
 * Entry-submission page accents, Figma frame 95:309 (1440x3020). The hero
 * sits on bg-cream and Figma mattes these on the same #FCF8F2, so the hero
 * pieces are kept opaque - they composite invisibly and avoid the knockout
 * artefacts a cutout would leave on soft-edged artwork.
 */
export const SUBMIT_ACCENT = {
  flowers: "/images/submit/flowers.png", // 178:258
  saxophone: "/images/submit/sax-s.png", // 178:260
  golfBag: "/images/submit/bluefig.png", // 178:215
  coffee: "/submit-coffee-cup.png", // hand-supplied, not from figma sync
  fishPlate: "/images/submit/kite-s.png", // 178:271
  golfCart: "/images/submit/cart.png", // 178:142
  kite: "/images/submit/kitetri.png", // 178:210 (rotated 26.59deg in Figma)
  /** Cyan section - real cutouts, since they sit on colour not cream. */
  heron: "/images/submit/heron.png", // 178:206
  statue: "/images/submit/statue-s.png", // 178:218
} as const;

/** Gallery page (Figma 106:272) artwork. */
/** 500 Gems page accents — hand-supplied, not from the figma sync. */
export const GALLERY_IMG = {
  mishtiPlate: "/gallery-mishti-plate.png",
  bar: "/gallery-bar.png",
  saxophone: "/gallery-saxophone.png",
  picks: "/gallery-picks.png",
} as const;
