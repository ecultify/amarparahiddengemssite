"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EVERY_MS = 3000;

/**
 * Drives a horizontal card rail: auto-advances one card every 3s, wraps at
 * either end, and pauses while hovered, touched or focused (spread `pause`
 * on the rail's wrapper). Arrows call `step`, and `index` / `pages` feed the
 * dots, so all three stay in agreement. `direction` -1 runs the rail
 * backwards — the homepage alternates rails so neighbours counter-scroll.
 *
 * `loop` is for a rail whose cards are printed twice: instead of rewinding
 * the whole way at the end, it rebases into the first copy before each step,
 * so the rail runs on and on and the seam is never seen. Cards must be
 * duplicated in the markup for it, and the dots count the real ones.
 */
export function useAutoRail(direction: 1 | -1 = 1, loop = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(0);
  const [paused, setPaused] = useState(false);
  const [nonce, setNonce] = useState(0);

  const step = useCallback(
    (dir: 1 | -1) => {
      const node = ref.current;
      if (!node) return;
      const [a, b] = node.children as unknown as HTMLElement[];
      const stride = b ? b.offsetLeft - a.offsetLeft : node.clientWidth;

      // A copy has to be wider than the window onto it, or there is no
      // position in the second copy that matches one in the first, and the
      // rebase would jump. Too few cards for that: wrap the old way.
      if (loop && node.scrollWidth / 2 > node.clientWidth) {
        // Half the track is the second copy. Jumping back by exactly one copy
        // lands on an identical card, so the rebase is invisible — and doing
        // it before the animation starts means it never interrupts one.
        const copy = node.scrollWidth / 2;
        let left = node.scrollLeft + dir * stride;
        if (left >= copy) {
          node.scrollLeft -= copy;
          left -= copy;
        } else if (left < 0) {
          node.scrollLeft += copy;
          left += copy;
        }
        node.scrollTo({ left, behavior: "smooth" });
        setNonce((n) => n + 1);
        return;
      }

      const max = node.scrollWidth - node.clientWidth;
      const atEnd = node.scrollLeft >= max - 1;
      const atStart = node.scrollLeft <= 1;
      const left =
        dir === 1 ? (atEnd ? 0 : node.scrollLeft + stride) : atStart ? max : node.scrollLeft - stride;
      node.scrollTo({ left, behavior: "smooth" });
      setNonce((n) => n + 1); // a manual step restarts the clock
    },
    [loop],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const sync = () => {
      const [a, b] = node.children as unknown as HTMLElement[];
      const stride = b ? b.offsetLeft - a.offsetLeft : node.clientWidth;

      if (loop && node.scrollWidth / 2 > node.clientWidth) {
        // The dots count the real cards, not the copies.
        const copy = node.scrollWidth / 2;
        const count = Math.max(1, Math.round(copy / stride));
        setPages(count);
        setIndex(Math.round((node.scrollLeft % copy) / stride) % count);
        return;
      }

      // The last stop is usually a partial stride (the rail clamps at its
      // end), so it counts as its own page and the end position maps to it.
      const max = node.scrollWidth - node.clientWidth;
      const count = max <= 1 ? 1 : Math.ceil((max - 1) / stride) + 1;
      setPages(count);
      setIndex(node.scrollLeft >= max - 1 ? count - 1 : Math.round(node.scrollLeft / stride));
    };
    sync();
    node.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      node.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [loop]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) step(direction);
    }, EVERY_MS);
    return () => clearInterval(id);
  }, [paused, nonce, direction, step]);

  const pause = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onTouchStart: () => setPaused(true),
    onTouchEnd: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return { ref, index, pages, step, pause };
}
