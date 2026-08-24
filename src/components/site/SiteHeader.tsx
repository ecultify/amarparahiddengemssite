"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button3D } from "@/components/ui/Button3D";
import { Asset } from "@/components/ui/Asset";
import { IMG } from "@/lib/assets";

const NAV = [
  { label: "Home", href: "/" },
  { label: "500 Gems", href: "/500-gems" },
  { label: "Stories", href: "/#stories" },
  { label: "Creator Trails", href: "/#creator-trails" },
  { label: "Participate", href: "/participate" },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faqs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // On the homepage the bar starts transparent with an oversized logo hanging
  // over the hero (Figma 49:1944 bakes it in at 161px, x40/y17); scrolling
  // collapses it back into the ordinary navbar.
  const heroMode = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    // In-page anchors (Stories, Creator Trails) never take the active state.
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        heroMode ? "border-b-2 border-transparent bg-transparent" : "border-b-2 border-line bg-cream"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:h-[88px] lg:px-20">
        {/* Fixed-width box so the row never reflows; the logo itself scales out
            of it and overhangs into the hero while heroMode is on. */}
        <Link href="/" className="relative z-10 block size-12 shrink-0 lg:size-14">
          <Asset
            src={IMG.logoHiddenGems}
            alt="Amar Para Hidden Gems"
            className={`absolute top-0 left-0 max-w-none origin-top-left object-contain transition-all duration-300 ${
              heroMode
                ? "size-24 sm:size-32 lg:size-40"
                : "size-12 lg:size-14"
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex xl:gap-8">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-start justify-center gap-1"
              >
                <span
                  className={
                    active
                      ? "font-ui text-[15px] font-extrabold text-red"
                      : "font-ui text-[15px] font-semibold text-navy hover:text-red"
                  }
                >
                  {item.label}
                </span>
                {active ? <span className="h-[2px] w-4 rounded-[1px] bg-red" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button3D href="/submit" size="sm">
            Submit your gem
          </Button3D>
        </div>

      </div>
    </header>
  );
}
