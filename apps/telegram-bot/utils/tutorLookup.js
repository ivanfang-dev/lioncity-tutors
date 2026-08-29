import mongoose from 'mongoose';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { generatePhoneVariations, normalizePhone } from '../../../packages/shared/utils/phoneUtils.js';

// Own connection guard: the free-text forward path in whatsapp-webhook.js doesn't run
// recordTutorReply, so no connection exists there. Mongoose's default connection is a global
// singleton, so this second guarded connect is harmless and reuses the same socket when warm.
let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
}

// Best-effort: resolve a tutor's display name from their WhatsApp number (wa_id, e.g.
// "6598477178"). Returns fullName, or null when the number isn't a known tutor OR the
// lookup fails. Callers MUST treat this as optional enrichment and never let it block
// the notification — a DB hiccup degrades to the bare number, it does not drop the alert.
// Matches against every stored contactNumber shape via generatePhoneVariations (mirrors the
// existing number->tutor lookups in bot/handlers.js).
export async function getTutorNameByNumber(number) {
  try {
    await connectToDatabase();
    const tutor = await Tutor.findOne(
      { contactNumber: { $in: generatePhoneVariations(number) } },
      { fullName: 1 },
    ).lean();
    const name = tutor?.fullName?.trim();
    return name || null;
  } catch (err) {
    console.warn('Tutor name lookup failed:', err.message);
    return null;
  }
}

// Best-effort: which assignment was this number last contacted about? Used to label the
// free-text messages we forward to the owner, so "May I know the slot?" isn't context-free.
// Returns { assignmentId, title } or null. Same optional-enrichment contract as above — a miss
// or a DB error must degrade the alert, never drop it.
// Contacts are stored with normalizePhone applied, so match on that form. We scan the few most
// recent waves and pick the row with the latest sentAt: a tutor can sit in several open
// outreaches, and the one they're replying to is the one we messaged them about last.
export async function getRecentOutreachForNumber(number) {
  try {
    await connectToDatabase();
    const norm = normalizePhone(number);
    const assignments = await Assignment.find(
      { 'outreach.contacts': { $elemMatch: { phone: norm } } },
      { title: 1, 'outreach.contacts.phone': 1, 'outreach.contacts.sentAt': 1 },
    )
      .sort({ 'outreach.lastWaveAt': -1 })
      .limit(5)
      .lean();

    let best = null;
    for (const a of assignments) {
      for (const c of a.outreach?.contacts || []) {
        if (normalizePhone(c.phone) !== norm) continue;
        if (!best || new Date(c.sentAt || 0) > new Date(best.sentAt || 0)) {
          best = { assignmentId: a._id.toString(), title: a.title, sentAt: c.sentAt };
        }
      }
    }
    return best ? { assignmentId: best.assignmentId, title: best.title } : null;
  } catch (err) {
    console.warn('Recent outreach lookup failed:', err.message);
    return null;
  }
}
