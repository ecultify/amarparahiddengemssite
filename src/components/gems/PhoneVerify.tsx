"use client";

import { useEffect, useRef, useState } from "react";
import { clearPhone, requestPhoneOtp, verifyPhone } from "@/app/actions/auth";
import { track } from "@/lib/track";

const OTP_LENGTH = 6;
const FIELD =
  "h-[52px] w-full rounded-[8px] border border-line bg-white px-4 font-body text-[16px] text-navy transition-colors duration-150 placeholder:text-slate focus:border-pink";
const BUTTON =
  "btn-3d inline-flex h-[52px] shrink-0 items-center justify-center rounded-[4px] bg-yellow px-6 font-display text-[14px] font-extrabold uppercase text-navy disabled:cursor-not-allowed disabled:opacity-60";
const LINK = "font-body text-[13px] text-slate underline underline-offset-2 hover:text-pink disabled:no-underline disabled:opacity-60";

/** Indian numbers as people write them: 81699 21886. */
const pretty = (ten: string) => `${ten.slice(0, 5)} ${ten.slice(5)}`;

/**
 * Phone verification, inline: the number and its Send button share a row,
 * and the code slots open directly beneath once a code is on its way.
 *
 * `initialPhone` is the number from an existing visitor session (read
 * server-side), in which case this renders as already verified with a way to
 * change it. Verification itself happens in server actions, which start the
 * session cookie that the gem form and Guess the Para both read.
 */
export function PhoneVerify({
  initialPhone = null,
  onVerified,
  onCleared,
  source = "submit",
}: {
  initialPhone?: string | null;
  onVerified: (phone: string) => void;
  onCleared?: () => void;
  /** Which flow this sits in, for analytics. */
  source?: "submit" | "quiz";
}) {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(initialPhone);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [burned, setBurned] = useState(false);
  const slots = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");
  const ten = phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  const phoneOk = /^[6-9]\d{9}$/.test(ten);

  // Resend cooldown ticks down once a second.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function send() {
    if (!phoneOk) {
      setError("Enter a 10-digit Indian mobile number, starting 6 to 9.");
      return;
    }
    setError(null);
    setNotice(null);
    setSending(true);
    try {
      const result = await requestPhoneOtp(ten);
      if (!result.ok) {
        setError(result.error ?? "We couldn't send the SMS just now.");
        if (result.cooldown) setCooldown(result.cooldown);
        return;
      }
      track({ event: "otp_requested" });
      setSent(true);
      setBurned(false);
      setDigits(Array(OTP_LENGTH).fill(""));
      setCooldown(result.cooldown ?? 60);
      setNotice(`Code sent to ${pretty(ten)}. It's good for 10 minutes.`);
      requestAnimationFrame(() => slots.current[0]?.focus());
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
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

  async function confirm() {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError(null);
    setChecking(true);
    try {
      const result = await verifyPhone(ten, code, source);
      if (!result.ok) {
        setError(result.error ?? "That code didn't match. Try again.");
        // Clear the slots either way: a miss gets a fresh go at typing, and
        // a burned code leaves them empty and disabled, pointing at Resend.
        setDigits(Array(OTP_LENGTH).fill(""));
        if (result.burned) setBurned(true);
        else requestAnimationFrame(() => slots.current[0]?.focus());
        return;
      }
      track({ event: "otp_verified", source, event_id: result.eventId });
      setVerifiedPhone(ten);
      setNotice(null);
      onVerified(ten);
    } catch {
      setError("Couldn't verify right now. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  async function change() {
    await clearPhone();
    setVerifiedPhone(null);
    setPhone("");
    setSent(false);
    setBurned(false);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
    setNotice(null);
    setCooldown(0);
    onCleared?.();
  }

  // Auto-confirm the moment the last digit lands, so nobody has to find the
  // Confirm button. It stays as a fallback for a code that didn't match.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- fire once per complete code */
  useEffect(() => {
    if (sent && !burned && code.length === OTP_LENGTH && !checking) void confirm();
  }, [code]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  if (verifiedPhone) {
    return (
      <div className="flex w-full max-w-[440px] items-center gap-3 rounded-[12px] border border-grass/30 bg-grass/8 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-grass text-white">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className="font-display text-[15px] font-bold text-navy">Number verified</span>
          <span className="truncate font-body text-[13px] text-slate">+91 {pretty(verifiedPhone)}</span>
        </div>
        <button type="button" onClick={change} className={LINK}>
          Change number
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
      <label className="flex w-full flex-col items-start gap-2">
        <span className="font-display text-[16px] font-bold text-navy">
          Mobile Number<span className="text-red"> *</span>
        </span>
        {/* Number and its Send button share the row. */}
        <div className="flex w-full gap-2">
          <input
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={sent}
            placeholder="10-digit mobile number"
            className={`${FIELD} disabled:bg-cream/60 disabled:text-slate`}
          />
          {!sent ? (
            <button type="button" onClick={send} disabled={sending || cooldown > 0} className={BUTTON}>
              {sending ? "Sending…" : cooldown > 0 ? `${cooldown}s` : "Send code"}
            </button>
          ) : null}
        </div>
      </label>

      {/* The code slots open directly beneath the number. */}
      {sent ? (
        <div className="flex w-full flex-col items-start gap-2">
          <span className="font-display text-[15px] font-bold text-navy">
            Enter the code sent to +91 {pretty(ten)}
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
                disabled={burned || checking}
                aria-label={`Code digit ${index + 1}`}
                className="h-[52px] min-w-0 flex-1 rounded-[8px] border border-line bg-white text-center font-display text-[20px] font-extrabold text-navy transition-colors duration-150 focus:border-pink disabled:bg-cream/60"
              />
            ))}
          </div>
          <div className="flex w-full items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setBurned(false);
                  setDigits(Array(OTP_LENGTH).fill(""));
                  setError(null);
                  setNotice(null);
                }}
                className={LINK}
              >
                Change number
              </button>
              <button type="button" onClick={send} disabled={sending || cooldown > 0} className={LINK}>
                {sending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
            <button
              type="button"
              onClick={confirm}
              disabled={checking || burned}
              className="btn-3d inline-flex h-12 items-center justify-center rounded-[4px] bg-yellow px-6 font-display text-[14px] font-extrabold uppercase text-navy disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? "Checking…" : "Confirm"}
            </button>
          </div>
        </div>
      ) : null}

      {notice && !error ? <p className="w-full text-left font-body text-[13px] text-slate">{notice}</p> : null}
      {error ? <p className="w-full text-left font-body text-[13px] text-red">{error}</p> : null}
    </div>
  );
}
