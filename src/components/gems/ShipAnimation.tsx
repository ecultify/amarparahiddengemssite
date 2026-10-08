/**
 * The "we're boxing this up" state for the submit button: the logo chest with
 * its lid shutting on the words, looping while the server action is in
 * flight. Same layered PNGs and hinge maths as /dev/logo's "shut" stage, only
 * on a 3s loop and 40px tall; keyframes live in globals.css under .ship.
 */
const PARTS = ["body", "lid", "lidshut", "amarpara", "hidden", "gems", "spark"] as const;

export function ShipAnimation({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`ship relative block h-10 w-[37px] shrink-0 ${className}`}>
      {PARTS.map((part) => (
        <span
          key={part}
          className={`ship-${part} absolute inset-0 bg-contain bg-center bg-no-repeat`}
          style={{ backgroundImage: `url(/images/logo-motion/${part}.png)` }}
        />
      ))}
    </span>
  );
}
