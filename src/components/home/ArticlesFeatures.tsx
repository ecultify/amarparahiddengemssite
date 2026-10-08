import { Asset } from "@/components/ui/Asset";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOME_ACCENT } from "@/lib/assets";
import type { Article } from "@/data/site";
import { ArticleRow } from "@/components/home/ArticleRow";

/** Articles & Features — Figma 49:2090. Two staggered rows that bleed right. */
export function ArticlesFeatures({ rowOne, rowTwo }: { rowOne: Article[]; rowTwo: Article[] }) {
  return (
    <div className="relative w-full">
      {/* Group 36 (178:245). Per request the horn sits top-left, level with the
          section title and flush with the wall. The PNG is cropped to its art
          (126x227), so the 100x180 box adds no letterbox gap on the left. */}
      <Asset
          data-reveal
        src={HOME_ACCENT.horn}
        className="pointer-events-none hidden lg:block absolute top-[24px] left-0 z-10 h-[180px] w-[100px] object-contain"
      />
    <section id="articles" className="relative w-full overflow-hidden bg-yellow pt-[84px] pb-14 lg:pt-[38px] lg:pb-[72px]">
      {/* Figma 49:2090 — Group 36 (178:245) is the horn at bottom-left.
          Group_23 (178:549) is page-level in Figma, overlapping this section
          at x=1330 y=2502 (130x155); it bleeds past the 1440 canvas. */}
      {/* Below lg the kebab sits in the band above the heading. */}
      <Asset
          data-reveal
        src={HOME_ACCENT.kebab}
        className="pointer-events-none absolute top-[6px] right-[-14px] h-[68px] w-[48px] lg:top-[58px] lg:right-[-28px] lg:h-[155px] lg:w-[110px] object-contain"
      />

      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-20">
        <SectionHeading
          eyebrow="Articles & Features"
          eyebrowClassName="text-pink"
          title="Dive Deep into the Fascinating Stories Behind the Gems"
          titleClassName="text-white"
          blurb="Discover the history, culture and people behind some of Kolkata's most interesting para finds."
          blurbWidth={788}
        />
      </div>

      {/* The two rows step in opposite directions (the design's counter-scroll),
          one card at a time with a rest between, and pause on hover. */}
      <div data-reveal="1" className="mt-8 flex flex-col gap-5 lg:mt-10 lg:gap-7">
        <ArticleRow articles={rowOne} direction={1} />
        <ArticleRow articles={rowTwo} direction={-1} />
      </div>
    </section>
    </div>
  );
}
