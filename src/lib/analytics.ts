import type { Submission } from "./submissions.ts";
import type { QuizUser } from "./users.ts";

/**
 * Overview numbers, bucketed in IST. Everything comes from timestamps the
 * app already stores: submissions (createdAt), verified users (firstSeen /
 * lastSeen) and quiz guesses (at). No tracking pixel, nothing new written.
 */

const IST_MS = 5.5 * 3_600_000;
const MIN = 60_000;
const DAY = 86_400_000;

export type Bucket = { label: string; key: string; submissions: number; users: number; guesses: number };
export type Granularity = "minute" | "day" | "week" | "month";

export type Analytics = {
  generatedAt: string;
  kpis: {
    submissionsToday: number;
    submissionsWeek: number;
    submissionsMonth: number;
    submissionsTotal: number;
    pending: number;
    usersTotal: number;
    usersToday: number;
    activeNow: number;
    guessesToday: number;
  };
  series: Record<Granularity, Bucket[]>;
};

/** IST calendar parts of a timestamp. */
function ist(ms: number) {
  const d = new Date(ms + IST_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes(), dow: d.getUTCDay() };
}
/** Start of the IST day containing `ms`, as a real epoch. */
const dayStart = (ms: number) => Math.floor((ms + IST_MS) / DAY) * DAY - IST_MS;
/** Start of the IST week (Monday) containing `ms`. */
const weekStart = (ms: number) => {
  const { dow } = ist(ms);
  return dayStart(ms) - ((dow + 6) % 7) * DAY;
};
/** Start of the IST month containing `ms`. */
const monthStart = (ms: number) => {
  const { y, m } = ist(ms);
  return Date.UTC(y, m, 1) - IST_MS;
};
const addMonths = (ms: number, n: number) => {
  const { y, m } = ist(ms);
  return Date.UTC(y, m + n, 1) - IST_MS;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function labelFor(g: Granularity, start: number) {
  const t = ist(start);
  if (g === "minute") return `${String(t.h).padStart(2, "0")}:${String(t.min).padStart(2, "0")}`;
  if (g === "month") return `${MONTHS[t.m]} ${String(t.y).slice(2)}`;
  return `${t.d} ${MONTHS[t.m]}`;
}

/** Bucket edges, oldest first, ending with the bucket containing `now`. */
function edges(g: Granularity, now: number): number[] {
  if (g === "minute") {
    const end = Math.floor(now / MIN) * MIN;
    return Array.from({ length: 60 }, (_, i) => end - (59 - i) * MIN);
  }
  if (g === "day") {
    const end = dayStart(now);
    return Array.from({ length: 30 }, (_, i) => end - (29 - i) * DAY);
  }
  if (g === "week") {
    const end = weekStart(now);
    return Array.from({ length: 12 }, (_, i) => end - (11 - i) * 7 * DAY);
  }
  const end = monthStart(now);
  return Array.from({ length: 6 }, (_, i) => addMonths(end, i - 5));
}

function build(g: Granularity, now: number, events: { at: number; kind: "submissions" | "users" | "guesses" }[]): Bucket[] {
  const starts = edges(g, now);
  const buckets: Bucket[] = starts.map((start) => ({
    key: String(start),
    label: labelFor(g, start),
    submissions: 0,
    users: 0,
    guesses: 0,
  }));
  const first = starts[0];
  for (const event of events) {
    if (event.at < first) continue;
    // Find the last edge <= at.
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= event.at) lo = mid;
      else hi = mid - 1;
    }
    buckets[lo][event.kind] += 1;
  }
  return buckets;
}

export function computeAnalytics(submissions: Submission[], users: QuizUser[], now = Date.now()): Analytics {
  const events: { at: number; kind: "submissions" | "users" | "guesses" }[] = [];
  for (const s of submissions) events.push({ at: Date.parse(s.createdAt), kind: "submissions" });
  for (const u of users) {
    events.push({ at: Date.parse(u.firstSeen), kind: "users" });
    for (const g of Object.values(u.guesses ?? {})) events.push({ at: Date.parse(g.at), kind: "guesses" });
  }

  const today = dayStart(now);
  const week = weekStart(now);
  const month = monthStart(now);
  const since = (from: number, kind: "submissions" | "users" | "guesses") =>
    events.filter((e) => e.kind === kind && e.at >= from).length;

  return {
    generatedAt: new Date(now).toISOString(),
    kpis: {
      submissionsToday: since(today, "submissions"),
      submissionsWeek: since(week, "submissions"),
      submissionsMonth: since(month, "submissions"),
      submissionsTotal: submissions.length,
      pending: submissions.filter((s) => s.status === "new").length,
      usersTotal: users.length,
      usersToday: since(today, "users"),
      // "Active" = touched the site (verified, guessed or submitted) in the last 5 minutes.
      activeNow: users.filter((u) => now - Date.parse(u.lastSeen) < 5 * MIN).length,
      guessesToday: since(today, "guesses"),
    },
    series: {
      minute: build("minute", now, events),
      day: build("day", now, events),
      week: build("week", now, events),
      month: build("month", now, events),
    },
  };
}
