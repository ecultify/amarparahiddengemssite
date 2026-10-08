"use client";

import { useEffect, useState } from "react";

/** Two floating buttons: back to the top of the page, and down to the rail
 *  of other articles. Each hides when it would do nothing. */
export function JumpButtons({ bottomId }: { bottomId: string }) {
  const [y, setY] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const target = document.getElementById(bottomId);
    const onScroll = () => {
      setY(window.scrollY);
      setAtEnd(!!target && target.getBoundingClientRect().top < window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bottomId]);

  const btn =
    "icon-btn flex size-11 items-center justify-center rounded-full border-2 border-line bg-white text-navy shadow-[0_4px_10px_rgba(27,42,74,0.2)] transition-opacity duration-300";
  const hidden = "pointer-events-none opacity-0";

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2 lg:right-8 lg:bottom-8">
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0 })}
        className={`${btn} ${y < 400 ? hidden : ""}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
      <button
        type="button"
        aria-label="More articles"
        onClick={() => document.getElementById(bottomId)?.scrollIntoView({ block: "start" })}
        className={`${btn} ${atEnd ? hidden : ""}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </button>
    </div>
  );
}
