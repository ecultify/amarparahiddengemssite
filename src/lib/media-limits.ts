/**
 * The one place upload sizes are decided. The browser checks against these
 * before encoding, the API enforces them again on the way in, and the copy
 * shown to people is generated from them, so the three can never drift.
 *
 * The old 7MB ceiling was Upstash Redis and Vercel's request cap. Media now
 * lives in Postgres on our own box, where the limits are the disk (93GB free)
 * and the memory a served file occupies, so these are set for what a phone
 * actually produces rather than what a hosted store would take.
 */
const MB = 1024 * 1024;

export const MAX_IMAGE_BYTES = 25 * MB;
export const MAX_VIDEO_BYTES = 64 * MB;

/** Base64 inflates by 4/3. The API caps the encoded length, so convert. */
export const base64CharsFor = (bytes: number) => Math.ceil(bytes / 3) * 4;

export const asMB = (bytes: number) => `${Math.round(bytes / MB)} MB`;

export const limitFor = (contentType: string) =>
  contentType.startsWith("video") ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
