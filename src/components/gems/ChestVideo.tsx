"use client";

import { useEffect, useRef } from "react";

/**
 * The chest-opens-to-logo clip on the thank-you page. It is under a second
 * long, so it must not start until the page has settled: it waits for the
 * enclosing scroll-reveal fade to finish, then plays once and holds its last
 * (open) frame. Falls back to a timer where the fade never fires (no reveal
 * ancestor, reduced motion).
 */
export function ChestVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const host = video.closest("[data-reveal]");
    const play = () => {
      host?.removeEventListener("transitionend", onEnd);
      clearTimeout(fallback);
      video.play().catch(() => {});
    };
    const onEnd = (event: Event) => {
      if ((event as TransitionEvent).propertyName === "opacity") play();
    };
    host?.addEventListener("transitionend", onEnd);
    const fallback = setTimeout(play, 1500);
    return () => {
      host?.removeEventListener("transitionend", onEnd);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <video
      ref={ref}
      src="/gem-submitted.mp4"
      muted
      playsInline
      preload="auto"
      aria-hidden
      className={`pointer-events-none ${className}`}
    />
  );
}
