import Link from "next/link";
import { notFound } from "next/navigation";
import { Asset } from "@/components/ui/Asset";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { HOME_ACCENT, IMG, PARTICIPATE_ACCENT, SUBMIT_ACCENT } from "@/lib/assets";
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
  // Wrap around, so the chevrons are never dead ends on the first or last piece.
  const prev = articles[(index - 1 + articles.length) % articles.length];
  const next = articles[(index + 1) % articles.length];

  return (
    <>
      {/* Campaign banner over the article — Figma 178:296 keeps the submission
          hero here, accents and all, so the piece opens on the same cream
          before dropping into the yellow. */}
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-cream px-5 py-14 md:px-10 lg:px-20 lg:py-[72px]">
        <Asset
          src={SUBMIT_ACCENT.flowers}
          className="pointer-events-none absolute top-[96px] left-[-52px] h-[110px] w-[88px] lg:top-[150px] lg:left-[-46px] lg:h-[190px] lg:w-[152px] object-contain"
        />
        <Asset
          src={IMG.accentKiteRainbow}
          className="pointer-events-none absolute top-[8px] left-[-40px] h-[104px] w-[79px] lg:top-[120px] lg:left-[calc(50%-700px)] lg:h-[180px] lg:w-[136px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.saxophone}
          className="pointer-events-none absolute top-[70px] right-[-56px] h-[170px] w-[106px] lg:top-[40px] lg:right-[-40px] lg:h-[290px] lg:w-[181px] object-contain"
        />
        <Asset
          src={HOME_ACCENT.golfer}
          className="pointer-events-none hidden lg:block absolute top-[210px] left-[calc(50%+180px)] h-[109px] w-[55px] object-contain"
        />

        <div className="relative flex w-full max-w-[840px] flex-col items-center gap-4 text-center">
          <h2 className="font-title text-[44px] leading-[0.92] font-black uppercase sm:text-[62px] lg:text-[76px]">
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
        <Asset
          src={HOME_ACCENT.kebab}
          className="pointer-events-none hidden lg:block absolute top-[40px] right-[-28px] h-[155px] w-[110px] object-contain"
        />

        <div className="relative mx-auto flex w-full max-w-[1216px] flex-col items-center gap-6">
          <p className="font-ui text-[13px] font-extrabold uppercase tracking-[0.08em] text-pink">
            {article.date ?? "Amar Para Hidden Gems"}
          </p>
          <h1 className="text-center font-title text-[38px] leading-tight font-black text-pink uppercase sm:text-[48px] lg:text-[56px]">
            {article.title}
          </h1>

          <Asset
            src={article.image}
            alt={article.title}
            className="mt-2 h-[220px] w-full rounded-[12px] object-cover sm:h-[320px] lg:h-[402px]"
          />

          <div className="mt-2 flex w-full max-w-[720px] flex-col gap-5">
            {(article.body ?? []).map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-center font-body text-[15px] leading-[1.7] text-white sm:text-[16px]">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-6 text-center font-display text-[26px] leading-tight font-extrabold text-white sm:text-[32px] lg:text-[40px]">
            Deep dives into Kolkata&apos;s most fascinating paras.
          </p>

          {/* Figma 178:663 — chevrons pinned to the plate's outer edges. */}
          <nav className="mt-4 flex w-full items-center justify-between gap-4">
            <Link
              href={`/articles/${articleSlug(prev.title)}`}
              aria-label={`Previous article: ${prev.title}`}
              className="icon-btn flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white text-navy lg:size-12"
            >
              <ChevronLeft className="size-5" />
            </Link>
            <Link
              href={`/articles/${articleSlug(next.title)}`}
              aria-label={`Next article: ${next.title}`}
              className="icon-btn flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white text-navy lg:size-12"
            >
              <ChevronRight className="size-5" />
            </Link>
          </nav>
        </div>
      </article>

      {/* The footer tucks "i am Kolkata" into whatever comes last; this page
          ends on yellow, so give the mark a cream division to land on. */}
      <div className="relative w-full">
        <Asset
          src={PARTICIPATE_ACCENT.dancers}
          className="pointer-events-none hidden lg:block absolute right-[64px] bottom-[18px] h-[83px] w-[115px] object-contain"
        />
        <div className="h-[72px] w-full bg-cream lg:h-[120px]" />
      </div>
    </>
  );
}
