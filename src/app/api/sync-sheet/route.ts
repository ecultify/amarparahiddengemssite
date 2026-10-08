import { syncSheet } from "@/lib/sheet-sync";

/** Hit by the VPS cron once a day (see scripts/deploy-vps.sh). The bearer
 *  secret keeps strangers from making the app hammer ME-QR and Sheets. */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    return Response.json(await syncSheet());
  } catch (error) {
    console.error("[sync-sheet]", error);
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
