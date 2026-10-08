/* node scripts/dedash.test.mjs */
import assert from "node:assert/strict";
import { dedash, dedashDeep, countDashes } from "./dedash.mjs";

// Spacing is normalised whichever side the dash was crowded on.
assert.equal(dedash("a — b"), "a - b");
assert.equal(dedash("New Jersey— yet"), "New Jersey - yet");
assert.equal(dedash("soil —was opened"), "soil - was opened");
assert.equal(dedash("College Square—an emergence"), "College Square - an emergence");
assert.equal(dedash("rating– one"), "rating - one");

// A quote attribution stays flush left instead of gaining an indent.
assert.equal(dedash("— Bhaskar Chitrakar, Kalighat"), "- Bhaskar Chitrakar, Kalighat");

// Newlines survive: only spaces and tabs beside the dash are absorbed.
assert.equal(dedash("one\n— two"), "one\n- two");

// HTML entities for the same glyphs are caught too, and counted.
assert.equal(dedash("Mumbai &ndash; 400 001"), "Mumbai - 400 001");
assert.equal(dedash("a &mdash; b"), "a - b");
assert.equal(dedash("a &#8212; b"), "a - b");
assert.equal(countDashes("x &ndash; y — z"), 2);

// Plain hyphens and minus signs are left alone.
assert.equal(dedash("post-partition, 1947-48"), "post-partition, 1947-48");

// HTML keeps its tags; only the dash between them moves.
assert.equal(dedash("<p>a—b</p>"), "<p>a - b</p>");

// Nothing this module targets survives a pass, at any depth.
const messy = { a: "x — y", b: ["p–q", { c: "— r" }], n: 7, z: null };
const clean = dedashDeep(messy);
assert.equal(countDashes(JSON.stringify(clean)), 0);
assert.deepEqual(clean, { a: "x - y", b: ["p - q", { c: "- r" }], n: 7, z: null });

// Idempotent: running it twice changes nothing further.
assert.deepEqual(dedashDeep(clean), clean);

console.log("dedash: ok");
