export const metadata = {
  title: "Logo motion — Amar Para Hidden Gems",
  robots: { index: false, follow: false },
};

/**
 * Dev preview for the animated logo. Deliberately outside the (site) group so
 * it carries no header, footer or copy — three looping stages and nothing else.
 *
 * The logo is six PNGs cut from the PSD and re-registered on one canvas, so
 * every piece can be stacked at inset 0 and moved on its own. The lid pivots on
 * the box's back-top edge, a line at -8.09deg; CSS only scales along an axis,
 * so the hinge transforms un-rotate that line, scale, and rotate back.
 */

const PARTS = ["body", "lid", "lidshut", "amarpara", "hidden", "gems", "spark"] as const;

function Stage({ variant }: { variant: "shut" | "open" | "stack" }) {
  return (
    <div className={`stage ${variant}`}>
      {PARTS.map((part) => (
        <span key={part} className={`layer lm-${part}`} />
      ))}
    </div>
  );
}

export default function LogoMotionPage() {
  return (
    <main className="wrap">
      <style>{CSS}</style>
      <Stage variant="shut" />
      <Stage variant="open" />
      <Stage variant="stack" />
    </main>
  );
}

/* The hinge line, and the two states either side of it. */
const SHUT = "rotate(-8.09deg) scaleY(0) rotate(8.09deg)";
const OPEN = "rotate(-8.09deg) scaleY(1) rotate(8.09deg)";

const CSS = `
.wrap {
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px 20px;
  background: #fcf8f2;
}
.stage {
  position: relative;
  width: min(340px, 88vw);
  aspect-ratio: 1800 / 1936;
}
.layer {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  will-change: transform, opacity;
}
.lm-body     { background-image: url(/images/logo-motion/body.png) }
.lm-lid      { background-image: url(/images/logo-motion/lid.png) }
.lm-lidshut  { background-image: url(/images/logo-motion/lidshut.png) }
.lm-amarpara { background-image: url(/images/logo-motion/amarpara.png) }
.lm-hidden   { background-image: url(/images/logo-motion/hidden.png) }
.lm-gems     { background-image: url(/images/logo-motion/gems.png) }
.lm-spark    { background-image: url(/images/logo-motion/spark.png) }

/* Every lid piece turns on the same hinge. */
.lm-lid, .lm-lidshut, .lm-amarpara { transform-origin: 48.8% 48.7% }

/* ---- 1. shut the lid: rests open, closes, reopens ---- */
.shut .lm-lid, .shut .lm-amarpara { animation: sLid 6s ease-in-out infinite }
.shut .lm-lidshut              { animation: sShut 6s ease-in-out infinite }
.shut .lm-hidden               { animation: sHidden 6s ease-in-out infinite }
.shut .lm-spark                { animation: sSpark 6s ease-in-out infinite }

@keyframes sLid {
  0%, 20% { transform: ${OPEN} }
  30%, 74% { transform: ${SHUT} }
  84%, 100% { transform: ${OPEN} }
}
@keyframes sShut {
  0%, 27% { transform: ${SHUT} }
  36%, 70% { transform: none }
  78%, 100% { transform: ${SHUT} }
}
@keyframes sHidden {
  0%, 18% { transform: none; opacity: 1 }
  28%, 76% { transform: translateY(7%) scale(.88); opacity: 0 }
  88%, 100% { transform: none; opacity: 1 }
}
@keyframes sSpark {
  0%, 33% { opacity: 1; transform: none }
  38% { opacity: 1; transform: scale(1.5) }
  43%, 100% { opacity: 1; transform: none }
}

/* ---- 2. open the chest: rests shut, opens, the words climb out ---- */
.open .lm-lidshut  { animation: oShut 6s ease-in-out infinite }
.open .lm-lid      { animation: oLid 6s ease-in-out infinite }
.open .lm-amarpara { animation: oTitle 6s ease-in-out infinite }
.open .lm-hidden   { animation: oRise 6s ease-in-out infinite }
.open .lm-spark    { animation: oSpark 6s ease-in-out infinite }

@keyframes oShut {
  0%, 14% { transform: none }
  22%, 82% { transform: ${SHUT} }
  90%, 100% { transform: none }
}
@keyframes oLid {
  0%, 20% { transform: ${SHUT} }
  33% { transform: rotate(-8.09deg) scaleY(1.06) rotate(8.09deg) }
  38%, 80% { transform: ${OPEN} }
  88%, 100% { transform: ${SHUT} }
}
@keyframes oTitle {
  0%, 30% { transform: ${SHUT}; opacity: 0 }
  40%, 80% { transform: ${OPEN}; opacity: 1 }
  86%, 100% { transform: ${SHUT}; opacity: 0 }
}
@keyframes oRise {
  0%, 34% { transform: translateY(9%) scale(.85); opacity: 0 }
  46%, 80% { transform: none; opacity: 1 }
  87%, 100% { transform: translateY(9%) scale(.85); opacity: 0 }
}
@keyframes oSpark {
  0%, 48% { opacity: 1; transform: none }
  53% { opacity: 1; transform: scale(1.6) }
  58%, 100% { opacity: 1; transform: none }
}

/* ---- 3. stack it up: the pieces fly together, hold, and reset ---- */
.stack .lm-body     { animation: kBody 6s ease-out infinite }
.stack .lm-lid      { animation: kLid 6s cubic-bezier(.2,1.2,.3,1) infinite }
.stack .lm-amarpara { animation: kTitle 6s cubic-bezier(.2,1.3,.3,1) infinite }
.stack .lm-hidden   { animation: kLeft 6s cubic-bezier(.2,1.2,.3,1) infinite }
.stack .lm-gems     { animation: kRight 6s cubic-bezier(.2,1.2,.3,1) infinite }
.stack .lm-spark    { animation: kSpark 6s ease-out infinite }
.stack .lm-lidshut  { display: none }
.stack .lm-lid, .stack .lm-amarpara { transform-origin: 50% 50% }

@keyframes kBody {
  0% { transform: scale(1.06); opacity: 0 }
  7%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: scale(1.04); opacity: 0 }
}
@keyframes kLid {
  0%, 2% { transform: translateY(-30%); opacity: 0 }
  12%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: translateY(-14%); opacity: 0 }
}
@keyframes kTitle {
  0%, 5% { transform: translateY(-30%); opacity: 0 }
  15%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: translateY(-14%); opacity: 0 }
}
@keyframes kLeft {
  0%, 7% { transform: translateX(-38%); opacity: 0 }
  18%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: translateX(-16%); opacity: 0 }
}
@keyframes kRight {
  0%, 9% { transform: translateX(38%); opacity: 0 }
  20%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: translateX(16%); opacity: 0 }
}
@keyframes kSpark {
  0%, 22% { opacity: 0; transform: scale(.4) }
  27% { opacity: 1; transform: scale(1.5) }
  32%, 90% { opacity: 1; transform: none }
  97%, 100% { opacity: 0; transform: none }
}

@media (prefers-reduced-motion: reduce) {
  .layer { animation: none !important; transform: none !important; opacity: 1 !important }
  .lm-lidshut { display: none }
}
`;
