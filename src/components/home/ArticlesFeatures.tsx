import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOME_ACCENT } from "@/lib/assets";
import { slugOf, type Article } from "@/data/site";

/** article-card — Figma 49:2098. 320x200, 50% black scrim, title bottom-left. */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${slugOf(article)}`}
      className="group relative block h-[180px] w-[280px] shrink-0 overflow-hidden rounded-[12px] transition-transform duration-150 ease-[var(--ease-out-quart)] sm:h-[200px] sm:w-[320px] hover:-translate-y-[3px] active:translate-y-0"
    >
      <Asset
        src={article.image}
        alt={article.title}
        className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-black/50 transition-colors duration-150 group-hover:bg-black/40" />
      <div className="relative flex h-full flex-col justify-end p-5">
        <h3 className="font-display text-[18px] leading-tight font-extrabold text-white">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

/** Articles & Features — Figma 49:2090. Two staggered rows that bleed right. */
export function ArticlesFeatures({ rowOne, rowTwo }: { rowOne: Article[]; rowTwo: Article[] }) {
  return (
    <div className="relative w-full">
      {/* Group 36 (178:245). Per request the horn sits top-left, level with the
          section title rather than on the floor. The 65x150 box keeps the
          PNG's 0.43 aspect so object-contain adds no letterbox gap. */}
      <Asset
        src={HOME_ACCENT.horn}
        className="pointer-events-none hidden lg:block absolute top-[28px] left-[32px] z-10 h-[150px] w-[65px] object-contain"
      />
    <section id="articles" className="relative w-full overflow-hidden bg-yellow pt-[84px] pb-14 lg:pt-[38px] lg:pb-[72px]">
      {/* Figma 49:2090 — Group 36 (178:245) is the horn at bottom-left.
          Group_23 (178:549) is page-level in Figma, overlapping this section
          at x=1330 y=2502 (130x155); it bleeds past the 1440 canvas. */}
      {/* Below lg the kebab sits in the band above the heading. */}
      <Asset
        src={HOME_ACCENT.kebab}
        className="pointer-events-none absolute top-[6px] right-[-14px] h-[68px] w-[48px] lg:top-[58px] lg:right-[-28px] lg:h-[155px] lg:w-[110px] object-contain"
      />

      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-20">
        <SectionHeading
          eyebrow="Articles & Features"
          eyebrowClassName="text-pink"
          title="Deep into the fascinating stories behind the Gems"
          titleClassName="text-white"
          blurb="Discover the history, culture and people behind some of Kolkata's most interesting para finds."
          blurbWidth={788}
        />
      </div>

      {/* The two rows drift in opposite directions (the design's counter-scroll)
          and pause on hover. Each row renders its list twice so the loop wraps
          without a visible seam. */}
      <div data-reveal="1" className="mt-8 flex flex-col gap-5 lg:mt-10 lg:gap-7">
        <div className="overflow-hidden py-2">
          <div className="marquee-track">
            {[...rowOne, ...rowOne].map((article, index) => (
              <ArticleCard key={`${article.title}-${index}`} article={article} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden py-2">
          <div className="marquee-track marquee-reverse">
            {[...rowTwo, ...rowTwo].map((article, index) => (
              <ArticleCard key={`${article.title}-${index}`} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
