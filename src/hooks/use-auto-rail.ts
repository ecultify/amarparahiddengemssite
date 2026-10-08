"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EVERY_MS = 3000;

/** Crawl mode: how long the rail rests before it starts creeping, so a
 *  manual arrow step's smooth scroll finishes before the creep takes over. */
const HOLD_MS = 2200;

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
 *
 * `crawl` (px/second) swaps the 3s hop for a slow continuous creep that never
 * stops on a card. Needs `loop` and duplicated cards; `direction` -1 creeps
 * right to left.
 */
export function useAutoRail(direction: 1 | -1 = 1, loop = false, crawl = 0) {
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
    if (crawl || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) step(direction);
    }, EVERY_MS);
    return () => clearInterval(id);
  }, [crawl, paused, nonce, direction, step]);

  useEffect(() => {
    const node = ref.current;
    if (!crawl || !node) return;
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = performance.now();
    // Rest first, so a manual arrow step's smooth scroll finishes undisturbed.
    const holdUntil = last + HOLD_MS;
    // Kept off the DOM: scrollLeft rounds to whole pixels, and a sub-pixel
    // creep written straight to it rounds back to where it was every frame.
    let pos = node.scrollLeft;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = now - last;
      last = now;
      if (document.hidden || now < holdUntil) return;

      const [a, b] = node.children as unknown as HTMLElement[];
      const stride = b ? b.offsetLeft - a.offsetLeft : node.clientWidth;
      if (!stride) return;
      // One copy measured in whole cards — scrollWidth/2 lands half a gap off,
      // and that error would accumulate on every wrap.
      const copy = Math.round(node.scrollWidth / 2 / stride) * stride;

      if (Math.abs(node.scrollLeft - pos) > 1) pos = node.scrollLeft; // dragged or stepped
      pos += (direction * crawl * delta) / 1000;
      if (pos >= copy) pos -= copy;
      else if (pos < 0) pos += copy;
      node.scrollLeft = pos;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [crawl, paused, nonce, direction]);

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
