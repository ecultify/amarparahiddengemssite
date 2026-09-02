import { NextResponse } from "next/server";
import { appendRaw, delRaw, setRaw, writeJson } from "@/lib/blob-store";

/**
 * Chunked media upload into Redis. The browser sends base64 chunks small
 * enough for Vercel's 4.5MB request cap; Redis APPEND rebuilds the file.
 * Public route (the visitor form uploads through it), so every input is
 * validated here: type whitelist, chunk shape, and a hard total-size cap
 * enforced on APPEND's returned length.
 */

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime"];
// 7MB of raw media is ~9.4MB of base64, just under the store's request cap.
const MAX_BASE64_CHARS = 9_800_000;
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
    const length = index === 0 ? (await setRaw(key, chunk), chunk.length) : await appendRaw(key, chunk);
    if (length > MAX_BASE64_CHARS) {
      await delRaw(key);
      return NextResponse.json({ error: "That file is over the 7 MB limit." }, { status: 413 });
    }
    if (last) await writeJson(`${key}.meta`, { contentType });
    return NextResponse.json({ id, url: last ? `/api/media/${id}` : undefined });
  } catch {
    return NextResponse.json({ error: "Storage is unreachable. Try again." }, { status: 503 });
  }
}
