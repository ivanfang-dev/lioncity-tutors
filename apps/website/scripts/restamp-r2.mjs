// Re-stamps papers whose banner landed on a side edge instead of the top.
// Pages with a /Rotate flag were stamped in unrotated space before the fix in
// lib/stampPdf.mjs, so the banner needs redrawing from the original source PDF.
//
// Re-stamps every key you point it at, from the source URL recorded in the
// scrape-result-*.json files, so keys are reused exactly — nothing is orphaned.
// Scope a run with --only; without it, every recorded key is redone. Rerunning
// is safe but not free: a correct page keeps its /Rotate flag, so there is no
// way to tell a fixed file from a broken one without rendering it.
//
// Usage:
//   node --env-file=.env scripts/restamp-r2.mjs [--dry-run] [--only=<key prefix>]
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AwsClient } from "aws4fetch";
import { PDFDocument } from "pdf-lib";
import { stampPdfBuffer } from "./lib/stampPdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.split("=")[1] : "";
const UA = { "User-Agent": "Mozilla/5.0 (compatible; LionCityTutorsBot/1.0)" };

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 environment variables — run with --env-file=.env");
  process.exit(1);
}
const client = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });
const objectUrl = (key) => `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key.split("/").map(encodeURIComponent).join("/")}`;

// fileKey -> sourceUrl, from every recorded scrape run
const sources = new Map();
for (const name of await readdir(__dirname)) {
  if (!/^scrape-result-.*\.json$/.test(name)) continue;
  for (const r of JSON.parse(await readFile(path.join(__dirname, name), "utf8"))) {
    if (r.fileKey && r.sourceUrl) sources.set(r.fileKey, r.sourceUrl);
  }
}

const keys = [...sources.keys()].filter((k) => k.startsWith(only)).sort();
console.log(`${keys.length} key(s) with a recorded source URL${only ? ` under ${only}` : ""}\n`);

async function pageCount(bytes) {
  return (await PDFDocument.load(bytes, { ignoreEncryption: true })).getPageCount();
}

let fixed = 0, failed = 0;
for (const key of keys) {
  try {
    if (dryRun) {
      console.log(`[dry-run] would re-stamp ${key} <- ${sources.get(key)}`);
      fixed++;
      continue;
    }

    const srcRes = await fetch(sources.get(key), { headers: UA });
    if (!srcRes.ok) throw new Error(`source download ${srcRes.status}`);
    const srcBytes = Buffer.from(await srcRes.arrayBuffer());
    const stamped = await stampPdfBuffer(srcBytes);
    // the only cheap invariant worth asserting: cover page prepended, nothing dropped
    const expected = (await pageCount(srcBytes)) + 1;
    const got = await pageCount(stamped);
    if (got !== expected) throw new Error(`stamped page count ${got}, expected ${expected} — not uploading`);

    const put = await client.fetch(objectUrl(key), { method: "PUT", body: stamped, headers: { "Content-Type": "application/pdf" } });
    if (!put.ok) throw new Error(`upload ${put.status} ${await put.text()}`);
    console.log(`re-stamped ${key} (${got} pages, ${(stamped.length / 1024).toFixed(0)}KB)`);
    fixed++;
  } catch (err) {
    console.error(`FAILED ${key}: ${err.message}`);
    failed++;
  }
}

console.log(`\n${dryRun ? "would re-stamp" : "re-stamped"} ${fixed} | failed ${failed}`);
if (failed) process.exit(1);
