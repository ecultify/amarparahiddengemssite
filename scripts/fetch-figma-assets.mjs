#!/usr/bin/env node
/**
 * Downloads every image referenced by the Figma design into public/images.
 *
 * Figma's MCP asset URLs expire roughly 7 days after they are generated, so if
 * this script starts returning 403/404 the manifest needs regenerating from the
 * Figma file (feGxkhlM2AE5Ke6n8O9H5r).
 *
 *   npm run assets
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "images");
const manifestPath = path.join(root, "figma-assets.json");

const force = process.argv.includes("--force");

const { assets } = JSON.parse(await readFile(manifestPath, "utf8"));
await mkdir(outDir, { recursive: true });

let ok = 0;
let skipped = 0;
const failed = [];

for (const [name, url] of Object.entries(assets)) {
  const dest = path.join(outDir, name);
  if (!force && existsSync(dest)) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
    process.stdout.write(`  ok  ${name}\n`);
  } catch (err) {
    failed.push([name, err.message]);
    process.stdout.write(`  FAIL ${name} (${err.message})\n`);
  }
}

console.log(`\n${ok} downloaded, ${skipped} already present, ${failed.length} failed.`);
if (failed.length) {
  console.log("\nFailed assets usually mean the Figma URLs have expired.");
  console.log("Ask Claude to regenerate figma-assets.json from the Figma file.");
  process.exitCode = 1;
}
