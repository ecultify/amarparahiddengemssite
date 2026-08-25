/**
 * The "we're boxing this up" state for the submit button.
 *
 * Deliberately an inline SVG with CSS keyframes rather than a Lottie or a GIF:
 * it inherits currentColor, weighs nothing, and the global
 * prefers-reduced-motion rule already flattens it to a static parcel.
 * Swap the shapes for the supplied box animation when it arrives — the button
 * only depends on this rendering at 24px tall.
 */
export function ShipAnimation({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 26"
      aria-hidden
      className={`ship h-[26px] w-[44px] shrink-0 overflow-visible ${className}`}
      fill="none"
    >
      {/* ground the parcel travels along */}
      <g className="ship-line" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.35">
        <path d="M2 23h6M12 23h5M21 23h4" />
      </g>

      <g className="ship-parcel">
        {/* the entry, dropping in */}
        <rect
          data-part
          className="ship-note"
          x="13.5"
          y="4"
          width="11"
          height="8"
          rx="1.5"
          fill="currentColor"
          opacity="0.9"
        />
        {/* box body */}
        <path
          data-part
          d="M8 10h22v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9Z"
          fill="currentColor"
        />
        {/* lid, hinged at its left edge */}
        <rect
          data-part
          className="ship-lid"
          x="7"
          y="6.5"
          width="24"
          height="4"
          rx="1.2"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
