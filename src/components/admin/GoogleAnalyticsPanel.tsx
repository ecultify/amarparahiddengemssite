import Link from "next/link";
import { Check, Circle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsSettings } from "@/lib/content";
import { fetchGaReport, gaServiceAccountEmail, type GaReport, type Row } from "@/lib/ga";

/**
 * Google's view of the site: realtime users and the last 28 days across
 * devices, platforms, places, pages and sources. Server component — the key
 * never leaves the box. Until GA is wired up it shows what is still missing.
 */
export async function GoogleAnalyticsPanel({ settings }: { settings?: AnalyticsSettings }) {
  const tagSet = Boolean(settings?.gtmId || settings?.gaId);
  const propertyId = settings?.gaPropertyId;
  const serviceEmail = gaServiceAccountEmail();

  if (!tagSet || !propertyId || !serviceEmail) {
    return <Setup tagSet={tagSet} propertySet={Boolean(propertyId)} serviceEmail={serviceEmail} />;
  }

  let report: GaReport;
  try {
    report = await fetchGaReport(propertyId);
  } catch (error) {
    return (
      <section className="flex flex-col gap-3">
        <Heading />
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <p className="font-medium">Google Analytics isn&apos;t answering.</p>
          <p className="mt-1 text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Usual causes: the service account (<span className="font-mono">{serviceEmail}</span>) isn&apos;t a Viewer on
            property {propertyId}, the property ID is wrong, or the Google Analytics Data API isn&apos;t enabled on the
            Google Cloud project.
          </p>
        </div>
      </section>
    );
  }

  const { realtime, totals, byDate } = report;
  const minutes = Math.round(totals.avgSessionSeconds / 60);
  const seconds = Math.round(totals.avgSessionSeconds % 60);

  return (
    <section className="flex flex-col gap-4">
      <Heading fetchedAt={report.fetchedAt} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="On the site right now" value={realtime.activeUsers} sub={realtime.byDevice.map((d) => `${d.value} ${d.label}`).join(" · ") || "no one in the last 30 min"} live />
        <Kpi label={`Users · ${report.days} days`} value={totals.activeUsers} sub={`${totals.newUsers} new`} />
        <Kpi label={`Sessions · ${report.days} days`} value={totals.sessions} sub={`${totals.pageViews} page views`} />
        <Kpi label="Engagement" value={`${Math.round(totals.engagementRate * 100)}%`} sub={`avg session ${minutes}m ${seconds}s`} />
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-baseline justify-between text-sm">
            <span>Daily users, sessions and page views</span>
            <span className="text-xs font-normal text-muted-foreground">last {report.days} days · Google Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DailyChart data={byDate} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RowsCard title="Right now · pages" rows={realtime.byPage} unit="users" />
        <RowsCard title="Right now · countries" rows={realtime.byCountry} unit="users" />
        <RowsCard title="Devices" rows={report.byDevice} unit="users" />
        <RowsCard title="Operating systems" rows={report.byOs} unit="users" />
        <RowsCard title="Browsers" rows={report.byBrowser} unit="users" />
        <RowsCard title="Countries" rows={report.byCountry} unit="users" />
        <RowsCard title="Cities" rows={report.byCity} unit="users" />
        <RowsCard title="Top pages" rows={report.byPage} unit="views" />
        <RowsCard title="Traffic channels" rows={report.byChannel} unit="sessions" />
        <RowsCard title="Sources" rows={report.bySource} unit="sessions" />
      </div>
    </section>
  );
}

function Heading({ fetchedAt }: { fetchedAt?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-sm font-semibold">Google Analytics</h2>
      {fetchedAt ? (
        <p className="text-xs text-muted-foreground">
          Google data as of{" "}
          {new Date(fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}{" "}
          IST · realtime covers the last 30 minutes · daily figures lag Google by up to a day
        </p>
      ) : null}
    </div>
  );
}

function Step({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      {done ? <Check className="mt-0.5 size-4 text-green-600" /> : <Circle className="mt-0.5 size-4 text-muted-foreground" />}
      <span className={done ? "text-muted-foreground line-through" : ""}>{children}</span>
    </li>
  );
}

function Setup({ tagSet, propertySet, serviceEmail }: { tagSet: boolean; propertySet: boolean; serviceEmail: string | null }) {
  return (
    <section className="flex flex-col gap-3">
      <Heading />
      <div className="rounded-lg border border-dashed p-5 text-sm">
        <p className="font-medium">Connect Google Analytics to see devices, platforms, countries, pages and sources here.</p>
        <ol className="mt-3 flex flex-col gap-2">
          <Step done={tagSet}>
            Add your GTM container ID or GA4 measurement ID in{" "}
            <Link href="/admin/settings" className="underline">Settings</Link>. The public site starts sending data to Google.
          </Step>
          <Step done={propertySet}>
            Add the GA4 property ID (GA Admin → Property details) in{" "}
            <Link href="/admin/settings" className="underline">Settings</Link>.
          </Step>
          <Step done={Boolean(serviceEmail)}>
            In Google Cloud: create a service account, enable the <em>Google Analytics Data API</em>, download its JSON
            key, and set it as <span className="font-mono">GA_SERVICE_ACCOUNT_KEY</span> on the server.
            {serviceEmail ? (
              <>
                {" "}Then add <span className="font-mono">{serviceEmail}</span> as a Viewer on the GA property (Admin →
                Property access management).
              </>
            ) : null}
          </Step>
        </ol>
        <a
          href="https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground underline"
        >
          Google&apos;s quickstart for the service account <ExternalLink className="size-3" />
        </a>
      </div>
    </section>
  );
}

function Kpi({ label, value, sub, live }: { label: string; value: number | string; sub: string; live?: boolean }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {live ? <span className="inline-flex size-2 rounded-full bg-green-500" /> : null}
          {label}
        </p>
        <p className="text-3xl font-bold tabular-nums tracking-tight">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

/** Horizontal bars, share of the top row. */
function RowsCard({ title, rows, unit }: { title: string; rows: Row[]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nothing yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {rows.map((row) => (
              <li key={row.label} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="truncate">{row.label}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {row.value} {unit}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-pink" style={{ width: `${(row.value / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** Users, sessions and page views per day as grouped bars. */
function DailyChart({ data }: { data: GaReport["byDate"] }) {
  const W = 900;
  const H = 180;
  const PAD = 4;
  const max = Math.max(1, ...data.map((d) => Math.max(d.users, d.sessions, d.pageViews)));
  const group = W / Math.max(1, data.length);
  const bw = Math.max(2, (group - 4) / 3);
  const series: { key: "users" | "sessions" | "pageViews"; color: string; label: string }[] = [
    { key: "users", color: "var(--color-pink)", label: "Users" },
    { key: "sessions", color: "var(--color-cyan)", label: "Sessions" },
    { key: "pageViews", color: "var(--color-grass)", label: "Page views" },
  ];
  const fmt = (d: string) => `${Number(d.slice(6, 8))}/${Number(d.slice(4, 6))}`;
  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full" role="img" aria-label="Daily traffic">
        {[0.5, 1].map((f) => (
          <line key={f} x1={0} x2={W} y1={H - PAD - (H - 2 * PAD) * f} y2={H - PAD - (H - 2 * PAD) * f} stroke="currentColor" strokeOpacity={0.08} />
        ))}
        {data.map((d, i) =>
          series.map((s, j) => {
            const v = d[s.key];
            const h = v === 0 ? 1 : Math.max(2, ((H - 2 * PAD) * v) / max);
            return (
              <g key={`${d.date}-${s.key}`}>
                <rect x={i * group + j * bw} y={H - PAD - h} width={bw - 1} height={h} rx={1} fill={s.color} fillOpacity={v === 0 ? 0.15 : 1} />
                <title>{`${fmt(d.date)} · ${s.label}: ${v}`}</title>
              </g>
            );
          }),
        )}
        <line x1={0} x2={W} y1={H - PAD} y2={H - PAD} stroke="currentColor" strokeOpacity={0.2} />
      </svg>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{data[0] ? fmt(data[0].date) : ""}</span>
        <span className="flex gap-3">
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1">
              <span className="inline-block size-2 rounded-sm" style={{ background: s.color }} /> {s.label}
            </span>
          ))}
        </span>
        <span>{data.at(-1) ? fmt(data.at(-1)!.date) : ""}</span>
      </div>
    </div>
  );
}
