import { Redis } from "@upstash/redis";
import { del, list, put } from "@vercel/blob";

/**
 * The only place that knows where JSON documents live. Content and
 * submissions are stored in Upstash Redis (sub-ms reads and writes, generous
 * free tier), keyed by the same pathnames the blob store used, so the rest of
 * the app never changed. When the Redis env vars are absent (a fresh clone
 * without `vercel env pull`), everything falls back to the old Vercel Blob
 * JSON storage. Media files (photo/video uploads) still live in Vercel Blob
 * either way — that part is /api/upload's job, not this file's.
 */

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null;

/* ---- Blob fallback plumbing ---- */

/** vercel_blob_rw_<storeId>_<secret> -> https://<storeid>.public.blob... */
function blobBaseUrl() {
  const storeId = (process.env.BLOB_READ_WRITE_TOKEN ?? "").split("_")[3];
  return storeId ? `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

const blobUrlFor = (pathname: string) => {
  const base = blobBaseUrl();
  return base ? `${base}/${pathname}` : null;
};

/* ---- The storage API ---- */

export async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    if (redis) return await redis.get<T>(pathname);
    const url = blobUrlFor(pathname);
    if (!url) return null;
    const res = await fetch(url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    // Store unreachable: callers fall back to their defaults.
    return null;
  }
}

export async function writeJson(pathname: string, value: unknown) {
  if (redis) {
    await redis.set(pathname, value);
    return;
  }
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Every JSON document under a prefix, newest pathname first.
 *  ponytail: KEYS is an O(keyspace) scan — fine for a few hundred
 *  submissions; move to an index set if the inbox ever gets huge. */
export async function readJsonCollection<T>(prefix: string): Promise<T[]> {
  try {
    if (redis) {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length === 0) return [];
      keys.sort((a, b) => b.localeCompare(a));
      const items = await redis.mget<(T | null)[]>(...keys);
      return items.filter((item): item is T => item !== null);
    }
    const { blobs } = await list({ prefix });
    const ordered = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
    const items = await Promise.all(
      ordered.map(async (blob): Promise<T | null> => {
        const res = await fetch(blob.url, { cache: "no-store" });
        return res.ok ? ((await res.json()) as T) : null;
      }),
    );
    return items.filter((item) => item !== null);
  } catch {
    return [];
  }
}

export async function removeBlob(pathname: string) {
  if (redis) {
    await redis.del(pathname);
    return;
  }
  const url = blobUrlFor(pathname);
  if (url) await del(url);
}
