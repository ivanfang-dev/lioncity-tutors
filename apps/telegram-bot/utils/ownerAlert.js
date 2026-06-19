// Best-effort Telegram alert to the owner/admin. Used for outreach signals (a tutor
// said yes, an assignment ran out of tutors, etc.). Never throws into the caller.
export async function notifyOwner(text) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.WHATSAPP_ALERT_CHAT_ID
    || process.env.ADMIN_USERS?.split(',')[0]?.trim();
  if (!botToken || !chatId) {
    console.warn('notifyOwner: BOT_TOKEN or admin chat id not set — alert skipped');
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
  } catch (err) {
    console.warn('notifyOwner failed:', err.message);
  }
}
