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
  | { event: "otp_verified"; source: "submit" | "quiz" }
  | { event: "gem_submitted"; category: string; para: string; has_upload: boolean }
  | { event: "quiz_played"; correct: boolean }
  | { event: "outbound_click"; link_url: string; link_text: string }
  | { event: "video_play"; video_title: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(data: TrackEvent) {
  if (typeof window === "undefined") return;
  (window.dataLayer ??= []).push(data);
}
