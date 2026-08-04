// Downloads papers linked from an sgtestpaper.com listing page, stamps them
// with the LionCity banner + cover page, and uploads to R2. Does NOT touch
// src/data/testPapers.mjs — it prints suggested entries for manual review,
// since mapping a scraped title into the right subject/exam-type bucket is
// a judgment call.
//
// Usage:
//   node --env-file=.env scripts/scrape-sgtestpaper.mjs <listingPageUrl> <keyPrefix> [--dry-run] [--limit=N]
// e.g.
//   node --env-file=.env scripts/scrape-sgtestpaper.mjs \
//     https://www.sgtestpaper.com/primary/subject2025/y25p6maths.html \
//     papers/primary/2025/p6-maths --dry-run
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import { AwsClient } from "aws4fetch";
import { stampPdfBuffer } from "./lib/stampPdf.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const [listingUrl, keyPrefix] = args.filter((a) => !a.startsWith("--"));

if (!listingUrl || !keyPrefix) {
  console.error(
    "Usage: node scripts/scrape-sgtestpaper.mjs <listingPageUrl> <keyPrefix> [--dry-run] [--limit=N]"
  );
  process.exit(1);
}

const ALLOWED_HOST = "sgtestpaper.com";
const url = new URL(listingUrl);
if (!url.hostname.endsWith(ALLOWED_HOST)) {
  console.error(`Refusing to scrape ${url.hostname} — this script is scoped to ${ALLOWED_HOST} only.`);
  process.exit(1);
}

function slugifySegment(segment) {
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchHtml(u) {
  const res = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (compatible; LionCityTutorsBot/1.0)" } });
  if (!res.ok) throw new Error(`GET ${u} -> ${res.status}`);
  return res.text();
}

// A listing page links to either a direct .pdf or an intermediate HTML page
// that itself contains the direct .pdf link. Resolve one hop if needed.
async function resolvePdfUrl(href, baseUrl) {
  const absolute = new URL(href, baseUrl).toString();
  if (absolute.toLowerCase().endsWith(".pdf")) return absolute;
  if (!absolute.toLowerCase().endsWith(".html")) return null;

  const html = await fetchHtml(absolute);
  const $ = cheerio.load(html);
  const pdfLink = $("a[href$='.pdf'], a[href*='.pdf']")
    .map((_, el) => $(el).attr("href"))
    .get()
    .find((h) => h && h.toLowerCase().includes(".pdf"));
  if (!pdfLink) return null;
  return new URL(pdfLink, absolute).toString();
}

console.log(`Fetching listing: ${listingUrl}`);
const listingHtml = await fetchHtml(listingUrl);
const $ = cheerio.load(listingHtml);

const candidates = $("a[href]")
  .map((_, el) => ({ href: $(el).attr("href"), text: $(el).text().trim() }))
  .get()
  .filter(({ href }) => href && (href.includes(".pdf") || href.includes("test_paper") || href.includes("WorkedSolutions")))
  .filter(({ href }) => !href.includes("mcqQuizP6.php")); // skip interactive quiz links, not downloadable PDFs

console.log(`Found ${candidates.length} candidate links (before dedup/resolve)`);

const seen = new Set();
const resolved = [];
for (const { href, text } of candidates) {
  if (resolved.length >= limit) break;
  const pdfUrl = await resolvePdfUrl(href, listingUrl);
  if (!pdfUrl || seen.has(pdfUrl)) continue;
  seen.add(pdfUrl);
  resolved.push({ pdfUrl, text });
}
console.log(`Resolved ${resolved.length} unique PDF URLs\n`);

if (dryRun) {
  for (const { pdfUrl, text } of resolved) console.log(`[dry-run] "${text}" -> ${pdfUrl}`);
  process.exit(0);
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 environment variables — run with --env-file=.env");
  process.exit(1);
}
const client = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });

const results = [];
for (const { pdfUrl, text } of resolved) {
  try {
    const filename = decodeURIComponent(path.basename(new URL(pdfUrl).pathname));
    const key = `${keyPrefix}/${slugifySegment(filename.replace(/\.pdf$/i, ""))}.pdf`;

    const res = await fetch(pdfUrl, { headers: { "User-Agent": "Mozilla/5.0 (compatible; LionCityTutorsBot/1.0)" } });
    if (!res.ok) throw new Error(`download failed: ${res.status}`);
    const rawBuf = Buffer.from(await res.arrayBuffer());
    const stampedBuf = await stampPdfBuffer(rawBuf);

    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    const putUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${encodedKey}`;
    const putRes = await client.fetch(putUrl, {
      method: "PUT",
      body: stampedBuf,
      headers: { "Content-Type": "application/pdf" },
    });
    if (!putRes.ok) throw new Error(`upload failed: ${putRes.status} ${await putRes.text()}`);

    console.log(`uploaded ${key} (${(stampedBuf.length / 1024).toFixed(0)}KB) <- "${text}"`);
    results.push({ title: text, fileKey: key, sourceUrl: pdfUrl });
  } catch (err) {
    console.error(`FAILED "${text}" (${pdfUrl}): ${err.message}`);
  }
}

const outPath = path.join("scripts", `scrape-result-${Date.now()}.json`);
await writeFile(outPath, JSON.stringify(results, null, 2));

console.log(`\n${results.length} papers uploaded. Suggested testPapers.mjs entries written to ${outPath}:\n`);
for (const r of results) {
  console.log(`{ title: '${r.title.replace(/'/g, "\\'")}', fileKey: '${r.fileKey}' },`);
}
console.log("\nReview these, pick the right subject/exam-type bucket in src/data/testPapers.mjs, and paste in.");
