// Usage:
//   node --env-file=.env scripts/upload-r2.mjs <sourceDir> <keyPrefix> [--dry-run] [--no-stamp]
// e.g. node --env-file=.env scripts/upload-r2.mjs public/papers papers --dry-run
// Slugifies every path segment, skips cover_page.pdf, uploads PDFs with
// Content-Type application/pdf, writes scripts/r2-manifest-<keyPrefix>.json.
// Every PDF is stamped with the LionCity Tutors cover page + banner before
// upload (see lib/stampPdf.mjs) unless --no-stamp is passed.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { AwsClient } from "aws4fetch";
import { stampPdfBuffer } from "./lib/stampPdf.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const noStamp = args.includes("--no-stamp");
const [sourceDir, keyPrefix] = args.filter((a) => !a.startsWith("--"));
if (!sourceDir || !keyPrefix) {
  console.error("Usage: node scripts/upload-r2.mjs <sourceDir> <keyPrefix> [--dry-run] [--no-stamp]");
  process.exit(1);
}

const EXCLUDE = new Set(["cover_page.pdf"]);

function slugifySegment(segment) {
  return segment
    .replace(/(\.pdf)+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toKey(relPath) {
  const parts = relPath.split(path.sep);
  const file = parts.pop();
  const slugged = [...parts.map(slugifySegment), `${slugifySegment(file)}.pdf`];
  return [keyPrefix, ...slugged].join("/");
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.toLowerCase().endsWith(".pdf") && !EXCLUDE.has(entry.name)) yield full;
  }
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
if (!dryRun && (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME)) {
  console.error("Missing R2 environment variables — run with --env-file=.env");
  process.exit(1);
}
const client = dryRun
  ? null
  : new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });

const manifest = [];
for await (const file of walk(sourceDir)) {
  const relPath = path.relative(sourceDir, file);
  const key = toKey(relPath);
  manifest.push({ file: path.join(sourceDir, relPath), key });
  if (dryRun) {
    console.log(`[dry-run] ${relPath} -> ${key}`);
    continue;
  }
  const rawBody = await readFile(file);
  const body = noStamp ? rawBody : await stampPdfBuffer(rawBody);
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${encodedKey}`;
  const res = await client.fetch(url, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/pdf" },
  });
  if (!res.ok) {
    console.error(`FAILED ${key}: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const stampNote = noStamp ? "" : ` (stamped, was ${(rawBody.length / 1024).toFixed(0)}KB)`;
  console.log(`uploaded ${key} (${(body.length / 1024).toFixed(0)} KB)${stampNote}`);
}

const manifestPath = path.join("scripts", `r2-manifest-${keyPrefix}.json`);
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} files -> ${manifestPath}`);
