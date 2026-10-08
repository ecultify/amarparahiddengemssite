/* Proves a DLT template actually delivers before the site is switched to it.
   The gateway accepts any text at send time; the operator rejects a mismatch
   minutes later, so the only real test is: send one, then poll its status.

   node scripts/test-otp-template.mjs --to 98XXXXXXXX --template 1077… \
     --text "Welcome … Your OTP is {#var#}. … - ECLTFY"

   Omit --template/--text to test what the site currently sends. */
import { readFileSync, existsSync } from "node:fs";
import { otpMessage } from "../src/lib/sms.ts";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}
const arg = (name) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : undefined; };

const to = arg("to")?.replace(/\D/g, "").slice(-10);
if (!/^[6-9]\d{9}$/.test(to ?? "")) throw new Error("--to needs a ten-digit Indian mobile");
const templateId = arg("template") ?? process.env.COMBIRDS_TEMPLATE_ID;
const otp = String(Math.floor(100000 + Math.random() * 900000));
const message = arg("text") ? arg("text").replace("{#var#}", otp) : otpMessage(otp);
const key = process.env.COMBIRDS_API_KEY;
const senderId = process.env.COMBIRDS_SENDER_ID;
if (!key || !senderId || !templateId) throw new Error("COMBIRDS_* env is incomplete");

console.log(`template ${templateId} -> 91XXXXXX${to.slice(-4)}`);
console.log(`text (${message.length} chars): ${message}`);

const sent = await fetch("https://api.combirds.com/api/v1/sms/send", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": key },
  body: JSON.stringify({ number: [`91${to}`], message, senderId, templateId, smsType: "OTP" }),
});
const body = await sent.json().catch(() => null);
const tx = body?.data?.transactionId;
if (!sent.ok || !body?.success || !tx) {
  console.error("gateway refused:", sent.status, JSON.stringify(body));
  process.exit(2);
}
console.log("accepted, transaction", tx);

// Operators usually answer within a minute; give it three.
const FINAL = /DELIVERED|REJECTED|FAILED|EXPIRED|UNDELIV|DND|BLOCKED/i;
for (let attempt = 1; attempt <= 18; attempt++) {
  await new Promise((r) => setTimeout(r, 10_000));
  const res = await fetch(`https://api.combirds.com/api/v1/org/transaction/${tx}/messages`, {
    headers: { "x-api-key": key, "content-type": "application/json" },
  });
  const status = await res.json().catch(() => null);
  const text = JSON.stringify(status);
  const state = text.match(/"status(?:Description)?"\s*:\s*"([^"]+)"/i)?.[1] ?? "(no status field)";
  console.log(`  ${attempt * 10}s: ${state}`);
  if (FINAL.test(text)) {
    const ok = /DELIVERED/i.test(text);
    console.log(ok ? "\nDELIVERED - template works." : `\nNOT DELIVERED:\n${text}`);
    process.exit(ok ? 0 : 1);
  }
}
console.log("\nno final status after 3 minutes - check the Combirds SMS Reports page for", tx);
process.exit(3);
