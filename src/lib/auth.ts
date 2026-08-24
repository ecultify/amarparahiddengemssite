import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "amarpara_admin";
const MAX_AGE = 60 * 60 * 12; // 12h

const secret = () => process.env.AUTH_SECRET ?? "dev-only-insecure-secret";

/** `<expiry>.<hmac>` — no session store needed for a single shared login. */
export function signSession(expiresAt: number) {
  const mac = createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");
  return `${expiresAt}.${mac}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [expiry, mac] = token.split(".");
  if (!expiry || !mac) return false;
  if (Number(expiry) < Date.now()) return false;
  const expected = createHmac("sha256", secret()).update(expiry).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession() {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  (await cookies()).set(SESSION_COOKIE, signSession(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthed() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/**
 * Server Actions are reachable by direct POST, so every mutation calls this —
 * the proxy guard in front of /admin is only a first line of defence.
 */
export async function requireAdmin() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
}
