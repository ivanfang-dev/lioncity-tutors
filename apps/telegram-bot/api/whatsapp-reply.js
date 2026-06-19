import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from '../utils/phone.js';
import { notifyOwner } from '../utils/ownerAlert.js';

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
  await notifyOwner(
    `✅ *Tutor interested*\n` +
    `*${tutorName || 'A tutor'}* said YES to *${assignment.title}*\n` +
    `(${interestedCount}/${INTERESTED_TARGET} interested)` +
    (assignment.outreach?.status === 'Fulfilled' ? `\n\n🎯 Target reached — no more tutors will be messaged.` : '')
  );
}

// Records a tutor's Yes/No reply (forwarded by the WhatsApp service, which owns no DB).
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    // Shared-secret auth: same key the WhatsApp /send endpoint already uses.
    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { phone, reply } = req.body || {};
    const decision = reply === 'yes' ? 'Interested' : reply === 'no' ? 'Declined' : null;
    if (!phone || !decision) {
      return res.status(400).json({ error: 'phone and reply (yes|no) required' });
    }

    await connectToDatabase();
    const norm = normalizePhone(phone);

    // The most recent still-active outreach that messaged this number and is waiting
    // on a reply. (A tutor in several open assignments → attribute to the latest wave.)
    const assignment = await Assignment.findOne({
      'outreach.status': 'Active',
      'outreach.contacts': { $elemMatch: { phone: norm, status: 'Sent' } }
    }).sort({ 'outreach.lastWaveAt': -1 });

    if (!assignment) {
      return res.status(200).json({ matched: false });
    }

    let tutorName = '';
    for (const c of assignment.outreach.contacts) {
      if (c.phone === norm && c.status === 'Sent') {
        c.status = decision;
        c.respondedAt = new Date();
        tutorName = c.tutorName || tutorName;
      }
    }

    const interestedCount = assignment.interestedCount();
    if (decision === 'Interested' && interestedCount >= INTERESTED_TARGET) {
      assignment.outreach.status = 'Fulfilled';
    }
    await assignment.save();

    if (decision === 'Interested') {
      await alertOwnerInterested(assignment, tutorName, interestedCount);
    }

    return res.status(200).json({
      matched: true,
      assignmentId: assignment._id.toString(),
      reply,
      interestedCount,
      stopped: assignment.outreach.status === 'Fulfilled'
    });
  } catch (err) {
    console.error('whatsapp-reply error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
