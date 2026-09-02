"use server";

import { redirect } from "next/navigation";
import { checkPassword, endSession, startGemSession, startSession } from "@/lib/auth";
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

export type VerifyPhoneState = { ok: boolean; error?: string };

/**
 * Public: OTP check for the gem form and the Guess the Para gate. Demo build —
 * no SMS provider yet, so any six digits pass (matching PhoneVerify's UI).
 * Wiring a real provider changes only this function. On success it starts the
 * visitor session cookie both pages share.
 */
export async function verifyPhone(phone: string, code: string): Promise<VerifyPhoneState> {
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, error: "Enter a 10-digit mobile number." };
  if (!/^\d{6}$/.test(code)) return { ok: false, error: "Enter all 6 digits." };
  await startGemSession(phone);
  // Every verified number becomes a row on the admin's Users page.
  await touchUser(phone);
  return { ok: true };
}
