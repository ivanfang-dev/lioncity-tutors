import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';

// Outbound cold-outreach DM to a tutor over Telegram — the FREE alternative to a billable
// WhatsApp template. Mirrors whatsappSender.js: a single fetch choke point that THROWS on
// failure so tutorNotifier can fall back to WhatsApp when a DM can't be delivered (tutor
// blocked the bot, deleted the chat, or the id is stale). Talks to the raw Bot API rather
// than the node-telegram-bot-api instance in api/telegram.js so this module stays out of the
// webhook's import graph (telegram.js → handlers → tutorNotifier → here would otherwise cycle).

const TELEGRAM_API = 'https://api.telegram.org';

// Escape a VALUE so Telegram's legacy-Markdown parser can't choke on stray _ * [ ] ` in
// owner-typed free text (especially the description). Only interpolated values are escaped;
// the literal *bold* markers below are ours and stay intact. A parse failure here would throw
// and — via sendToTutor — wrongly mark the tutor's Telegram stale, so this guard matters.
function escapeMd(text) {
  return String(text ?? '').replace(/[_*[\]`]/g, '\\$&');
}

// Format the assignment for a tutor-facing DM. Unlike the WhatsApp template — 6 rigid,
// single-line params with the description dropped — a Telegram DM has no such limits, so we
// include the full description: the extra context that makes a tutor more likely to say yes.
function formatAssignmentDM(assignment) {
  const timing = formatTimeSlots(assignment.preferredTimeSlots);
  const frequency = timing ? `${assignment.frequency}, ${timing}` : assignment.frequency;

  let msg = `*🎯 New Assignment Match*\n\n`;
  msg += `*${escapeMd(assignment.title || 'Assignment')}*\n\n`;
  msg += `*Level:* ${escapeMd(assignment.level)}\n`;
  msg += `*Subject:* ${escapeMd(assignment.subject)}\n`;
  msg += `*Location:* ${escapeMd(assignment.location)}\n`;
  msg += `*Frequency:* ${escapeMd(frequency)}\n`;
  msg += `*Rate:* ${escapeMd(assignment.rate)}\n`;
  if (assignment.description) {
    msg += `\n*Details:* ${escapeMd(assignment.description)}\n`;
  }
  msg += `\nInterested? Tap below 👇`;
  return msg;
}

// POST to a Bot API method and throw a diagnosable error on failure, so the caller can treat
// any non-delivery as "fall back to WhatsApp". Telegram returns { ok, error_code, description }.
async function postToTelegram(method, payload) {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) throw new Error('BOT_TOKEN not configured');

  const res = await fetch(`${TELEGRAM_API}/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000)
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      `Telegram ${method} failed (HTTP ${res.status}${body.error_code ? `, code ${body.error_code}` : ''}): ${body.description || res.statusText}`
    );
  }
  return res.json();
}

// DM a matching tutor about an assignment with two inline buttons:
//   ✅ Interested       → outreach_interested_<id> — a lightweight Yes, mirroring the WhatsApp
//                          quick-reply; recorded straight against the outreach contact.
//   📝 Apply with my rate → apply_assignment_<id> — the existing formal apply flow, unchanged.
// Both are callback_data (not a t.me deep link) so the tutor stays in the DM instead of being
// re-prompted to share a contact they've already linked. Requires tutor.telegramId; throws if
// the DM can't be sent so the caller reaches this tutor over WhatsApp instead.
export async function sendAssignmentDM(tutor, assignment) {
  if (!tutor.telegramId) throw new Error('tutor has no telegramId');

  await postToTelegram('sendMessage', {
    chat_id: tutor.telegramId,
    text: formatAssignmentDM(assignment),
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Interested', callback_data: `outreach_interested_${assignment._id}` }],
        [{ text: '📝 Apply with my rate', callback_data: `apply_assignment_${assignment._id}` }]
      ]
    }
  });
}
