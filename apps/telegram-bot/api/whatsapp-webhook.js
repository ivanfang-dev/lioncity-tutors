import { recordTutorReply } from '../utils/recordTutorReply.js';
import { sendWhatsApp, sendWhatsAppList } from '../utils/whatsappSender.js';
import { notifyOwner } from '../utils/ownerAlert.js';
import { getRecentOutreachForNumber, getTutorNameByNumber } from '../utils/tutorLookup.js';
import { recordQuotedRate } from '../utils/rateCapture.js';
import { declineReasonListRows, parseListReplyId, recordDeclineReason } from '../utils/declineReason.js';

// Meta Cloud API webhook. GET = the one-time verification handshake; POST = inbound events
// (tutor replies + delivery statuses). Replaces the whatsapp-web.js message handler and the
// VM→/api/whatsapp-reply forwarding hop. Meta gives us the sender's real number (wa_id)
// directly, so the old @lid contact-resolution dance is gone.
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

// Lowercase, and fold contractions so one negation list also covers isn't / can't / don't.
function normalizeInbound(value) {
  return String(value).trim().toLowerCase().replace(/n['\u2019]t\b/g, ' not ');
}

// A negated availability word ANYWHERE in the message — "not interested", "sorry, not
// interested", "no longer free". Up to two filler words are allowed between the two halves
// ("not really interested"), but a comma or full stop ends the phrase so this cannot reach
// across clauses and read "not sure, but I am free" as a decline.
//
// Every affirmative rule below matches `interested` as a bare SUBSTRING, so this must be
// tested first. Anchoring it (the previous /^not\s+.../) only caught declines that began with
// "not", which meant "I'm not interested" and even "no, not interested" were recorded as YES.
const NEGATED_AVAILABILITY =
  /\b(?:not|never|unable|cannot|no longer)\s+(?:\w+\s+){0,2}(?:interested|available|free|able|keen|taking)\b/;

// Quick-Reply button label → yes/no. Our template buttons are "Yes, interested" / "Not
// available"; match generously in case the wording is tweaked later. The decline check runs
// first for the same substring reason as above — relabelling the decline button to "Not
// interested" in the Meta console would otherwise turn every decline into a yes.
function parseButton(label) {
  if (!label) return null;
  const t = normalizeInbound(label);
  if (NEGATED_AVAILABILITY.test(t) || t.startsWith('no')) return 'no';
  if (t.startsWith('yes') || t.includes('interested')) return 'yes';
  return null;
}

// Fallback for tutors who type instead of tapping (mirrors the old parseReply). Deliberately
// keyword-shallow: anything it isn't sure about must fall through to the owner, which is a
// visible non-failure, rather than being guessed at and silently recorded as the wrong answer.
function parseText(body) {
  if (!body) return null;
  const t = normalizeInbound(body);
  if (NEGATED_AVAILABILITY.test(t)) return 'no';
  if (/^y(es|ep|eah|a|up)?\b/.test(t) || t === 'ok' || t === 'okay' || t.includes('interested')) return 'yes';
  if (/^n(o|ope|ah)?\b/.test(t)) return 'no';
  return null;
}

// Classify whatever inbound shape Meta sent, WITHOUT deciding what to do about it. Template
// Quick-Reply taps arrive as type 'button'; interactive taps as 'interactive' (button_reply for
// our reply-buttons, list_reply for the decline-reason list); typed replies as 'text'.
//
// Pure and exported so the parse order can be tested: this deliberately does NOT look for a
// rate, because "is this a rate?" depends on whether we asked this tutor for one — state that
// lives in Mongo. The handler applies that check first; see the order comment there.
export function classifyInbound(msg) {
  if (msg?.type === 'button') {
    const reply = parseButton(msg.button?.text || msg.button?.payload);
    return reply ? { kind: 'reply', reply } : { kind: 'unknown' };
  }
  if (msg?.type === 'interactive') {
    const listId = msg.interactive?.list_reply?.id;
    if (listId) {
      const parsed = parseListReplyId(listId);
      return parsed ? { kind: 'reason', ...parsed } : { kind: 'unknown' };
    }
    const reply = parseButton(msg.interactive?.button_reply?.title);
    return reply ? { kind: 'reply', reply } : { kind: 'unknown' };
  }
  if (msg?.type === 'text' && msg.text?.body) {
    const reply = parseText(msg.text.body);
    return reply ? { kind: 'reply', reply } : { kind: 'text', body: msg.text.body };
  }
  return { kind: 'unknown' };
}

async function acknowledge(to, reply) {
  try {
    await sendWhatsApp(to, reply === 'yes'
      ? "Thank you for your response! 🙏 We've noted your interest and will contact you should there be a match. Feel free to contact us anytime at 8870 1152 if you need any further help 😊"
      : "Thank you for your response. We'll contact you should there be a match in the future. Feel free to contact us anytime at 8870 1152 if you need any further help 😊");
  } catch (err) {
    console.warn('Failed to send tutor acknowledgement:', err.message);
  }
}

// Ask an interested tutor what they'd charge for THIS assignment, in place of the generic ack.
// Free-form, which is legal because the tutor's own button tap just opened the 24h service
// window — so this needs no template and no Meta approval.
async function askForRate(to, ratePrompt) {
  try {
    await sendWhatsApp(to, `✅ Great — we've noted your interest!\n\n${ratePrompt}`);
  } catch (err) {
    console.warn('Failed to send rate prompt:', err.message);
  }
}

// Ask a declining tutor why. A list (not reply-buttons) because those cap at 3 and there are 5
// reasons. Best-effort on top of an already-recorded No.
async function askDeclineReason(to, assignmentId) {
  try {
    await sendWhatsAppList(to, {
      body: "Thanks for letting us know. Mind telling us why? It helps us send you better-matched assignments.",
      buttonText: 'Choose a reason',
      sectionTitle: 'Reason',
      rows: declineReasonListRows(assignmentId)
    });
  } catch (err) {
    console.warn('Failed to send decline-reason list:', err.message);
  }
}

// A tutor sent free text (a question, not a Yes/No). The Cloud API number has no inbox, so
// forward it to the owner's Telegram. The number is embedded as "(wa:<digits>)" so the owner
// can just REPLY in Telegram and the bot relays it back (see handleMessage in handlers.js).
// Sent as plain text (parseMode null) so the tutor's message can't break Markdown parsing.
async function forwardTutorMessage(from, body, { note = '' } = {}) {
  try {
    // Best-effort name so the owner sees WHO wrote in. Degrades to the bare number if the
    // sender isn't a known tutor or the lookup fails — never blocks the alert. Keep the
    // "(wa:<digits>)" token intact so the reply-relay matcher in handlers.js still routes.
    // Assignment title alongside the name, so the owner knows WHICH assignment a question like
    // "what's the slot?" is about. Both lookups are optional enrichment, so run them together
    // and let either come back null.
    const [name, outreach] = await Promise.all([
      getTutorNameByNumber(from),
      getRecentOutreachForNumber(from),
    ]);
    const sender = name || 'an unknown number';
    const context = outreach?.title ? `\n📋 Re: ${outreach.title}` : '';
    const warning = note ? `\n${note}` : '';
    await notifyOwner(
      `💬 New WhatsApp message from ${sender} (wa:${from})${context}${warning}\n\n${body}\n\n↩️ Reply to this message to respond to them.`,
      undefined,
      { parseMode: null }
    );
  } catch (err) {
    console.warn('Failed to forward tutor message:', err.message);
  }
}

// A Yes/No we could NOT tie to an outreach contact — the number isn't in any assignment's
// contacts, or that contact already replied once. This used to `return` silently: the tutor heard
// nothing back and the owner never learned there was interest, so a real yes simply evaporated.
// Forward it with the reply spelled out instead, and tell the tutor we got it.
async function forwardUnmatchedReply(from, reply, body) {
  const text = body || (reply === 'yes' ? '[tapped "Yes, interested"]' : '[tapped "Not available"]');
  await forwardTutorMessage(from, text, {
    note: `⚠️ Read as ${reply === 'yes' ? 'a YES' : 'a NO'}, but no outreach contact matched — nothing was recorded.`
  });
  await sendWhatsApp(from, "Thanks for getting back to us! We'll check and follow up shortly 😊")
    .catch(err => console.warn('Failed to ack unmatched reply:', err.message));
}

// Route ONE inbound tutor message. The order below is load-bearing — three parsers now compete
// for the same text:
//
//   1. RATE. Only when this tutor has a pending rateRequestedAt (recordQuotedRate no-ops
//      otherwise), and only when the text is rate-shaped, so the DB is untouched for ordinary
//      messages. Must come first: a tutor answering "40" to a prompt on a $40-60 assignment
//      would otherwise be read as something else entirely.
//   2. REASON. A decline-reason list tap.
//   3. YES/NO. Button payloads, then typed intent.
//   4. FORWARD. Anything left goes to the owner's Telegram as a question.
//
// The combined "yes but $50" case is deliberately not special-cased: no pending request exists
// at that point, so it lands on (3), is recorded Interested, and the rate prompt follows —
// the tutor restates the number. A second, looser rate extractor competing with the strict one
// is a permanent cost; asking once more is not.
async function handleInbound(from, msg) {
  const body = msg.type === 'text' ? msg.text?.body : null;

  // (1) Rate.
  if (body) {
    const rateResult = await recordQuotedRate({ phone: from, text: body });
    if (rateResult.matched) {
      console.log(`Webhook rate $${rateResult.rate} from ${from} → ${rateResult.assignmentId}`);
      await sendWhatsApp(from, `👍 Noted — $${rateResult.rate}/hr for ${rateResult.assignmentTitle}.` +
        (rateResult.declined
          ? "\n\nWe'll let you know if the parent can stretch to that."
          : "\n\nWe'll be in touch shortly!")
      ).catch(err => console.warn('Failed to ack rate:', err.message));
      return;
    }
  }

  const inbound = classifyInbound(msg);

  // (2) Decline reason.
  if (inbound.kind === 'reason') {
    const result = await recordDeclineReason({ phone: from, reason: inbound.reason, assignmentId: inbound.assignmentId });
    console.log(`Webhook decline reason '${inbound.reason}' from ${from} → matched=${result.matched}`);
    if (result.ratePrompt) {
      await sendWhatsApp(from, result.ratePrompt).catch(err => console.warn('Failed to ask rate after decline:', err.message));
    } else if (result.matched && inbound.reason === 'inactive') {
      await sendWhatsApp(from, "Got it — we'll stop sending you assignments. Message us any time to start again.")
        .catch(() => {});
    }
    return;
  }

  // (3) Yes/no.
  if (inbound.kind === 'reply') {
    const result = await recordTutorReply(from, inbound.reply);
    console.log(`Webhook reply '${inbound.reply}' from ${from} → matched=${result.matched}`, result.assignmentId || '');
    // Couldn't tie it to a contact — hand it to the owner rather than dropping it.
    if (!result.matched) {
      await forwardUnmatchedReply(from, inbound.reply, body);
      return;
    }
    if (result.ratePrompt) await askForRate(from, result.ratePrompt);
    else if (inbound.reply === 'no') await askDeclineReason(from, result.assignmentId);
    else await acknowledge(from, inbound.reply);
    return;
  }

  // (4) Free-text question — forward to the owner's Telegram to handle.
  if (inbound.kind === 'text') {
    await forwardTutorMessage(from, inbound.body);
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
          await handleInbound(from, msg);
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
