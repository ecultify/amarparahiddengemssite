import assert from "node:assert/strict";
import { test } from "node:test";
import { computeAnalytics } from "./analytics.ts";

// 2026-09-11 12:00 IST as the "now"; a submission an hour earlier lands in
// today / this week / this month and in the right minute-free buckets.
test("analytics buckets by IST day, week and month", () => {
  const now = Date.UTC(2026, 8, 11, 6, 30); // 12:00 IST
  const hourAgo = new Date(now - 3_600_000).toISOString();
  const lastMonth = new Date(Date.UTC(2026, 7, 20, 6, 0)).toISOString();
  const sub = (createdAt: string) => ({ id: createdAt, createdAt, status: "new" as const, para: "", location: "", title: "", category: "", description: "" });
  const a = computeAnalytics([sub(hourAgo), sub(lastMonth)], [
    { phone: "9000000001", firstSeen: hourAgo, lastSeen: new Date(now - 60_000).toISOString(), guesses: {} },
  ], now);
  assert.equal(a.kpis.submissionsToday, 1);
  assert.equal(a.kpis.submissionsMonth, 1);
  assert.equal(a.kpis.submissionsTotal, 2);
  assert.equal(a.kpis.usersToday, 1);
  assert.equal(a.kpis.activeNow, 1);
  assert.equal(a.series.day.length, 30);
  assert.equal(a.series.day.at(-1)?.submissions, 1);
  assert.equal(a.series.month.length, 6);
  assert.equal(a.series.month.at(-2)?.submissions, 1, "August bucket holds last month's entry");
  assert.equal(a.series.minute.reduce((s, b) => s + b.submissions, 0), 0, "an hour ago is outside the 60-minute window");
});
