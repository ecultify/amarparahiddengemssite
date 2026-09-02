import { getRaw, readJson } from "@/lib/blob-store";

/** Serves a stored media file. Streamed (a video can exceed the buffered
 *  response cap) and immutable-cached, so the CDN absorbs repeat views and
 *  Redis is only read on a cold edge. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9-]{6,40}$/.test(id)) return new Response("Not found", { status: 404 });

  const [meta, data] = await Promise.all([
    readJson<{ contentType: string }>(`media/${id}.meta`),
    getRaw(`media/${id}`),
  ]);
  if (!meta || !data) return new Response("Not found", { status: 404 });

  const buffer = Buffer.from(data, "base64");
  const stream = new ReadableStream({
    start(controller) {
      const step = 1024 * 1024;
      for (let offset = 0; offset < buffer.length; offset += step) {
        controller.enqueue(buffer.subarray(offset, offset + step));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": meta.contentType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
