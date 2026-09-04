import { Asset } from "@/components/ui/Asset";
import { Button3D } from "@/components/ui/Button3D";
import { GemsDiscovered } from "@/components/gems/GemsDiscovered";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { User, MapPin, Upload, Check } from "@/components/ui/icons";
import { HOME_ACCENT, IMG, PARTICIPATE_ACCENT } from "@/lib/assets";
import { getContent } from "@/lib/content";

/** Participate — Figma node 95:4 (submit-your-gem-final). */

const STEPS = [
  {
    n: 1,
    Icon: User,
    title: "Log in",
    body: "Enter your mobile number and verify it using the OTP sent to you.",
  },
  {
    n: 2,
    Icon: MapPin,
    title: "Share Your Hidden Gem",
    body: "Tell us about a place, tradition or local favourite from your para that deserves to be known across Kolkata.",
  },
  {
    n: 3,
    Icon: Upload,
    title: "Upload & Submit",
    body: "You may add a photo or video of your hidden gem to support your entry.",
  },
];

const GUIDELINES = [
  "Your hidden gem must be a real place, street, food stall, or building from Kolkata.",
  "Upload clear, relevant photos or videos. Avoid blurry, out-of-focus or stock images.",
  "All entries will be reviewed. Only genuine, original submissions that meet the campaign guidelines will be considered for publication.",
  "Keep it respectful and authentic. Share accurate local context and celebrate your para with pride.",
  "Multiple submissions are welcome. Nominate as many deserving hidden gems from your para as you like.",
];

function Connector() {
  return (
    <div className="relative hidden size-[72px] shrink-0 items-center justify-center md:flex">
      <span className="h-[2px] w-14 rounded-full bg-white/20" />
      <span className="absolute size-3 rotate-45 border-2 border-white/20 bg-green-soft" />
    </div>
  );
}

export default async function ParticipatePage() {
  const content = await getContent();
  return (
    <>
      {/* Section-Hero-Login — Figma 95:35 */}
      <div className="relative w-full">
      {/* Guitar pick 164:59 (x=-23 y=549, 83x101) runs 46px past the hero's
          516px floor, so it lives outside the clip and in front. */}
      <Asset
        src={PARTICIPATE_ACCENT.shell}
        className="pointer-events-none hidden lg:block absolute top-[461px] left-[-23px] z-20 h-[101px] w-[83px] object-contain"
      />
      {/* Below lg the accents live in the top and bottom bands, clear of the copy. */}
      <section className="relative flex w-full items-center overflow-hidden bg-cream px-5 pt-[104px] pb-[124px] md:px-10 lg:h-[516px] lg:px-20 lg:py-0">
        {/* Hero accents — Figma 95:4. The frame includes an 88px navbar, so
            every y below is the Figma value minus 88. Edge pieces that bleed
            past the 1440 canvas stay viewport-anchored; the rest are pinned
            to the centred canvas so they hold on wide screens. */}
        {/* Rainbow kite over the top of "500 Gems." — Figma has it at 131x148
            starting level with the hero's top edge, so y is the Figma value
            minus the 88px navbar the frame includes, same as the rest here. */}
        <Asset
          src={IMG.accentKitePainted}
          className="pointer-events-none hidden lg:block absolute top-[6px] left-[calc(50%-353px)] z-10 h-[148px] w-[131px] rotate-[11deg] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.golfPouch}
          className="pointer-events-none hidden lg:block absolute top-[28px] left-[-17px] h-[111px] w-[100px] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.saxophone}
          className="pointer-events-none absolute top-[6px] left-[-10px] h-[92px] w-[62px] lg:top-[111px] lg:left-[calc(50%-637px)] lg:h-[317px] lg:w-[213px] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.plate}
          className="pointer-events-none hidden lg:block absolute top-[21px] right-[-37px] h-[147px] w-[124px] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.tower}
          className="pointer-events-none absolute right-[-8px] bottom-0 h-[112px] w-[61px] lg:top-[227px] lg:bottom-auto lg:right-[-26px] lg:h-[291px] lg:w-[159px] object-contain"
        />
        <Asset
          src={PARTICIPATE_ACCENT.kingfisher}
          className="pointer-events-none hidden lg:block absolute top-[247px] left-[calc(50%-141px)] h-[38px] w-[36px] object-contain"
        />
        {/* Layer_113 (164:32) stands on the full stop of "500 Gems." — x=921
            y=179, 24x37. z-10 so it reads above the headline. */}
        <Asset
          src={PARTICIPATE_ACCENT.caddie}
          className="pointer-events-none hidden lg:block absolute top-[168px] left-[calc(50%+259px)] z-10 h-[37px] w-[24px] object-contain"
        />
        <Asset
          src={HOME_ACCENT.golfer}
          className="pointer-events-none hidden lg:block absolute top-[406px] left-[calc(50%-287px)] h-[109px] w-[55px] object-contain"
        />
        <Asset
          src={IMG.accentAutoRickshaw}
          className="pointer-events-none hidden lg:block absolute top-[194px] left-[calc(50%+300px)] h-[120px] w-[161px] opacity-90 object-contain"
        />

        <div className="relative z-30 mx-auto flex w-full max-w-[1315px] flex-col items-center gap-8">
          <div data-reveal className="flex flex-col items-center gap-4 text-center">
            {/* Figma 95:40 — the two lines carry different colours (#81429e /
                #e36418), with the pink wash 178:28 (x=491 y=194, 152x34)
                sitting behind the first line. */}
            <div className="relative w-full max-w-[1315px]">
              <span
                aria-hidden
                className="pointer-events-none hidden lg:block absolute top-[59px] left-[calc(50%-246px)] h-[34px] w-[152px] bg-[rgba(233,78,119,0.7)]"
              />
              <h1 className="relative text-center font-title text-[56px] leading-[1.05] font-black sm:text-[78px] lg:text-[128px] lg:leading-[0.78]">
                <span className="text-purple">500 Gems.</span>
                <br />
                <span className="text-orange">One Kolkata.</span>
              </h1>
            </div>
            <p className="text-center font-body text-[18px] leading-[28px] font-medium text-red sm:text-[24px] sm:leading-[36px]">
              Share Your Para&apos;s Hidden Gem
            </p>
            <p className="w-full max-w-[940px] font-body text-[15px] leading-[22px] text-slate sm:text-[16px] sm:leading-[24px]">
              You know your para better than anyone. Share a place, tradition or local
              favourite that deserves to be known beyond your&nbsp;neighbourhood.
            </p>
          </div>

          <div data-reveal="2" className="flex w-full justify-center">
            <Button3D href="/submit" variant="red" className="h-14 w-full max-w-[360px] px-4 text-center sm:h-16 sm:w-auto sm:px-8">
              Log in to participate
            </Button3D>
          </div>
        </div>
      </section>
      </div>

      {/* Section-How-To-Participate — Figma 95:46 */}
      <div className="relative w-full">
      {/* "Frame 1" 178:17 — a brutalist panel straddling the section edge,
          rising 21px into the hero. Sits outside the clip so that overhang
          survives. The PNG already carries its own offset red wash, so the
          separate 178:26 span that used to sit behind it stacked a third
          layer and was removed. */}
      <Asset
        src={PARTICIPATE_ACCENT.dancers}
        className="pointer-events-none hidden lg:block absolute top-[-21px] left-[calc(50%+178px)] z-20 h-[83px] w-[115px] object-contain"
      />
      {/* Derozio statue 178:226 (x=1297 y=1235, 169x346) runs 165px past the
          green floor into Gems Already Discovered. Bottom-anchored so that
          overhang is exact whatever height the section renders at. */}
      <Asset
        src={PARTICIPATE_ACCENT.statue}
        className="pointer-events-none hidden lg:block absolute bottom-[-165px] right-0 z-10 h-[346px] w-[143px] object-contain"
      />
      <section className="relative w-full overflow-hidden bg-green px-5 pt-12 pb-[124px] md:px-10 lg:px-20 lg:pt-[44px] lg:pb-[110px]">
        {/* Dhol 164:62 (x=172 y=1219, 172x204) at the section floor. */}
        <Asset
          src={PARTICIPATE_ACCENT.charkha}
          className="pointer-events-none absolute bottom-[8px] left-[-24px] h-[96px] w-[52px] lg:bottom-[16px] lg:left-[calc(50%-548px)] lg:h-[179px] lg:w-[97px] rotate-[29deg] object-contain"
        />

        <div className="relative z-30 mx-auto flex max-w-[1280px] flex-col items-center gap-10 lg:gap-[44px]">
          <div className="flex w-full flex-col items-center gap-8">
            <SectionHeading
              eyebrow="Step-by-step Guide"
              eyebrowClassName="text-yellow"
              title="How to Participate"
              titleClassName="text-white"
              blurb="Add your para's hidden gem to TOI's Amar Para collection and be credited for the discovery."
              blurbClassName="text-white"
              blurbWidth={800}
            />

            <div data-reveal="1" className="flex w-full flex-col items-center justify-center gap-8 md:flex-row md:items-start md:gap-6">
              {STEPS.map((step, index) => (
                <div key={step.n} className="contents">
                  {index > 0 ? <Connector /> : null}
                  <div className="flex flex-1 flex-col items-center gap-3">
                    <div className="relative flex size-[72px] items-center justify-center rounded-full border-[3px] border-red bg-white text-navy">
                      <step.Icon className="size-7" />
                      <span className="absolute -top-[7px] -right-[7px] flex size-7 items-center justify-center rounded-full bg-red font-display text-[14px] font-extrabold text-white">
                        {step.n}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center text-white">
                      <h3 className="font-display text-[18px] font-extrabold">{step.title}</h3>
                      <p className="font-body text-[14px] leading-[1.5] opacity-90">{step.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* submission-guidelines — Figma 95:88 */}
          <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:gap-12">
            <div data-reveal className="flex w-full flex-col gap-2 lg:w-[360px]">
              <p className="font-body text-[14px] font-bold uppercase tracking-[0.08em] text-yellow">
                Important notes
              </p>
              <h2 className="font-title text-[42px] leading-[1.05] font-black text-white sm:text-[50px] lg:text-[58px]">
                Submission Guidelines
              </h2>
            </div>

            <div className="grid w-full flex-1 grid-cols-1 gap-4 md:grid-cols-2">
              {GUIDELINES.map((text, index) => (
                <div
                  key={text}
                  data-reveal={String(index % 2)}
                  className="flex items-center gap-3 rounded-[16px] border border-white/40 bg-white/80 p-4 shadow-[0_10px_24px_0_rgba(27,42,74,0.08)] md:h-20"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-[12px] bg-green-soft/15 text-green-soft">
                    <Check />
                  </span>
                  <p className="font-body text-[14px] leading-[1.5] text-navy">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

      <GemsDiscovered theme="cream" gems={content.discoveredGems} gemCount={content.gemCount} />
    </>
  );
}
