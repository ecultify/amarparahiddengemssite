"use client";

import { useRef, useState } from "react";
import { verifyPhone } from "@/app/actions/auth";

const OTP_LENGTH = 6;
const FIELD =
  "h-[52px] w-full rounded-[8px] border border-line bg-white px-4 font-body text-[16px] text-navy transition-colors duration-150 placeholder:text-slate focus:border-pink";

/**
 * Phone verification, inline: the number and its Verify button share a row,
 * and the code slots open directly beneath once a code has been requested.
 *
 * There is no SMS provider wired up yet, so requesting a code just reveals the
 * slots and any six digits verify. The shape is the real one though, so
 * swapping in a provider is a change to the server action, not to this UI.
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
  const [checking, setChecking] = useState(false);
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

  // Server-side so the check also starts the visitor session cookie that
  // Guess the Para shares.
  async function confirm() {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError(null);
    setChecking(true);
    try {
      const result = await verifyPhone(phone, code);
      if (!result.ok) {
        setError(result.error ?? "That code didn't match. Try again.");
        return;
      }
      onVerified(phone);
    } catch {
      setError("Couldn't verify right now. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
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
        {/* Number and its Verify button share the row. */}
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
              className="btn-3d inline-flex h-[52px] shrink-0 items-center justify-center rounded-[4px] bg-yellow px-6 font-display text-[14px] font-extrabold uppercase text-navy"
            >
              Verify
            </button>
          ) : null}
        </div>
      </label>

      {/* The code slots open directly beneath the number. */}
      {sent ? (
        <div className="flex w-full flex-col items-start gap-2">
          <span className="font-display text-[15px] font-bold text-navy">
            Enter the code sent to {phone}
          </span>
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
                aria-label={`Code digit ${index + 1}`}
                className="h-[52px] min-w-0 flex-1 rounded-[8px] border border-line bg-white text-center font-display text-[20px] font-extrabold text-navy transition-colors duration-150 focus:border-pink"
              />
            ))}
          </div>
          <div className="flex w-full items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setDigits(Array(OTP_LENGTH).fill(""));
                setError(null);
              }}
              className="font-body text-[13px] text-slate underline underline-offset-2 hover:text-pink"
            >
              Change number
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={checking}
              className="btn-3d inline-flex h-12 items-center justify-center rounded-[4px] bg-yellow px-6 font-display text-[14px] font-extrabold uppercase text-navy disabled:opacity-60"
            >
              {checking ? "Checking…" : "Confirm"}
            </button>
          </div>
          <p className="font-body text-[12px] text-slate/70">
            Demo build. No SMS is sent, any six digits will verify.
          </p>
        </div>
      ) : null}

      {error ? <p className="w-full text-left font-body text-[13px] text-red">{error}</p> : null}
    </div>
  );
}
