import { categoryTone } from "@/lib/tokens";

export function CategoryTag({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex rounded-[6px] px-[10px] py-[4px] font-ui text-[11px] font-bold uppercase ${categoryTone(category)}`}
    >
      {category}
    </span>
  );
}
