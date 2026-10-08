/* node --experimental-strip-types src/lib/coalesce.test.ts */
import assert from "node:assert/strict";
import { coalesce } from "./coalesce.ts";

// A burst of calls during one run collapses into exactly one follow-up run.
{
  let runs = 0;
  let active = 0;
  let maxActive = 0;
  const trigger = coalesce(async () => {
    runs++;
    maxActive = Math.max(maxActive, ++active);
    await new Promise((r) => setTimeout(r, 20));
    active--;
  }, () => {});
  const calls = [trigger(), trigger(), trigger(), trigger()];
  await Promise.all(calls);
  assert.equal(runs, 2);
  assert.equal(maxActive, 1, "runs never overlap");

  // Idle again: the next call starts a fresh run.
  await trigger();
  assert.equal(runs, 3);
}

// A failing run reports the error and does not wedge the queue.
{
  const errors: unknown[] = [];
  let first = true;
  let runs = 0;
  const trigger = coalesce(async () => {
    runs++;
    if (first) {
      first = false;
      throw new Error("boom");
    }
  }, (e) => errors.push(e));
  await trigger();
  await trigger();
  assert.equal(errors.length, 1);
  assert.equal(runs, 2);
}

console.log("coalesce: ok");
