import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";
import { Facebook, Instagram, Twitter } from "@/components/ui/icons";

const LINKS = [
  { label: "500 Gems", href: "/500-gems" },
  { label: "Gallery", href: "/500-gems#gallery" },
  { label: "T&C", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "X", href: "https://x.com", Icon: Twitter },
];

export function SiteFooter() {
  return (
    <>
      {/* "i am Kolkata" sits *inside* the tail of whatever comes last rather
          than on a band of its own, so no strip of page background opens up
          between that section and the footer. The submission page's cyan
          section supplies its own cream division for this to land on. */}
      {/* The pull-up has to stay inside the preceding section's bottom padding,
          which is 64px on mobile against 100px+ from lg up. */}
      {/* pointer-events-none: the band overlaps the CTA row above it, and a
          full-width overlay would otherwise eat clicks on those buttons. */}
      <div className="pointer-events-none relative z-10 -mt-[56px] w-full lg:-mt-[102px]">
        <div className="mx-auto max-w-[1440px] px-5 pb-2 md:px-10 lg:px-20">
          {/* The mark is centred over the masthead below: this box is exactly
              the masthead's width and starts on the same left edge. */}
          <div className="flex w-[160px] justify-center sm:w-[210px]">
            <Asset
              data-reveal
              src={IMG.logoIAmKolkata}
              alt="I am Kolkata"
              className="h-[54px] w-[86px] object-contain lg:h-[76px] lg:w-[120px]"
            />
          </div>
        </div>
      </div>

      <footer className="relative w-full">
      <div className="w-full bg-pink">
      <div className="mx-auto max-w-[1440px] px-5 pt-[6px] md:px-10 lg:px-20">
        <Asset data-reveal src={IMG.logoToi} alt="The Times of India" className="h-[49px] w-[160px] object-contain object-left sm:h-[64px] sm:w-[210px]" />

        <div className="flex flex-col items-start justify-between gap-8 pt-[6px] pb-5 lg:flex-row lg:gap-0">
          <p className="w-full max-w-[360px] font-body text-[14px] leading-[1.6] text-white/80">
            Amar Para Hidden Gems is a citizen-led initiative by{" "}
            <span className="whitespace-nowrap">The Times of India</span>, celebrating the places,
            people and stories that define Kolkata&apos;s paras (neighbourhoods) and bringing their
            lesser-known gems to a wider audience.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 font-body text-[14px] text-white">
            {LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="opacity-80 hover:opacity-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
      </div>

      {/* Socials sit below the pink band on the page cream, as filled pink
          discs — Figma puts them outside the footer frame on every page. */}
      <div className="w-full bg-cream">
        <div className="mx-auto flex max-w-[1440px] gap-5 px-5 pt-5 pb-[18px] md:px-10 lg:px-20">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-pink text-white transition-opacity hover:opacity-80"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
      </footer>
    </>
  );
}
