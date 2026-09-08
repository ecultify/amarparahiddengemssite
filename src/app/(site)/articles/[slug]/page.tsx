import { notFound } from "next/navigation";
import { Asset } from "@/components/ui/Asset";
import { ArticleCarousel } from "@/components/home/ArticleCarousel";
import { IMG } from "@/lib/assets";
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
      {/* The article itself — a full-bleed white plate. It opens the page now
          that the campaign banner is gone, so it carries its own top space. */}
      <article className="relative w-full overflow-hidden bg-white px-5 pt-10 pb-12 md:px-10 lg:px-20 lg:pt-14 lg:pb-16">
        <div className="relative mx-auto flex w-full max-w-[1216px] flex-col items-center gap-5">
          <p data-reveal className="font-ui text-[12px] font-extrabold uppercase tracking-[0.1em] text-pink sm:text-[13px]">
            {article.date ?? "Amar Para Hidden Gems"}
          </p>
          <h1 data-reveal="1" className="text-center font-title text-[34px] leading-[1.05] font-black text-pink uppercase sm:text-[46px] lg:text-[56px]">
            {article.title}
          </h1>

          <Asset
            src={article.image}
            alt={article.title}
            data-reveal="2"
            className="mt-1 h-[210px] w-full rounded-[10px] object-cover sm:h-[320px] lg:h-[402px]"
          />

          {article.html ? (
            /* Admin-authored rich body. Admin-only input, so rendering it
               directly is safe enough; sanitise here if authorship ever widens. */
            <div
              data-reveal
              className="article-prose mt-2 w-full max-w-[700px] font-body text-[14px] leading-[1.7] text-ink sm:text-[15px]"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          ) : (
            <div data-reveal className="mt-2 flex w-full max-w-[700px] flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-center font-body text-[14px] leading-[1.7] text-ink sm:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Figma 178:664 + 178:663 — the rail of other pieces, chevrons on
              either side of it. */}
          <div className="mt-10 flex w-full flex-col items-center gap-6 lg:mt-16">
            <h2 data-reveal className="text-center font-display text-[24px] leading-tight font-extrabold text-ink sm:text-[32px] lg:text-[40px]">
              Deep dives into Kolkata&apos;s most fascinating paras.
            </h2>
            <ArticleCarousel articles={others} />
          </div>
        </div>
      </article>

      {/* The footer tucks "i am Kolkata" into whatever comes last; this page
          ends on white, so the division carries that colour up to the footer. */}
      <div className="relative w-full">
        {/* Flush with the footer edge, per the design feedback. */}
        <Asset
          data-reveal
          src={IMG.blogCouple}
          className="pointer-events-none absolute right-[8px] bottom-0 h-[58px] w-[83px] lg:right-[80px] lg:h-[115px] lg:w-[165px] object-contain object-bottom"
        />
        <div className="h-[86px] w-full bg-white lg:h-[128px]" />
      </div>
    </>
  );
}
