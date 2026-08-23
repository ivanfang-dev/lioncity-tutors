// Seeds a throwaway assignment so the multi-tutor "Send all N" shortlist can be tested
// end-to-end with a SINGLE phone number.
//
// The trick: both outreach contacts are stored under YOUR number, so one "Yes" reply
// flips them BOTH to Interested (whatsapp-reply marks every contact matching the phone) —
// giving interestedCount = N without needing N real phones. Each contact points at a
// different real tutor, so the shortlist still shows N distinct profiles. parentContact
// is also your number, so the relayed shortlist comes back to you.
//
// The real tutors are NEVER messaged — we seed contacts directly; no outreach wave runs.
//
// Usage:  MONGODB_URI=... node scripts/seedShortlistTest.js <yourPhone> [tutorCount]
// Example: node scripts/seedShortlistTest.js 91234567 2

import mongoose from 'mongoose';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { EDUCATION_LEVELS, getSubjectsForLevel } from '../../../packages/shared/index.js';
import { normalizePhone } from '../../../packages/shared/utils/phoneUtils.js';

const phoneArg = process.argv[2];
const tutorCount = Number(process.argv[3]) || 2;

if (!phoneArg) {
  console.error('Usage: node scripts/seedShortlistTest.js <yourPhone> [tutorCount]');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with: MONGODB_URI=... node scripts/seedShortlistTest.js <yourPhone>');
  process.exit(1);
}

const matchPhone = normalizePhone(phoneArg); // 8-digit form used for reply matching

await mongoose.connect(process.env.MONGODB_URI);

// Need N real tutors so the shortlist renders real profiles.
const tutors = await Tutor.find({ fullName: { $exists: true, $ne: '' } }).limit(tutorCount).lean();
if (tutors.length < tutorCount) {
  console.error(`Only found ${tutors.length} tutor(s); need ${tutorCount}. Add tutors or lower the count.`);
  await mongoose.disconnect();
  process.exit(1);
}

// Derive a guaranteed-valid level/subject from the canonical lists (not from existing DB
// rows — legacy assignments can hold subjects that predate the current enum, e.g.
// "O Level english", which would fail validation).
const level = EDUCATION_LEVELS.find(l => getSubjectsForLevel(l)?.length > 0);
const subject = getSubjectsForLevel(level)[0];
if (!level || !subject) {
  console.error('Could not derive a valid level/subject from shared constants.');
  await mongoose.disconnect();
  process.exit(1);
}

const now = new Date();
const assignment = await Assignment.create({
  title: '[TEST] Shortlist send — safe to delete',
  level,
  subject,
  location: 'Online',
  frequency: '1x/week',
  rate: '$50/hr',
  parentContact: phoneArg,        // raw form, as the owner would have typed it
  status: 'Open',
  outreach: {
    status: 'Active',
    waveCount: 1,
    startedAt: now,
    lastWaveAt: now,
    contacts: tutors.map((t) => ({
      tutorId: t._id,
      phone: matchPhone,          // all under YOUR number → one "Yes" flips them all
      tutorName: t.fullName,
      wave: 1,
      sentAt: now,
      status: 'Sent'
    }))
  }
});

console.log(`✅ Seeded test assignment ${assignment._id}`);
console.log(`   parentContact: ${phoneArg}`);
console.log(`   ${tutors.length} tutors seeded as 'Sent' contacts: ${tutors.map(t => t.fullName).join(', ')}`);
console.log('');
console.log(`Next: from WhatsApp (${phoneArg}) reply "Yes" to the bot. You should get a Telegram`);
console.log(`alert with "📤 Send all ${tutors.length} profiles to parent" — tap it to receive the shortlist.`);
console.log('Tap again afterwards to confirm dedup ("No new interested tutors to send").');
console.log('');
console.log(`Clean up: node -e "import('mongoose').then(async m=>{await m.connect(process.env.MONGODB_URI);await m.connection.collection('assignments').deleteOne({_id:new m.Types.ObjectId('${assignment._id}')});await m.disconnect();console.log('deleted')})"`);

await mongoose.disconnect();
