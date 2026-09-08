import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";
import { Facebook, Instagram, Twitter } from "@/components/ui/icons";

const LINKS = [
  { label: "How to Participate", href: "/participate" },
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
    <footer className="relative w-full bg-pink">
      <div className="mx-auto max-w-[1440px] px-5 pt-6 pb-6 md:px-10 lg:px-20">
        {/* The mark is centred over the masthead below: this box is exactly
            the masthead's width and starts on the same left edge. It uses the
            white cut of the artwork, since the band behind it is pink. */}
        <div className="flex w-[160px] justify-center sm:w-[210px]">
          <Asset
            data-reveal
            src={IMG.logoIAmKolkataWhite}
            alt="I am Kolkata"
            className="h-[54px] w-[86px] object-contain lg:h-[76px] lg:w-[120px]"
          />
        </div>

        <Asset data-reveal src={IMG.logoToi} alt="The Times of India" className="h-[49px] w-[160px] object-contain object-left sm:h-[64px] sm:w-[210px]" />

        <div className="flex flex-col items-start justify-between gap-8 pt-[6px] pb-6 lg:flex-row lg:gap-0">
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

        {/* Socials close the same pink band. White discs, since a pink disc
            would disappear into it. */}
        <div className="flex gap-5 border-t border-white/20 pt-6">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-white text-pink transition-opacity hover:opacity-80"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
