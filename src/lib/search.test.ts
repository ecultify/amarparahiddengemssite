/* node --experimental-strip-types src/lib/search.test.ts */
import assert from "node:assert/strict";
import { search, searchScore } from "./search.ts";

const rows = [
  { name: "Rahul Sen", phone: "919830012345", para: "Bowbazar", title: "Old tram depot" },
  { name: "Priya Das", phone: "+91 98311 55555", para: "Park Street", title: "Rahul's tea stall" },
  { name: "Ankit", phone: "9007000000", para: "Kumartuli", title: "Idol makers" },
];
const fields = (r: (typeof rows)[number]) => [
  { text: r.name, weight: 3 },
  { text: r.phone, phone: true },
  { text: r.para, weight: 2 },
  { text: r.title },
];
const find = (q: string) => search(rows, q, fields).map((r) => r.name);

// Empty query keeps everything in order.
assert.deepEqual(find("  "), ["Rahul Sen", "Priya Das", "Ankit"]);
// A name hit outranks the same word in someone else's title.
assert.deepEqual(find("rahul"), ["Rahul Sen", "Priya Das"]);
// Every word has to match somewhere.
assert.deepEqual(find("rahul bowbazar"), ["Rahul Sen"]);
// Prefix, spaces dropped, typos, case.
assert.deepEqual(find("kumar"), ["Ankit"]);
assert.deepEqual(find("parkstreet"), ["Priya Das"]);
assert.deepEqual(find("BOWBAZAAR"), ["Rahul Sen"]);
assert.deepEqual(find("kumertuli"), ["Ankit"]);
// Phone numbers in any shape.
assert.deepEqual(find("+91 98300 12345"), ["Rahul Sen"]);
assert.deepEqual(find("09831155555"), ["Priya Das"]);
assert.deepEqual(find("12345"), ["Rahul Sen"]);
assert.deepEqual(find("9007"), ["Ankit"]);
// Short words get no typo slack, so "park" does not pull in "para".
assert.equal(searchScore("park", [{ text: "Amar para" }]), 0);
assert.deepEqual(find("nobody"), []);
