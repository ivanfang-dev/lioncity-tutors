import { Assignment, Tutor, Placement, Meta } from '../../../packages/shared/server-exports.js';

// Materialized tutor.stats (roadmap Phase 7): a daily recompute of each tutor's performance from the
// event sources (outreach.contacts + placements) into a cache that ranking and the ops console can
// read cheaply. Events stay the source of truth; nothing here is incremented live. There's no cron
// on Vercel Hobby, so the escalation tick calls runTutorStatsMaterialization() every tick and a
// once-per-day guard (a Meta doc) makes it a no-op except when a day has passed.

const DAY_MS = 24 * 60 * 60 * 1000;
const STATS_INTERVAL_MS = Number(process.env.TUTOR_STATS_INTERVAL_MS) || DAY_MS;
const META_KEY = 'tutorStats';
// Bulk-write chunk size — bounds memory/write load per run (the "batched" part of the spec).
const CHUNK = 500;

// Median of a numeric list, integer-rounded, null on empty. Pure — exported for unit testing.
export function median(nums) {
  const xs = (nums || []).filter(n => typeof n === 'number' && Number.isFinite(n)).sort((a, b) => a - b);
  if (xs.length === 0) return null;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : Math.round((xs[mid - 1] + xs[mid]) / 2);
}

// Per-tutor contact aggregates from every assignment's outreach log, in one pipeline.
async function contactStatsByTutor() {
  const rows = await Assignment.aggregate([
    { $match: { 'outreach.contacts.0': { $exists: true } } },
    { $unwind: '$outreach.contacts' },
    { $match: { 'outreach.contacts.tutorId': { $ne: null } } },
    { $group: {
      _id: '$outreach.contacts.tutorId',
      contacted: { $sum: 1 },
      // A reply is any status past 'Sent' — Interested OR Declined both mean they answered.
      responded: { $sum: { $cond: [{ $in: ['$outreach.contacts.status', ['Interested', 'Declined']] }, 1, 0] } },
      interested: { $sum: { $cond: [{ $eq: ['$outreach.contacts.status', 'Interested'] }, 1, 0] } },
      latencies: { $push: '$outreach.contacts.responseLatencyMins' },
      lastRepliedAt: { $max: '$outreach.contacts.respondedAt' },
    } },
  ]);
  return new Map(rows.map(r => [String(r._id), r]));
}

// Per-tutor placement aggregates.
async function placementStatsByTutor() {
  const rows = await Placement.aggregate([
    { $group: {
      _id: '$tutorId',
      placed: { $sum: 1 },
      survived30d: { $sum: { $cond: ['$survived30d', 1, 0] } },
    } },
  ]);
  return new Map(rows.map(r => [String(r._id), r]));
}

// Recompute stats for every tutor that appears in either source and bulk-write them. Returns the
// number of tutors updated. Exported so the verify script / tests can invoke it directly.
export async function materializeTutorStats(now = new Date()) {
  const [contacts, placements] = await Promise.all([contactStatsByTutor(), placementStatsByTutor()]);
  const tutorIds = new Set([...contacts.keys(), ...placements.keys()]);

  const ops = [];
  for (const id of tutorIds) {
    const c = contacts.get(id);
    const p = placements.get(id);
    const stats = {
      contacted: c?.contacted || 0,
      responded: c?.responded || 0,
      interested: c?.interested || 0,
      placed: p?.placed || 0,
      survived30d: p?.survived30d || 0,
      medianResponseMins: median(c?.latencies),
      lastRepliedAt: c?.lastRepliedAt || null,
      computedAt: now,
    };
    ops.push({ updateOne: { filter: { _id: id }, update: { $set: { stats } } } });
  }

  let updated = 0;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const res = await Tutor.bulkWrite(ops.slice(i, i + CHUNK), { ordered: false });
    updated += res.modifiedCount ?? 0;
  }
  return { tutorCount: tutorIds.size, updated };
}

// Tick entry point: run the materialization at most once per STATS_INTERVAL_MS. The Meta-doc guard is
// claimed atomically (a due-or-absent filter + upsert) so two overlapping ticks can't both run it —
// the loser hits the unique-key conflict on insert and simply returns. Best-effort: any failure is
// logged and swallowed so it never breaks the tick.
export async function runTutorStatsMaterialization(now = new Date()) {
  const cutoff = new Date(now.getTime() - STATS_INTERVAL_MS);
  try {
    const res = await Meta.updateOne(
      { key: META_KEY, $or: [{ lastRunAt: { $lte: cutoff } }, { lastRunAt: { $exists: false } }, { lastRunAt: null }] },
      { $set: { lastRunAt: now, updatedAt: now }, $setOnInsert: { key: META_KEY } },
      { upsert: true }
    );
    // Nothing claimed → not due yet.
    if ((res.modifiedCount ?? 0) === 0 && (res.upsertedCount ?? 0) === 0) return { ran: false };
  } catch (err) {
    // E11000 = another tick already holds a (recent) run doc → not due. Anything else: log + bail.
    if (err.code !== 11000) console.error('tutor-stats guard failed:', err.message);
    return { ran: false };
  }

  try {
    const result = await materializeTutorStats(now);
    console.log(`Materialized tutor.stats for ${result.updated}/${result.tutorCount} tutor(s).`);
    return { ran: true, ...result };
  } catch (err) {
    console.error('tutor-stats materialization failed:', err.message);
    return { ran: true, error: err.message };
  }
}
