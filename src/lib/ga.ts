import { createSign } from "node:crypto";

/**
 * Google Analytics Data API (GA4), read-only, for the Overview. Auth is a
 * service account: its JSON key sits in GA_SERVICE_ACCOUNT_KEY (raw JSON or
 * base64), and its email must be a Viewer on the GA property. The JWT is
 * signed here with node:crypto — no Google SDK.
 *
 * Every call is memoised for 60s per property so the Overview's 30s refresh
 * doesn't burn the API quota.
 */

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://analyticsdata.googleapis.com/v1beta";
const MEMO_MS = 60_000;

type ServiceAccount = { client_email: string; private_key: string };

function serviceAccount(): ServiceAccount | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json) as Partial<ServiceAccount>;
    return parsed.client_email && parsed.private_key ? (parsed as ServiceAccount) : null;
  } catch {
    return null;
  }
}

/** The service-account email, for the Settings page to show. */
export const gaServiceAccountEmail = () => serviceAccount()?.client_email ?? null;

const b64url = (input: string | Buffer) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const tokens = new Map<string, { value: string; expiresAt: number }>();

/** An access token for the service account, cached per scope until it is
 *  about to expire. Shared with the Sheets sync, which uses the same key. */
export async function googleAccessToken(scope: string) {
  const sa = serviceAccount();
  if (!sa) throw new Error("GA_SERVICE_ACCOUNT_KEY is not set");
  return accessToken(sa, scope);
}

async function accessToken(sa: ServiceAccount, scope = SCOPE) {
  const token = tokens.get(scope);
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({ iss: sa.client_email, scope, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );
  const signature = b64url(createSign("RSA-SHA256").update(`${header}.${claims}`).sign(sa.private_key));
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed (${res.status})`);
  const body = (await res.json()) as { access_token: string; expires_in: number };
  tokens.set(scope, { value: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 });
  return body.access_token;
}

/* ---- Report shapes the Overview renders ---- */

export type Row = { label: string; value: number };
export type GaReport = {
  fetchedAt: string;
  realtime: {
    activeUsers: number;
    byDevice: Row[];
    byCountry: Row[];
    byPage: Row[];
  };
  days: number;
  totals: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
    pageViews: number;
    engagementRate: number;
    avgSessionSeconds: number;
  };
  byDate: { date: string; users: number; sessions: number; pageViews: number }[];
  byDevice: Row[];
  byOs: Row[];
  byBrowser: Row[];
  byCountry: Row[];
  byCity: Row[];
  byPage: Row[];
  byChannel: Row[];
  bySource: Row[];
};

type ApiRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type ApiReport = { rows?: ApiRow[]; totals?: ApiRow[] };

const rows = (report: ApiReport | undefined, metric = 0): Row[] =>
  (report?.rows ?? []).map((r) => ({
    label: r.dimensionValues?.[0]?.value ?? "(not set)",
    value: Number(r.metricValues?.[metric]?.value ?? 0),
  }));

async function call(sa: ServiceAccount, path: string, body: unknown) {
  const res = await fetch(`${API}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken(sa)}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = (() => {
      try {
        return (JSON.parse(text) as { error?: { message?: string } }).error?.message;
      } catch {
        return undefined;
      }
    })();
    throw new Error(msg ?? `GA API ${path} failed (${res.status})`);
  }
  return res.json();
}

const memo = new Map<string, { at: number; value: Promise<GaReport> }>();

/** Realtime snapshot plus the last `days` days, in one memoised fetch. */
export function fetchGaReport(propertyId: string, days = 28): Promise<GaReport> {
  const key = `${propertyId}:${days}`;
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < MEMO_MS) return hit.value;
  const value = load(propertyId, days).catch((error) => {
    memo.delete(key);
    throw error;
  });
  memo.set(key, { at: Date.now(), value });
  return value;
}

async function load(propertyId: string, days: number): Promise<GaReport> {
  const sa = serviceAccount();
  if (!sa) throw new Error("GA_SERVICE_ACCOUNT_KEY is not set");
  const property = `properties/${propertyId}`;
  // Google's "Last N days" preset ends yesterday, so the tiles agree with the
  // GA UI. Today is still visible in the realtime cards.
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "yesterday" }];
  const top = (dimension: string, metric = "activeUsers", limit = 10) => ({
    dimensions: [{ name: dimension }],
    metrics: [{ name: metric }],
    dateRanges,
    orderBys: [{ metric: { metricName: metric }, desc: true }],
    limit,
  });

  const [batchA, batchB, rtDevice, rtCountry, rtPage] = await Promise.all([
    call(sa, `${property}:batchRunReports`, {
      requests: [
        {
          metrics: [
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "engagementRate" },
            { name: "averageSessionDuration" },
          ],
          dateRanges,
        },
        {
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
          dateRanges,
          orderBys: [{ dimension: { dimensionName: "date" } }],
          limit: 100,
        },
        top("deviceCategory"),
        top("operatingSystem"),
        top("browser"),
      ],
    }) as Promise<{ reports?: ApiReport[] }>,
    call(sa, `${property}:batchRunReports`, {
      requests: [
        top("country"),
        top("city"),
        top("pagePath", "screenPageViews"),
        top("sessionDefaultChannelGroup", "sessions"),
        top("sessionSource", "sessions"),
      ],
    }) as Promise<{ reports?: ApiReport[] }>,
    call(sa, `${property}:runRealtimeReport`, { dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "activeUsers" }] }) as Promise<ApiReport>,
    call(sa, `${property}:runRealtimeReport`, { dimensions: [{ name: "country" }], metrics: [{ name: "activeUsers" }], limit: 10 }) as Promise<ApiReport>,
    call(sa, `${property}:runRealtimeReport`, { dimensions: [{ name: "unifiedScreenName" }], metrics: [{ name: "activeUsers" }], limit: 10 }) as Promise<ApiReport>,
  ]);

  const [totalsR, dateR, deviceR, osR, browserR] = batchA.reports ?? [];
  const [countryR, cityR, pageR, channelR, sourceR] = batchB.reports ?? [];
  const t = totalsR?.rows?.[0]?.metricValues ?? [];
  const n = (i: number) => Number(t[i]?.value ?? 0);
  const rtDeviceRows = rows(rtDevice);

  return {
    fetchedAt: new Date().toISOString(),
    realtime: {
      activeUsers: rtDeviceRows.reduce((sum, r) => sum + r.value, 0),
      byDevice: rtDeviceRows,
      byCountry: rows(rtCountry),
      byPage: rows(rtPage),
    },
    days,
    totals: {
      activeUsers: n(0),
      newUsers: n(1),
      sessions: n(2),
      pageViews: n(3),
      engagementRate: n(4),
      avgSessionSeconds: n(5),
    },
    byDate: (dateR?.rows ?? []).map((r) => ({
      date: r.dimensionValues?.[0]?.value ?? "",
      users: Number(r.metricValues?.[0]?.value ?? 0),
      sessions: Number(r.metricValues?.[1]?.value ?? 0),
      pageViews: Number(r.metricValues?.[2]?.value ?? 0),
    })),
    byDevice: rows(deviceR),
    byOs: rows(osR),
    byBrowser: rows(browserR),
    byCountry: rows(countryR),
    byCity: rows(cityR),
    byPage: rows(pageR),
    byChannel: rows(channelR),
    bySource: rows(sourceR),
  };
}
