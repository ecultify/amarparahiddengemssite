"use client";

import { useEffect, useState } from "react";

type Section = { id: string; text: string };

/** The "In this article" list. Sticky beside the body on desktop, a native
 *  <details> above it on phones. The heading nearest the top of the viewport
 *  is highlighted as you read. */
export function ArticleToc({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;
    // Track which headings are past the reading line; the last one wins.
    const onScroll = () => {
      const line = window.scrollY + 140;
      let current = headings[0].id;
      for (const h of headings) if (h.offsetTop <= line) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  if (sections.length === 0) return null;

  const list = (
    <ol className="flex flex-col gap-1 border-l-2 border-line">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={`-ml-[2px] block border-l-2 py-1.5 pl-3 font-ui text-[13px] leading-snug transition-colors ${
              active === s.id
                ? "border-pink font-bold text-pink"
                : "border-transparent text-ink/70 hover:border-line hover:text-ink"
            }`}
          >
            {s.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Phones: collapsed by default so the cover and opening lines come first. */}
      <details className="w-full rounded-[10px] border-2 border-line bg-cream/40 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer font-ui text-[12px] font-extrabold uppercase tracking-[0.1em] text-navy">
          In this article
        </summary>
        <div className="pt-3">{list}</div>
      </details>
      <nav aria-label="In this article" className="hidden lg:block">
        <p className="mb-3 font-ui text-[12px] font-extrabold uppercase tracking-[0.1em] text-navy">In this article</p>
        {list}
      </nav>
    </>
  );
}
