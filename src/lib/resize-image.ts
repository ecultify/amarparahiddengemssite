const MAX_EDGE = 1600;
const QUALITY = 0.85;

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
    const scale = MAX_EDGE / Math.max(bitmap.width, bitmap.height);
    if (scale >= 1) {
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
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: blob.type });
  } catch {
    return file;
  }
}
