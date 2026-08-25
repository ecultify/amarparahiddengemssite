"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Land every route change at the very top.
 *
 * The App Router already scrolls to the top on navigation, but `html` carries
 * `scroll-behavior: smooth` for the in-page anchor links (Stories, Creator
 * Trails). That turns the router's jump into an animation, and when the new
 * page streams in mid-animation the browser cancels it — leaving you parked
 * somewhere inside the hero. Forcing an instant scroll sidesteps the animation
 * without giving up smooth anchors.
 *
 * Skipped when the URL carries a hash, so anchor navigation still lands on its
 * section instead of being yanked back to the top.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
