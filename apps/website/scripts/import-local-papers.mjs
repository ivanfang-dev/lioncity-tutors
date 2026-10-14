// Stamps and uploads local PDFs listed in a manifest, then writes a
// scrape-result-*.json that merge-scrape-result.mjs reads, same as the scraper.
//
// Manifest: a JSON array of { file, title, fileKey }, where `file` is an
// absolute path to a PDF and `fileKey` is papers/<level>/<year>/<folder>/<name>.pdf.
//
// Usage:
//   node --env-file=.env scripts/import-local-papers.mjs <manifest.json> [--dry-run]
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { AwsClient } from "aws4fetch";
import { stampPdfBuffer } from "./lib/stampPdf.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const [manifestPath] = args.filter((a) => !a.startsWith("--"));
if (!manifestPath) {
  console.error("Usage: node scripts/import-local-papers.mjs <manifest.json> [--dry-run]");
  process.exit(1);
}

const entries = JSON.parse(await readFile(manifestPath, "utf8"));
const KEY_SHAPE = /^papers\/(primary|secondary|jc)\/20\d\d\/[a-z0-9-]+\/[a-z0-9-]+\.pdf$/;

// Check every entry before uploading anything.
const problems = [];
const seenKeys = new Set();
for (const { file, title, fileKey } of entries) {
  if (!title || !file || !fileKey) problems.push(`incomplete entry: ${JSON.stringify({ file, title, fileKey })}`);
  else if (!KEY_SHAPE.test(fileKey)) problems.push(`bad fileKey: ${fileKey}`);
  else if (seenKeys.has(fileKey)) problems.push(`duplicate fileKey: ${fileKey}`);
  else if (!file.toLowerCase().endsWith(".pdf")) problems.push(`not a PDF: ${file}`);
  else {
    try {
      const head = (await readFile(file)).subarray(0, 5).toString("latin1");
      if (head !== "%PDF-") problems.push(`not a PDF file: ${file}`);
    } catch {
      problems.push(`missing file: ${file}`);
    }
  }
  seenKeys.add(fileKey);
}
if (problems.length) {
  console.error(`${problems.length} problem(s), nothing uploaded:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

if (dryRun) {
  for (const { file, title, fileKey } of entries) console.log(`[dry-run] ${title}\n    ${path.basename(file)} -> ${fileKey}`);
  console.log(`\n${entries.length} entries OK.`);
  process.exit(0);
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 environment variables — run with --env-file=.env");
  process.exit(1);
}
const client = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });

const results = [];
for (const { file, title, fileKey } of entries) {
  try {
    const stamped = await stampPdfBuffer(await readFile(file));
    const encodedKey = fileKey.split("/").map(encodeURIComponent).join("/");
    const putUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${encodedKey}`;
    const res = await client.fetch(putUrl, { method: "PUT", body: stamped, headers: { "Content-Type": "application/pdf" } });
    if (!res.ok) throw new Error(`upload failed: ${res.status} ${await res.text()}`);
    console.log(`uploaded ${fileKey} (${(stamped.length / 1024).toFixed(0)}KB)`);
    results.push({ title, fileKey, sourceFile: path.basename(file) });
  } catch (err) {
    console.error(`FAILED "${title}" (${file}): ${err.message}`);
  }
}

const outPath = path.join("scripts", `scrape-result-${Date.now()}.json`);
await writeFile(outPath, JSON.stringify(results, null, 2));
console.log(`\n${results.length}/${entries.length} uploaded. Merge with:\n  node scripts/merge-scrape-result.mjs ${outPath} --write`);
