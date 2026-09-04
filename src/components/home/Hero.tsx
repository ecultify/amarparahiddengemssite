import { Button3D } from "@/components/ui/Button3D";
import { Gem } from "@/components/ui/icons";
import { HeroCarousel } from "@/components/home/HeroCarousel";

/**
 * Hero — Figma 49:1944.
 *
 * Two columns from lg up: the headline stack on the left, the editorial
 * collage carousel on the right. The header sits transparently on top of this
 * section on the homepage, so the left column starts below the oversized logo.
 * Below lg everything centres and the spacing tightens so most of the collage
 * is on screen at first glance.
 */
export function Hero({ gemCount }: { gemCount: { discovered: number; total: number } }) {
  return (
    <section className="relative w-full overflow-hidden bg-cream">
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-6 px-5 pt-12 pb-10 md:px-10 sm:pt-[60px] lg:min-h-[713px] lg:pt-[100px] lg:grid-cols-[minmax(0,780px)_minmax(0,1fr)] lg:gap-6 lg:px-20 lg:py-0">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Two lines below lg, three from lg up, so no line carries a lone word. */}
          <h1
            data-reveal
            className="font-title text-[38px] leading-[1.05] font-black text-navy uppercase sm:text-[60px] lg:text-[108px] lg:leading-[0.88]"
          >
            Finding 500
            <br className="hidden lg:block" /> Gems
            <br className="lg:hidden" /> Across
            <br className="hidden lg:block" /> Kolkata&apos;s Paras.
          </h1>

          <p
            data-reveal="1"
            className="mt-4 max-w-[720px] font-body text-[18px] leading-[1.4] text-navy lg:mt-6 lg:text-[30px] lg:leading-[1.3]"
          >
            Every para has a gem only locals know about.
            <br className="hidden lg:block" /> Help us uncover 500 hidden gems across Kolkata.
          </p>

          <div data-reveal="2" className="mt-5 flex w-full flex-row items-center gap-3 sm:w-auto sm:gap-2 lg:mt-8">
            <Button3D href="/submit" className="flex-1 whitespace-nowrap max-sm:px-2 max-sm:text-[14px] sm:w-[247px] sm:flex-none">
              Submit your gem
            </Button3D>
            <Button3D href="/500-gems" variant="outline" className="flex-1 whitespace-nowrap max-sm:px-2 max-sm:text-[14px] sm:w-[247px] sm:flex-none">
              Explore gems
            </Button3D>
          </div>

          <div data-reveal="3" className="mt-5 flex items-center gap-3 lg:mt-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-yellow text-navy">
              <Gem />
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-[28px] leading-none font-black text-navy sm:text-[32px]">
                {gemCount.discovered}
              </span>
              <span className="font-body text-[18px] text-navy sm:text-[20px]">
                of {gemCount.total} gems discovered
              </span>
            </span>
          </div>
        </div>

        {/* From lg up the collage leaves the grid entirely (its cell was only
            476px wide, and negative margins on grid items do nothing): it is
            pinned to the section's top-right, 640px tall so its bottom edge
            lands level with the gem-counter row, and as wide as the space
            between the 780px headline column and the viewport's right edge
            (width caps at the height, since the art is square). right-0 is the
            viewport edge below 1440px; past that the calc eats the gutter. */}
        <div
          data-reveal="1"
          className="w-full lg:absolute lg:top-[52px] lg:right-0 lg:h-[640px] lg:w-[calc(100vw-884px)] lg:max-w-[640px] min-[1440px]:right-[calc(720px-50vw)] min-[1440px]:w-[calc(50vw-164px)]"
        >
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
