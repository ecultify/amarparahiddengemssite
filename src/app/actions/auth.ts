"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, endGemSession, endSession, startGemSession, startSession } from "@/lib/auth";
import { requestOtp, verifyOtp } from "@/lib/otp";
import { normalisePhone } from "@/lib/sms";
import { touchUser } from "@/lib/users";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "That password doesn't match." };

  await startSession();
  const from = String(formData.get("from") ?? "/admin");
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export type VerifyPhoneState = { ok: boolean; error?: string; burned?: boolean };
export type RequestOtpState = { ok: boolean; error?: string; cooldown?: number };

/** nginx sets X-Real-IP from the socket, so it can't be spoofed by the client;
 *  X-Forwarded-For's first hop is the fallback for any other front door. */
async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

/** Public: sends an OTP to an Indian mobile. Rate-limited by number and IP. */
export async function requestPhoneOtp(phone: string): Promise<RequestOtpState> {
  const ten = normalisePhone(phone);
  if (!ten) return { ok: false, error: "Enter a 10-digit Indian mobile number." };
  return requestOtp(ten, await clientIp());
}

/**
 * Public: OTP check for the gem form and the Guess the Para gate. On success
 * it starts the visitor session cookie both pages share, so whichever flow
 * verifies first, the other one never asks again.
 */
export async function verifyPhone(phone: string, code: string): Promise<VerifyPhoneState> {
  const ten = normalisePhone(phone);
  if (!ten) return { ok: false, error: "Enter a 10-digit Indian mobile number." };
  if (!/^\d{6}$/.test(code)) return { ok: false, error: "Enter all 6 digits." };
  const result = await verifyOtp(ten, code);
  if (!result.ok) return result;
  await startGemSession(ten);
  // Every verified number becomes a row on the admin's Users page.
  await touchUser(ten);
  return { ok: true };
}

/** "Change number": drops the session so a fresh verification is required. */
export async function clearPhone() {
  await endGemSession();
}
