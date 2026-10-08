/* node --experimental-strip-types src/lib/rail-columns.test.ts */
import assert from "node:assert/strict";
import { columns } from "./rail-columns.ts";

const photo = (title: string) => ({ title, image: `/${title}.jpg`, category: "", location: "" });
const tale = (title: string) => ({ title, image: "", category: "", location: "" });
const shape = (cols: { title: string }[][]) => cols.map((c) => c.map((g) => g.title).join("+"));

// Balanced list: text pair, photo, text pair, photo, all the way round —
// and the input order is not what decides it.
const live = [tale("T1"), tale("T2"), photo("P1"), tale("T3"), tale("T4"), photo("P2")];
assert.deepEqual(shape(columns(live)), ["T1+T2", "P1", "T3+T4", "P2"]);
assert.deepEqual(shape(columns([photo("P1"), photo("P2"), tale("T1"), tale("T2"), tale("T3"), tale("T4")])),
  ["T1+T2", "P1", "T3+T4", "P2"], "starts with text whatever the editor's order");

// Whichever kind runs out first, the other carries on at the end.
assert.deepEqual(shape(columns([photo("P1"), photo("P2"), photo("P3"), tale("T1"), tale("T2")])), ["T1+T2", "P1", "P2", "P3"]);
assert.deepEqual(shape(columns([tale("T1"), tale("T2"), tale("T3"), tale("T4"), photo("P1")])), ["T1+T2", "P1", "T3+T4"]);

// An odd tale stands alone rather than being dropped.
assert.deepEqual(shape(columns([tale("T1"), tale("T2"), tale("T3"), photo("P1")])), ["T1+T2", "P1", "T3"]);

// Nothing lost, nothing duplicated, whatever the mix.
for (const list of [live, [], [photo("P1")], [tale("T1")], [tale("T1"), tale("T2"), tale("T3"), tale("T4"), tale("T5")]]) {
  const flat = columns(list).flat().map((g) => g.title);
  assert.deepEqual([...flat].sort(), list.map((g) => g.title).sort());
  assert.ok(columns(list).every((c) => c.length <= 2), "never more than two per column");
  assert.ok(columns(list).every((c) => c.length === 1 || c.every((g) => !g.image)), "photos never stack");
}

console.log("rail-columns: ok");
