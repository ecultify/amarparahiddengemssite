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
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-12 md:px-10 lg:min-h-[713px] lg:pt-[100px] lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-6 lg:px-20 lg:py-0">
        <div className="flex flex-col">
          <h1 className="font-title text-[60px] leading-[0.88] font-black text-navy uppercase sm:text-[92px] lg:text-[144px]">
            500 Gems.
            <br />
            One Kolkata.
          </h1>

          <p className="mt-6 max-w-[420px] font-body text-[16px] leading-[1.55] text-navy">
            Every para has a story.
            <br />
            Every story is a gem.
            <br />
            Help us discover 500 hidden gems of Kolkata.
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

        {/* Collage leads on mobile, sits in the right column from lg up. */}
        <div className="order-first w-full lg:order-none">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
