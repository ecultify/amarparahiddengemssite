"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Analytics, Bucket, Granularity } from "@/lib/analytics";

const REFRESH_MS = 30_000;

const RANGES: { key: Granularity; label: string; hint: string }[] = [
  { key: "minute", label: "Last hour", hint: "in the last hour" },
  { key: "day", label: "30 days", hint: "in the last 30 days" },
  { key: "week", label: "12 weeks", hint: "in the last 12 weeks" },
  { key: "month", label: "6 months", hint: "in the last 6 months" },
];

const SERIES: { key: keyof Pick<Bucket, "submissions" | "users" | "guesses">; label: string; color: string }[] = [
  { key: "submissions", label: "Gem submissions", color: "var(--color-pink, #e6007e)" },
  { key: "users", label: "New verified users", color: "var(--color-cyan, #00a9ce)" },
  { key: "guesses", label: "Guess the Para plays", color: "var(--color-grass, #5aa02c)" },
];

/** Overview analytics: KPI tiles and one bar chart per series. Refreshes
 *  itself every 30s via a router refresh, so the server recomputes from the
 *  live tables — nothing is polled from the browser directly. */
export function AnalyticsPanel({ data }: { data: Analytics }) {
  const router = useRouter();
  const [range, setRange] = useState<Granularity>("day");

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  const buckets = data.series[range];
  const { kpis } = data;
  const updated = new Date(data.generatedAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Analytics</h2>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          Live · updated {updated} IST · refreshes every 30s
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Submissions today" value={kpis.submissionsToday} sub={`${kpis.submissionsWeek} this week · ${kpis.submissionsMonth} this month`} />
        <Kpi label="Total submissions" value={kpis.submissionsTotal} sub={`${kpis.pending} waiting on review`} />
        <Kpi label="Verified users" value={kpis.usersTotal} sub={`${kpis.usersToday} new today`} />
        <Kpi label="Active in last 5 min" value={kpis.activeNow} sub={`${kpis.guessesToday} quiz plays today`} />
      </div>

      <Tabs value={range} onValueChange={(value) => setRange(value as Granularity)}>
        <TabsList>
          {RANGES.map((r) => (
            <TabsTrigger key={r.key} value={r.key}>
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 xl:grid-cols-3">
        {SERIES.map((series) => (
          <Card key={series.key} size="sm">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between text-sm">
                <span>{series.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {buckets.reduce((sum, b) => sum + b[series.key], 0)} {RANGES.find((r) => r.key === range)?.hint}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bars buckets={buckets} field={series.key} color={series.color} dense={range === "minute"} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Kpi({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold tabular-nums tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

/** A plain SVG bar chart: rounded bars, a baseline, a handful of labels, and
 *  a native tooltip per bar. Scales to the card width. */
function Bars({ buckets, field, color, dense }: { buckets: Bucket[]; field: "submissions" | "users" | "guesses"; color: string; dense: boolean }) {
  const W = 600;
  const H = 160;
  const PAD = 4;
  const max = Math.max(1, ...buckets.map((b) => b[field]));
  const gap = dense ? 2 : 6;
  const bw = (W - gap * (buckets.length - 1)) / buckets.length;
  const labelEvery = Math.ceil(buckets.length / (dense ? 6 : 6));
  return (
    <div className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" role="img" aria-label={`${field} chart`}>
        {/* faint grid at 50% and 100% */}
        {[0.5, 1].map((f) => (
          <line key={f} x1={0} x2={W} y1={H - PAD - (H - 2 * PAD) * f} y2={H - PAD - (H - 2 * PAD) * f} stroke="currentColor" strokeOpacity={0.08} />
        ))}
        {buckets.map((b, i) => {
          const value = b[field];
          const h = value === 0 ? 2 : Math.max(3, ((H - 2 * PAD) * value) / max);
          const x = i * (bw + gap);
          const y = H - PAD - h;
          return (
            <g key={b.key}>
              <rect x={x} y={y} width={bw} height={h} rx={Math.min(3, bw / 2)} fill={value === 0 ? "currentColor" : color} fillOpacity={value === 0 ? 0.12 : 1} />
              <title>{`${b.label}: ${value}`}</title>
            </g>
          );
        })}
        <line x1={0} x2={W} y1={H - PAD} y2={H - PAD} stroke="currentColor" strokeOpacity={0.2} />
      </svg>
      <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
        {buckets.filter((_, i) => i % labelEvery === 0 || i === buckets.length - 1).map((b) => (
          <span key={b.key}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}
