/**
 * Combirds SMS gateway and the one DLT-approved OTP template. Pure module:
 * no Next imports, so the template test can load it under plain `node`.
 */

/**
 * The DLT-registered OTP text (Airtel template 1077585670050706128). Indian
 * operators reject any message that differs from the approved template by a
 * single character — and they do it silently: the send reports success and
 * the status endpoint later says REJECTED. Only the digits may vary.
 *
 * This is the ONLY place this text may be built. Do not reword, shorten or
 * reformat it. `sms.test.ts` pins the length and a key phrase.
 */
export function otpMessage(otp: string): string {
  return `Welcome to TOI Kolkata - Amar Para Hidden Gems! Your OTP is ${otp}. Enter it to verify your mobile number and share your para's hidden gem. - ECLTFY`;
}

/** Indian mobiles only: tolerate +91 / 91 / 0 prefixes and any punctuation,
 *  require ten digits starting 6-9. Returns the bare ten digits or null. */
export function normalisePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/** For logs and status copy: 91XXXXXX1886. Never log a full number. */
export const maskPhone = (ten: string) => `91XXXXXX${ten.slice(-4)}`;

const SEND_URL = "https://api.combirds.com/api/v1/sms/send";

export class SmsError extends Error {}

/**
 * Sends one OTP SMS. Resolves to the gateway transactionId (kept on the OTP
 * row so a "never got my code" report can be checked against
 * GET /api/v1/org/transaction/{id}/messages in seconds). Throws SmsError on
 * any non-success so the caller can decline to start cooldowns or spend a
 * daily send on a message that never left.
 */
export async function sendOtpSms(ten: string, otp: string): Promise<string> {
  const key = process.env.COMBIRDS_API_KEY;
  const senderId = process.env.COMBIRDS_SENDER_ID;
  const templateId = process.env.COMBIRDS_TEMPLATE_ID;
  if (!key || !senderId || !templateId) throw new SmsError("SMS gateway is not configured");

  let res: Response;
  try {
    res = await fetch(SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify({
        number: [`91${ten}`],
        message: otpMessage(otp),
        senderId,
        templateId,
        smsType: "OTP",
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("[otp] gateway unreachable", maskPhone(ten), error instanceof Error ? error.message : error);
    throw new SmsError("SMS gateway unreachable");
  }

  const body = (await res.json().catch(() => null)) as
    | { success?: boolean; data?: { msg?: string; transactionId?: string }; message?: string }
    | null;
  if (!res.ok || !body?.success || !body.data?.transactionId) {
    console.error("[otp] gateway refused", maskPhone(ten), res.status, body?.data?.msg ?? body?.message ?? "");
    throw new SmsError("SMS gateway refused the message");
  }
  console.log("[otp] sent", maskPhone(ten), "tx", body.data.transactionId);
  return body.data.transactionId;
}
