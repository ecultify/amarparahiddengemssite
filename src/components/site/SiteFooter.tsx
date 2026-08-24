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
      {/* "i am Kolkata" sits on a cream division of its own between the last
          section and the pink footer. On pages whose last section is already
          cream this reads as continuous; on the submission page it is the white
          break the design puts under the cyan, and it is what gives the
          overhanging playground somewhere to stand. Height is set so that
          170px-tall overhang clears the footer. */}
      <div className="relative z-10 w-full bg-cream py-10">
        <div className="mx-auto max-w-[1440px] px-5 pb-2 md:px-10 lg:px-20">
          {/* Figma 49:2160 sets the box at x=100, 20px past the 80px gutter. */}
          <Asset
            src={IMG.logoIAmKolkata}
            alt="I am Kolkata"
            className="h-[48px] w-[77px] object-contain lg:ml-5 lg:h-[94px] lg:w-[150px]"
          />
        </div>
      </div>

      <footer className="relative w-full">
      <div className="w-full bg-pink">
      <div className="mx-auto max-w-[1440px] px-5 pt-[6px] md:px-10 lg:px-20">
        {/* Figma 49:2195 sets the box at x=39, so the masthead artwork lines up
            with the body copy below rather than with the 80px gutter. */}
        <Asset src={IMG.logoToi} alt="The Times of India" className="h-[56px] w-[220px] object-contain sm:h-[74px] sm:w-[290px] lg:-ml-[41px]" />

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
