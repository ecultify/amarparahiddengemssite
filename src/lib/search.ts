/**
 * Forgiving search for the admin lists. A query is split into words and every
 * word has to land somewhere in the record: "rahul bowbazar" finds Rahul's
 * Bowbazar gem. A word matches a field exactly, by prefix, inside it, with the
 * field's spaces dropped ("parkstreet"), or with a typo or two ("bowbazaar").
 * A query that is mostly digits is read as a phone number, so "+91 98300 12345",
 * "098300-12345" and "12345" all find the same person.
 */

/** A searchable field and how much a hit in it counts. */
export type Field = { text?: string | null; weight?: number; phone?: boolean };

const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const words = (s: string): string[] => fold(s).match(/[\p{L}\p{N}]+/gu) ?? [];

const digits = (s: string) => s.replace(/\D/g, "");

/** Drop a leading 0 or 91 so a number typed any Indian way lines up. */
const localNumber = (d: string) =>
  d.length > 10 && d.startsWith("91") ? d.slice(2) : d.length === 11 && d.startsWith("0") ? d.slice(1) : d;

/** Edit distance, stopping early once it can no longer be within `max`. */
function within(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    if (Math.min(...row) > max) return false;
    prev = row;
  }
  return prev[b.length] <= max;
}

/** How well one query word matches one field's text: 0 is no match. */
function wordScore(word: string, text: string) {
  const parts = words(text);
  if (parts.includes(word)) return 4;
  if (parts.some((p) => p.startsWith(word))) return 3;
  if (parts.join("").includes(word)) return 2;
  // Typos only for words long enough that a slip is not a different word.
  const slack = word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0;
  if (slack && parts.some((p) => within(word, p, slack) || within(word, p.slice(0, word.length), slack)))
    return 1;
  return 0;
}

/** A relevance score for the record, or 0 when the query does not match. */
export function searchScore(query: string, fields: Field[]) {
  const q = query.trim();
  if (!q) return 1;

  // Mostly digits: a phone number, matched on digits alone.
  const d = digits(q);
  if (d.length >= 3 && d.length >= q.replace(/\s/g, "").length - 1) {
    const want = localNumber(d);
    let best = 0;
    for (const f of fields) {
      if (!f.text) continue;
      const have = f.phone ? localNumber(digits(f.text)) : digits(f.text);
      if (!have) continue;
      const hit = have === want ? 4 : have.endsWith(want) || have.startsWith(want) ? 3 : have.includes(want) ? 2 : 0;
      // A number inside a title or description counts for less than the phone.
      best = Math.max(best, hit * (f.phone ? 3 : 1));
    }
    if (best) return best;
  }

  let total = 0;
  for (const word of words(q)) {
    let best = 0;
    for (const f of fields) {
      if (f.text) best = Math.max(best, wordScore(word, f.text) * (f.weight ?? 1));
    }
    if (!best) return 0;
    total += best;
  }
  return total;
}

/** The rows that match, best first; ties keep their original order. */
export function search<T>(rows: T[], query: string, fields: (row: T) => Field[]) {
  if (!query.trim()) return rows;
  return rows
    .map((row, index) => ({ row, index, score: searchScore(query, fields(row)) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((hit) => hit.row);
}
