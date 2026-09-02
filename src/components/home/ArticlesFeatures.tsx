import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
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
      {/* Group 36 (178:245). Per request this sits flush to the bottom-left of
          the yellow and does NOT overhang into Creator Trails, and is scaled
          down from Figma's 194x314. The 133x240 box keeps the PNG's 0.5525
          aspect so object-contain adds no letterbox gap on the left. */}
      <Asset
        src={HOME_ACCENT.horn}
        className="pointer-events-none hidden lg:block absolute bottom-0 left-0 z-10 h-[240px] w-[133px] object-contain object-left-bottom"
      />
    <section id="articles" className="relative w-full overflow-hidden bg-yellow pt-10 pb-16 lg:pt-[38px] lg:pb-[100px]">
      {/* Figma 49:2090 — Group 36 (178:245) is the horn at bottom-left.
          Group_23 (178:549) is page-level in Figma, overlapping this section
          at x=1330 y=2502 (130x155); it bleeds past the 1440 canvas. */}
      <Asset
        src={HOME_ACCENT.kebab}
        className="pointer-events-none absolute top-[16px] right-[-30px] h-[90px] w-[64px] lg:top-[58px] lg:right-[-28px] lg:h-[155px] lg:w-[110px] object-contain"
      />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-5 md:px-10 lg:px-20">
        <p className="font-body text-[14px] font-bold uppercase tracking-[0.08em] text-pink">
          Articles &amp; Features
        </p>
        <h2 className="text-center font-title text-[40px] leading-tight font-black text-white sm:text-[46px] lg:text-[56px]">
          Deep into the fascinating stories behind the Gems
        </h2>
        <p className="max-w-[788px] text-center font-body text-[16px] text-body-muted">
          Discover the history, culture and people behind some of Kolkata&apos;s most interesting para finds.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-5 lg:mt-14 lg:gap-7">
        <div className="no-scrollbar flex gap-5 overflow-x-auto px-5 md:px-10 lg:pr-0 lg:pl-20">
          {rowOne.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>
        <div className="no-scrollbar flex gap-5 overflow-x-auto px-5 md:px-10 lg:pr-0 lg:pl-40">
          {rowTwo.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
