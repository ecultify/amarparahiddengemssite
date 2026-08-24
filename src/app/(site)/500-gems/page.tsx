import { Asset } from "@/components/ui/Asset";
import { Button3D } from "@/components/ui/Button3D";
import { GalleryTabs } from "@/components/gems/GalleryTabs";
import { GALLERY_IMG } from "@/lib/assets";
import { getContent } from "@/lib/content";

/** 500 Gems of Kolkata — Figma node 106:272 (gallery-page-final). */
export default async function GalleryPage() {
  const content = await getContent();
  const { gemCount } = content;
  const percent = Math.round((gemCount.discovered / gemCount.total) * 100);

  return (
    <>
      {/* gallery-hero-section — Figma 106:288 */}
      <section className="relative flex w-full flex-col items-center gap-8 overflow-hidden bg-white px-5 py-12 md:px-10 lg:gap-10 lg:px-20 lg:py-20">
        <Asset
          src={GALLERY_IMG.accentKite}
          className="pointer-events-none hidden lg:block absolute top-10 left-[-30px] h-[170px] w-[150px] object-contain opacity-80"
        />
        <Asset
          src={GALLERY_IMG.accentHandRickshaw}
          className="pointer-events-none hidden lg:block absolute top-[60px] right-[-20px] h-[160px] w-[190px] object-contain opacity-85"
        />

        <div className="relative flex w-full max-w-[800px] flex-col items-center gap-4">
          <p className="font-body text-[14px] font-bold uppercase tracking-[0.08em] text-pink">
            Community Gallery
          </p>
          <h1 className="text-center font-title text-[48px] leading-tight font-black text-navy sm:text-[60px] lg:text-[78px]">
            500 Gems of Kolkata
          </h1>
          <p className="text-center font-body text-[16px] leading-[1.6] text-slate sm:text-[18px]">
            Welcome to the living archive of our city. Discover, wander, and celebrate the beautiful
            architectural nooks, local tea joints, and cultural cornerstones suggested and documented
            by citizens.
          </p>
        </div>

        <div className="relative flex w-full max-w-[400px] flex-col items-center gap-3">
          <div className="flex w-full items-start justify-between text-[14px]">
            <span className="font-ui font-extrabold text-navy">
              {gemCount.discovered} GEMS DISCOVERED
            </span>
            <span className="font-ui font-bold text-grey">Goal: {gemCount.total}</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-pink" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {/* bento-gallery-section — Figma 106:316 */}
      <section className="flex w-full flex-col items-center gap-8 bg-white px-5 pt-12 pb-16 md:px-10 lg:px-20 lg:pt-20 lg:pb-[100px]">
        <GalleryTabs
          photoGems={content.photoGems}
          videoGems={content.videoGems}
          streetStories={content.streetStories}
        />
      </section>

      {/* cta-submit-section — Figma 106:420 */}
      <section className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden bg-green-soft px-5 py-16 md:px-10 lg:gap-8 lg:px-20 lg:py-[120px]">
        <Asset
          src={GALLERY_IMG.accentMonument}
          className="pointer-events-none hidden lg:block absolute top-[60px] left-[-40px] h-[280px] w-[180px] object-contain opacity-80"
        />
        <Asset
          src={GALLERY_IMG.accentTempleGreen}
          className="pointer-events-none hidden lg:block absolute top-20 right-[-30px] h-[280px] w-[180px] object-contain opacity-80"
        />
        <h2 className="relative text-center font-title text-[42px] font-black text-black sm:text-[52px] lg:text-[66px]">
          Your Para Has a Story Too
        </h2>
        <p className="relative w-full max-w-[680px] text-center font-body text-[16px] leading-[1.5] text-cream sm:text-[18px]">
          Don&apos;t let the unique history of your street fade away. Document your local addas,
          favorite sweet shops, or historic landmarks and share it with the world.
        </p>
        <Button3D href="/submit" className="relative rounded-[8px]">
          Submit your gem
        </Button3D>
      </section>
    </>
  );
}
