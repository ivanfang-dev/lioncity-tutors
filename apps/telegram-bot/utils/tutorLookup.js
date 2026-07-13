import mongoose from 'mongoose';
import { Tutor } from '../../../packages/shared/server-exports.js';
import { generatePhoneVariations } from '../../../packages/shared/utils/phoneUtils.js';

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
