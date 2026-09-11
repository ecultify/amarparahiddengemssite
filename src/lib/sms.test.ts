import assert from "node:assert/strict";
import { test } from "node:test";
import { maskPhone, normalisePhone, otpMessage } from "./sms.ts";

// The DLT template is matched character for character by the operator, and a
// mismatch is silent (send succeeds, status later says REJECTED). Pin it.
test("OTP message matches the DLT-approved template exactly", () => {
  const message = otpMessage("123456");
  assert.equal(
    message,
    "Welcome to Amar Para Hidden Gems! Your OTP is 123456. Enter it to verify your mobile number and share your para's hidden gem. - ECLTFY",
  );
  assert.equal(message.length, 134);
  assert.ok(message.includes("Enter it to verify"));
  assert.ok(message.includes("para's"), "apostrophe must be straight ASCII U+0027");
  assert.ok(!/[‘’]/.test(message), "no curly quotes");
  assert.ok(message.endsWith("hidden gem. - ECLTFY"), "spaces around the dash");
});

test("Indian mobile normalisation", () => {
  assert.equal(normalisePhone("8169921886"), "8169921886");
  assert.equal(normalisePhone("+91 81699 21886"), "8169921886");
  assert.equal(normalisePhone("918169921886"), "8169921886");
  assert.equal(normalisePhone("08169921886"), "8169921886");
  assert.equal(normalisePhone("5169921886"), null, "must start 6-9");
  assert.equal(normalisePhone("816992188"), null, "nine digits");
  assert.equal(normalisePhone("+44 7700 900123"), null, "not Indian");
  assert.equal(maskPhone("8169921886"), "91XXXXXX1886");
});
