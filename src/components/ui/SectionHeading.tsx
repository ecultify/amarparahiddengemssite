import type { ReactNode } from "react";

type Props = {
  /** Small all-caps eyebrow above the title. */
  eyebrow: string;
  eyebrowClassName?: string;
  title: ReactNode;
  titleClassName?: string;
  blurb?: string;
  blurbClassName?: string;
  blurbWidth?: number;
};

/**
 * The eyebrow / display title / blurb stack repeated at the top of every
 * section in the design (Explore the Gems, Stories from the Paras, Creator
 * Trails, Articles & Features).
 */
export function SectionHeading({
  eyebrow,
  eyebrowClassName = "text-cyan",
  title,
  titleClassName = "text-ink",
  blurb,
  blurbClassName = "text-body-muted",
  blurbWidth = 600,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className={`font-body text-[14px] font-bold uppercase tracking-[0.08em] ${eyebrowClassName}`}>
        {eyebrow}
      </p>
      <h2 className={`text-center font-title text-[42px] leading-[1.05] font-black sm:text-[50px] lg:text-[58px] ${titleClassName}`}>
        {title}
      </h2>
      {blurb ? (
        <p
          className={`w-full text-center font-body text-[15px] leading-[1.5] sm:text-[16px] ${blurbClassName}`}
          style={{ maxWidth: blurbWidth }}
        >
          {blurb}
        </p>
      ) : null}
    </div>
  );
}
