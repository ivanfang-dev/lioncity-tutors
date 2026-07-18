// The console's client for the bot's HTTP API. Reads (assignments, funnels) come straight from
// Mongo, but every WRITE and every drafting call goes through the bot: outreach state transitions
// and parent drafts live there (utils/parentOutcome.js, utils/parentMessage.js), and a second copy
// in the website would drift from what the Telegram buttons do. The bot also owns the Telegram
// sends a rejection triggers.
//
// Server-only by contract: import this from server components and route handlers only. BOT_API_URL
// and WHATSAPP_API_KEY are unprefixed, so a client import would read them as undefined rather than
// leak the secret — but the shared key still must never be shipped to a browser.

const BOT_API_URL = process.env.BOT_API_URL;

function botUrl(path) {
  if (!BOT_API_URL) throw new Error('BOT_API_URL is not set — the ops console cannot reach the bot');
  return new URL(path, BOT_API_URL);
}

function authHeaders() {
  return process.env.WHATSAPP_API_KEY ? { 'x-api-key': process.env.WHATSAPP_API_KEY } : {};
}

async function readError(response) {
  try {
    const body = await response.json();
    return body.error || response.statusText;
  } catch {
    return response.statusText;
  }
}

// Record a parent outcome through the same recorder the Telegram buttons use.
// `outcome`: 'pick' (needs tutorId) | 'reject' (needs reason) | 'noreply'.
export async function recordOutcome({ outcome, assignmentId, tutorId, reason }) {
  const response = await fetch(botUrl('/api/parent-outcome'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ outcome, assignmentId, tutorId, reason }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`parent-outcome failed (${response.status}): ${await readError(response)}`);
  return response.json();
}

// The drafted parent message + its wa.me deep link. Called on tap rather than on render — drafting
// runs through Gemini, and paying for that on every queue load would make the console slow.
export async function fetchParentDraft({ assignmentId, kind }) {
  const url = botUrl('/api/parent-draft');
  url.searchParams.set('assignmentId', assignmentId);
  url.searchParams.set('kind', kind);
  const response = await fetch(url, { headers: authHeaders(), cache: 'no-store' });
  if (!response.ok) throw new Error(`parent-draft failed (${response.status}): ${await readError(response)}`);
  return response.json();
}

// The per-filter attrition funnel explaining a thin matching pool. On-demand (one countDocuments
// per filter), so only the drill-down asks for it.
export async function fetchMatchStats({ assignmentId }) {
  const url = botUrl('/api/match-stats');
  url.searchParams.set('assignmentId', assignmentId);
  const response = await fetch(url, { headers: authHeaders(), cache: 'no-store' });
  if (!response.ok) throw new Error(`match-stats failed (${response.status}): ${await readError(response)}`);
  return response.json();
}
