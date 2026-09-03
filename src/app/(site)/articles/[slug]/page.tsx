import { notFound } from "next/navigation";
import { Asset } from "@/components/ui/Asset";
import { ArticleCarousel } from "@/components/home/ArticleCarousel";
import { IMG, SUBMIT_ACCENT } from "@/lib/assets";
import { isDraft, slugOf } from "@/data/site";
import { getContent } from "@/lib/content";

/** Article page — Figma 178:296 (Blogs). Drafts 404 like any missing page. */

export async function generateStaticParams() {
  const { articles } = await getContent();
  return articles.filter((a) => !isDraft(a)).map((article) => ({ slug: slugOf(article) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { articles } = await getContent();
  const article = articles.find((a) => slugOf(a) === slug && !isDraft(a));
  if (!article) return {};
  return {
    title: article.seoTitle || `${article.title} — Amar Para Hidden Gems`,
    description: article.seoDescription || undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContent();
  const articles = content.articles.filter((a) => !isDraft(a));

  const index = articles.findIndex((a) => slugOf(a) === slug);
  if (index === -1) notFound();

  const article = articles[index];
  // Shipped articles carry body as string[]; admin-edited ones as one string
  // with blank lines between paragraphs.
  const paragraphs = Array.isArray(article.body)
    ? article.body
    : (article.body ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  // Everything else, starting from the next one, so the rail always leads with
  // what follows this piece rather than restarting at the top of the list.
  const others = [...articles.slice(index + 1), ...articles.slice(0, index)];

  return (
    <>
      {/* Campaign banner — Figma 178:296 opens the piece on the submission
          hero. The frame runs y=88..609, so the section is 521px on lg and
          every accent below is its Figma y minus the 88px navbar. */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-cream px-5 py-14 md:px-10 lg:h-[521px] lg:px-20 lg:py-0">
        <Asset
          src={IMG.blogKite}
          className="pointer-events-none absolute top-[112px] left-[-42px] h-[124px] w-[78px] lg:top-[226px] lg:left-[-19px] lg:h-[295px] lg:w-[184px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.golfBag}
          className="pointer-events-none absolute top-[8px] left-[14px] h-[70px] w-[36px] lg:top-[35px] lg:left-[calc(50%-588px)] lg:h-[136px] lg:w-[70px] object-contain"
        />
        {/* fhcfgjm 2 (178:588), sitting just left of "Hidden" on the second
            line. Its ink is only 194x210 inside a 351x341 canvas, so the box is
            sized well past the Figma one — at 175px the flowers themselves came
            out under 100px and read as clipped. */}
        <Asset
          src={IMG.blogFlowers}
          className="pointer-events-none absolute bottom-[-10px] left-[-32px] h-[126px] w-[130px] lg:top-[153px] lg:bottom-auto lg:left-[calc(50%-458px)] lg:h-[233px] lg:w-[240px] object-contain"
        />
        <Asset
          src={IMG.blogSprout}
          className="pointer-events-none absolute top-[-2px] left-[calc(50%+104px)] h-[58px] w-[33px] lg:top-[43px] lg:left-[calc(50%-65px)] lg:h-[80px] lg:w-[49px] object-contain"
        />
        <Asset
          src={IMG.blogDhol}
          className="pointer-events-none absolute top-[84px] right-[-34px] h-[148px] w-[110px] lg:top-[159px] lg:right-[-20px] lg:h-[314px] lg:w-[234px] object-contain"
        />
        <Asset
          src={IMG.blogWalkers}
          className="pointer-events-none absolute right-[8px] bottom-[8px] h-[60px] w-[84px] lg:top-[411px] lg:right-[182px] lg:bottom-auto lg:h-[113px] lg:w-[158px] object-contain"
        />

        <div className="relative z-30 flex w-full max-w-[840px] flex-col items-center gap-5 text-center lg:gap-[44px]">
          {/* Two lines, as the frame sets it — on one line the headline runs
              straight through the sprout and the dhol. */}
          <h2 className="font-title text-[42px] leading-[0.92] font-black uppercase sm:text-[62px] lg:text-[128px]">
            <span className="block text-cyan">Share Your Para&apos;s</span>
            <span className="block text-pink">Hidden Gem</span>
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

          {article.html ? (
            /* Admin-authored rich body. Admin-only input, so rendering it
               directly is safe enough; sanitise here if authorship ever widens. */
            <div
              className="article-prose mt-2 w-full max-w-[700px] font-body text-[14px] leading-[1.7] text-white/90 sm:text-[15px]"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          ) : (
            <div className="mt-2 flex w-full max-w-[700px] flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-center font-body text-[14px] leading-[1.7] text-white/90 sm:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

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
        {/* Flush with the footer edge, per the design feedback. */}
        <Asset
          src={IMG.blogCouple}
          className="pointer-events-none absolute right-[8px] bottom-0 h-[58px] w-[83px] lg:right-[80px] lg:h-[115px] lg:w-[165px] object-contain object-bottom"
        />
        <div className="h-[86px] w-full bg-cream lg:h-[128px]" />
      </div>
    </>
  );
}
