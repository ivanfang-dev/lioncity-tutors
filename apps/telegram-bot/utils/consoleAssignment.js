import { isValidLevelSubjectCombination } from '../../../packages/shared/client-exports.js';
import { formatAssignmentForChannel } from './channelFormat.js';

// Assignments posted from the ops console: every field the channel post needs, trimmed.
const REQUIRED = ['title', 'level', 'subject', 'location', 'rate', 'frequency'];

// `subjects` (a list) or `subject` (one); 2+ distinct subjects post as Multiple Subjects.
function pickSubjects(body) {
  const raw = Array.isArray(body?.subjects) ? body.subjects : [body?.subject];
  return [...new Set(raw.map(s => String(s ?? '').trim()).filter(Boolean))];
}

export function validateConsoleAssignment(body) {
  const data = {};
  const subjects = pickSubjects(body);
  for (const field of REQUIRED) {
    if (field === 'subject') {
      if (!subjects.length) return { ok: false, error: 'missing_subject' };
      continue;
    }
    const value = String(body?.[field] ?? '').trim();
    if (!value) return { ok: false, error: `missing_${field}` };
    data[field] = value;
  }
  if (!subjects.every(s => isValidLevelSubjectCombination(data.level, s))) {
    return { ok: false, error: 'invalid_subject' };
  }
  if (subjects.length > 1) {
    data.subject = 'Multiple Subjects';
    data.subjects = subjects;
  } else {
    data.subject = subjects[0];
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
