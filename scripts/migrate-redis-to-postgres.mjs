/* One-off: copy everything out of Upstash Redis into Postgres. Re-runnable —
   each key is upserted, so a second pass just refreshes. */
import { readFileSync } from "node:fs";
import { Redis } from "@upstash/redis";
import pg from "pg";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] ??= m[2];
}
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const keys = await redis.keys("*");
console.log(`${keys.length} keys in Redis`);

let documents = 0, media = 0, skipped = 0;
for (const key of keys) {
  const value = await redis.get(key);
  if (value === null || value === undefined) { skipped++; continue; }
  // A media body is the only thing stored as a bare string; everything else
  // is a JSON document. media/<id>.meta is a document, media/<id> is bytes.
  const isMediaBody = key.startsWith("media/") && !key.endsWith(".meta");
  if (isMediaBody) {
    await client.query(
      `INSERT INTO media (key, data) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [key, String(value)],
    );
    media++;
  } else {
    await client.query(
      `INSERT INTO documents (path, data) VALUES ($1, $2::jsonb)
       ON CONFLICT (path) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [key, JSON.stringify(value)],
    );
    documents++;
  }
}

const { rows } = await client.query(`
  SELECT (SELECT count(*) FROM documents) AS documents,
         (SELECT count(*) FROM media) AS media,
         (SELECT count(*) FROM documents WHERE path LIKE 'submissions/%') AS submissions,
         (SELECT count(*) FROM documents WHERE path LIKE 'users/%') AS users,
         (SELECT pg_size_pretty(pg_database_size(current_database()))) AS size`);
console.log(`copied: ${documents} documents, ${media} media, ${skipped} empty keys skipped`);
console.log("in postgres:", rows[0]);
await client.end();
