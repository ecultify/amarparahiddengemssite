# Amar Para 2.0 — Hidden Gems

Next.js 16 build of the Amar Para 2.0 microsite for The Times of India, Kolkata.
Every screen is a direct implementation of the Figma file
[`Amar Para 2.0`](https://www.figma.com/design/feGxkhlM2AE5Ke6n8O9H5r/Amar-Para-2.0).

## Stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, tokens declared in `src/app/globals.css` |
| Fonts | Outfit, Manrope, Fira Sans, self-hosted via Fontsource (no runtime call to Google) |

## Getting started

```bash
npm install
npm run assets   # downloads the Figma artwork into public/images — run this first
npm run dev      # http://localhost:3000
```

`npm run assets` pulls every image from `figma-assets.json`. Those URLs are issued by
Figma and **expire roughly seven days after they were generated (19 Aug 2026)**. If the
script starts failing, the manifest needs regenerating from the Figma file. Until the
assets are downloaded the site renders with neutral placeholder blocks where the
artwork goes; nothing breaks.

## Routes

| Route | Figma node | Frame |
|---|---|---|
| `/` | `49:1939` | amar-para-homepage - final |
| `/participate` | `95:4` | submit-your-gem-final |
| `/submit` | `95:309` | entry-submission-page |
| `/500-gems` | `106:272` | gallery-page-final |

## Structure

```
src/
  app/                 route entries, one per Figma frame
  components/site/     shared navbar + footer
  components/ui/       Button3D, CategoryTag, SectionHeading, Asset, icons
  components/home/     homepage sections (Hero, ExploreGems, StoriesFromParas, …)
  components/gems/     GemsDiscovered directory block, SubmissionForm
  data/site.ts         all copy and card content lifted from the design
  lib/assets.ts        typed map of every image path
```

Each component carries a comment naming the Figma node it implements, so a design
change can be traced back to the exact frame.

## Design tokens

Colours, type families and layout constants live in the `@theme` block of
`src/app/globals.css` and are used as Tailwind utilities (`bg-pink`, `text-navy`,
`font-display`). Nothing is hardcoded as a hex value in a component.

## Known deviations from the Figma

These are deliberate. Each one is a place where following the file literally would have
produced worse code, not better fidelity.

1. **Hero collage.** The hero frame (`49:1944`) is a single flattened raster: headline,
   editorial caption, navbar and collage are all one PNG. The left-hand column has been
   rebuilt as real text so it is selectable, translatable and indexable. The collage on
   the right is that PNG, cropped to exclude the baked-in navbar and headline. The crop
   rectangle is `COLLAGE_CROP` in `src/components/home/Hero.tsx`. If a clean export of
   just the collage becomes available, drop it in and remove the crop.
2. **Shared navbar.** The four frames carry three different navbars. The one from the
   submission page (`95:310`) is used everywhere, since it is the most complete.
3. **First gem card.** The first card in the homepage carousel has no image in Figma,
   which reads as an oversight rather than an intent. It has been given one.
4. **UI icons.** Chevrons, arrows, the map pin, the upload cloud and the social glyphs
   are drawn inline as SVG. Every piece of *artwork* — logos, collage, photography,
   illustrated accents — comes from the Figma export.
5. **Desktop first.** The Figma has 1440px frames only. Layouts are locked to that
   width; tablet and mobile breakpoints are the next pass.

## Not yet wired

- The submission form is client-side only. It needs an API route, validation, file
  upload to storage and OTP login before it can accept real entries.
- Carousels move by scroll position; there is no data layer behind them yet.
- `/about`, `/faqs`, `/exhibitions`, `/contact`, `/privacy`, `/terms` are linked in the
  nav and footer but have no pages.
