"use client";

import { useRef, useState } from "react";

const OTP_LENGTH = 6;
const FIELD =
  "h-[52px] w-full rounded-[8px] border border-line bg-white px-4 font-body text-[16px] text-navy transition-colors duration-150 placeholder:text-slate focus:border-pink";

/**
 * Dummy phone verification gating the submit button.
 *
 * There is no SMS provider wired up yet, so requesting a code just reveals the
 * slots and any six digits verify. The shape is the real one though — request,
 * per-digit entry with paste and backspace handling, then a verified state —
 * so swapping in a provider is a change to the two handlers, not to the UI.
 */
export function PhoneVerify({
  verified,
  onVerified,
}: {
  verified: boolean;
  onVerified: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const slots = useRef<Array<HTMLInputElement | null>>([]);

  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const code = digits.join("");

  function send() {
    if (!phoneOk) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    setError(null);
    setSent(true);
    // Focus the first slot once it exists.
    requestAnimationFrame(() => slots.current[0]?.focus());
  }

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((d) => d.map((v, i) => (i === index ? "" : v)));
      return;
    }
    // A paste lands in one slot: spread it across the rest.
    setDigits((d) => {
      const next = [...d];
      for (let i = 0; i < clean.length && index + i < OTP_LENGTH; i += 1) {
        next[index + i] = clean[i];
      }
      return next;
    });
    const landed = Math.min(index + clean.length, OTP_LENGTH - 1);
    slots.current[landed]?.focus();
  }

  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      slots.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) slots.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) slots.current[index + 1]?.focus();
  }

  function verify() {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError(null);
    onVerified(phone);
  }

  if (verified) {
    return (
      <div className="flex w-full max-w-[440px] items-center gap-3 rounded-[12px] border border-grass/30 bg-grass/8 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-grass text-white">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <div className="flex min-w-0 flex-col text-left">
          <span className="font-display text-[15px] font-bold text-navy">Number verified</span>
          <span className="truncate font-body text-[13px] text-slate">{phone}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
      <label className="flex w-full flex-col items-start gap-2">
        <span className="font-display text-[16px] font-bold text-navy">Mobile Number</span>
        <div className="flex w-full gap-2">
          <input
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={sent}
            placeholder="10-digit mobile number"
            className={`${FIELD} disabled:bg-cream/60 disabled:text-slate`}
          />
          {!sent ? (
            <button
              type="button"
              onClick={send}
              className="icon-btn h-[52px] shrink-0 rounded-[8px] border-2 border-navy px-4 font-display text-[14px] font-extrabold uppercase text-navy"
            >
              Send OTP
            </button>
          ) : null}
        </div>
      </label>

      {sent ? (
        <div className="flex w-full flex-col items-start gap-2">
          <span className="font-display text-[16px] font-bold text-navy">Enter the OTP</span>
          <div className="flex w-full gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  slots.current[index] = el;
                }}
                value={digit}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={(event) => onKeyDown(index, event)}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={OTP_LENGTH}
                aria-label={`OTP digit ${index + 1}`}
                className="h-[52px] min-w-0 flex-1 rounded-[8px] border border-line bg-white text-center font-display text-[20px] font-extrabold text-navy transition-colors duration-150 focus:border-pink"
              />
            ))}
          </div>
          <div className="flex w-full items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setSent(false); setDigits(Array(OTP_LENGTH).fill("")); }}
              className="font-body text-[13px] text-slate underline underline-offset-2 hover:text-pink"
            >
              Change number
            </button>
            <button
              type="button"
              onClick={verify}
              className="btn-3d inline-flex h-12 items-center justify-center rounded-[4px] bg-yellow px-6 font-display text-[14px] font-extrabold uppercase text-navy"
            >
              Verify
            </button>
          </div>
          <p className="font-body text-[12px] text-slate/70">
            Demo build — no SMS is sent, any six digits will verify.
          </p>
        </div>
      ) : null}

      {error ? <p className="w-full text-left font-body text-[13px] text-red">{error}</p> : null}
    </div>
  );
}
