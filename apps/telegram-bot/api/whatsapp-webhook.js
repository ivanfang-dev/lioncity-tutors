import { recordTutorReply } from '../utils/recordTutorReply.js';
import { sendWhatsApp } from '../utils/whatsappSender.js';
import { notifyOwner } from '../utils/ownerAlert.js';

// Meta Cloud API webhook. GET = the one-time verification handshake; POST = inbound events
// (tutor replies + delivery statuses). Replaces the whatsapp-web.js message handler and the
// VM→/api/whatsapp-reply forwarding hop. Meta gives us the sender's real number (wa_id)
// directly, so the old @lid contact-resolution dance is gone.
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

// Quick-Reply button label → yes/no. Our template buttons are "Yes, interested" / "Not
// available"; match generously in case the wording is tweaked later.
function parseButton(label) {
  if (!label) return null;
  const t = label.trim().toLowerCase();
  if (t.startsWith('yes') || t.includes('interested')) return 'yes';
  if (t.startsWith('no') || t.startsWith('not')) return 'no';
  return null;
}

// Fallback for tutors who type instead of tapping (mirrors the old parseReply).
function parseText(body) {
  if (!body) return null;
  const t = body.trim().toLowerCase();
  if (/^y(es|ep|eah|a|up)?\b/.test(t) || t === 'ok' || t === 'okay' || t.includes('interested')) return 'yes';
  if (/^n(o|ope|ah)?\b/.test(t)) return 'no';
  return null;
}

// Pull a yes/no out of whatever inbound message shape Meta sent. Template Quick-Reply taps
// arrive as type 'button'; interactive-message taps as 'interactive'; typed replies as 'text'.
function replyFromMessage(msg) {
  if (msg.type === 'button') return parseButton(msg.button?.text || msg.button?.payload);
  if (msg.type === 'interactive') return parseButton(msg.interactive?.button_reply?.title);
  if (msg.type === 'text') return parseText(msg.text?.body);
  return null;
}

async function acknowledge(to, reply) {
  try {
    await sendWhatsApp(to, reply === 'yes'
      ? "Thank you for your response! 🙏 We've noted your interest and will contact you should there be a match."
      : "Thank you for your response. We'll contact you should there be a match in the future.");
  } catch (err) {
    console.warn('Failed to send tutor acknowledgement:', err.message);
  }
}

// A tutor sent free text (a question, not a Yes/No). The Cloud API number has no inbox, so
// forward it to the owner's Telegram. The number is embedded as "(wa:<digits>)" so the owner
// can just REPLY in Telegram and the bot relays it back (see handleMessage in handlers.js).
// Sent as plain text (parseMode null) so the tutor's message can't break Markdown parsing.
async function forwardTutorMessage(from, body) {
  try {
    await notifyOwner(
      `💬 New WhatsApp message from a tutor (wa:${from})\n\n${body}\n\n↩️ Reply to this message to respond to them.`,
      undefined,
      { parseMode: null }
    );
  } catch (err) {
    console.warn('Failed to forward tutor message:', err.message);
  }
}

export default async function handler(req, res) {
  // --- GET: verification handshake ---
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Meta retries on non-2xx and expects a fast ack, so we process inline (light work) and
  // always return 200. Any per-message error is logged, never surfaced to Meta.
  try {
    for (const entry of req.body?.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};

        for (const msg of value.messages || []) {
          const from = msg.from; // wa_id: the tutor's real number, digits only
          const reply = replyFromMessage(msg);

          if (reply) {
            const result = await recordTutorReply(from, reply);
            console.log(`Webhook reply '${reply}' from ${from} → matched=${result.matched}`, result.assignmentId || '');
            // Only acknowledge tutors who are part of an active outreach.
            if (result.matched) await acknowledge(from, reply);
          } else if (msg.type === 'text' && msg.text?.body) {
            // Free-text question (not Yes/No) — forward to the owner's Telegram to handle.
            await forwardTutorMessage(from, msg.text.body);
          }
        }

        // Delivery/read/failed callbacks — log failures so a silent drop is never invisible.
        for (const status of value.statuses || []) {
          if (status.status === 'failed') {
            console.warn(`WA message ${status.id} to ${status.recipient_id} failed:`, JSON.stringify(status.errors || []));
          }
        }
      }
    }
  } catch (err) {
    console.error('whatsapp-webhook error:', err);
  }

  return res.status(200).json({ received: true });
}
