import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { incrementJson, readJson, removeStale, writeJson } from "@/lib/blob-store";
import { maskPhone, sendOtpSms, SmsError } from "@/lib/sms";

/**
 * One-time codes for mobile verification. State lives in the documents
 * store, one row per number (`otp/<ten digits>.json`) and one per sending
 * IP (`otp-ip/<ip>.json`), so nothing is lost when pm2 restarts on deploy.
 * The code itself is never stored: only an HMAC of phone + code.
 */

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_NUMBER = 5; // per 24h
const MAX_SENDS_PER_IP = 10; // per hour
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

type OtpRow = {
  /** Absent once the code is used, burned or expired: the row then only
   *  carries the send history, so the daily cap survives a burned code. */
  hash?: string;
  issuedAt: number;
  expiresAt: number;
  attempts: number;
  /** Send timestamps for this number, pruned to the last 24h. */
  sent: number[];
  /** Combirds transactionId — the handle for checking a "never arrived". */
  transactionId?: string;
};

type IpRow = { sent: number[] };

const otpPath = (ten: string) => `otp/${ten}.json`;
const ipPath = (ip: string) => `otp-ip/${ip.replace(/[^0-9a-f.:]/gi, "_")}.json`;

const secret = () => {
  const value = process.env.OTP_SECRET;
  if (!value) throw new Error("OTP_SECRET is not set");
  return value;
};

const hashOf = (ten: string, otp: string) =>
  createHmac("sha256", secret()).update(`${ten}.${otp}`).digest("hex");

/** Kills the code but keeps the send history. The 24h sweep drops the rest. */
const retire = (ten: string, row: OtpRow) =>
  writeJson(otpPath(ten), { issuedAt: row.issuedAt, expiresAt: 0, attempts: 0, sent: row.sent });

export type RequestResult =
  | { ok: true; cooldown: number }
  | { ok: false; error: string; cooldown?: number };

/** Issues and sends a code. Nothing is recorded against the number or the IP
 *  unless the gateway actually accepted the message. */
export async function requestOtp(ten: string, ip: string): Promise<RequestResult> {
  const now = Date.now();
  // Housekeeping rides along on sends: rows more than a day old are dead.
  await removeStale("otp/", DAY_MS);
  await removeStale("otp-ip/", DAY_MS);

  const ipRow = (await readJson<IpRow>(ipPath(ip))) ?? { sent: [] };
  const ipRecent = ipRow.sent.filter((t) => now - t < HOUR_MS);
  if (ipRecent.length >= MAX_SENDS_PER_IP) {
    console.warn("[otp] ip limit", ip);
    return { ok: false, error: "Too many codes requested from this connection. Try again in an hour." };
  }

  const existing = await readJson<OtpRow>(otpPath(ten));
  const sent = (existing?.sent ?? []).filter((t) => now - t < DAY_MS);
  if (existing?.hash && now - existing.issuedAt < RESEND_COOLDOWN_MS) {
    const cooldown = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.issuedAt)) / 1000);
    return { ok: false, error: `A code was just sent. You can ask for another in ${cooldown}s.`, cooldown };
  }
  if (sent.length >= MAX_SENDS_PER_NUMBER) {
    return { ok: false, error: "That's the limit of codes for this number today. Try again tomorrow." };
  }

  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  let transactionId: string;
  try {
    transactionId = await sendOtpSms(ten, otp);
  } catch (error) {
    // Not counted against anyone: the message never left.
    return {
      ok: false,
      error:
        error instanceof SmsError && error.message.includes("not configured")
          ? "SMS isn't set up on this server yet."
          : "We couldn't send the SMS just now. Give it a moment and try again.",
    };
  }

  const row: OtpRow = {
    hash: hashOf(ten, otp),
    issuedAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    sent: [...sent, now],
    transactionId,
  };
  await writeJson(otpPath(ten), row);
  await writeJson(ipPath(ip), { sent: [...ipRecent, now] });
  return { ok: true, cooldown: RESEND_COOLDOWN_MS / 1000 };
}

export type VerifyResult = { ok: true } | { ok: false; error: string; burned?: boolean };

/** Checks a code. Every miss counts, atomically; the fifth burns the row. */
export async function verifyOtp(ten: string, otp: string): Promise<VerifyResult> {
  const row = await readJson<OtpRow>(otpPath(ten));
  if (!row?.hash) return { ok: false, error: "No code is active for this number. Request a new one.", burned: true };
  if (Date.now() > row.expiresAt) {
    await retire(ten, row);
    return { ok: false, error: "That code has expired. Request a new one.", burned: true };
  }

  // Count the attempt before comparing, so a burst of guesses can't share
  // one attempt between them.
  const attempts = (await incrementJson(otpPath(ten), "attempts")) ?? MAX_ATTEMPTS + 1;
  if (attempts > MAX_ATTEMPTS) {
    await retire(ten, row);
    return { ok: false, error: "Too many tries. Request a new code.", burned: true };
  }

  const a = Buffer.from(row.hash);
  const b = Buffer.from(hashOf(ten, otp));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    const left = MAX_ATTEMPTS - attempts;
    if (left <= 0) {
      await retire(ten, row);
      console.warn("[otp] burned", maskPhone(ten), "tx", row.transactionId);
      return { ok: false, error: "Too many tries. Request a new code.", burned: true };
    }
    return { ok: false, error: `That code didn't match. ${left} ${left === 1 ? "try" : "tries"} left.` };
  }

  await retire(ten, row);
  console.log("[otp] verified", maskPhone(ten));
  return { ok: true };
}
