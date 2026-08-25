import Link from "next/link";
import { notFound } from "next/navigation";
import { Asset } from "@/components/ui/Asset";
import { ArticleCarousel } from "@/components/home/ArticleCarousel";
import { IMG, SUBMIT_ACCENT } from "@/lib/assets";
import { articleSlug } from "@/data/site";
import { getContent } from "@/lib/content";

/** Article page — Figma 178:296 (Blogs). */

export async function generateStaticParams() {
  const { articles } = await getContent();
  return articles.map((article) => ({ slug: articleSlug(article.title) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { articles } = await getContent();
  const article = articles.find((a) => articleSlug(a.title) === slug);
  return article ? { title: `${article.title} — Amar Para Hidden Gems` } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { articles } = await getContent();

  const index = articles.findIndex((a) => articleSlug(a.title) === slug);
  if (index === -1) notFound();

  const article = articles[index];
  // Everything else, starting from the next one, so the rail always leads with
  // what follows this piece rather than restarting at the top of the list.
  const others = [...articles.slice(index + 1), ...articles.slice(0, index)];

  return (
    <>
      {/* Campaign banner — Figma 178:296 opens the piece on the submission
          hero, accents and all, before dropping into the yellow plate. */}
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-cream px-5 py-14 md:px-10 lg:px-20 lg:py-[72px]">
        <Asset
          src={IMG.blogKite}
          className="pointer-events-none absolute top-[104px] left-[-44px] h-[120px] w-[75px] lg:top-[226px] lg:left-[-19px] lg:h-[296px] lg:w-[185px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.golfBag}
          className="pointer-events-none absolute top-[10px] left-[16px] h-[74px] w-[38px] lg:top-[35px] lg:left-[calc(50%-588px)] lg:h-[136px] lg:w-[70px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.flowers}
          className="pointer-events-none absolute top-[92px] left-[calc(50%-168px)] h-[86px] w-[89px] lg:top-[244px] lg:left-[calc(50%-436px)] lg:h-[170px] lg:w-[175px] object-contain"
        />
        <Asset
          src={IMG.blogSprout}
          className="pointer-events-none absolute top-[-4px] left-[calc(50%+92px)] h-[62px] w-[35px] lg:top-[14px] lg:left-[calc(50%-96px)] lg:h-[120px] lg:w-[67px] object-contain"
        />
        <Asset
          src={IMG.blogDhol}
          className="pointer-events-none absolute top-[76px] right-[-30px] h-[150px] w-[102px] lg:top-[159px] lg:right-[-20px] lg:h-[315px] lg:w-[214px] object-contain"
        />
        <Asset
          src={IMG.blogWalkers}
          className="pointer-events-none absolute right-[10px] bottom-[-12px] h-[62px] w-[86px] lg:right-[calc(50%-620px)] lg:bottom-[24px] lg:h-[113px] lg:w-[158px] object-contain"
        />

        <div className="relative z-30 flex w-full max-w-[840px] flex-col items-center gap-4 text-center">
          <h2 className="font-title text-[42px] leading-[0.92] font-black uppercase sm:text-[62px] lg:text-[76px]">
            <span className="text-cyan">Share Your Para&apos;s </span>
            <span className="text-pink">Hidden Gem</span>
          </h2>
          <p className="max-w-[720px] font-body text-[15px] leading-[1.6] text-slate sm:text-[16px]">
            Tell us about the special places, stories, and memories that make your neighborhood
            unique. Stand up for your community and place your neighborhood&apos;s legacy on
            TOI&apos;s historic directory.
          </p>
        </div>
      </section>

      {/* The article itself — Figma 178:625, a full-bleed yellow plate. */}
      <article className="relative w-full overflow-hidden bg-yellow px-5 py-12 md:px-10 lg:px-20 lg:py-16">
        <div className="relative mx-auto flex w-full max-w-[1216px] flex-col items-center gap-5">
          <p className="font-ui text-[12px] font-extrabold uppercase tracking-[0.1em] text-pink sm:text-[13px]">
            {article.date ?? "Amar Para Hidden Gems"}
          </p>
          <h1 className="text-center font-title text-[34px] leading-tight font-black text-pink uppercase sm:text-[46px] lg:text-[56px]">
            {article.title}
          </h1>

          <Asset
            src={article.image}
            alt={article.title}
            className="mt-1 h-[210px] w-full rounded-[10px] object-cover sm:h-[320px] lg:h-[402px]"
          />

          <div className="mt-2 flex w-full max-w-[700px] flex-col gap-4">
            {(article.body ?? []).map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-center font-body text-[14px] leading-[1.7] text-white/90 sm:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Figma 178:664 + 178:663 — the rail of other pieces, chevrons on
              either side of it. */}
          <div className="mt-10 flex w-full flex-col items-center gap-6 lg:mt-16">
            <h2 className="text-center font-display text-[24px] leading-tight font-extrabold text-white sm:text-[32px] lg:text-[40px]">
              Deep dives into Kolkata&apos;s most fascinating paras.
            </h2>
            <ArticleCarousel articles={others} />
          </div>
        </div>
      </article>

      {/* The footer tucks "i am Kolkata" into whatever comes last; this page
          ends on yellow, so the mark needs a cream division to land on. */}
      <div className="relative w-full">
        <Asset
          src={IMG.blogCouple}
          className="pointer-events-none absolute right-[8px] bottom-[6px] h-[58px] w-[83px] lg:right-[80px] lg:bottom-[10px] lg:h-[115px] lg:w-[165px] object-contain"
        />
        <div className="h-[86px] w-full bg-cream lg:h-[128px]" />
      </div>
    </>
  );
}
