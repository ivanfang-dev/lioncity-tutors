import { findMatchingTutors } from './tutorMatcher.js';

const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001';

async function sendWhatsAppMessage(phoneNumber, message, assignmentId, assignmentTitle, tutorName) {
  const res = await fetch(`${WHATSAPP_SERVICE_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, message, assignmentId, assignmentTitle, tutorName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

async function notifyMatchedTutors(assignment, botUsername) {
  try {
    const tutors = await findMatchingTutors(assignment, 5);

    if (tutors.length === 0) {
      console.log(`No matching tutors found for assignment ${assignment._id}`);
      return { sent: 0, failed: 0 };
    }

    console.log(`Notifying ${tutors.length} matched tutors for assignment ${assignment._id}`);

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

    const results = await Promise.allSettled(
      tutors.map(tutor =>
        sendWhatsAppMessage(
          tutor.contactNumber,
          message,
          assignment._id.toString(),
          assignment.title,
          tutor.fullName || 'Unknown'
        )
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    if (failed > 0) {
      const errors = results.filter(r => r.status === 'rejected').map(r => r.reason?.message);
      console.log(`WhatsApp notifications: ${sent} sent, ${failed} failed:`, errors);
    }

    return { sent, failed };
  } catch (error) {
    console.error('Error notifying matched tutors:', error);
    return { sent: 0, failed: 0 };
  }
}

export { notifyMatchedTutors };
