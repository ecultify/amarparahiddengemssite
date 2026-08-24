import { del, list, put } from "@vercel/blob";

/**
 * Thin wrapper over Vercel Blob — the only place that knows where bytes live.
 * Swapping in a database later means reimplementing these five functions.
 */

async function urlFor(pathname: string) {
  const { blobs } = await list({ prefix: pathname, limit: 100 });
  return blobs.find((blob) => blob.pathname === pathname)?.url ?? null;
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const url = await urlFor(pathname);
    if (!url) return null;
    const res = await fetch(url, { cache: "no-store" });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    // No token / store not reachable: callers fall back to their defaults.
    return null;
  }
}

export async function writeJson(pathname: string, value: unknown) {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Every JSON blob under a prefix, newest pathname first. */
export async function readJsonCollection<T>(prefix: string): Promise<T[]> {
  try {
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
  const url = await urlFor(pathname);
  if (url) await del(url);
}
