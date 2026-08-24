"use server";

import { redirect } from "next/navigation";
import { checkPassword, endSession, startSession } from "@/lib/auth";

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
