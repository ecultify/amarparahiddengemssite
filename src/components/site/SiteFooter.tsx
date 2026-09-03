import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";
import { Facebook, Instagram, Twitter } from "@/components/ui/icons";

const COLUMN_ONE = [
  { label: "About", href: "/about" },
  { label: "Exhibitions", href: "/exhibitions" },
  { label: "Participate", href: "/participate" },
  { label: "500 Gems", href: "/500-gems" },
];

const COLUMN_TWO = [
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
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
          {/* Both marks carry transparent padding inside their own files —
              9/157 here, 54/387 on the masthead — so each needs its own pull to
              put the visible artwork on the same left edge as the body copy
              below. Aligning the boxes instead would leave them staggered. */}
          <Asset
            src={IMG.logoIAmKolkata}
            alt="I am Kolkata"
            className="-ml-[4px] h-[48px] w-[77px] object-contain lg:-ml-[9px] lg:h-[94px] lg:w-[150px]"
          />
        </div>
      </div>

      <footer className="relative w-full">
      <div className="w-full bg-pink">
      <div className="mx-auto max-w-[1440px] px-5 pt-[6px] md:px-10 lg:px-20">
        <Asset src={IMG.logoToi} alt="The Times of India" className="-ml-[31px] h-[56px] w-[220px] object-contain sm:-ml-[40px] sm:h-[74px] sm:w-[290px] lg:-ml-[41px]" />

        <div className="flex flex-col items-start justify-between gap-8 pt-[6px] pb-5 lg:flex-row lg:gap-0">
          <p className="w-full max-w-[360px] font-body text-[14px] leading-[1.6] text-white/80">
            Amar Para Hidden Gems is a citizen-led initiative by The Times of India, celebrating
            the places, people and stories that define Kolkata&apos;s paras (neighbourhoods) and
            bringing their lesser-known gems to a wider audience.
          </p>

          <div className="flex w-full flex-col gap-4 font-body text-[14px] text-white sm:flex-row sm:justify-between lg:w-[634px]">
            <div className="flex flex-wrap gap-4 sm:flex-1">
              {COLUMN_ONE.map((link) => (
                <Link key={link.label} href={link.href} className="opacity-80 hover:opacity-100">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-1">
              {COLUMN_TWO.map((link) => (
                <Link key={link.label} href={link.href} className="opacity-80 hover:opacity-100">
                  {link.label}
                </Link>
              ))}
            </div>
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
