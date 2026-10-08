import { coalesce } from "@/lib/coalesce";
import { googleAccessToken } from "@/lib/ga";
import { listSubmissions } from "@/lib/submissions";
import { listUsers } from "@/lib/users";

/**
 * Mirrors the campaign's numbers into the team's Google Sheet (SHEET_ID),
 * rewriting three tabs from scratch on every run so the sheet never drifts:
 *   Submissions — every gem entry, joined to the quiz record by phone
 *   Scans       — ME-QR totals for the newspaper QR, then per-day / device / city
 *   Scan Log    — one row per scan event, as ME-QR reports it
 * Runs after every new submission and every admin status change or delete
 * (queueSheetSync), plus the VPS cron once a day via /api/sync-sheet as a backstop. The service account in
 * GA_SERVICE_ACCOUNT_KEY needs Editor on the sheet.
 */
const SHEETS = "https://sheets.googleapis.com/v4/spreadsheets";
const MEQR = "https://me-qr.com/api/v2/qr/statistic";

type Scan = {
  city: string | null;
  country: string | null;
  device: string | null;
  os: string | null;
  scanDate: string;
  isUnique: boolean;
};

type Cell = string | number | boolean;

const ist = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
const istDay = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

async function fetchScans(qrId: string): Promise<Scan[]> {
  const key = process.env.MEQR_API_KEY;
  if (!key) throw new Error("MEQR_API_KEY is not set");
  const all: Scan[] = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const res = await fetch(`${MEQR}?qrUID=${qrId}&limit=1000&page=${page}`, {
      headers: { "X-AUTH-TOKEN": key },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`ME-QR ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { totalPages: number; items: Scan[] };
    pages = body.totalPages;
    all.push(...body.items);
  }
  return all;
}

function tally(scans: Scan[], key: (s: Scan) => string): Cell[][] {
  const counts = new Map<string, number>();
  for (const s of scans) counts.set(key(s), (counts.get(key(s)) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]).map(([k, n]) => [k, n]);
}

/** Uploads are stored as site-relative paths; the sheet needs a full URL. */
const abs = (url: string) => (url.startsWith("/") ? `https://amarpara.in${url}` : url);

async function submissionRows(): Promise<Cell[][]> {
  const [submissions, users] = await Promise.all([listSubmissions(), listUsers()]);
  const byPhone = new Map(users.map((u) => [u.phone.replace(/\D/g, ""), u]));
  const rows: Cell[][] = [
    ["Submitted (IST)", "Name", "Phone", "Para", "Location", "Category", "Gem", "Description", "Upload", "Status", "Played quiz", "Quiz days", "Correct"],
  ];
  for (const s of submissions) {
    // Imported leads (Meta lead forms) are tracked in Meta, not in this sheet.
    if (s.source) continue;
    const user = byPhone.get((s.phone ?? "").replace(/\D/g, ""));
    const guesses = Object.values(user?.guesses ?? {});
    rows.push([
      ist(s.createdAt), s.name ?? "", s.phone ?? "", s.para, s.location, s.category, s.title, s.description,
      s.upload ? `${s.uploadType === "video" ? "Video" : "Photo"} ${abs(s.upload)}` : "",
      s.status, guesses.length ? "Yes" : "No", guesses.length, guesses.filter((g) => g.correct).length,
    ]);
  }
  return rows;
}

function scanTabs(scans: Scan[]): { Scans: Cell[][]; "Scan Log": Cell[][] } {
  const sorted = [...scans].sort((a, b) => a.scanDate.localeCompare(b.scanDate));
  const last = sorted.at(-1)?.scanDate;
  const section = (title: string, rows: Cell[][]): Cell[][] => [[], [title, "Scans"], ...rows];
  return {
    Scans: [
      ["Updated (IST)", ist(new Date().toISOString())],
      ["Total scans", scans.length],
      ["Unique scans", scans.filter((s) => s.isUnique).length],
      ["Last scan (IST)", last ? ist(last) : ""],
      ...section("Day", tally(sorted, (s) => istDay(s.scanDate)).sort((a, b) => String(a[0]).localeCompare(String(b[0])))),
      ...section("Device", tally(scans, (s) => s.device ?? "unknown")),
      ...section("OS", tally(scans, (s) => s.os ?? "unknown")),
      ...section("City", tally(scans, (s) => s.city ?? "unknown")),
    ],
    "Scan Log": [
      ["Scanned (IST)", "City", "Country", "Device", "OS", "Unique"],
      ...sorted.reverse().map((s) => [ist(s.scanDate), s.city ?? "", s.country ?? "", s.device ?? "", s.os ?? "", s.isUnique ? "Yes" : "No"]),
    ],
  };
}

/* ---- Formatting: brand header, frozen top row, sized columns ---- */
const NAVY = { red: 27 / 255, green: 42 / 255, blue: 74 / 255 };
const CREAM = { red: 252 / 255, green: 248 / 255, blue: 242 / 255 };
const WHITE = { red: 1, green: 1, blue: 1 };
const BOLD = (color = NAVY) => ({ textFormat: { bold: true, foregroundColor: color } });

/** Description column on the Submissions tab: wrapped at a fixed width so
 *  a 250-char entry doesn't push everything else off screen. */
const WRAP_COLS: Record<string, number[]> = { Submissions: [7] };

function styling(sheetId: number, values: Cell[][], title: string) {
  const cols = Math.max(...values.map((r) => r.length));
  const grid = (start: number, end: number, c0 = 0, c1 = cols) => ({
    sheetId, startRowIndex: start, endRowIndex: end, startColumnIndex: c0, endColumnIndex: c1,
  });
  const fill = (range: object, format: object, fields: string) => ({
    repeatCell: { range, cell: { userEnteredFormat: format }, fields: `userEnteredFormat(${fields})` },
  });

  // Section headers on the Scans tab are the rows whose second cell is "Scans";
  // everything else with a header is a plain table with its header on row 1.
  const headers = title === "Scans" ? values.flatMap((r, i) => (r[1] === "Scans" ? [i] : [])) : [0];
  const summary = title === "Scans" ? 4 : 0; // the label/value block at the top

  return [
    // Reset, so a column that disappears doesn't leave stale styling behind.
    { updateCells: { range: { sheetId }, fields: "userEnteredFormat" } },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: title === "Scans" ? 0 : 1 } }, fields: "gridProperties.frozenRowCount" } },
    fill(grid(0, values.length), { textFormat: { fontFamily: "Manrope", fontSize: 10 }, verticalAlignment: "MIDDLE" }, "textFormat,verticalAlignment"),
    ...headers.map((r) =>
      fill(grid(r, r + 1), { backgroundColor: NAVY, ...BOLD(WHITE), horizontalAlignment: "LEFT" }, "backgroundColor,textFormat,horizontalAlignment"),
    ),
    ...(summary
      ? [
          fill(grid(0, summary, 0, 1), BOLD(), "textFormat"),
          fill(grid(0, summary, 1, 2), { horizontalAlignment: "LEFT", ...BOLD() }, "horizontalAlignment,textFormat"),
        ]
      : []),
    ...(title === "Scans" ? [] : [fill(grid(1, values.length), { backgroundColor: CREAM }, "backgroundColor")]),
    { autoResizeDimensions: { dimensions: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: cols } } },
    ...(WRAP_COLS[title] ?? []).flatMap((c) => [
      { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: c, endIndex: c + 1 }, properties: { pixelSize: 360 }, fields: "pixelSize" } },
      fill(grid(1, values.length, c, c + 1), { wrapStrategy: "WRAP" }, "wrapStrategy"),
    ]),
  ];
}

const UPLOAD_COL = 8;

/** Turns "Photo https://…" cells into clickable "Photo" links. Rich-text
 *  links rather than HYPERLINK() formulas: no locale-dependent separator
 *  and nothing the visitor typed can ever be run as a formula. */
function links(sheetId: number, values: Cell[][], col: number) {
  return values.flatMap((row, r) => {
    const [label, url] = String(row[col] ?? "").split(" ");
    if (r === 0 || !url?.startsWith("http")) return [];
    return [
      {
        updateCells: {
          range: { sheetId, startRowIndex: r, endRowIndex: r + 1, startColumnIndex: col, endColumnIndex: col + 1 },
          rows: [{ values: [{ userEnteredValue: { stringValue: label }, textFormatRuns: [{ startIndex: 0, format: { link: { uri: url } } }] }] }],
          fields: "userEnteredValue,textFormatRuns",
        },
      },
    ];
  });
}

export async function syncSheet() {
  const sheetId = process.env.SHEET_ID;
  const qrId = process.env.MEQR_QR_ID;
  if (!sheetId || !qrId) throw new Error("SHEET_ID / MEQR_QR_ID are not set");

  const [Submissions, scans] = await Promise.all([submissionRows(), fetchScans(qrId)]);
  const tabs: Record<string, Cell[][]> = { Submissions, ...scanTabs(scans) };

  const auth = { Authorization: `Bearer ${await googleAccessToken("https://www.googleapis.com/auth/spreadsheets")}` };
  const api = async (path: string, body: unknown) => {
    const res = await fetch(`${SHEETS}/${sheetId}${path}`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`Sheets ${path} ${res.status}: ${await res.text()}`);
    return res.json();
  };

  // Tabs are created on first run so nothing has to be set up by hand.
  const readMeta = async () =>
    (await (await fetch(`${SHEETS}/${sheetId}?fields=sheets.properties(title,sheetId)`, { headers: auth })).json()) as {
      sheets?: { properties: { title: string; sheetId: number } }[];
    };
  let meta = await readMeta();
  const have = new Set((meta.sheets ?? []).map((s) => s.properties.title));
  const missing = Object.keys(tabs).filter((t) => !have.has(t));
  if (missing.length) {
    await api(":batchUpdate", { requests: missing.map((title) => ({ addSheet: { properties: { title } } })) });
    meta = await readMeta();
  }
  const ids = Object.fromEntries((meta.sheets ?? []).map((s) => [s.properties.title, s.properties.sheetId]));

  await api("/values:batchClear", { ranges: Object.keys(tabs).map((t) => `'${t}'`) });
  // RAW: a description that starts with "=" must stay text, not run as a formula.
  await api("/values:batchUpdate", {
    valueInputOption: "RAW",
    data: Object.entries(tabs).map(([t, values]) => ({ range: `'${t}'!A1`, values })),
  });
  await api(":batchUpdate", {
    requests: [
      ...Object.entries(tabs).flatMap(([t, values]) => styling(ids[t], values, t)),
      ...links(ids.Submissions, Submissions, UPLOAD_COL),
    ],
  });

  return { submissions: Submissions.length - 1, scans: scans.length };
}

/** Fire-and-forget refresh for the submission actions. Queued, so a burst of
 *  entries never runs overlapping rewrites of the sheet. */
export const queueSheetSync = coalesce(syncSheet, (error) => console.error("[sync-sheet]", error));
