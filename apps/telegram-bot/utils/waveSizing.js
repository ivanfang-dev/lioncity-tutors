import { Assignment } from '../../../packages/shared/server-exports.js';

// Adaptive wave sizing (roadmap Phase 10, step 2). Instead of a fixed 6-per-wave, size each wave to
// the replies still needed and how often a contacted tutor actually says yes — small waves when
// interest runs hot, bigger ones when it's cold, so we hit the interested target without over- or
// under-messaging (and burning WhatsApp spend).

const INTEREST_SAMPLE_SIZE = Number(process.env.OUTREACH_INTEREST_SAMPLE) || 500;
const INTEREST_RATE_FLOOR = 0.10; // never assume better than 1-in-10, so a cold start can't blow up
const WAVE_MIN = Number(process.env.OUTREACH_WAVE_MIN) || 4;
const WAVE_MAX = Number(process.env.OUTREACH_WAVE_MAX) || 12;

// Pure: how many tutors to message this wave to land `remainingNeeded` more interested replies,
// given the expected interested-per-contact rate. clamp(ceil(need / rate), min, max). The rate is
// floored so a zero/low observed rate can't demand an unbounded wave. Exported for unit testing.
export function computeWaveSize(remainingNeeded, expectedInterestRate, { min = WAVE_MIN, max = WAVE_MAX } = {}) {
  const rate = Math.max(expectedInterestRate || 0, INTEREST_RATE_FLOOR);
  const need = Math.max(remainingNeeded, 0);
  const raw = Math.ceil(need / rate);
  return Math.min(max, Math.max(min, raw));
}

// The trailing interested/contacted ratio over the most recent ~N outreach contacts across all
// assignments — the base rate the wave size divides by. One cheap aggregate; the tick computes it
// once and reuses it for every assignment that tick. Floored so a fresh install (few/no contacts)
// defaults to the smallest safe rate rather than dividing by ~0. `model` injectable for tests.
export async function trailingInterestRate({ model = Assignment, sampleSize = INTEREST_SAMPLE_SIZE } = {}) {
  const rows = await model.aggregate([
    { $match: { 'outreach.contacts.0': { $exists: true } } },
    { $unwind: '$outreach.contacts' },
    { $sort: { 'outreach.contacts.sentAt': -1 } }, // most recent contacts first
    { $limit: sampleSize },
    { $group: {
      _id: null,
      contacted: { $sum: 1 },
      interested: { $sum: { $cond: [{ $eq: ['$outreach.contacts.status', 'Interested'] }, 1, 0] } },
    } },
  ]);
  const r = rows[0];
  if (!r || !r.contacted) return INTEREST_RATE_FLOOR;
  return Math.max(r.interested / r.contacted, INTEREST_RATE_FLOOR);
}

export { INTEREST_RATE_FLOOR, WAVE_MIN, WAVE_MAX };
