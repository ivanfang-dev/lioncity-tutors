// Best-effort Telegram alert to the owner/admin. Used for outreach signals (a tutor
// said yes, an assignment ran out of tutors, etc.). Never throws into the caller.
// `replyMarkup` optionally attaches an inline keyboard (e.g. a "Send to parent" button).
export async function notifyOwner(text, replyMarkup) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.WHATSAPP_ALERT_CHAT_ID
    || process.env.ADMIN_USERS?.split(',')[0]?.trim();
  if (!botToken || !chatId) {
    console.warn('notifyOwner: BOT_TOKEN or admin chat id not set — alert skipped');
    return;
  }
  try {
    const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
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
