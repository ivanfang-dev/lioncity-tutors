import express from 'express';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

// Load the bot's .env (one level up) so this service shares BOT_TOKEN / WHATSAPP_API_KEY
// with the bot. Guarded: in hosted environments the file may be absent and env is injected.
try {
  process.loadEnvFile(new URL('../.env', import.meta.url));
} catch {
  // No .env file — rely on env vars already present in the process environment.
}

const app = express();
app.use(express.json());

// Where to forward Yes/No tutor replies for durable recording. The bot (on Vercel)
// owns MongoDB; this service intentionally holds no DB connection, to keep the
// memory-constrained VM lean. See deploy notes for the BOT_API_URL env var.
const BOT_API_URL = process.env.BOT_API_URL;

// Telegram bot details (for notifying admin).
// Configured from env at startup so alerts work without the (serverless, stateless) bot
// having to push config; the /config endpoint stays as an optional runtime override.
let telegramNotifier = null;
{
  const botToken = process.env.BOT_TOKEN;
  const adminChatId = process.env.WHATSAPP_ALERT_CHAT_ID || '812379368';
  if (botToken && adminChatId) {
    telegramNotifier = { botToken, adminChatId };
    console.log(`Telegram alerts enabled → chat ${adminChatId}`);
  } else {
    console.warn('Telegram alerts disabled: BOT_TOKEN not set');
  }
}

// Push an operational alert to the admin's Telegram chat (if configured).
// Best-effort: a failed alert must never throw into the caller.
async function notifyAdmin(text) {
  if (!telegramNotifier) return;
  const { botToken, adminChatId } = telegramNotifier;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: adminChatId, text, parse_mode: 'Markdown' })
    });
  } catch (err) {
    console.warn('Failed to send admin alert:', err.message);
  }
}

// --- WhatsApp Client Setup ---
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 60000
  }
});

// Queue to serialize sendMessage calls — concurrent CDP calls on the same Chrome process cause timeouts
let sendQueue = Promise.resolve();
function enqueueSend(fn) {
  sendQueue = sendQueue.then(fn).catch(() => {});
  return sendQueue;
}

let isReady = false;
let isRecovering = false;
let hasBeenReady = false; // becomes true after the first successful 'ready' — used to distinguish
                          // a normal first-boot QR from a session-lost QR that needs a human re-scan

// WhatsApp Web sometimes silently reloads its page (client updates, session refresh).
// When that happens the puppeteer frame detaches but `disconnected` does not fire,
// so isReady stays true and every queued send fails with "detached Frame".
// Recover by tearing the client down and re-initializing.
async function recoverClient(reason) {
  if (isRecovering) return;
  isRecovering = true;
  isReady = false;
  console.warn(`Recovering WhatsApp client: ${reason}`);
  notifyAdmin(`⚠️ *WhatsApp client recovering*\nReason: ${reason}\n\nSends are paused while it restarts. You'll get an "online" message when it's back.`);
  try {
    await client.destroy();
  } catch (err) {
    console.warn('Error during client.destroy() (ignoring):', err.message);
  }
  try {
    await client.initialize();
  } catch (err) {
    console.error('client.initialize() failed during recovery:', err);
  } finally {
    isRecovering = false;
  }
}

// True when the error means the WhatsApp Web page's injected runtime is broken or gone
// — a detached/closed frame, OR the page reloaded and wiped window.WWebJS / window.Store
// (which surfaces as "Cannot read properties of undefined (reading 'getChat')" etc.).
// All of these are recoverable by tearing down and re-initializing the client.
function isRecoverableClientError(err) {
  const msg = err?.message || String(err);
  return /detached Frame|Execution context was destroyed|Target closed|Session closed|Cannot read properties of undefined \(reading '(getChat|sendSeen|sendMessage|getMessageModel)'\)|WWebJS|window\.Store/i.test(msg);
}

client.on('qr', (qr) => {
  console.log('Scan this QR code with WhatsApp:');
  qrcode.generate(qr, { small: true });
  // A QR after we've already been online means the session was lost and a human must
  // re-scan on the server — the service cannot self-heal from this. Alert loudly.
  if (hasBeenReady) {
    notifyAdmin('🚨 *WhatsApp session lost — action required*\nThe service needs a QR re-scan on the server before any tutors can be notified again.');
  }
});

client.on('ready', () => {
  const recovered = hasBeenReady;
  isReady = true;
  hasBeenReady = true;
  console.log('WhatsApp client is ready!');
  if (recovered) {
    notifyAdmin('✅ *WhatsApp client back online*\nSends have resumed.');
  }
});

client.on('authenticated', () => {
  console.log('WhatsApp client authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('WhatsApp authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  isReady = false;
  console.log('WhatsApp client disconnected:', reason);
  notifyAdmin(`⚠️ *WhatsApp client disconnected*\nReason: ${reason}`);
});

// Classify a tutor's free-text reply. We act only on a clear yes/no; anything else
// (including silence) is ignored — the escalation timer handles non-responders.
function parseReply(body) {
  if (!body) return null;
  if (/^y(es|ep|eah|a|up)?\b/.test(body) || body === 'ok' || body === 'okay' || body.includes('interested')) return 'yes';
  if (/^n(o|ope|ah)?\b/.test(body)) return 'no';
  return null;
}

// Forward a yes/no reply to the bot, which records it in MongoDB and decides whether
// the assignment's interest target is met. Returns the bot's result, or null if the
// bot is unreachable / unconfigured.
async function recordReply(phone, reply) {
  if (!BOT_API_URL) {
    console.warn('BOT_API_URL not set — tutor reply not recorded');
    return null;
  }
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['x-api-key'] = API_KEY;
  const res = await fetch(`${BOT_API_URL}/api/whatsapp-reply`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone, reply }),
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`reply endpoint returned ${res.status}`);
  return res.json();
}

// Handle incoming Yes/No replies from tutors.
client.on('message', async (message) => {
  const from = message.from || '';
  // Diagnostic: logs EVERY inbound message before any filter, so we can see whether a
  // tutor's reply actually arrives and in what address format (@c.us vs @lid). Remove
  // once reply handling is confirmed working.
  console.log(`Inbound message: from="${from}" fromMe=${message.fromMe} body="${message.body}"`);
  // Only 1:1 chats — ignore groups, status broadcasts, and our own messages.
  if (message.fromMe || !(from.endsWith('@c.us') || from.endsWith('@lid'))) return;

  const reply = parseReply(message.body?.trim().toLowerCase());
  if (!reply) return;

  // Resolve the actual phone number. With WhatsApp's newer LID system, message.from is an
  // opaque "@lid" id that is NOT the phone number, so a @lid reply can't be matched to the
  // tutor we messaged unless we resolve the contact back to its real number. For a plain
  // "@c.us" chat the id already IS the number.
  let phone = from.replace('@c.us', '').replace('@lid', '');
  if (from.endsWith('@lid')) {
    try {
      const contact = await message.getContact();
      // Log candidates so we can confirm which field carries the real number on this
      // whatsapp-web.js version, then prefer it.
      console.log(`Contact resolve for ${from}: number=${contact?.number} id=${contact?.id?._serialized} user=${contact?.id?.user}`);
      if (contact?.number) phone = contact.number;
    } catch (e) {
      console.warn('getContact failed:', e.message);
    }
  }

  try {
    const result = await recordReply(phone, reply);
    // Diagnostic: shows every recognized reply, what it parsed to, and whether the bot
    // tied it to an active outreach. Lets us tell "not matched" apart from "errored".
    console.log(`Reply from ${phone}: "${message.body}" → parsed=${reply}, matched=${result ? result.matched : 'no-response'}`);
    // Only acknowledge tutors who are actually part of an active outreach.
    if (!result?.matched) return;

    await message.reply(reply === 'yes'
      ? "Thank you for your response! 🙏 We've noted your interest and will contact you should there be a match."
      : "Thank you for your response. We'll contact you should there be a match in future.");
    console.log(`Tutor ${phone} replied ${reply} → assignment ${result.assignmentId}`);
  } catch (err) {
    console.error('Error handling tutor reply:', err.message);
  }
});

// --- API Key Auth ---
const API_KEY = process.env.WHATSAPP_API_KEY;

function requireAuth(req, res, next) {
  if (!API_KEY) return next(); 
  const provided = req.headers['x-api-key'];
  if (provided !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// --- HTTP API ---

// Health check (no auth needed)
app.get('/health', (req, res) => {
  res.json({ status: isReady ? 'ready' : 'not_ready' });
});

// Configure Telegram notifier
app.post('/config', requireAuth, (req, res) => {
  const { botToken, adminChatId } = req.body;
  if (botToken && adminChatId) {
    telegramNotifier = { botToken, adminChatId };
    console.log('Telegram notifier configured');
    res.json({ ok: true });
  } else {
    res.status(400).json({ error: 'botToken and adminChatId required' });
  }
});

// Send WhatsApp message
app.post('/send', requireAuth, async (req, res) => {
  if (!isReady) {
    return res.status(503).json({ error: 'WhatsApp client not ready' });
  }

  const { phoneNumber, message, assignmentId, assignmentTitle, tutorName } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'phoneNumber and message required' });
  }

  try {
    // Build the WhatsApp chat id. A bare 8-digit number is a Singapore local number, so
    // prepend the 65 country code; anything longer already includes a country code
    // (65… for SG, 1… for a US test number, etc.) and is used as-is.
    const digits = phoneNumber.replace(/\D/g, '');
    const chatId = `${digits.length === 8 ? '65' + digits : digits}@c.us`;

    // Per-send timeout: if puppeteer hangs (page is in a bad state, WhatsApp Web slow,
    // detached frame), we want a definitive error in <=30s instead of letting the call
    // sit in the queue blocking subsequent sends.
    const SEND_TIMEOUT_MS = 30000;
    await new Promise((resolve, reject) => {
      enqueueSend(() => {
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          reject(new Error(`sendMessage timed out after ${SEND_TIMEOUT_MS}ms`));
        }, SEND_TIMEOUT_MS);
        return client.sendMessage(chatId, message).then(
          (val) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(val);
          },
          (err) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(err);
          }
        );
      });
    });

    console.log(`Message sent to ${chatId}`);
    res.json({ ok: true });
  } catch (err) {
    console.error(`Failed to send to ${phoneNumber}:`, err.message);
    if (isRecoverableClientError(err) || /timed out after/.test(err.message)) {
      // Don't await — recovery can take 10-30s and we want to fail fast for this request.
      recoverClient(err.message);
    }
    res.status(500).json({ error: err.message });
  }
});

// --- Proactive health check ---
// WhatsApp Web can silently reload and wipe its injected runtime without firing
// 'disconnected', leaving isReady=true while every send is broken. Poll getState() so we
// catch this and recover BEFORE a batch of sends starts, rather than discovering it one
// failed tutor at a time. getState() returns null (or throws) when the page runtime is gone.
const HEALTH_CHECK_MS = Number(process.env.WHATSAPP_HEALTH_CHECK_MS) || 60000;
let healthCheckRunning = false;
setInterval(async () => {
  if (!isReady || isRecovering || healthCheckRunning) return;
  healthCheckRunning = true;
  try {
    const state = await client.getState();
    if (state !== 'CONNECTED') {
      recoverClient(`health check: state=${state}`);
    }
  } catch (err) {
    recoverClient(`health check error: ${err.message}`);
  } finally {
    healthCheckRunning = false;
  }
}, HEALTH_CHECK_MS);

// --- Escalation tick ---
// The bot (serverless on Vercel) can't run timers, so this always-on service pings
// the bot's escalation endpoint on a schedule; the bot decides and fires any due next
// waves. Featherweight here: just an HTTP call — no DB or matching logic on this box.
const ESCALATION_TICK_MS = Number(process.env.ESCALATION_TICK_MS) || 5 * 60 * 1000;
if (BOT_API_URL) {
  setInterval(async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (API_KEY) headers['x-api-key'] = API_KEY;
      const res = await fetch(`${BOT_API_URL}/api/escalation-tick`, {
        method: 'POST',
        headers,
        signal: AbortSignal.timeout(20000)
      });
      if (!res.ok) console.warn(`Escalation tick returned ${res.status}`);
    } catch (err) {
      console.warn('Escalation tick failed:', err.message);
    }
  }, ESCALATION_TICK_MS);
  console.log(`Escalation tick every ${ESCALATION_TICK_MS / 1000}s → ${BOT_API_URL}/api/escalation-tick`);
} else {
  console.warn('BOT_API_URL not set — escalation tick disabled');
}

// --- Start ---
const PORT = process.env.WHATSAPP_PORT || 3001;

client.initialize();

app.listen(PORT, () => {
  console.log(`WhatsApp service running on port ${PORT}`);
  console.log('Waiting for QR code...');
});
