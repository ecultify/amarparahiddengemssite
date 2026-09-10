import { Pool } from "pg";

/**
 * Postgres behind the same eight calls the rest of the app already makes, so
 * nothing outside this file knows which store it is talking to.
 *
 * Two tables carry everything. `documents` holds the JSON that used to be one
 * key per pathname — the site's content, every submission, every quiz user —
 * keyed by the same pathnames, so a prefix listing is a range scan. `media`
 * holds uploads as the base64 the routes already speak, appended chunk by
 * chunk the way Redis APPEND did.
 */

declare global {
  // Next reloads modules on every request in dev; one pool, not one per reload.
  var amarparaPool: Pool | undefined;
}

function pool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  globalThis.amarparaPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 8,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
  return globalThis.amarparaPool;
}

export const hasPostgres = () => Boolean(process.env.DATABASE_URL);

export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS documents (
    path       text PRIMARY KEY,
    data       jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  -- Prefix listings ("submissions/%") need pattern ops to use an index.
  CREATE INDEX IF NOT EXISTS documents_path_pattern ON documents (path text_pattern_ops);

  CREATE TABLE IF NOT EXISTS media (
    key        text PRIMARY KEY,
    data       text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
`;

export async function initSchema() {
  await pool().query(SCHEMA);
}

/* ---- documents ---- */

export async function pgReadJson<T>(path: string): Promise<T | null> {
  const { rows } = await pool().query<{ data: T }>("SELECT data FROM documents WHERE path = $1", [path]);
  return rows[0]?.data ?? null;
}

export async function pgWriteJson(path: string, value: unknown) {
  await pool().query(
    `INSERT INTO documents (path, data) VALUES ($1, $2::jsonb)
     ON CONFLICT (path) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [path, JSON.stringify(value)],
  );
}

/** Newest pathname first, matching the ids' timestamp prefix. */
export async function pgReadJsonCollection<T>(prefix: string): Promise<T[]> {
  const { rows } = await pool().query<{ data: T }>(
    "SELECT data FROM documents WHERE path LIKE $1 ORDER BY path DESC",
    [`${prefix}%`],
  );
  return rows.map((row) => row.data);
}

export async function pgRemove(path: string) {
  await pool().query("DELETE FROM documents WHERE path = $1", [path]);
}

/* ---- media, as base64 text ---- */

export async function pgSetRaw(key: string, chunk: string) {
  await pool().query(
    `INSERT INTO media (key, data) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, chunk],
  );
}

/** Resolves to the new total length, the one thing the size cap checks. */
export async function pgAppendRaw(key: string, chunk: string): Promise<number> {
  const { rows } = await pool().query<{ length: string }>(
    `INSERT INTO media (key, data) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET data = media.data || EXCLUDED.data, updated_at = now()
     RETURNING length(data) AS length`,
    [key, chunk],
  );
  return Number(rows[0].length);
}

export async function pgGetRaw(key: string): Promise<string | null> {
  const { rows } = await pool().query<{ data: string }>("SELECT data FROM media WHERE key = $1", [key]);
  return rows[0]?.data ?? null;
}

export async function pgDelRaw(key: string) {
  await pool().query("DELETE FROM media WHERE key = $1", [key]);
}
