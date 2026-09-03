import { downscaleImage } from "@/lib/resize-image";

/**
 * Browser-side media upload into the site's database. Images are downscaled
 * to web size first; everything is base64-encoded and sent in chunks small
 * enough for the platform's request caps, then served back from
 * /api/media/<id>. Videos are capped at 7MB — the store's hard ceiling.
 */

export const MAX_VIDEO_BYTES = 7 * 1024 * 1024;
const CHUNK_CHARS = 3_000_000;

const HEIC = /heic|heif/i;

export async function uploadMedia(file: File): Promise<{ url: string; type: "image" | "video" }> {
  const isVideo = file.type.startsWith("video");
  const prepared = isVideo ? file : await downscaleImage(file);

  // Safari decodes HEIC, so downscaleImage turns it into WebP there. Browsers
  // that cannot decode it would upload a file nothing can display, so ask for
  // a JPEG instead rather than storing something the desk cannot open.
  if (!isVideo && (HEIC.test(prepared.type) || HEIC.test(prepared.name))) {
    throw new Error(
      "This device can't read that HEIC photo. Set the camera to Most Compatible, or pick a JPEG.",
    );
  }

  if (isVideo && prepared.size > MAX_VIDEO_BYTES) {
    throw new Error("Videos can be up to 7 MB. Trim it or upload a photo instead.");
  }

  const base64 = await toBase64(prepared);
  const chunks: string[] = [];
  for (let offset = 0; offset < base64.length; offset += CHUNK_CHARS) {
    chunks.push(base64.slice(offset, offset + CHUNK_CHARS));
  }

  let id: string | undefined;
  let url: string | undefined;
  for (let index = 0; index < chunks.length; index += 1) {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        index,
        last: index === chunks.length - 1,
        chunk: chunks[index],
        contentType: prepared.type,
      }),
    });
    const data = (await res.json()) as { id?: string; url?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Upload failed.");
    id = data.id;
    url = data.url;
  }

  if (!url) throw new Error("Upload failed.");
  return { url, type: isVideo ? "video" : "image" };
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
