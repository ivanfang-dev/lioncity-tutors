#!/usr/bin/env node

/**
 * Push recent test-paper leads into a Sender.net group.
 *
 * Usage:
 *   node --env-file=apps/telegram-bot/.env --env-file=apps/backend/.env \
 *        apps/backend/scripts/syncLeadsToSender.js [options]
 *
 * Options:
 *   --since=YYYY-MM-DD   Only leads created on/after this date. Default 2026-06-07.
 *   --group=<id>         Existing Sender.net group id to add them to.
 *   --create-group=<t>   Create a new group with this title and use it.
 *   --with-phone         Also send the phone number as +65XXXXXXXX.
 *   --limit=<n>          Only push the first n. Useful for a canary run.
 *   --apply              Actually write. Without it the script only prints.
 */

import mongoose from 'mongoose';

const API = 'https://api.sender.net/v2';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const SINCE = new Date(`${args.since || '2026-06-07'}T00:00:00Z`);
const APPLY = args.apply === true;
const WITH_PHONE = args['with-phone'] === true;
const LIMIT = args.limit ? Number(args.limit) : null;

const TOKEN = process.env.SENDER_API_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;

function bail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

if (!TOKEN) bail('SENDER_API_TOKEN is not set. Add it to apps/backend/.env.');
if (!MONGODB_URI) bail('MONGODB_URI is not set.');
if (Number.isNaN(SINCE.getTime())) bail(`Could not parse --since=${args.since}`);

async function sender(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = body?.message || JSON.stringify(body)?.slice(0, 200) || '';
    throw new Error(`${options.method || 'GET'} ${path} → HTTP ${res.status} ${detail}`);
  }
  return body;
}

// SG numbers are stored as 8 bare digits; Sender.net wants international format.
function normalisePhone(raw) {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 8) return `+65${digits}`;
  if (digits.length === 10 && digits.startsWith('65')) return `+${digits}`;
  return null;
}

// Addresses that would hard-bounce or aren't real leads. Hard bounces hurt the
// sending reputation the 322-tutor list depends on.
const BLOCKED_DOMAINS = new Set([
  'example.com', 'example.org', 'example.net', 'test.com',
  'dragonflyhk.com', 'hankaiacademy.com',
]);
const TYPO_TLDS = /\.(con|cim|comm|cm|co m|gmial\.com|gmai\.com)$/i;

function skipReason(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'malformed address';
  const [local, domain] = email.split('@');
  if (TYPO_TLDS.test(domain)) return `typo domain (${domain})`;
  if (BLOCKED_DOMAINS.has(domain)) return `blocked domain (${domain})`;
  if (local.length < 2) return 'local part too short';
  return null;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const leads = await mongoose.connection.db
    .collection('testpaperleads')
    .find({ createdAt: { $gte: SINCE } })
    .sort({ createdAt: 1 })
    .toArray();
  await mongoose.disconnect();

  // The write route upserts on email, but guard anyway.
  const seen = new Set();
  const recipients = [];
  const skipped = [];
  for (const lead of leads) {
    const email = (lead.email || '').trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    const reason = skipReason(email);
    if (reason) {
      skipped.push({ email, reason });
      continue;
    }
    recipients.push({
      email,
      phone: normalisePhone(lead.phone),
      createdAt: lead.createdAt,
      papers: (lead.downloads || []).length,
      lastPaper: lead.downloads?.[lead.downloads.length - 1]?.paperTitle || '—',
    });
  }

  console.log(`\nLeads created on/after ${SINCE.toISOString().slice(0, 10)}: ${recipients.length}\n`);
  for (const r of recipients) {
    const when = r.createdAt?.toISOString().slice(0, 10) ?? '?';
    console.log(`  ${when}  ${r.email.padEnd(38)} ${String(r.papers).padStart(2)} paper(s)  ${r.lastPaper}`);
  }

  if (skipped.length) {
    console.log(`\nSkipped ${skipped.length}:`);
    skipped.forEach((s) => console.log(`  ${s.email.padEnd(38)} ${s.reason}`));
  }

  const noPhone = recipients.filter((r) => !r.phone).length;
  if (WITH_PHONE && noPhone) {
    console.log(`\n⚠ ${noPhone} lead(s) have an unparseable phone; they will be sent without one.`);
  }

  if (!recipients.length) return;

  if (!APPLY) {
    console.log('\nDry run — nothing was written. Re-run with --apply to push these to Sender.net.\n');
    return;
  }

  let groupId = args.group;
  if (args['create-group']) {
    const created = await sender('/groups', {
      method: 'POST',
      body: JSON.stringify({ title: args['create-group'] }),
    });
    groupId = created?.data?.id;
    if (!groupId) bail('Group creation returned no id.');
    console.log(`\nCreated group "${args['create-group']}" (${groupId})`);
  }
  if (!groupId) bail('Need --group=<id> or --create-group="<title>" when using --apply.');

  // Re-runs are common (canary first, then the rest), so skip anyone already in.
  const existing = new Set();
  for (let page = 1; ; page += 1) {
    const res = await sender(`/groups/${groupId}/subscribers?limit=100&page=${page}`);
    const rows = res?.data || [];
    rows.forEach((r) => existing.add((r.email || '').toLowerCase()));
    if (rows.length < 100) break;
  }

  let queue = recipients.filter((r) => !existing.has(r.email));
  const alreadyIn = recipients.length - queue.length;
  if (alreadyIn) console.log(`\n${alreadyIn} already in group ${groupId}, skipping those.`);
  if (LIMIT) queue = queue.slice(0, LIMIT);

  if (!queue.length) {
    console.log('\nNothing left to add.\n');
    return;
  }

  console.log(`\nAdding ${queue.length} subscriber(s) to group ${groupId}...\n`);
  let added = 0;
  const failures = [];
  for (const r of queue) {
    const payload = { email: r.email, groups: [groupId] };
    if (WITH_PHONE && r.phone) {
      payload.phone = r.phone;
      payload.phone_country = 'SG';
    }
    try {
      await sender('/subscribers', { method: 'POST', body: JSON.stringify(payload) });
      added += 1;
      console.log(`  ✓ ${r.email}`);
    } catch (err) {
      failures.push({ email: r.email, error: err.message });
      console.log(`  ✖ ${r.email} — ${err.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log(`\nDone. ${added} added, ${failures.length} failed.`);
  if (failures.length) {
    console.log('Failed addresses:');
    failures.forEach((f) => console.log(`  ${f.email}  ${f.error}`));
  }
  console.log(`\nCompose and send the campaign to group ${groupId} from the Sender.net dashboard.\n`);
}

main().catch((err) => {
  console.error(`\n✖ ${err.message}\n`);
  process.exit(1);
});
