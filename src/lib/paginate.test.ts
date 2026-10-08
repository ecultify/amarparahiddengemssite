/* node --experimental-strip-types src/lib/paginate.test.ts */
import assert from "node:assert/strict";
import { pageList } from "./paginate.ts";

// Short lists render every page, no ellipsis.
assert.deepEqual(pageList(1, 1), [1]);
assert.deepEqual(pageList(2, 3), [1, 2, 3]);
assert.deepEqual(pageList(4, 7), [1, 2, 3, 4, 5, 6, 7]);

// Long lists keep first, last and a window round the current page.
assert.deepEqual(pageList(1, 10), [1, 2, "gap", 10]);
assert.deepEqual(pageList(2, 10), [1, 2, 3, "gap", 10]);
assert.deepEqual(pageList(5, 10), [1, "gap", 4, 5, 6, "gap", 10]);
assert.deepEqual(pageList(9, 10), [1, "gap", 8, 9, 10]);
assert.deepEqual(pageList(10, 10), [1, "gap", 9, 10]);

// No page is ever listed twice, and the order always climbs.
for (let last = 1; last <= 40; last++) {
  for (let current = 1; current <= last; current++) {
    const nums = pageList(current, last).filter((n): n is number => n !== "gap");
    assert.equal(new Set(nums).size, nums.length, `duplicate page at ${current}/${last}`);
    assert.deepEqual([...nums].sort((a, b) => a - b), nums, `out of order at ${current}/${last}`);
    assert.ok(nums.includes(current), `current page missing at ${current}/${last}`);
    assert.equal(nums[0], 1);
    assert.equal(nums[nums.length - 1], last);
  }
}

console.log("paginate: ok");

// paginate(): clamps a bad page and hands back exactly one page of rows.
import { paginate } from "./paginate.ts";
const rows = Array.from({ length: 54 }, (_, i) => i + 1);
assert.deepEqual(paginate(rows, 1, 20), { page: 1, pageCount: 3, slice: rows.slice(0, 20) });
assert.deepEqual(paginate(rows, 3, 20).slice, rows.slice(40, 54));
// Past the end (a stale ?page= after a filter shrank the list) lands on the last page.
assert.equal(paginate(rows, 99, 20).page, 3);
// Zero, negative or NaN input lands on page 1 rather than slicing nothing.
assert.equal(paginate(rows, 0, 20).page, 1);
assert.equal(paginate(rows, -4, 20).page, 1);
assert.equal(paginate(rows, Number.NaN, 20).page, 1);
assert.equal(paginate(rows, 2.7, 20).page, 2);
// An empty list is one empty page, so the pager knows to hide itself.
assert.deepEqual(paginate([], 1, 20), { page: 1, pageCount: 1, slice: [] });
console.log("paginate(): ok");
