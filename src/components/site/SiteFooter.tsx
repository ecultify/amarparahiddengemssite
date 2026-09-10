import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";
import { Facebook, Instagram, Twitter } from "@/components/ui/icons";

/** Two titled columns give the right side the vertical mass the paragraph has
 *  on the left; the social tray closes that same column. */
const COLUMNS = [
  {
    title: "Explore the Gems",
    links: [
      { label: "Gallery", href: "/500-gems#gallery" },
      { label: "Articles & Features", href: "/#articles" },
      { label: "Chronicles of Kolkata", href: "/#stories" },
      { label: "Creator Discoveries", href: "/#creator-trails" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "How to Participate", href: "/participate" },
      { label: "Submit your Gem", href: "/submit" },
      { label: "T&C", href: "/terms" },
      {
        label: "Privacy Policy",
        href: "https://timesofindia.indiatimes.com/privacy-policy/cookiepolicy/86934312.cms",
      },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "X", href: "https://x.com", Icon: Twitter },
];

export function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-pink">
      {/* The only band on the site with bare walls — the rainbow kite from the
          gallery hero drifts in the top-right gutter. */}
      <Asset
        data-reveal
        src={IMG.accentKiteRainbow}
        className="pointer-events-none absolute top-[6px] right-[-26px] hidden h-[124px] w-[110px] rotate-[14deg] object-contain lg:block"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-6 pb-8 md:px-10 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div>
            {/* The mark is centred over the masthead below: this box is exactly
                the masthead's width and starts on the same left edge. It uses
                the white cut of the artwork, since the band behind it is pink. */}
            <div className="flex w-[160px] justify-center sm:w-[210px]">
              <Asset
                data-reveal
                src={IMG.logoIAmKolkataWhite}
                alt="I am Kolkata"
                className="h-[54px] w-[86px] object-contain lg:h-[76px] lg:w-[120px]"
              />
            </div>

            <Asset
              data-reveal
              src={IMG.logoToi}
              alt="The Times of India"
              className="h-[49px] w-[160px] object-contain object-left sm:h-[64px] sm:w-[210px]"
            />

            <p className="mt-[6px] w-full max-w-[360px] font-body text-[14px] leading-[1.6] text-white/80">
              Amar Para Hidden Gems is a citizen-led initiative by{" "}
              <span className="whitespace-nowrap">The Times of India</span>, celebrating the places,
              people and stories that define Kolkata&apos;s paras (neighbourhoods) and bringing
              their lesser-known gems to a wider audience.
            </p>
          </div>

          {/* Links and socials share one column, so the band ends together. */}
          <div className="flex flex-col gap-8 lg:pt-2 lg:pr-10">
            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              {COLUMNS.map((column) => (
                <div key={column.title} className="flex flex-col gap-3">
                  <span className="font-display text-[12px] font-extrabold tracking-[0.12em] text-white/60 uppercase">
                    {column.title}
                  </span>
                  {column.links.map((link) =>
                    link.href.startsWith("http") ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-body text-[14px] text-white opacity-80 hover:opacity-100"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="font-body text-[14px] text-white opacity-80 hover:opacity-100"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              ))}
            </div>

            {/* White discs, since a pink disc would disappear into the band. */}
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
        </div>
      </div>
    </footer>
  );
}
