import { normalizePhone } from './phoneUtils.js';
import { extractNumbers } from './numericRates.js';

// A tutor who applies from the public channel post or the website writes to assignment.applicants,
// which outreach never reads. These helpers mirror the application into outreach.contacts so a
// self-applicant is counted, scored and shortlisted like any tutor who said yes to a wave.

const MIN_PLAUSIBLE_RATE = 5;
const MAX_PLAUSIBLE_RATE = 1000;

// A typed rate ("$65/hr", "65", 65) as a number, or null when it holds no plausible figure.
function toQuotedRate(rate) {
  if (rate == null) return null;
  const [num] = extractNumbers(rate);
  if (num == null || num < MIN_PLAUSIBLE_RATE || num > MAX_PLAUSIBLE_RATE) return null;
  return num;
}

// The outreach contact row for a tutor who applied themselves. Status is Interested on creation:
// seeking the assignment out is the yes, and the application already carries their rate.
export function applicationContact(tutor, { rate = null, now = new Date() } = {}) {
  const quotedRate = toQuotedRate(rate);
  return {
    tutorId: tutor._id,
    phone: normalizePhone(tutor.contactNumber || ''),
    tutorName: tutor.fullName || '',
    wave: 0,
    channel: 'application',
    sentAt: now,
    status: 'Interested',
    respondedAt: now,
    ...(quotedRate != null && { quotedRate }),
  };
}

// Record an application as outreach interest on `assignmentId`. Flips the tutor's existing contact
// row when a wave already reached them, otherwise pushes a new one. Never .save() — a legacy
// subject/level would fail re-validation and a stale contact array could clobber a live reply.
export async function recordApplicationInterest(model, assignmentId, tutor, { rate = null, now = new Date() } = {}) {
  const tutorId = tutor._id;
  const quotedRate = toQuotedRate(rate);

  const set = {
    'outreach.contacts.$[c].status': 'Interested',
    'outreach.contacts.$[c].respondedAt': now,
    'outreach.contacts.$[c].channel': 'application',
  };
  if (quotedRate != null) set['outreach.contacts.$[c].quotedRate'] = quotedRate;

  // A contact the parent already passed on is excluded, so reapplying can't put them back in play.
  const flip = await model.updateOne(
    {
      _id: assignmentId,
      'outreach.contacts': { $elemMatch: { tutorId, parentRejectedAt: { $exists: false } } },
    },
    { $set: set },
    { arrayFilters: [{ 'c.tutorId': tutorId }] }
  );
  if (flip.matchedCount > 0) return { flipped: true, added: false };

  const push = await model.updateOne(
    { _id: assignmentId, 'outreach.contacts.tutorId': { $ne: tutorId } },
    { $push: { 'outreach.contacts': applicationContact(tutor, { rate, now }) } }
  );
  return { flipped: false, added: push.modifiedCount > 0 };
}
