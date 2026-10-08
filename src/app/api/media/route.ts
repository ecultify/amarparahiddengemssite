import { NextResponse } from "next/server";
import { appendRaw, delRaw, setRaw, writeJson } from "@/lib/blob-store";
import { asMB, base64CharsFor, limitFor } from "@/lib/media-limits";

/**
 * Chunked media upload into Postgres. The browser sends base64 chunks small
 * enough to clear nginx's body cap; the append rebuilds the file server-side.
 * Public route (the visitor form uploads through it), so every input is
 * validated here: type whitelist, chunk shape, and a hard total-size cap
 * enforced on the running length the append returns.
 */

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  // iPhones hand these over straight from the camera roll.
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
];
// Chunks stay well under nginx's 25MB client_max_body_size, JSON envelope
// and all. The per-file ceiling comes from media-limits, by type.
const MAX_CHUNK_CHARS = 4_000_000;

type Body = {
  id?: string;
  index: number;
  last: boolean;
  chunk: string;
  contentType: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { index, last, chunk, contentType } = body;
  if (!ALLOWED.includes(contentType)) {
    return NextResponse.json({ error: "That file type isn't supported." }, { status: 415 });
  }
  if (typeof chunk !== "string" || chunk.length === 0 || chunk.length > MAX_CHUNK_CHARS) {
    return NextResponse.json({ error: "Bad chunk" }, { status: 400 });
  }

  const id =
    index === 0
      ? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
      : body.id;
  if (!id || !/^[a-z0-9-]{6,40}$/.test(id)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  const key = `media/${id}`;
  try {
    const limit = limitFor(contentType);
    const length = index === 0 ? (await setRaw(key, chunk), chunk.length) : await appendRaw(key, chunk);
    if (length > base64CharsFor(limit)) {
      await delRaw(key);
      return NextResponse.json(
        { error: `That file is over the ${asMB(limit)} limit.` },
        { status: 413 },
      );
    }
    if (last) await writeJson(`${key}.meta`, { contentType });
    return NextResponse.json({ id, url: last ? `/api/media/${id}` : undefined });
  } catch {
    return NextResponse.json({ error: "Storage is unreachable. Try again." }, { status: 503 });
  }
}
