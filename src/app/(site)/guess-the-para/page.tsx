import { Asset } from "@/components/ui/Asset";
import { QuizCard } from "@/components/gems/QuizCard";
import { QuizGate } from "@/components/gems/QuizGate";
import { HOME_ACCENT, IMG, PARTICIPATE_ACCENT, SUBMIT_ACCENT } from "@/lib/assets";
import { getGemPhone } from "@/lib/auth";
import { getContent } from "@/lib/content";

/** Unlisted daily quiz — reached only from the thank-you page, never linked
 *  in the site nav, and kept out of search indexes. */
export const metadata = {
  title: "Guess the Para — Amar Para Hidden Gems",
  robots: { index: false, follow: false },
};

const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 5.5 * 3_600_000;

/** The IST calendar-day number — the quiz rotates on it. */
const istDayIndex = () => Math.floor((Date.now() + IST_OFFSET_MS) / DAY_MS);

export default async function GuessTheParaPage() {
  const [phone, content] = await Promise.all([getGemPhone(), getContent()]);
  const quiz = content.quiz;

  const dayIndex = istDayIndex();
  const question = quiz.length ? quiz[dayIndex % quiz.length] : null;

  return (
    <>
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-cream px-5 py-16 md:px-10 lg:px-20 lg:py-24">
        {/* Dressed with the same accents as the thank-you page it follows. */}
        <Asset
          src={SUBMIT_ACCENT.flowers}
          className="pointer-events-none absolute top-[80px] left-[-54px] h-[110px] w-[88px] lg:top-[120px] lg:left-[-40px] lg:h-[200px] lg:w-[160px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.saxophone}
          className="pointer-events-none absolute top-[54px] right-[-58px] h-[170px] w-[106px] lg:top-[70px] lg:right-[-50px] lg:h-[320px] lg:w-[200px] object-contain"
        />
        <Asset
          src={IMG.accentKiteRainbow}
          className="pointer-events-none hidden lg:block absolute top-[90px] left-[calc(50%-620px)] h-[170px] w-[128px] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.tower}
          className="pointer-events-none hidden lg:block absolute right-[calc(50%-660px)] bottom-[40px] h-[240px] w-[131px] object-contain"
        />
        <Asset
          src={HOME_ACCENT.golfer}
          className="pointer-events-none hidden lg:block absolute bottom-[60px] left-[calc(50%-470px)] h-[109px] w-[55px] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.kingfisher}
          className="pointer-events-none hidden lg:block absolute top-[190px] left-[calc(50%+300px)] h-[38px] w-[36px] object-contain"
        />

        <div className="relative z-30 flex w-full max-w-[1000px] flex-col items-center gap-6 text-center lg:gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="rounded-full bg-pink/8 px-3.5 py-1.5 font-display text-[13px] font-extrabold uppercase tracking-[0.06em] text-pink">
              Daily quiz
            </span>
            <h1 className="font-title text-[44px] leading-[0.94] font-black uppercase sm:text-[56px] lg:text-[128px]">
              <span className="text-cyan">Guess </span>
              <span className="text-pink">the Para</span>
            </h1>
            <p className="max-w-[680px] font-body text-[15px] leading-[1.7] text-slate sm:text-[16px]">
              One question a day for the people who really know Kolkata. Read the clue, pick your
              para, and see if you got it right.
            </p>
          </div>

          {!question ? (
            <p className="font-display text-[18px] font-extrabold text-navy">
              Today&apos;s question is being prepared — check back soon.
            </p>
          ) : phone ? (
            <QuizCard question={question} dayKey={String(dayIndex)} />
          ) : (
            <QuizGate />
          )}
        </div>
      </section>

      {/* The footer tucks "i am Kolkata" up into whatever comes last, and this
          page's only section is cream, so no extra division is needed. */}
    </>
  );
}
