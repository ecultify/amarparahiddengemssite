"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button3D } from "@/components/ui/Button3D";
import { Asset } from "@/components/ui/Asset";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { IMG } from "@/lib/assets";

const NAV = [
  { label: "Explore the Gems", href: "/500-gems" },
  { label: "Participate", href: "/participate" },
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

        {/* Nav sits right beside the CTA, per the design feedback. */}
        <div className="flex items-center gap-5 sm:gap-8 lg:gap-10">
          <nav className="hidden items-center gap-5 sm:flex lg:gap-8">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-start justify-center gap-1"
                >
                  <span
                    className={`font-ui text-[15px] transition-colors duration-150 ${
                      active
                        ? "font-extrabold text-red"
                        : "font-semibold text-navy hover:text-red"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`h-[2px] w-4 rounded-[1px] transition-colors duration-150 ${
                      active ? "bg-red" : "bg-transparent"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button3D href="/submit" size="sm">
              Submit your gem
            </Button3D>
          </div>

          {/* Below sm the nav collapses into a hamburger that opens a sidebar
              carrying the same links plus the CTA. Links close the sheet. */}
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="icon-btn flex size-11 items-center justify-center rounded-full border-2 border-navy bg-cream text-navy sm:hidden"
            >
              <MenuIcon className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-cream p-6 pt-20 text-navy">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col gap-2">
                {NAV.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className={`rounded-[6px] px-3 py-3 font-ui text-[18px] ${
                        isActive(item.href)
                          ? "font-extrabold text-red"
                          : "font-semibold text-navy"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button3D href="/submit" size="sm" className="mt-4 w-full px-0">
                  Submit your gem
                </Button3D>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
