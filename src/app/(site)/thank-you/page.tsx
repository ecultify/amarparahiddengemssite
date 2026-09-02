import { Asset } from "@/components/ui/Asset";
import { Button3D } from "@/components/ui/Button3D";
import { IMG, PARTICIPATE_ACCENT, SUBMIT_ACCENT } from "@/lib/assets";

export const metadata = {
  title: "Thank you — Amar Para Hidden Gems",
};

/** Landed on after a successful submission. Dressed with accents already in
 *  use elsewhere on the site so it does not read as a bare system page. */
export default function ThankYouPage() {
  return (
    <>
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-cream px-5 py-16 md:px-10 lg:px-20 lg:py-16">
        <Asset
          src={SUBMIT_ACCENT.flowers}
          className="pointer-events-none absolute top-[80px] left-[-30px] h-[110px] w-[88px] lg:top-[190px] lg:left-[16px] lg:h-[200px] lg:w-[160px] object-contain"
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
          className="pointer-events-none hidden lg:block absolute right-0 bottom-0 h-[240px] w-[131px] object-contain object-bottom"
        />
        <Asset
          src={PARTICIPATE_ACCENT.kingfisher}
          className="pointer-events-none hidden lg:block absolute top-[150px] left-[calc(50%+250px)] z-40 h-[38px] w-[36px] object-contain"
        />

        <div className="relative flex w-full max-w-[1000px] flex-col items-center gap-5 text-center">
          <span className="rounded-full bg-pink/8 px-3.5 py-1.5 font-display text-[13px] font-extrabold uppercase tracking-[0.06em] text-pink">
            Submission received
          </span>

          <h1 className="font-title text-[40px] leading-[0.94] font-black text-navy uppercase sm:text-[56px] lg:text-[128px]">
            Thank You for Sharing Your Hidden Gem
          </h1>

          <p className="font-display text-[18px] leading-tight font-extrabold text-red sm:text-[20px]">
            Your entry has been submitted successfully.
          </p>

          <p className="max-w-[680px] font-body text-[15px] leading-[1.7] text-slate sm:text-[16px]">
            Thank you for adding to Amar Para Hidden Gems and helping us build a collection of the
            places, people and stories that make Kolkata&apos;s paras distinctive.
          </p>

          <p className="max-w-[680px] font-body text-[15px] leading-[1.7] text-slate sm:text-[16px]">
            If selected, your hidden gem may be featured by The Times of India, with credit to
            you for the submission.
          </p>

          <div className="mt-4 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button3D href="/500-gems" className="w-full px-6 sm:w-auto">
              Explore more hidden gems
            </Button3D>
            <Button3D href="/submit" variant="outline" className="w-full px-6 sm:w-auto">
              Submit another gem
            </Button3D>
            <Button3D href="/guess-the-para" variant="red" className="w-full px-6 sm:w-auto">
              Guess the Para
            </Button3D>
          </div>
        </div>
      </section>

      {/* The footer tucks "i am Kolkata" up into whatever comes last, and this
          page's only section is cream, so no extra division is needed. */}
    </>
  );
}
