import { Asset } from "@/components/ui/Asset";
import { GemsDiscovered } from "@/components/gems/GemsDiscovered";
import { SubmissionForm } from "@/components/gems/SubmissionForm";
import { IMG, SUBMIT_ACCENT } from "@/lib/assets";
import { getContent } from "@/lib/content";

/** Share Your Para's Hidden Gem — Figma node 95:309 (entry-submission-page). */
export default async function SubmitPage() {
  const content = await getContent();
  return (
    <>
      <section className="relative w-full overflow-hidden bg-cream px-5 pt-12 pb-16 md:px-10 lg:px-20 lg:pt-14 lg:pb-[64px]">
        {/* Hero accents — Figma 95:309. y values are the Figma value minus the
            88px navbar the frame includes. Box sizes follow each export's own
            aspect so object-contain adds no letterbox offset. The three lower
            pieces are anchored from the section floor, not the top: our form
            is shorter than Figma's, so Figma's absolute offsets would drop
            them past the floor where overflow-hidden clips them away. */}
        <Asset
          src={SUBMIT_ACCENT.flowers}
          className="pointer-events-none absolute top-[120px] left-[-20px] h-[130px] w-[104px] lg:top-[188px] lg:left-[-60px] lg:h-[237px] lg:w-[190px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.saxophone}
          className="pointer-events-none absolute top-[70px] right-[-22px] h-[200px] w-[125px] lg:top-[100px] lg:right-[-66px] lg:h-[377px] lg:w-[236px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.golfBagTall}
          className="pointer-events-none hidden lg:block absolute top-[21px] left-[calc(50%+278px)] z-40 h-[99px] w-[42px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.kite}
          className="pointer-events-none hidden lg:block absolute top-[218px] left-[calc(50%-400px)] h-[106px] w-[108px] rotate-[26.59deg] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.coffee}
          className="pointer-events-none hidden lg:block absolute bottom-[320px] left-[-11px] h-[170px] w-[167px] object-contain"
        />
        <Asset
          src={SUBMIT_ACCENT.fishPlateNew}
          className="pointer-events-none hidden lg:block absolute bottom-[180px] right-[-26px] h-[232px] w-[160px] object-contain"
        />
        {/* Same kite art as the participate Gems block, sitting against the
            form card's right border (card spans 50%-313px .. 50%+313px). */}
        <Asset
          src={IMG.accentKiteCreator}
          className="pointer-events-none hidden lg:block absolute top-[600px] left-[calc(50%+313px)] h-[153px] w-[119px] scale-x-[-1] object-contain opacity-85"
        />
        <Asset
          src={SUBMIT_ACCENT.golfCart}
          className="pointer-events-none hidden lg:block absolute bottom-0 left-[calc(50%-448px)] z-40 h-[144px] w-[172px] object-contain"
        />

        <div className="relative z-30 mx-auto flex max-w-[1200px] flex-col items-center gap-6 lg:gap-8">
          <div className="flex w-full max-w-[840px] flex-col items-center gap-3">
            <span className="rounded-full bg-pink/8 px-3.5 py-1.5 font-display text-[14px] font-extrabold uppercase tracking-[0.06em] text-pink">
              Submit your entry
            </span>
            {/* Figma 95:339 — cyan #00b4d8 / pink #e91e8c, with the yellow
                wash 178:561 (x=803 y=379, 175x37) behind "Gem". */}
            <div className="relative w-full max-w-[840px]">
              <span
                aria-hidden
                className="pointer-events-none hidden lg:block absolute top-[147px] left-[calc(50%+83px)] h-[37px] w-[175px] bg-[rgba(255,210,0,0.78)]"
              />
              <h1 className="relative text-center font-title text-[44px] leading-[0.78] font-black sm:text-[56px] lg:text-[128px]">
                <span className="text-cyan">Share Your Para&apos;s </span>
                <span className="text-pink">Hidden Gem</span>
              </h1>
            </div>
            <p className="text-center font-body text-[16px] leading-[24px] text-slate sm:text-[17px] sm:leading-[26px]">
              Tell us about the special places, stories, and memories that make your neighborhood
              unique. Stand up for your community and place your neighborhood&apos;s legacy on
              TOI&apos;s historic directory.
            </p>
          </div>

          <SubmissionForm />
        </div>
      </section>

      <GemsDiscovered theme="cyan" gems={content.discoveredGems} gemCount={content.gemCount} />
    </>
  );
}
