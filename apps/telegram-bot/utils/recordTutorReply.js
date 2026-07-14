import mongoose from 'mongoose';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from './phone.js';
import { notifyOwner } from './ownerAlert.js';

// Shared core for recording a tutor's Yes/No reply, used by both the legacy
// /api/whatsapp-reply endpoint (VM-forwarded) and the new /api/whatsapp-webhook
// (Meta Cloud API). Keeping the matching + owner-alert logic in one place means the
// two entry points can never drift apart.

// Stop sending new waves once this many tutors have replied "Yes".
const INTERESTED_TARGET = Number(process.env.OUTREACH_INTERESTED_TARGET) || 3;

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
  isConnected = true;
}

// Ping the owner when a tutor says yes — the signal they act on to reach the parent fast.
async function alertOwnerInterested(assignment, tutorName, interestedCount) {
  // Offer a one-tap relay only when we can act on it: the assignment has a parent number
  // to send to. The button forwards the whole interested-but-unsent shortlist, so its
  // label tracks how many tutors are currently waiting to be sent (1, 2, 3...).
  let replyMarkup;
  if (assignment.parentContact) {
    const pendingCount = assignment.pendingParentTutorIds().length;
    if (pendingCount > 0) {
      replyMarkup = {
        inline_keyboard: [[{
          text: pendingCount === 1
            ? '📤 Send profile to parent'
            : `📤 Send all ${pendingCount} profiles to parent`,
          callback_data: `sendallprof_${assignment._id}`
        }]]
      };
    }
  }

  await notifyOwner(
    `✅ *Tutor interested*\n` +
    `*${tutorName || 'A tutor'}* said YES to *${assignment.title}*\n` +
    `(${interestedCount}/${INTERESTED_TARGET} interested)` +
    (assignment.parentContact ? '' : `\n\n⚠️ No parent contact on this assignment — relay unavailable.`) +
    (assignment.outreach?.status === 'Fulfilled' ? `\n\n🎯 Target reached — no more tutors will be messaged.` : ''),
    replyMarkup
  );
}

// Record a tutor's reply ('yes' | 'no') against the most recent active outreach that
// messaged this number. Returns a result object; { matched: false } when the reply can't
// be tied to an open outreach (so callers can skip acknowledging strangers). Never throws
// for a bad reply value — returns { matched: false, error } instead.
export async function recordTutorReply(phone, reply) {
  const decision = reply === 'yes' ? 'Interested' : reply === 'no' ? 'Declined' : null;
  if (!phone || !decision) {
    return { matched: false, error: 'phone and reply (yes|no) required' };
  }

  await connectToDatabase();
  const norm = normalizePhone(phone);

  // Find the most recent still-active outreach that messaged this number AND flip its
  // waiting contact(s) to the decision, in one atomic operation. Deliberately not
  // find + mutate + .save(): a full-document save re-validates legacy assignments whose
  // subject/level predate the current enums (ValidationError → reply lost), and a
  // concurrent reply from another tutor could be clobbered by the stale write-back.
  // (A tutor in several open assignments → the sort attributes it to the latest wave.)
  const assignment = await Assignment.findOneAndUpdate(
    {
      'outreach.status': 'Active',
      'outreach.contacts': { $elemMatch: { phone: norm, status: 'Sent' } }
    },
    {
      $set: {
        'outreach.contacts.$[c].status': decision,
        'outreach.contacts.$[c].respondedAt': new Date()
      }
    },
    {
      new: true,
      sort: { 'outreach.lastWaveAt': -1 },
      arrayFilters: [{ 'c.phone': norm, 'c.status': 'Sent' }]
    }
  );

  if (!assignment) {
    return { matched: false };
  }

  // `new: true` returns the post-update doc, so the flipped contact already carries
  // the decision; any row with this phone belongs to the same tutor.
  const contact = assignment.outreach.contacts.find(c => c.phone === norm);
  return finalizeReply(assignment, contact, decision, reply);
}

// Shared tail for both reply recorders (WhatsApp phone-matched and Telegram tutorId-matched):
// apply the interested-target fulfilment gate, credit the tutor for responding, and alert the
// owner on a Yes. Keeping it here means the two channels can never drift apart. `assignment`
// is already the post-update doc; `contact` is the row we just flipped.
async function finalizeReply(assignment, contact, decision, reply) {
  const tutorName = contact?.tutorName || '';
  const tutorId = contact?.tutorId || null;

  // Gate on viable (non-parent-rejected) interested tutors, so a resumed "find more" outreach
  // keeps sending until fresh tutors say Yes rather than instantly re-fulfilling on the old shortlist.
  const interestedCount = assignment.viableInterestedCount();
  if (decision === 'Interested' && interestedCount >= INTERESTED_TARGET) {
    // Targeted update — never re-save a legacy document (subject/level enums may fail validation).
    await Assignment.updateOne(
      { _id: assignment._id },
      { $set: { 'outreach.status': 'Fulfilled' } }
    );
    // Mirror it in memory so the owner alert and the `stopped` return value see it.
    assignment.outreach.status = 'Fulfilled';
  }

  // Credit the tutor for responding (Yes OR No both count — they're reachable).
  if (tutorId) {
    await Tutor.updateOne({ _id: tutorId }, { $inc: { 'responseStats.responded': 1 } });
  }

  if (decision === 'Interested') {
    await alertOwnerInterested(assignment, tutorName, interestedCount);
  }

  return {
    matched: true,
    assignmentId: assignment._id.toString(),
    reply,
    interestedCount,
    stopped: assignment.outreach.status === 'Fulfilled'
  };
}

// Telegram counterpart of recordTutorReply. When a tutor taps ✅ Interested / ❌ on an outreach
// DM, the callback carries the exact assignmentId and we know the tutorId from their linked
// telegramId — so match precisely by (assignmentId, tutorId) instead of by phone. Same atomic,
// no-`.save()` flip + shared finalize tail as the phone path.
export async function recordTutorReplyByTutorId(tutorId, reply, assignmentId) {
  const decision = reply === 'yes' ? 'Interested' : reply === 'no' ? 'Declined' : null;
  if (!tutorId || !assignmentId || !decision) {
    return { matched: false, error: 'tutorId, assignmentId and reply (yes|no) required' };
  }

  await connectToDatabase();
  const tid = new mongoose.Types.ObjectId(tutorId);

  const assignment = await Assignment.findOneAndUpdate(
    {
      _id: assignmentId,
      'outreach.status': 'Active',
      'outreach.contacts': { $elemMatch: { tutorId: tid, status: 'Sent' } }
    },
    {
      $set: {
        'outreach.contacts.$[c].status': decision,
        'outreach.contacts.$[c].respondedAt': new Date()
      }
    },
    {
      new: true,
      arrayFilters: [{ 'c.tutorId': tid, 'c.status': 'Sent' }]
    }
  );

  if (!assignment) {
    return { matched: false };
  }

  const contact = assignment.outreach.contacts.find(c => c.tutorId?.toString() === tid.toString());
  return finalizeReply(assignment, contact, decision, reply);
}
