import { Button3D } from "@/components/ui/Button3D";
import { Gem } from "@/components/ui/icons";
import { HeroCarousel } from "@/components/home/HeroCarousel";

/**
 * Hero — Figma 49:1944.
 *
 * Two columns from lg up: the headline stack on the left, the editorial
 * collage carousel on the right. The header sits transparently on top of this
 * section on the homepage, so the left column starts below the oversized logo.
 */
export function Hero({ gemCount }: { gemCount: { discovered: number; total: number } }) {
  return (
    <section className="relative w-full overflow-hidden bg-cream">
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 pt-12 pb-12 md:px-10 sm:pt-[76px] lg:min-h-[713px] lg:pt-[100px] lg:grid-cols-[minmax(0,780px)_minmax(0,1fr)] lg:gap-6 lg:px-20 lg:py-0">
        <div className="flex flex-col">
          <h1 className="font-title text-[44px] leading-[0.88] font-black text-navy uppercase sm:text-[64px] lg:text-[128px]">
            Finding 500 Gems
            <br />
            Across Kolkata&apos;s Paras.
          </h1>

          <p className="mt-6 max-w-[420px] font-body text-[16px] leading-[1.55] text-navy">
            Every para has a gem only locals know about.
            <br />
            Help us uncover 500 hidden gems across Kolkata.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2">
            <Button3D href="/submit" className="w-full px-0 sm:w-[247px]">
              Submit your gem
            </Button3D>
            <Button3D href="/500-gems" variant="outline" className="w-full px-0 sm:w-[247px]">
              Explore gems
            </Button3D>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-yellow text-navy">
              <Gem />
            </span>
            <span className="font-display text-[28px] leading-none font-black text-navy sm:text-[32px]">
              {gemCount.discovered}
            </span>
            <span className="font-body text-[15px] text-navy">
              of {gemCount.total} gems discovered
            </span>
          </div>
        </div>

        {/* Collage leads on mobile, sits in the right column from lg up.
            The header is sticky, so it takes 88px of flow and the section's
            100px top padding pushed the collage a further 100px down. Pulling
            that padding back off this one column lands its top on the header's
            bottom edge, just under the nav CTA. Reclaiming the right gutter
            then widens the column by about as much as the top gained, and since
            the collage is square that is what keeps the bottom edge put — it
            grows upward instead of just sliding up.

            The left column is 580 rather than 660: the widest headline line
            measures 515px in Bebas Kai at 86px, so that column was holding
            145px it never used. Handing most of it over is free width for the
            collage that does not risk overflowing the viewport, which is all
            the right bleed can safely take below ~1700px. */}
        {/* From lg up the collage leaves the grid entirely (its cell was only
            476px wide, and negative margins on grid items do nothing): it is
            pinned to the section's top-right, 692px tall so its bottom edge
            lands level with the gem-counter row, and as wide as the space
            between the 780px headline column and the viewport's right edge
            (width caps at the height, since the art is square). right-0 is the
            viewport edge below 1440px; past that the calc eats the gutter. */}
        <div className="w-full lg:absolute lg:top-0 lg:right-0 lg:h-[692px] lg:w-[calc(100vw-884px)] lg:max-w-[692px] min-[1440px]:right-[calc(720px-50vw)] min-[1440px]:w-[calc(50vw-164px)]">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
