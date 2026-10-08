import { Asset } from "@/components/ui/Asset";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { MapPin } from "@/components/ui/icons";
import type { Gem } from "@/data/site";

type Props = {
  gem: Gem;
  /** Homepage cards use teal titles; the directory cards use navy. */
  titleTone?: "teal" | "navy";
  /** `half`: one of two text cards stacked in a single rail column. It gives
   *  up its own width and minimum height and instead splits the column's
   *  height with its sibling, so the pair stands as tall as a photo card. */
  size?: "full" | "half";
  /** Set on the duplicated half of a looping rail, so the copies are not
   *  read out twice. */
  "aria-hidden"?: boolean;
};

/** gem-card — Figma 49:1963 / 95:377. 280x360, 180px image, 20px body. */
export function GemCard({ gem, titleTone = "teal", size = "full", ...rest }: Props) {
  const half = size === "half";
  return (
    <article
      {...rest}
      className={`flex w-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_8px_16px_0_rgba(27,42,74,0.06)] ${
        half ? "min-h-0 flex-1" : "min-h-[360px] shrink-0 snap-start sm:w-[280px]"
      }`}
    >
      {/* Written tales come out of the gallery without a photo — their card
          is the same card, minus the image strip. */}
      {gem.image ? (
        <Asset src={gem.image} alt={gem.title} className="h-[180px] w-full shrink-0 object-cover" />
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 p-5">
        <div className="flex flex-col items-start gap-2">
          <CategoryTag category={gem.category} />
          {gem.submittedBy ? (
            <span className="truncate font-ui text-[12px] text-slate/80">
              Uncovered by {gem.submittedBy}
            </span>
          ) : null}
          <h3
            className={`font-display text-[18px] leading-tight font-extrabold ${
              titleTone === "teal" ? "text-teal" : "text-navy"
            }`}
          >
            {gem.title}
          </h3>
          {/* A resident's line about the place, where the doc supplies one. */}
          {gem.description ? (
            <p
              className={`${half ? "line-clamp-3" : gem.image ? "line-clamp-4" : "line-clamp-[9]"} font-body text-[13px] leading-[1.45] text-slate`}
            >
              {gem.description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-pink" />
          <span className="truncate font-ui text-[13px] font-semibold text-slate">{gem.location}</span>
        </div>
      </div>
    </article>
  );
}
