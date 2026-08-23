import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';
import { escapeMd } from './markdown.js';

// Outbound cold-outreach DM to a tutor over Telegram — the FREE alternative to a billable
// WhatsApp template. Mirrors whatsappSender.js: a single fetch choke point that THROWS on
// failure so tutorNotifier can fall back to WhatsApp when a DM can't be delivered (tutor
// blocked the bot, deleted the chat, or the id is stale). Talks to the raw Bot API rather
// than the node-telegram-bot-api instance in api/telegram.js so this module stays out of the
// webhook's import graph (telegram.js → handlers → tutorNotifier → here would otherwise cycle).

const TELEGRAM_API = 'https://api.telegram.org';

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
//   ✅ Interested       → outreach_interested_<id> — a Yes, mirroring the WhatsApp quick-reply;
//                          recorded against the outreach contact, then followed by the rate ask.
//   ❌ Not available     → outreach_decline_<id> — a No, followed by the reason buttons.
//
// The old '📝 Apply with my rate' button is GONE, folded into ✅. It routed to apply_assignment_,
// which writes to assignment.applicants — a DIFFERENT array from outreach.contacts — so a tutor
// who used it was invisible to outreach: no credit toward INTERESTED_TARGET, no shortlistRank,
// no shortlist alert, and waves kept firing at a tutor who had already said yes with a rate.
// Every yes now carries a rate anyway, so the two buttons were the same action. The apply flow
// itself is untouched and keeps its real entry point: the public channel post.
//
// '❌ Not available' is NEW. Telegram tutors previously had no way to decline at all — they
// could only ignore the DM and keep collecting reminders. It is also what the decline-reason
// buttons hang off, which the WhatsApp side has had (via the template) since day one.
//
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
        [{ text: '❌ Not available', callback_data: `outreach_decline_${assignment._id}` }]
      ]
    }
  });
}

// One FREE profile-improvement nudge (roadmap Phase 9 follow-on): a tutor with a weak extracted
// profile (qualityGrade ≤ 2) gets a single Telegram DM suggesting they add concrete results. The
// button routes into the existing track-record edit flow ('edit_track_record'), which on save
// re-extracts their profile (Phase 9) — so acting on the nudge can lift their ranking automatically.
// Telegram-only, no WhatsApp spend. Throws on failure so the caller can log it.
export async function sendProfileNudgeDM(tutor) {
  if (!tutor.telegramId) throw new Error('tutor has no telegramId');

  await postToTelegram('sendMessage', {
    chat_id: tutor.telegramId,
    text: "Hi! A quick tip: tutors whose profiles show CONCRETE results — specific grade improvements, schools taught, years of experience — get shortlisted far more often than those with a short or general profile. If you'd like more assignment matches, add your track record below and we'll update your profile. 👇",
    reply_markup: {
      inline_keyboard: [[{ text: '✏️ Add my track record', callback_data: 'edit_track_record' }]]
    }
  });
}

// One FREE reactivation DM to a tutor we've auto-paused for dormancy (roadmap Phase 10 step 3): many
// unanswered messages and no confirmed activity in months. One tap ('reactivate', handled in
// handlers.js) clears pausedAt and puts them back in the pool. Telegram-only — no WhatsApp spend.
// Throws if the DM can't be delivered so the caller can log it; the pause itself still stands.
export async function sendReactivationDM(tutor) {
  if (!tutor.telegramId) throw new Error('tutor has no telegramId');

  await postToTelegram('sendMessage', {
    chat_id: tutor.telegramId,
    text: "Hi! We haven't been able to match you to an assignment in a while, so we've paused your profile to keep our shortlists tidy. Still tutoring and want to keep receiving assignment matches? Just tap below to stay listed. 👇",
    reply_markup: {
      inline_keyboard: [[{ text: '✅ Still tutoring — keep me listed', callback_data: 'reactivate' }]]
    }
  });
}
