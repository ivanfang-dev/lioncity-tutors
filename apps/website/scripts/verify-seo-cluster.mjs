/**
 * Full-cluster SEO verification against a RUNNING server.
 *
 * Usage:  npm run build && npm start &   then:  npm run verify:seo
 *
 * Source greps are not sufficient: titles and JSON-LD are composed at runtime.
 * Every assertion here reads rendered HTML from localhost:3000.
 */
import { execSync } from 'node:child_process';
import { HUBS, SPOKES } from '../src/lib/seo/clusters.mjs';
import { getBreadcrumbs } from '../src/lib/seo/links.mjs';

const get = (url) =>
  status(url) === '200'
    ? execSync(`curl -s localhost:3000${url}`, { encoding: 'utf8', maxBuffer: 1e8 })
    : null;

const anchors = (html) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1]).filter((u) => u.startsWith('/'));

const ldBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'");

const statusCache = new Map();
const status = (u) => {
  if (!statusCache.has(u))
    statusCache.set(u, execSync(`curl -s -o /dev/null -w '%{http_code}' localhost:3000${u}`, { encoding: 'utf8' }));
  return statusCache.get(u);
};

const problems = [];
const clusterDupes = [];
const linkCounts = [];
const rows = [];

const all = [
  ...Object.values(HUBS).map((h) => ({ ...h, kind: 'hub' })),
  ...Object.values(SPOKES).map((s) => ({ ...s, kind: 'spoke' })),
];

for (const page of all) {
  const html = get(page.url);
  if (!html) {
    problems.push(`${page.slug}: ${page.url} did not return 200`);
    continue;
  }

  const a = anchors(html);
  const internal = new Set(a);
  const blocks = ldBlocks(html);

  // 1. JSON-LD must be present and every block must parse.
  let types = [];
  if (blocks.length === 0) problems.push(`${page.slug}: no JSON-LD`);
  for (const b of blocks) {
    try {
      const parsed = JSON.parse(decode(b));
      types.push(parsed['@type']);
    } catch (e) {
      problems.push(`${page.slug}: JSON-LD failed to parse — ${e.message}`);
    }
  }

  // 2. BreadcrumbList on every cluster page.
  if (!types.includes('BreadcrumbList')) problems.push(`${page.slug}: missing BreadcrumbList`);

  // 3. Hubs get Article unless the registry names another type — find-a-tutor
  //    is a conversion page, not an editorial guide, so it carries Service.
  //    Spokes get Course unless the registry names another type — a folder of
  //    downloads is a CollectionPage, a rate card a Service.
  if (page.kind === 'hub') {
    const wanted = page.schemaType ?? 'Article';
    if (!types.includes(wanted)) problems.push(`${page.slug}: hub missing ${wanted}`);
  }
  if (page.kind === 'spoke') {
    const wanted = page.schemaType ?? 'Course';
    if (!types.includes(wanted)) problems.push(`${page.slug}: spoke missing ${wanted}`);
  }

  // 4. Title present and under 60 chars.
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const titleLen = decode(title).length;
  if (!title) problems.push(`${page.slug}: no <title>`);
  else if (titleLen >= 60) problems.push(`${page.slug}: title ${titleLen} chars (>=60): ${decode(title)}`);

  // 5. Meta description 150-160.
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const descLen = decode(desc).length;
  if (!desc) problems.push(`${page.slug}: no meta description`);
  else if (descLen < 150 || descLen > 160) problems.push(`${page.slug}: description ${descLen} chars (want 150-160)`);

  // 6. No page is a dead end.
  if (internal.size < 2) problems.push(`${page.slug}: only ${internal.size} distinct internal links`);

  // 7. Spokes must link their hub; hubs must not link themselves.
  if (page.kind === 'spoke') {
    const hubUrl = HUBS[page.hub].url;
    if (!internal.has(hubUrl)) problems.push(`${page.slug}: does not link its hub ${hubUrl}`);
    for (const extra of page.alsoIn ?? []) {
      if (!internal.has(HUBS[extra].url)) problems.push(`${page.slug}: does not link alsoIn hub ${HUBS[extra].url}`);
    }
  } else if (internal.has(page.url) && !page.allowSelfLink) {
    problems.push(`${page.slug}: hub links to itself`);
  }

  // 8. Count links per page. Duplicates are reported after the loop, once the
  //    chrome baseline is known — see below.
  const counts = {};
  for (const u of a) counts[u] = (counts[u] || 0) + 1;
  linkCounts.push({ slug: page.slug, counts });

  // 9. Every internal link must resolve (no 404s).
  for (const u of internal) {
    const code = status(u);
    if (code !== '200') problems.push(`${page.slug}: link ${u} returned ${code}`);
  }

  // 10. Breadcrumb depth matches the registry.
  const expected = getBreadcrumbs(page.slug).length;
  const bc = blocks.map((b) => { try { return JSON.parse(decode(b)); } catch { return null; } })
    .find((p) => p && p['@type'] === 'BreadcrumbList');
  if (bc && bc.itemListElement.length !== expected)
    problems.push(`${page.slug}: breadcrumb has ${bc.itemListElement.length} items, registry says ${expected}`);

  rows.push({ slug: page.slug, kind: page.kind, titleLen, descLen, links: internal.size, ld: blocks.length, types: types.join('+') });
}

// Duplicate links to another CLUSTER page, ignoring site chrome. Nav, footer
// and CTA links repeat on every page by design, and some of them (/, /blog,
// /tuition-rates, /free-test-papers, /free-notes) are cluster pages
// themselves. Rather than hardcoding that list, take the chrome baseline to be
// the fewest times a url appears on any page: a page that links it more than
// that is adding one in-content link, which is fine; more than one is worth a
// look.
const clusterUrls = new Set(all.map((x) => x.url));
const chromeBaseline = (url) => Math.min(...linkCounts.map((p) => p.counts[url] ?? 0));

for (const { slug, counts } of linkCounts) {
  const dupes = Object.entries(counts)
    .filter(([url, n]) => clusterUrls.has(url) && n - chromeBaseline(url) > 1)
    .map(([url, n]) => `${url} x${n}`);
  if (dupes.length) clusterDupes.push(`${slug}: ${dupes.join(', ')}`);
}

console.log('page'.padEnd(28), 'kind '.padEnd(6), 'title', 'desc', 'links', 'ld', 'schema');
for (const r of rows)
  console.log(r.slug.padEnd(28), r.kind.padEnd(6), String(r.titleLen).padStart(5), String(r.descLen).padStart(4), String(r.links).padStart(5), String(r.ld).padStart(2), r.types);

console.log(`\n${rows.length} cluster pages checked`);
if (clusterDupes.length) {
  console.log(`\nrepeated cluster links (in-content link plus RelatedGuides — review, not necessarily wrong):`);
  for (const d of clusterDupes) console.log('  -', d);
}
if (problems.length === 0) {
  console.log('ALL CHECKS PASSED');
} else {
  console.log(`\n${problems.length} PROBLEM(S):`);
  for (const p of problems) console.log('  -', p);
  process.exitCode = 1;
}
