import { dbConnect } from '@/lib/mongoose';
import { Tutor } from '@lioncity/shared/server-exports.js';
import { activeManualContacts, messagedAgo, withMessaged, withReply } from './manualContacts.mjs';

// Reads and writes Tutor.manualContacts straight to Mongo: it's console-only data that the bot never reads.

export async function loadManualContacts(tutorIds) {
  await dbConnect();
  const ids = tutorIds.filter(Boolean);
  if (ids.length === 0) return new Map();
  const tutors = await Tutor.find({ _id: { $in: ids }, 'manualContacts.0': { $exists: true } })
    .select('manualContacts')
    .lean();
  const now = new Date();
  return new Map(tutors.map(t => [
    String(t._id),
    activeManualContacts(t.manualContacts, now).map(e => ({
      id: String(e._id), label: e.label, reply: e.reply || null, ago: messagedAgo(e.at, now),
    })),
  ]));
}

// Applies `change` to the tutor's log; false if the tutor doesn't exist.
async function updateLog(tutorId, change) {
  await dbConnect();
  const tutor = await Tutor.findById(tutorId).select('manualContacts').lean();
  if (!tutor) return false;
  await Tutor.updateOne({ _id: tutorId }, { $set: { manualContacts: change(tutor.manualContacts) } });
  return true;
}

export function recordMessaged(tutorId, label) {
  return updateLog(tutorId, list => withMessaged(list, label));
}

export function recordReply(tutorId, entryId, reply) {
  return updateLog(tutorId, list => withReply(list, entryId, reply));
}
