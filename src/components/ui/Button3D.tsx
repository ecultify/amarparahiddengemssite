import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "yellow" | "outline" | "red";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  // Figma: Button-3D — #ffd200 fill, navy label, hard 4px navy offset shadow.
  yellow: "bg-yellow text-navy btn-3d",
  // Figma: hero secondary CTA — cream fill, navy border, same offset.
  outline: "bg-cream text-navy border-2 border-navy btn-3d",
  // Figma 95:43 — LOG IN TO PARTICIPATE.
  red: "bg-red text-white btn-3d",
};

const SIZES: Record<Size, string> = {
  sm: "h-12 px-8 text-[16px]", // navbar CTA
  md: "h-14 px-8 text-[16px]", // section CTAs
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function Button3D({
  children,
  variant = "yellow",
  size = "md",
  className = "",
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      className={[
        "inline-flex items-center justify-center rounded-[4px]",
        "font-display font-extrabold uppercase tracking-[0.01em]",
        "hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--color-navy)]",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-navy)]",
        SIZES[size],
        VARIANTS[variant],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
