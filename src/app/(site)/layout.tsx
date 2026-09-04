import { Reveal } from "@/components/site/Reveal";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Reveal />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
