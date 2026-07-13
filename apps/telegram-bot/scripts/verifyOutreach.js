// Read-only inspector for an assignment's outreach state — use it to verify the
// "Parent passed — find more tutors" resume flow end-to-end.
//
// Prints the assignment/outreach status, the interested vs. viable counts (the latter
// excludes parent-rejected tutors, and is what gates new waves), and a per-contact table
// showing who was relayed to the parent and who's been rejected. Purely reads — never writes.
//
// Usage:  node --env-file=.env scripts/verifyOutreach.js <assignmentId>
//    or:  MONGODB_URI=... node scripts/verifyOutreach.js <assignmentId>

import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';

const assignmentId = process.argv[2];

if (!assignmentId) {
  console.error('Usage: node --env-file=.env scripts/verifyOutreach.js <assignmentId>');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}
if (!mongoose.isValidObjectId(assignmentId)) {
  console.error(`"${assignmentId}" is not a valid assignment id.`);
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const a = await Assignment.findById(assignmentId);
if (!a) {
  console.error(`No assignment found with id ${assignmentId}.`);
  await mongoose.disconnect();
  process.exit(1);
}

const o = a.outreach || {};
const fmt = (d) => (d ? new Date(d).toISOString().replace('T', ' ').slice(0, 19) : '—');
const target = Number(process.env.OUTREACH_INTERESTED_TARGET) || 3;
const viable = a.viableInterestedCount();

console.log('');
console.log(`📋 ${a.title || 'Assignment'}  (${a._id})`);
console.log(`   ${a.level} · ${a.subject}   parentContact: ${a.parentContact || '(none)'}`);
console.log(`   Assignment status: ${a.status}`);
console.log(`   Outreach: ${o.status || '(none)'} · wave ${o.waveCount || 0} · started ${fmt(o.startedAt)} · lastWave ${fmt(o.lastWaveAt)}`);
console.log(`   interestedCount (total Yes) = ${a.interestedCount()}`);
console.log(`   viableInterestedCount (gates waves) = ${viable}   target = ${target}   ${viable >= target ? '→ Fulfilled (stops)' : '→ below target (keeps sending)'}`);
if (a.status === 'Filled') {
  console.log(`   ✅ Filled: matchedTutorId ${a.matchedTutorId || '(none)'} at ${fmt(a.filledAt)}`);
}
console.log('');

const contacts = o.contacts || [];
if (contacts.length === 0) {
  console.log('   No outreach contacts recorded.');
} else {
  console.log(`   Contacts (${contacts.length}):`);
  for (const c of contacts) {
    const flags = [
      c.relayedToParentAt ? 'relayed ✓' : 'relayed ·',
      c.parentRejectedAt ? 'rejected ✓' : 'rejected ·'
    ].join('  ');
    const name = (c.tutorName || '(unknown)').padEnd(22);
    const status = String(c.status || '').padEnd(11);
    console.log(`   • ${name} ${status} wave ${c.wave ?? '?'}  ${flags}  responded ${fmt(c.respondedAt)}`);
  }
}
console.log('');

await mongoose.disconnect();
