/* node --experimental-strip-types src/lib/excerpt.test.ts */
import assert from "node:assert/strict";
import { excerpt } from "./excerpt.ts";
import articles from "../data/articles.json" with { type: "json" };

// Tags go, the words stay.
assert.equal(excerpt("<p>Hello <b>there</b>.</p>"), "Hello there.");
// Entities are decoded rather than shown raw.
assert.equal(excerpt("<p>Tea &amp; mishti&nbsp;here</p>"), "Tea & mishti here");
// Short bodies come back whole, with no ellipsis.
assert.equal(excerpt("<p>Short one.</p>"), "Short one.");
// Empty in, empty out — the caller falls back to undefined.
assert.equal(excerpt(""), "");
assert.equal(excerpt("<p></p>"), "");

// Long bodies are cut on a word boundary, never mid-word, and never leave a
// dangling comma or dash in front of the ellipsis.
const long = excerpt("<p>" + "alpha bravo charlie delta ".repeat(40) + "</p>", 60);
assert.ok(long.endsWith("…"), long);
assert.ok(long.length <= 61, `too long: ${long.length}`);
assert.ok(!/[\s,;:.\-–—]…$/.test(long), `dangling punctuation: ${long}`);
assert.ok(!long.slice(0, -1).endsWith("alph"), "cut mid-word");

// Every real article yields a usable description, with no markup left in it.
for (const a of articles) {
  const d = excerpt(a.html ?? "");
  assert.ok(d.length > 40, `${a.slug}: too short (${d.length})`);
  assert.ok(d.length <= 156, `${a.slug}: too long (${d.length})`);
  assert.ok(!/[<>]/.test(d), `${a.slug}: markup leaked`);
  assert.ok(!/&[a-z]+;|&#\d+;/i.test(d), `${a.slug}: entity leaked`);
}

console.log(`excerpt: ok (${articles.length} articles)`);
