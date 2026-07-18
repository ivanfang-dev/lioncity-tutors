// Seeds one throwaway assignment per "Needs you" row type so the ops console (Phase 3) can be
// walked end-to-end: every queue row, its diagnosis, its wa.me button and its outcome buttons.
// Seeded assignments are titled with a marker so --cleanup removes exactly them.
//
// SAFETY — this writes to whatever MONGODB_URI points at, which is normally production:
//
//   * No tutor is messaged BY THIS SCRIPT: contacts are written directly, no wave is sent.
//   * But the live escalation tick claims { status: 'Open', outreach.status: 'Active' } and would
//     fire a real wave at real tutors for a fake assignment. So the three running-outreach
//     scenarios are seeded as 'In Progress', which the tick's claim query skips. The console
//     shows them identically (its queue rules read outreach.status, and only treat
//     Filled/Closed specially), so nothing under test is weakened.
//   * Pass --allow-outreach to seed those as a true 'Open' instead. Only do that with
//     TEST_RECIPIENT_PHONE set on the bot, or real tutors will be messaged.
//   * The Fulfilled/Exhausted scenarios are seeded 'Open' as-is — the tick never claims those for
//     a wave. The 30h-silent one may earn you one owner-only Telegram nudge; that's the flow.
//
// Usage:
//   node --env-file=apps/telegram-bot/.env apps/telegram-bot/scripts/seedOpsQueue.js <yourPhone>
//   node --env-file=apps/telegram-bot/.env apps/telegram-bot/scripts/seedOpsQueue.js --cleanup
//
// <yourPhone> becomes parentContact, so every wa.me button opens a chat with you.

import mongoose from 'mongoose';
import { Assignment, Tutor, Placement } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from '../utils/phone.js';

const MARKER = '[OPS-TEST]';
const args = process.argv.slice(2);
const allowOutreach = args.includes('--allow-outreach');
const arg = args.find(a => !a.startsWith('--')) || args[0];

// Assignment status for the scenarios whose outreach is still running. 'In Progress' keeps them
// out of the live tick's wave-claim query (which requires 'Open') so seeding can't message real
// tutors — see the SAFETY note above.
const RUNNING_STATUS = allowOutreach ? 'Open' : 'In Progress';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with: node --env-file=apps/telegram-bot/.env <script>');
  process.exit(1);
}
if (!arg) {
  console.error('Usage: seedOpsQueue.js <yourPhone> | --cleanup');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

if (arg === '--cleanup') {
  const seeded = await Assignment.find({ title: new RegExp(`^\\${MARKER}`) }).select('_id').lean();
  const ids = seeded.map(a => a._id);
  // Placements first: recording a test "Parent picked" creates one, and deleting only the
  // assignments would strand it — Placement is the ground-truth table Phase 5 and every future
  // ranking measurement read, so a fake row there quietly poisons real analysis.
  const placements = await Placement.deleteMany({ assignmentId: { $in: ids } });
  const { deletedCount } = await Assignment.deleteMany({ _id: { $in: ids } });
  console.log(`Removed ${deletedCount} seeded assignment(s) and ${placements.deletedCount} placement(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

const parentContact = normalizePhone(arg);
const now = Date.now();
const H = 3600e3;
const D = 24 * H;
const ago = (ms) => new Date(now - ms);

// Real tutors so the shortlist and candidate breakdown render real profiles. Wave 1 aims for
// WAVE_ONE_TARGET (8), so the "full wave" fixtures need 8 contacts — a 6-contact wave 1 is a thin
// pool by the console's rules, which would make the "healthy" scenario raise a row and quietly
// invalidate the fixture. Cycle through whatever real tutors exist to reach 8.
const WAVE_ONE_TARGET = 8;
const tutors = await Tutor.find({ fullName: { $exists: true, $ne: '' }, contactNumber: { $nin: [null, ''] } })
  .limit(WAVE_ONE_TARGET).lean();
if (tutors.length < 3) {
  console.error(`Need at least 3 tutors with names/numbers; found ${tutors.length}.`);
  await mongoose.disconnect();
  process.exit(1);
}
// A full wave-1 roster of exactly WAVE_ONE_TARGET contacts, reusing tutors if the pool is small.
const fullWave = (over = (i) => ({})) =>
  Array.from({ length: WAVE_ONE_TARGET }, (_, i) => contact(tutors[i % tutors.length], { wave: 1, ...over(i) }));

const contact = (tutor, over = {}) => ({
  tutorId: tutor._id, phone: tutor.contactNumber, tutorName: tutor.fullName,
  wave: 1, channel: 'telegram', sentAt: ago(5 * H), status: 'Sent', ...over,
});

// A valid level/subject pair — the Assignment pre-save hook validates the combination.
const base = {
  level: 'Secondary 3', subject: 'Mathematics', location: 'Bishan',
  frequency: '2x per week', rate: '$50/hr', parentContact, status: 'Open',
};

const scenarios = [
  {
    title: `${MARKER} Shortlist ready`,
    createdAt: ago(3 * H),
    outreach: {
      status: 'Fulfilled', waveCount: 2, startedAt: ago(5 * H), shortlistReleasedAt: ago(1 * H),
      // Five said yes; only the best 3 carry a shortlistRank, mirroring a real release (the other
      // two stay recorded as backups for a rejection). Verifies the console shows 3, not all 5.
      contacts: tutors.slice(0, 5).map((t, i) => contact(t, {
        status: 'Interested', respondedAt: ago(4 * H - i * 600e3),
        ...(i < 3 && { shortlistRank: i + 1 }),
      })),
    },
  },
  {
    title: `${MARKER} Parent silent 30h`,
    createdAt: ago(2 * D),
    outreach: {
      status: 'Fulfilled', waveCount: 2, startedAt: ago(2 * D), shortlistReleasedAt: ago(30 * H),
      parentNudgedAt: ago(6 * H),
      contacts: tutors.slice(0, 2).map((t, i) => contact(t, {
        status: 'Interested', respondedAt: ago(2 * D), shortlistRank: i + 1,
      })),
    },
  },
  {
    title: `${MARKER} Parent flagged 50h`,
    createdAt: ago(3 * D),
    outreach: {
      status: 'Fulfilled', waveCount: 2, startedAt: ago(3 * D), shortlistReleasedAt: ago(50 * H),
      parentNudgedAt: ago(26 * H), parentSilenceEscalatedAt: ago(2 * H),
      contacts: [contact(tutors[0], { status: 'Interested', respondedAt: ago(3 * D), shortlistRank: 1 })],
    },
  },
  {
    title: `${MARKER} Outreach exhausted`,
    createdAt: ago(8 * H),
    outreach: {
      status: 'Exhausted', waveCount: 3, startedAt: ago(8 * H),
      contacts: tutors.map((t, i) => contact(t, {
        status: i === 0 ? 'Declined' : 'Sent', respondedAt: i === 0 ? ago(7 * H) : undefined,
      })),
    },
  },
  {
    title: `${MARKER} Pool too small`,
    status: RUNNING_STATUS,
    createdAt: ago(1 * H),
    outreach: {
      status: 'Active', waveCount: 1, startedAt: ago(1 * H), lastWaveAt: ago(1 * H),
      contacts: tutors.slice(0, 2).map(t => contact(t)), // first wave reached only 2 of 6
    },
  },
  {
    title: `${MARKER} Zero replies after 2 waves`,
    status: RUNNING_STATUS,
    createdAt: ago(2 * H),
    outreach: {
      status: 'Active', waveCount: 2, startedAt: ago(2 * H), lastWaveAt: ago(30 * 60e3),
      // Wave 1 must be full, or the thin-pool rule (which runs first) claims this row instead.
      contacts: [...fullWave(), ...Array.from({ length: 4 }, (_, i) => contact(tutors[i % tutors.length], { wave: 2 }))],
    },
  },
  {
    title: `${MARKER} Open 6 days`,
    status: RUNNING_STATUS,
    createdAt: ago(6 * D),
    outreach: {
      status: 'Active', waveCount: 2, startedAt: ago(6 * D), lastWaveAt: ago(5 * D),
      contacts: fullWave((i) => ({ status: i === 0 ? 'Interested' : 'Declined', respondedAt: ago(5 * D) })),
    },
  },
  {
    title: `${MARKER} Healthy (should NOT appear in the queue)`,
    status: RUNNING_STATUS,
    createdAt: ago(1 * H),
    outreach: {
      status: 'Active', waveCount: 1, startedAt: ago(1 * H), lastWaveAt: ago(20 * 60e3),
      contacts: fullWave((i) => ({
        status: i < 2 ? 'Interested' : 'Sent', respondedAt: i < 2 ? ago(30 * 60e3) : undefined,
      })),
    },
  },
];

for (const scenario of scenarios) {
  const doc = await Assignment.create({ ...base, ...scenario });
  console.log(`seeded ${doc._id}  ${scenario.title}`);
}

console.log(`\n${scenarios.length} assignments seeded. Open /ops to walk them.`);
console.log('Clean up with: node --env-file=apps/telegram-bot/.env apps/telegram-bot/scripts/seedOpsQueue.js --cleanup');

await mongoose.disconnect();
