const MAX_EDGE = 1600;
const QUALITY = 0.85;
/** Past this, re-encode to WebP even if the pixel size is fine. */
const HEAVY_BYTES = 600 * 1024;

/**
 * WordPress-style upload scaling, done in the browser: images larger than
 * 1600px on their longest edge are drawn down onto a canvas and re-encoded as
 * WebP before upload, so a 12MP phone photo doesn't land on the page at full
 * resolution. Videos and small images pass through untouched, as does
 * anything a browser can't decode.
 */
export async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    // Already small and already light: nothing to gain by re-encoding.
    if (scale >= 1 && file.size <= HEAVY_BYTES) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY),
    );
    // Keep whichever is smaller: a PNG screenshot can beat a WebP re-encode.
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: blob.type });
  } catch {
    return file;
  }
}
