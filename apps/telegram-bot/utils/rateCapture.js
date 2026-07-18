import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';
import RateValidator from './RateValidator.js';
import { normalizePhone } from './phone.js';

// Rate capture: every tutor who says yes is asked what they'd charge FOR THIS ASSIGNMENT, and
// the answer is stored on the outreach contact as quotedRate. Profile rates go stale (tutors
// reply "too low" against a rate they typed themselves) and posted rates are often ranges
// ("$40-60/hr") that a bare Yes doesn't resolve — so the rate named at reply time is the only
// true one. Also runs on a rate-decline, where the number says how far off the budget was.
//
// The pending state lives in Mongo (contact.rateRequestedAt), never in the in-memory
// userSessions map: a Vercel cold start between the prompt and the tutor's "45" would drop it,
// and WhatsApp has no session concept at all. That single choice is what lets one mechanism
// serve both channels. See docs/superpowers/specs/2026-07-16-tutor-rate-capture-design.md.

// An hourly tuition rate this far outside reality is a tutor pasting something else — a phone
// number, a year, a monthly figure. RateValidator's own 10/200 thresholds are only warnings and
// are too tight to hard-reject on (a top JC tutor really can charge $250), so bound generously
// and let anything odder fall through to the owner as a normal free-text question.
const MIN_PLAUSIBLE_RATE = 5;
const MAX_PLAUSIBLE_RATE = 1000;

// Pull an hourly rate out of a tutor's reply, or null if this isn't one. Delegates the format
// to RateValidator (already handles 45 / $45 / 45/hr / $45/HR and is anchored, so prose and
// ranges are rejected) and adds only the plausibility bound. Strictness is deliberate: a reply
// that isn't clearly a rate must fall through to the yes/no parser and then to the owner, which
// is a visible non-failure — whereas a loose parser silently storing "91234567" as a rate is not.
export function parseRateReply(text) {
  const { valid, rate } = RateValidator.validate(typeof text === 'string' ? text.trim() : text);
  if (!valid) return null;
  const num = Number(rate);
  if (num < MIN_PLAUSIBLE_RATE || num > MAX_PLAUSIBLE_RATE) return null;
  return num;
}

// The ask, sent right after a tutor's yes (and after a rate-decline). Quoting the posted rate
// matters most on a range — "$40-60/hr" is exactly the case where a bare Yes tells us nothing
// about which end they want. Asks for a plain number because parseRateReply is anchored: prose
// like "I charge 45" is rejected by design, so the prompt must not invite it.
export function buildRatePrompt(assignment) {
  const posted = assignment?.rate ? ` (posted: ${assignment.rate})` : '';
  return `What's your rate for this assignment?${posted}\n\nReply with just the number — e.g. 45`;
}

// Which contact does an inbound bare number answer? The row we most recently asked and that
// hasn't answered yet, for this tutor. Matching on rateRequestedAt (not session state) is what
// survives cold starts; skipping rows that already carry a quotedRate means a tutor who sends a
// second number can't silently overwrite their first answer — that message falls through to the
// owner instead. Pure so the selection rule is testable without a database.
export function selectPendingRateContact(contacts, { phone, tutorId } = {}) {
  if (!Array.isArray(contacts) || (!phone && !tutorId)) return null;

  // Normalize both sides: contacts hold the 8-digit local form, but the caller's number can be
  // a Meta wa_id ("6591234567") or any profile shape. Comparing raw strings finds nothing and
  // reports no error — the worst kind of failure for a rate we asked a tutor to type.
  const wanted = phone ? normalizePhone(phone) : null;

  const pending = contacts.filter(c => {
    if (!c?.rateRequestedAt || c.quotedRate != null) return false;
    if (wanted) return normalizePhone(c.phone) === wanted;
    return c.tutorId?.toString() === tutorId.toString();
  });
  if (!pending.length) return null;

  return pending.reduce((latest, c) =>
    new Date(c.rateRequestedAt) > new Date(latest.rateRequestedAt) ? c : latest
  );
}

// Same local connection guard the other entry points use (recordTutorReply, escalation-tick,
// tutorLookup…). Not refactored into a shared helper here — that's seven call sites and not
// this phase's job.
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

// Land an inbound rate against whichever contact we most recently asked. Called by BOTH
// channels before any yes/no parsing (see the documented parse order) — a tutor answering "40"
// to a prompt on a $40-60 assignment must never be read as anything else.
//
// Deliberately NOT filtered by outreach.status: a rate that arrives after the shortlist
// released is still worth having, and dropping it would be a silent loss. Returns
// { matched: false } for anything unparseable or unasked-for, so the caller falls through to
// its normal handling (yes/no, then forward-to-owner) rather than swallowing the message.
export async function recordQuotedRate({ phone, tutorId, text }) {
  const rate = parseRateReply(text);
  if (rate === null) return { matched: false };
  if (!phone && !tutorId) return { matched: false };

  await connectToDatabase();

  // Contacts are stored with normalizePhone applied, so the query must match that form.
  const normPhone = phone ? normalizePhone(phone) : null;
  const match = { rateRequestedAt: { $exists: true }, quotedRate: { $exists: false } };
  if (normPhone) match.phone = normPhone;
  else match.tutorId = new mongoose.Types.ObjectId(tutorId);

  // A tutor can hold pending asks on several assignments at once (two yeses, two prompts), so
  // pick across ALL of them by most-recent ask rather than trusting a single sorted findOne —
  // the latest prompt is the one they're answering. Any older ask stays pending and simply
  // never gets an answer, which is the same as a tutor ignoring the prompt.
  const assignments = await Assignment.find({ 'outreach.contacts': { $elemMatch: match } });

  let best = null;
  for (const a of assignments) {
    const contact = selectPendingRateContact(a.outreach?.contacts, { phone: normPhone, tutorId });
    if (!contact) continue;
    if (!best || new Date(contact.rateRequestedAt) > new Date(best.contact.rateRequestedAt)) {
      best = { assignment: a, contact };
    }
  }
  if (!best) return { matched: false };

  // Targeted $set by the contact's own _id — never a full-document save (legacy assignments
  // carry subject/level values outside the current enums and would throw ValidationError).
  await Assignment.updateOne(
    { _id: best.assignment._id },
    {
      $set: { 'outreach.contacts.$[c].quotedRate': rate },
      $unset: { 'outreach.contacts.$[c].rateRequestedAt': '' }
    },
    { arrayFilters: [{ 'c._id': best.contact._id }] }
  );

  return {
    matched: true,
    rate,
    assignmentId: best.assignment._id.toString(),
    assignmentTitle: best.assignment.title || '',
    tutorName: best.contact.tutorName || '',
    declined: best.contact.status === 'Declined'
  };
}
