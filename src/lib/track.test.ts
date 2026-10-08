import assert from "node:assert/strict";
import test from "node:test";

test("a conversion's event_id is pushed to the dataLayer once", async () => {
  const store = new Map<string, string>();
  Object.assign(globalThis, {
    window: {},
    sessionStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) },
  });
  const { track } = await import("./track.ts");
  const push = () => track({ event: "gem_submitted", category: "Food", para: "Kasba", has_upload: false, event_id: "abc" });
  push();
  push(); // StrictMode double effect / back-nav replay
  track({ event: "gem_form_started" }); // no id: never deduped
  track({ event: "gem_form_started" });
  const layer = (globalThis as unknown as { window: { dataLayer: unknown[] } }).window.dataLayer;
  assert.equal(layer.filter((e) => (e as { event_id?: string }).event_id === "abc").length, 1);
  assert.equal(layer.length, 3);
});
