import assert from "node:assert/strict";
import { test } from "node:test";
import { withHeadingIds } from "./article-toc.ts";

test("h2s get slug ids, repeats are suffixed, other tags untouched", () => {
  const { html, sections } = withHeadingIds(
    '<p>x</p><h2>Meet you for adda</h2><h3>sub</h3><h2 class="a"><em>Meet</em> you for adda</h2>',
  );
  assert.deepEqual(sections, [
    { id: "meet-you-for-adda", text: "Meet you for adda" },
    { id: "meet-you-for-adda-2", text: "Meet you for adda" },
  ]);
  assert.equal(
    html,
    '<p>x</p><h2 id="meet-you-for-adda">Meet you for adda</h2><h3>sub</h3><h2 id="meet-you-for-adda-2" class="a"><em>Meet</em> you for adda</h2>',
  );
});

test("entities in headings are decoded for the TOC text", () => {
  const { sections } = withHeadingIds("<h2>Durga Puja &amp; Jhulan</h2>");
  assert.deepEqual(sections, [{ id: "durga-puja-jhulan", text: "Durga Puja & Jhulan" }]);
});
