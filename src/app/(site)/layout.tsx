import { ScrollToTop } from "@/components/site/ScrollToTop";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
