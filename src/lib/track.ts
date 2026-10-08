/**
 * The site's analytics events, pushed to the GTM dataLayer. Names and
 * parameters match the triggers set up in the GTM container — change one,
 * change the other. Safe to call anywhere: a no-op on the server or when no
 * tag has loaded yet (GTM reads the array it finds when it starts).
 */
export type TrackEvent =
  | { event: "gem_form_started" }
  | { event: "gem_form_step2"; category: string; para: string }
  | { event: "otp_requested" }
  | { event: "otp_verified"; source: "submit" | "quiz"; event_id?: string }
  | {
      event: "gem_submitted";
      category: string;
      para: string;
      has_upload: boolean;
      event_id?: string;
      /** Plain text on purpose: GTM's User-Provided Data variable hashes it
       *  in the browser before it goes to Google Ads. Only this event. */
      user_data?: { phone_number: string; first_name: string };
    }
  | { event: "quiz_played"; correct: boolean }
  | { event: "outbound_click"; link_url: string; link_text: string }
  | { event: "video_play"; video_title: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Conversions carry the server's event_id so Meta can dedupe the pixel hit
 *  against the Conversions API one. GA4 doesn't dedupe, so the same id is
 *  never pushed twice here: not by StrictMode's double effect, not by a
 *  back-navigation replay (sessionStorage outlives the page). */
const pushed = new Set<string>();
function seen(id: string) {
  const key = `tracked:${id}`;
  let hit = pushed.has(id);
  try {
    hit ||= sessionStorage.getItem(key) !== null;
    sessionStorage.setItem(key, "1");
  } catch {}
  pushed.add(id);
  return hit;
}

export function track(data: TrackEvent) {
  if (typeof window === "undefined") return;
  if ("event_id" in data && data.event_id && seen(data.event_id)) return;
  (window.dataLayer ??= []).push(data);
}
