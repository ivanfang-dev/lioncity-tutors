import { isValidLevelSubjectCombination } from '../../../packages/shared/client-exports.js';
import { formatAssignmentForChannel } from './channelFormat.js';

// Assignments posted from the ops console: every field the channel post needs, trimmed.
const REQUIRED = ['title', 'level', 'subject', 'location', 'rate', 'frequency'];

export function validateConsoleAssignment(body) {
  const data = {};
  for (const field of REQUIRED) {
    const value = String(body?.[field] ?? '').trim();
    if (!value) return { ok: false, error: `missing_${field}` };
    data[field] = value;
  }
  if (!isValidLevelSubjectCombination(data.level, data.subject)) {
    return { ok: false, error: 'invalid_subject' };
  }
  const description = String(body?.description ?? '').trim();
  if (description) data.description = description;
  return { ok: true, data };
}

// Post to the public channel with the Apply button; returns the channel message id. Throws if refused.
export async function sendChannelPost(assignment) {
  const res = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.CHANNEL_ID,
      text: formatAssignmentForChannel(assignment),
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[
        { text: '📝 Apply for this Assignment', url: `https://t.me/${process.env.BOT_USERNAME}?start=apply_${assignment._id}` },
      ]] },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.ok) throw new Error(`Telegram refused the channel post (HTTP ${res.status}): ${body.description || 'no description'}`);
  return body.result.message_id;
}
