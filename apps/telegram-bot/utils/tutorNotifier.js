import { findMatchingTutors } from './tutorMatcher.js';
import { rankTutorsWithAI } from './tutorRanker.js';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from './phone.js';

const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

async function sendWhatsAppMessage(phoneNumber, message, assignmentId, assignmentTitle, tutorName) {
  const headers = { 'Content-Type': 'application/json' };
  if (WHATSAPP_API_KEY) headers['x-api-key'] = WHATSAPP_API_KEY;

  const res = await fetch(`${WHATSAPP_SERVICE_URL}/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phoneNumber, message, assignmentId, assignmentTitle, tutorName }),
    signal: AbortSignal.timeout(45000)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

// Append the tutors we just messaged to the assignment's outreach log and mark the
// wave. Best-effort: a recording failure must not abort the notification flow.
async function recordWaveContacts(assignmentId, contacts) {
  if (contacts.length === 0) return;
  const now = new Date();
  try {
    await Assignment.updateOne(
      { _id: assignmentId },
      {
        $push: { 'outreach.contacts': { $each: contacts } },
        $set: { 'outreach.status': 'Active', 'outreach.lastWaveAt': now },
        $inc: { 'outreach.waveCount': 1 }
      }
    );
    // Stamp the start time only on the first wave (when it isn't set yet).
    await Assignment.updateOne(
      { _id: assignmentId, 'outreach.startedAt': { $exists: false } },
      { $set: { 'outreach.startedAt': now } }
    );
  } catch (err) {
    console.error('Failed to record outreach contacts:', err.message);
  }
}

async function notifyMatchedTutors(assignment, botUsername) {
  try {
    // Pull the top 40 quality-ranked matches; the AI re-ranker narrows to the best 8.
    const candidates = await findMatchingTutors(assignment, 40);

    if (candidates.length === 0) {
      console.log(`No matching tutors found for assignment ${assignment._id}`);
      return { sent: 0, failed: 0, aiUsed: false, aiError: null };
    }

    console.log(`Found ${candidates.length} candidates for assignment ${assignment._id}, ranking with AI...`);
    const { tutors, aiUsed, aiError } = await rankTutorsWithAI(assignment, candidates, 8);
    console.log(`Notifying ${tutors.length} top-ranked tutors (AI used: ${aiUsed})`);

    const applyUrl = `https://t.me/${botUsername}?start=apply_${assignment._id}`;

    const message =
      `New Tuition Assignment Match!\n\n` +
      `Title: ${assignment.title}\n` +
      `Level: ${assignment.level}\n` +
      `Subject: ${assignment.subject}\n` +
      `Location: ${assignment.location}\n` +
      `Frequency: ${assignment.frequency}\n` +
      `Rate: ${assignment.rate}\n` +
      (assignment.description ? `Description: ${assignment.description}\n` : '') +
      `\nThis assignment matches your profile.\n` +
      `- Reply "Yes" to apply\n` +
      `- Or apply via Telegram: ${applyUrl}`;

    // Send sequentially — whatsapp-web.js uses a single Chrome process and concurrent
    // sendMessage calls all queue CDP commands on the same browser, causing protocol timeouts.
    let sent = 0;
    let failed = 0;
    const errors = [];
    const contacts = [];
    for (const tutor of tutors) {
      try {
        await sendWhatsAppMessage(
          tutor.contactNumber,
          message,
          assignment._id.toString(),
          assignment.title,
          tutor.fullName || 'Unknown'
        );
        sent++;
        contacts.push({
          tutorId: tutor._id,
          phone: normalizePhone(tutor.contactNumber),
          tutorName: tutor.fullName || 'Unknown',
          wave: 1,
          sentAt: new Date(),
          status: 'Sent'
        });
      } catch (err) {
        failed++;
        errors.push(err.message);
      }
    }

    if (failed > 0) {
      console.log(`WhatsApp notifications: ${sent} sent, ${failed} failed:`, errors);
    }

    // Persist who we contacted so Yes/No replies can be matched and the escalation
    // loop can resume after a restart — this state must live in Mongo, never in
    // process memory (which is lost on every WhatsApp-service crash/restart).
    await recordWaveContacts(assignment._id, contacts);

    return { sent, failed, aiUsed, aiError };
  } catch (error) {
    console.error('Error notifying matched tutors:', error);
    return { sent: 0, failed: 0, aiUsed: false, aiError: null };
  }
}

export { notifyMatchedTutors };
