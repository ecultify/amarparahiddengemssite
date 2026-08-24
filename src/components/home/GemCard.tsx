import { Asset } from "@/components/ui/Asset";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { MapPin } from "@/components/ui/icons";
import type { Gem } from "@/data/site";

type Props = {
  gem: Gem;
  /** Homepage cards use teal titles; the directory cards use navy. */
  titleTone?: "teal" | "navy";
};

/** gem-card — Figma 49:1963 / 95:377. 280x360, 180px image, 20px body. */
export function GemCard({ gem, titleTone = "teal" }: Props) {
  return (
    <article className="flex h-[360px] w-[280px] shrink-0 flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_8px_16px_0_rgba(27,42,74,0.06)]">
      <Asset src={gem.image} alt={gem.title} className="h-[180px] w-full shrink-0 object-cover" />
      <div className="flex min-h-0 flex-1 flex-col justify-between p-5">
        <div className="flex flex-col items-start gap-2">
          <CategoryTag category={gem.category} />
          <h3
            className={`font-display text-[18px] leading-tight font-extrabold ${
              titleTone === "teal" ? "text-teal" : "text-navy"
            }`}
          >
            {gem.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-pink" />
          <span className="truncate font-ui text-[13px] font-semibold text-slate">{gem.location}</span>
        </div>
      </div>
    </article>
  );
}
