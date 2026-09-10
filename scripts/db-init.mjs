/* Creates the two tables if they are missing. Idempotent — the deploy runs it
   every time, so a fresh box needs no manual step. */
import { readFileSync, existsSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}
if (!process.env.DATABASE_URL) {
  console.log("db-init: no DATABASE_URL, nothing to do");
  process.exit(0);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(`
  CREATE TABLE IF NOT EXISTS documents (
    path       text PRIMARY KEY,
    data       jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS documents_path_pattern ON documents (path text_pattern_ops);
  CREATE TABLE IF NOT EXISTS media (
    key        text PRIMARY KEY,
    data       text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
`);
const { rows } = await client.query(
  `SELECT (SELECT count(*) FROM documents) AS documents, (SELECT count(*) FROM media) AS media`,
);
console.log(`db-init: schema ready — ${rows[0].documents} documents, ${rows[0].media} media`);
await client.end();
