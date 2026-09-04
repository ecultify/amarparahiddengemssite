/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** Scroll-reveal hook, forwarded to the <img>. */
  "data-reveal"?: string;
};

/**
 * Thin wrapper around <img> for Figma-exported artwork in /public/images.
 *
 * Plain <img> rather than next/image on purpose: these are fixed-size design
 * assets placed at exact coordinates, and next/image's layout wrapper fights
 * the absolute positioning the design relies on. Artwork is transparent PNG, so
 * never give these a background — it shows through as a box behind the cutout.
 */
export function Asset({ src, alt = "", className = "", ...rest }: Props) {
  return <img data-asset src={src} alt={alt} className={className} {...rest} />;
}
