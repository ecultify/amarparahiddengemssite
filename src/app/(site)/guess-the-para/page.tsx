import { Asset } from "@/components/ui/Asset";
import { QuizCard } from "@/components/gems/QuizCard";
import { QuizGate } from "@/components/gems/QuizGate";
import { IMG, PARTICIPATE_ACCENT, SUBMIT_ACCENT } from "@/lib/assets";
import { getGemPhone } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { istDayIndex } from "@/lib/quiz";
import { getUser } from "@/lib/users";

/** Unlisted daily quiz — reached only from the thank-you page, never linked
 *  in the site nav, and kept out of search indexes. */
export const metadata = {
  title: "Guess the Para — Amar Para Hidden Gems",
  robots: { index: false, follow: false },
};

export default async function GuessTheParaPage() {
  const [phone, content] = await Promise.all([getGemPhone(), getContent()]);
  const quiz = content.quiz;

  const dayIndex = istDayIndex();
  const question = quiz.length ? quiz[dayIndex % quiz.length] : null;
  // Today's guess, if this number already played — the server remembers, so
  // clearing the browser doesn't earn a second try.
  const todaysGuess = phone ? ((await getUser(phone))?.guesses[String(dayIndex)] ?? null) : null;

  return (
    <>
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-cream px-5 py-16 md:px-10 lg:px-20 lg:py-16">
        {/* Dressed with the same accents as the thank-you page it follows. */}
        <Asset
          src={SUBMIT_ACCENT.flowers}
          className="pointer-events-none absolute top-[80px] left-[-30px] h-[110px] w-[88px] lg:top-[190px] lg:left-0 lg:h-[200px] lg:w-[160px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.saxophone}
          className="pointer-events-none absolute top-[54px] right-[-58px] h-[170px] w-[106px] lg:top-[70px] lg:right-[-50px] lg:h-[320px] lg:w-[200px] object-contain"
        />
        <Asset
          src={IMG.accentKitePainted}
          className="pointer-events-none hidden lg:block absolute top-[90px] left-[calc(50%-620px)] h-[170px] w-[156px] rotate-[11deg] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.tower}
          className="pointer-events-none hidden lg:block absolute right-0 bottom-0 h-[240px] w-[109px] object-contain object-bottom"
        />
        <Asset
          src={PARTICIPATE_ACCENT.kingfisher}
          className="pointer-events-none hidden lg:block absolute top-[119px] left-[calc(50%+284px)] z-40 h-[38px] w-[36px] object-contain"
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
              One question a day for the people who really know Kolkata. Read the clue, pick
              your para, and see if you got it right.
            </p>
          </div>

          {!question ? (
            <p className="font-display text-[18px] font-extrabold text-navy">
              Today&apos;s question is being prepared. Check back soon.
            </p>
          ) : phone ? (
            <QuizCard question={question} initialGuess={todaysGuess} />
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
