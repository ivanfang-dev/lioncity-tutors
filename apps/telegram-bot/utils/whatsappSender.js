// Single place that talks to the WhatsApp Cloud API. Two send paths, both routed through
// postMessage(): sendWhatsApp() for free-form text (valid only inside the 24h window) and
// sendWhatsAppTemplate() for approved templates (the only way to reach a tutor cold).
const GRAPH_API_VERSION = 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Normalize to the digits-only international format the Cloud API expects (no '+'). A bare
// 8-digit number is a Singapore local number, so prepend the 65 country code; anything
// longer already carries a country code (65… for SG, 1… for a US test number) and is used
// as-is.
function toWaId(phoneNumber) {
  const digits = String(phoneNumber).replace(/\D/g, '');
  return digits.length === 8 ? '65' + digits : digits;
}

// POST a message payload to the Cloud API and throw a diagnosable error on failure.
// Shared by the text and template senders so auth/endpoint/error handling live in one place.
async function postMessage(payload) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN not configured');
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', ...payload }),
      signal: AbortSignal.timeout(30000)
    }
  );

  if (!res.ok) {
    // Meta returns structured errors: { error: { message, code, error_data: { details } } }.
    // Surface code + message so window/template failures (e.g. code 131047) are diagnosable.
    const body = await res.json().catch(() => ({}));
    const e = body?.error || {};
    const detail = e.error_data?.details ? ` — ${e.error_data.details}` : '';
    throw new Error(
      `WhatsApp send failed (HTTP ${res.status}${e.code ? `, code ${e.code}` : ''}): ${e.message || res.statusText}${detail}`
    );
  }
}

// Free-form text — only delivers inside the 24h customer-service window (recipient messaged
// us in the last 24h). Used for in-window replies (e.g. relaying a profile to a parent who
// just wrote in). Cold outreach must use sendWhatsAppTemplate instead.
export async function sendWhatsApp(phoneNumber, message) {
  await postMessage({
    to: toWaId(phoneNumber),
    type: 'text',
    text: { preview_url: false, body: message }
  });
}

// Interactive LIST send — free-form, so like sendWhatsApp it only delivers inside the 24h
// window. Used for the decline-reason question, which always follows the tutor's own button tap
// (that tap is what opens the window). A list rather than reply-buttons because those cap at 3
// options and there are 5 reasons.
//
// Meta's limits, all of which fail the whole send rather than truncating: button text ≤20 chars,
// section title ≤24, row title ≤24, row description ≤72, row id ≤200, ≤10 rows per section.
// Callers keep labels short (see declineReason.js) rather than trusting a silent trim.
export async function sendWhatsAppList(phoneNumber, { body, buttonText, sectionTitle, rows }) {
  await postMessage({
    to: toWaId(phoneNumber),
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: body },
      action: {
        button: buttonText,
        sections: [{ title: sectionTitle, rows }]
      }
    }
  });
}

// Approved-template send — the only way to reach a tutor OUTSIDE the 24h window, which is
// every cold outreach. `params` fill the body's {{1}}, {{2}}… in positional order; each must
// be a non-empty, single-line string (Meta rejects empty params, newlines, tabs, or 4+
// consecutive spaces). Quick-Reply buttons carry no variables, so they need no components.
// Template params can't contain newlines, tabs, or 4+ consecutive spaces (Meta rejects the
// send), so flatten all whitespace runs to single spaces. Assignment fields are owner-typed
// free text and may contain stray line breaks, so this guard lives in the one send choke point.
function sanitizeParam(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export async function sendWhatsAppTemplate(phoneNumber, templateName, params = [], { languageCode = 'en' } = {}) {
  const clean = params.map(sanitizeParam);
  const components = clean.length
    ? [{ type: 'body', parameters: clean.map((text) => ({ type: 'text', text })) }]
    : [];

  await postMessage({
    to: toWaId(phoneNumber),
    type: 'template',
    template: { name: templateName, language: { code: languageCode }, components }
  });
}
