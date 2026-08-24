import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];

/**
 * Browsers upload straight to Blob storage — a serverless function body caps
 * out around 4.5MB, so routing a 25MB video through the action would fail.
 * This route only mints a short-lived, constrained token.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        // ponytail: anonymous uploads are constrained by type/size only.
        // Add a rate limit or a captcha here if the form gets abused.
        allowedContentTypes: ALLOWED,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
