import crypto from "node:crypto";

/**
 * Meta Conversions API: the server-side twin of the pixel events GTM fires
 * in the browser. Both sides send the same event_name + event_id, so Meta
 * counts the conversion once even when an ad blocker or in-app browser
 * swallowed the pixel. Only Lead (gem_submitted) and CompleteRegistration
 * (otp_verified) go this way. Never throws: a slow or dead Meta API must not
 * fail the visitor's request.
 */
const PIXEL_ID = process.env.META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
/** Debug only: routes every event to Events Manager > Test events, where it
 *  does NOT count as a conversion. Set it, deploy, test, unset, redeploy. */
const TEST_CODE = process.env.META_TEST_EVENT_CODE;
const ENDPOINT = `https://graph.facebook.com/v26.0/${PIXEL_ID}/events`;

const sha = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

/** Meta wants digits with the country code and no "+": 98xxxxxxxx -> 9198xxxxxxxx. */
function hashPhoneIN(raw?: string | null) {
  if (!raw) return undefined;
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = "91" + d;
  return sha(d);
}

export async function sendMetaEvent(params: {
  /** The incoming request's headers (`await headers()` in a server action). */
  headers: Headers;
  eventName: "Lead" | "CompleteRegistration";
  eventId: string;
  eventSourceUrl: string;
  phone?: string;
  firstName?: string;
  externalId?: string;
  customData?: Record<string, unknown>;
}) {
  if (!PIXEL_ID || !TOKEN) return;

  const h = params.headers;
  const cookie = h.get("cookie") ?? "";
  const pick = (k: string) =>
    cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(k + "="))
      ?.split("=")
      .slice(1)
      .join("=");

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        event_source_url: params.eventSourceUrl,
        action_source: "website",
        user_data: {
          ph: params.phone ? [hashPhoneIN(params.phone)] : undefined,
          fn: params.firstName ? [sha(params.firstName.replace(/[^a-z]/gi, ""))] : undefined,
          external_id: params.externalId ? [sha(params.externalId)] : undefined,
          fbp: pick("_fbp"),
          fbc: pick("_fbc"),
          // nginx sets X-Real-IP from the socket; X-Forwarded-For is the fallback.
          client_ip_address: h.get("x-real-ip") ?? (h.get("x-forwarded-for") ?? "").split(",")[0].trim() ?? undefined,
          client_user_agent: h.get("user-agent") ?? undefined,
        },
        custom_data: params.customData,
      },
    ],
  };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  try {
    const res = await fetch(`${ENDPOINT}?access_token=${TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) console.error("[meta-capi]", params.eventName, res.status, await res.text());
  } catch (e) {
    console.error("[meta-capi] network", params.eventName, e);
  }
}
