// Deep link from an alert into the ops console (roadmap Phase 3). Telegram is the interrupt
// surface; the console is the workspace — the link is the hop between them, and it's the whole
// mobile flow: ping → tap → console → wa.me → outcome.
//
// Points at the assignment's drill-down rather than the queue anchor the roadmap sketched: the
// drill-down always exists, whereas a queue row only exists while the assignment needs action, so
// alerts on healthy assignments (a tutor said yes) would land on a dead fragment. Middleware
// carries the path through login, so a cold phone still arrives in the right place.
//
// Returns null when OPS_CONSOLE_URL isn't configured, so callers just omit the button.
export function opsLink(assignmentId) {
  const base = process.env.OPS_CONSOLE_URL;
  if (!base || !assignmentId) return null;
  return `${base.replace(/\/$/, '')}/ops/assignment/${assignmentId}`;
}

// An inline "Open in console" button row, or null when there's no console URL configured.
export function opsButtonRow(assignmentId, label = '🖥️ Open in console') {
  const url = opsLink(assignmentId);
  return url ? [{ text: label, url }] : null;
}

// Best-effort Telegram alert to the owner/admin. Used for outreach signals (a tutor
// said yes, an assignment ran out of tutors, etc.). Never throws into the caller.
// `replyMarkup` optionally attaches an inline keyboard (e.g. a "Send to parent" button).
export async function notifyOwner(text, replyMarkup, { parseMode = 'Markdown', disableWebPagePreview = false } = {}) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.WHATSAPP_ALERT_CHAT_ID
    || process.env.ADMIN_USERS?.split(',')[0]?.trim();
  if (!botToken || !chatId) {
    console.warn('notifyOwner: BOT_TOKEN or admin chat id not set — alert skipped');
    return;
  }
  try {
    // parseMode can be set to null to send raw text (e.g. forwarding a tutor's free-text
    // message, which may contain characters that would break Markdown parsing).
    const body = { chat_id: chatId, text };
    if (parseMode) body.parse_mode = parseMode;
    // Suppress the link preview card when the body carries a wa.me paste-fallback link.
    if (disableWebPagePreview) body.disable_web_page_preview = true;
    if (replyMarkup) body.reply_markup = replyMarkup;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.warn('notifyOwner failed:', err.message);
  }
}
