/* Em and en dashes read as machine-written. This turns every one of them into
   a plain spaced hyphen, leaving the words themselves alone.

   Only horizontal spaces are absorbed, never newlines, so multi-line copy and
   article HTML keep their shape. A dash that opens a string (a quote
   attribution, "— Bhaskar Chitrakar") keeps its position, minus the indent. */
// The literal characters, plus the HTML entities that article bodies and
// hand-written markup use for the same glyphs.
const ENTITY = /&(?:mdash|ndash|#8212|#8211|#x201[34]);/gi;
const DASH = /[ \t]*[—–―‒][ \t]*/g;

export const dedash = (text) =>
  // The second pass un-indents a dash that opens the string or a line, which
  // the first pass would otherwise push right by one space.
  text
    .replace(ENTITY, "—")
    .replace(DASH, " - ")
    .replace(/(^|\n) - /g, "$1- ");

/** Walk any JSON value, rewriting every string it holds. */
export function dedashDeep(value) {
  if (typeof value === "string") return dedash(value);
  if (Array.isArray(value)) return value.map(dedashDeep);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, dedashDeep(v)]));
  return value;
}

/** Every dash this module targets, for callers that want to count first. */
export const countDashes = (text) =>
  (text.match(/[—–―‒]/g) ?? []).length + (text.match(ENTITY) ?? []).length;
