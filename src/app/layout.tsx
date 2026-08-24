import type { Metadata } from "next";
// Self-hosted via Fontsource so the build has no network dependency on Google
// Fonts. Weights match the Figma type styles: Outfit 400-900 (display),
// Manrope 400-800 (UI + admin), Fira Sans 400 (body copy).
import "@fontsource-variable/outfit";
import "@fontsource-variable/manrope";
import "@fontsource/fira-sans/400.css";
import "@fontsource/fira-sans/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amar Para 2.0 — 500 Gems. One Kolkata.",
  description:
    "A citizen-driven Times of India initiative mapping 500 hidden gems across Kolkata's paras: the food, the places, the traditions and the people.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Headings are sized for Bebas Kai's condensed metrics, so a late swap
            from the wide fallback would visibly reflow. 32KB, fetched early. */}
        <link
          rel="preload"
          href="/Fonts/BebasKai.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Fonts/AdelleSans-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
