// Single place that talks to the WhatsApp service's /send endpoint. Used both for tutor
// outreach waves and for relaying tutor profiles to parents, so the URL/auth/timeout
// handling lives in one spot.
const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

export async function sendWhatsApp(phoneNumber, message) {
  const headers = { 'Content-Type': 'application/json' };
  if (WHATSAPP_API_KEY) headers['x-api-key'] = WHATSAPP_API_KEY;

  const res = await fetch(`${WHATSAPP_SERVICE_URL}/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phoneNumber, message }),
    signal: AbortSignal.timeout(45000)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}
