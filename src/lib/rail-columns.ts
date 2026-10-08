import type { Gem } from "@/data/site";

/**
 * Rail columns, strictly alternating: two text cards stacked, then a photo,
 * then two text cards, and so on. A text card has no image, so alone it sits
 * 40% empty against a photo card; two of them fill the same height.
 *
 * Within each kind the editor's order is kept: tales pair up in sequence,
 * photos stay in sequence, and the two runs are zipped together starting with
 * a text column. Whichever run is longer just carries on at the end, and an
 * odd tale stands alone at full height rather than being dropped.
 */
export function columns(gems: Gem[]): Gem[][] {
  const photos = gems.filter((g) => g.image).map((g) => [g]);
  const tales = gems.filter((g) => !g.image);
  const pairs: Gem[][] = [];
  for (let i = 0; i < tales.length; i += 2) pairs.push(tales.slice(i, i + 2));

  const out: Gem[][] = [];
  for (let i = 0; i < Math.max(pairs.length, photos.length); i++) {
    if (pairs[i]) out.push(pairs[i]);
    if (photos[i]) out.push(photos[i]);
  }
  return out;
}
