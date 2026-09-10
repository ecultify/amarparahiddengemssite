import { Redis } from "@upstash/redis";
import { del, list, put } from "@vercel/blob";
import {
  hasPostgres,
  pgAppendRaw,
  pgDelRaw,
  pgGetRaw,
  pgReadJson,
  pgReadJsonCollection,
  pgRemove,
  pgSetRaw,
  pgWriteJson,
} from "@/lib/pg-store";

/**
 * The only place that knows where JSON documents live. Postgres on our own
 * box holds everything now — content, submissions, quiz users, and the media
 * uploads as base64 — keyed by the same pathnames every earlier store used,
 * so the rest of the app never changed.
 *
 * The two older backends stay behind it as fallbacks, in the order they were
 * added: Upstash Redis when there is no DATABASE_URL, and Vercel Blob when
 * there are no Redis credentials either (a fresh clone without
 * `vercel env pull`). Which one answers depends only on which env vars exist.
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
    if (hasPostgres()) return await pgReadJson<T>(pathname);
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
  if (hasPostgres()) {
    await pgWriteJson(pathname, value);
    return;
  }
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
    if (hasPostgres()) return await pgReadJsonCollection<T>(prefix);
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
  if (hasPostgres()) {
    await pgRemove(pathname);
    return;
  }
  if (redis) {
    await redis.del(pathname);
    return;
  }
  const url = blobUrlFor(pathname);
  if (url) await del(url);
}

/* ---- Raw string storage for media ----
 * Uploads are base64 strings built up chunk by chunk, so a video arrives in
 * pieces that each stay under the request cap. These bypass the JSON layer on
 * purpose: a 9MB base64 string has no business sitting in a memo map.
 * On Postgres the ceiling is the disk; on Redis it was 256MB for the whole
 * store, roughly 25 full-size videos. */

function requireRedis() {
  if (!redis) throw new Error("Media storage needs the database (DATABASE_URL or KV env vars).");
  return redis;
}

/** Overwrites the key with the first chunk. */
export const setRaw = (key: string, chunk: string) =>
  hasPostgres() ? pgSetRaw(key, chunk) : requireRedis().set(key, chunk);

/** Appends a chunk; resolves to the new total length. */
export const appendRaw = (key: string, chunk: string): Promise<number> =>
  hasPostgres() ? pgAppendRaw(key, chunk) : requireRedis().append(key, chunk);

export const getRaw = (key: string): Promise<string | null> =>
  hasPostgres() ? pgGetRaw(key) : requireRedis().get<string>(key);

export const delRaw = (key: string) =>
  hasPostgres() ? pgDelRaw(key) : requireRedis().del(key);
