/**
 * UI chrome icons (chevrons, arrows, pin, upload, social). These are plain
 * geometric glyphs in the design with no brand-specific drawing, so they are
 * drawn inline here to keep them crisp and recolourable. Every *artwork* asset
 * — logos, collage, photography, illustrated accents — comes from the Figma
 * export in /public/images instead.
 */
type IconProps = { className?: string };

export const ChevronLeft = ({ className = "size-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ className = "size-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ArrowLeft = ({ className = "size-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export const ArrowRight = ({ className = "size-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const MapPin = ({ className = "size-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);

export const UploadCloud = ({ className = "size-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 13v8" />
    <path d="m8 17 4-4 4 4" />
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </svg>
);

export const Gem = ({ className = "size-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
  </svg>
);

export const Facebook = ({ className = "size-[18px]" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.46-4 4.15V9.9H7.6V13h2.7v8h3.2Z" />
  </svg>
);

export const Instagram = ({ className = "size-[18px]" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const Twitter = ({ className = "size-[18px]" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.5 3h3l-6.55 7.48L21.7 21h-5.9l-4.62-6.03L5.9 21H2.9l7-8-6.9-10h6.05l4.18 5.52L17.5 3Zm-1.05 16.2h1.66L7.63 4.72H5.85l10.6 14.48Z" />
  </svg>
);

export const User = ({ className = "size-7" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const Upload = ({ className = "size-7" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const Check = ({ className = "size-3.5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m5 13 4 4L19 7" />
  </svg>
);
