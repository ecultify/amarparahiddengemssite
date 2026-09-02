import { del, list, put } from "@vercel/blob";

/**
 * Thin wrapper over Vercel Blob — the only place that knows where bytes live.
 * Swapping in a database later means reimplementing these five functions.
 *
 * Reads go straight to the blob's public URL instead of calling list() first:
 * everything is written with addRandomSuffix: false, so the URL is
 * deterministic, and list() is a metered "advanced operation" that burned
 * through the free tier's monthly quota when it ran on every page view.
 */

/** vercel_blob_rw_<storeId>_<secret> -> https://<storeid>.public.blob... */
function baseUrl() {
  const storeId = (process.env.BLOB_READ_WRITE_TOKEN ?? "").split("_")[3];
  return storeId ? `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

const urlFor = (pathname: string) => {
  const base = baseUrl();
  return base ? `${base}/${pathname}` : null;
};

export async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const url = urlFor(pathname);
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

/** Every JSON blob under a prefix, newest pathname first. The one reader that
 *  still needs list() — ids under the prefix aren't known in advance. */
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
  const url = urlFor(pathname);
  if (url) await del(url);
}
