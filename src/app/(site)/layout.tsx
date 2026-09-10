import { Reveal } from "@/components/site/Reveal";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * Every public page reads the CMS, so none of them may be answered from a
 * build-time snapshot: an editor's save has to show on the next request.
 * Without this Next prerenders them at build - when the database is a fresh
 * clone's defaults - and serves that for a year.
 */
export const dynamic = "force-dynamic";

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
