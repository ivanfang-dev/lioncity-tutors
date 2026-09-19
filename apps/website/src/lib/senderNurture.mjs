// Adds parent download leads to a Sender.net group per level, so a Sender
// automation on "joined group" can run the exam-sprint nurture.

import { waitUntil } from '@vercel/functions';

const API = 'https://api.sender.net/v2';

// Shelf titles vary ("Primary School", "PSLE", "Junior College (A-Level)"), so
// match on keywords rather than exact labels.
export function levelBucket(level) {
  const l = String(level || '').toLowerCase();
  if (/primary|psle/.test(l)) return 'Primary';
  if (/junior college|\bjc\b|a-level|\bh[12]\b/.test(l)) return 'JC';
  if (/secondary|o-level|n-level|igcse/.test(l)) return 'Secondary';
  return null;
}

export const groupTitle = (bucket) => `Parents · ${bucket}`;

// Addresses that would hard-bounce; bounces hurt the sending reputation.
const BLOCKED_DOMAINS = new Set([
  'example.com', 'example.org', 'example.net', 'test.com',
  'dragonflyhk.com', 'hankaiacademy.com',
]);
const TYPO_TLDS = /\.(con|cim|comm|cm|co m|gmial\.com|gmai\.com)$/i;

export function skipReason(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'malformed address';
  const [local, domain] = email.split('@');
  if (TYPO_TLDS.test(domain)) return `typo domain (${domain})`;
  if (BLOCKED_DOMAINS.has(domain)) return `blocked domain (${domain})`;
  if (local.length < 2) return 'local part too short';
  return null;
}

export function createSender({ token = process.env.SENDER_API_TOKEN, fetchImpl = fetch } = {}) {
  const groupIds = new Map();

  async function call(path, { method = 'GET', body, allow404 = false } = {}) {
    const res = await fetchImpl(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => null);
    if (res.status === 404 && allow404) return null;
    if (!res.ok) {
      const detail = json?.message || JSON.stringify(json)?.slice(0, 200) || '';
      throw new Error(`${method} ${path} → HTTP ${res.status} ${detail}`);
    }
    return json;
  }

  // Finds the group by title, creating it on first use. Cached per instance.
  async function groupId(title) {
    if (groupIds.has(title)) return groupIds.get(title);
    for (let page = 1; ; page += 1) {
      const res = await call(`/groups?page=${page}`);
      for (const g of res?.data || []) groupIds.set(g.title, g.id);
      if (groupIds.has(title) || !res?.links?.next) break;
    }
    if (!groupIds.has(title)) {
      const created = await call('/groups', { method: 'POST', body: { title } });
      if (!created?.data?.id) throw new Error(`Creating group "${title}" returned no id`);
      groupIds.set(title, created.data.id);
    }
    return groupIds.get(title);
  }

  // Returns the bucket the parent was added to, or null when skipped.
  async function addParent({ email, level, subject }) {
    const address = String(email || '').trim().toLowerCase();
    const bucket = levelBucket(level);
    if (!token || !bucket || skipReason(address)) return null;

    const id = await groupId(groupTitle(bucket));
    const fields = { '{{level}}': bucket };
    if (subject) fields['{{top_subject}}'] = subject;

    // Add-to-group 400s for unknown emails, so look the subscriber up first.
    const path = `/subscribers/${encodeURIComponent(address)}`;
    const existing = await call(path, { allow404: true });
    if (!existing) {
      await call('/subscribers', { method: 'POST', body: { email: address, groups: [id], fields } });
    } else {
      await call(`/subscribers/groups/${id}`, { method: 'POST', body: { subscribers: [address] } });
      // Refresh fields without re-triggering automations.
      await call(path, { method: 'PATCH', body: { fields, trigger_automation: false } });
    }
    return bucket;
  }

  return { addParent, groupId };
}

const defaultSender = createSender();

// Called by the download routes after saving a lead. Runs after the response
// so a slow or failing Sender call never delays the download.
export function queueParentNurture(Model, lead, { level, subject }, { sender = defaultSender, defer = waitUntil } = {}) {
  const bucket = levelBucket(level);
  if (lead.role !== 'parent' || !bucket || lead.nurtureGroups?.includes(bucket)) return;
  defer(
    sender
      .addParent({ email: lead.email, level, subject })
      .then((added) => added && Model.updateOne({ _id: lead._id }, { $addToSet: { nurtureGroups: added } }))
      .catch((err) => console.error('Sender nurture sync failed:', err.message))
  );
}
