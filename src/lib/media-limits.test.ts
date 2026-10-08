/* node --experimental-strip-types src/lib/media-limits.test.ts */
import assert from "node:assert/strict";
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, base64CharsFor, asMB, limitFor } from "./media-limits.ts";

// The encoded cap must never be smaller than what a file at the limit encodes
// to, or a file the browser accepted would be rejected by the API.
for (const bytes of [1, 2, 3, 4, 100, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES]) {
  const encoded = Math.ceil(bytes / 3) * 4; // what btoa actually produces, padded
  assert.ok(base64CharsFor(bytes) >= encoded, `${bytes} bytes under-budgeted`);
}

// Video is the larger allowance, and both are stated in whole MB.
assert.ok(MAX_VIDEO_BYTES > MAX_IMAGE_BYTES);
assert.equal(asMB(MAX_VIDEO_BYTES), "64 MB");
assert.equal(asMB(MAX_IMAGE_BYTES), "25 MB");

// Every type the API allows routes to the right ceiling.
assert.equal(limitFor("video/mp4"), MAX_VIDEO_BYTES);
assert.equal(limitFor("video/quicktime"), MAX_VIDEO_BYTES);
assert.equal(limitFor("image/jpeg"), MAX_IMAGE_BYTES);
assert.equal(limitFor("image/heic"), MAX_IMAGE_BYTES);

console.log("media-limits: ok");
