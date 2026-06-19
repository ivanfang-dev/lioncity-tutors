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

// In-memory map: phone number -> { assignmentId, assignmentTitle, tutorName }
const sentAssignments = new Map();

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

// Handle incoming messages (for "Yes" replies)
client.on('message', async (message) => {
  const body = message.body?.trim().toLowerCase();
  if (body !== 'yes') return;

  const from = message.from; // format: 65XXXXXXXX@c.us
  const phone = from.replace('@c.us', '');

  const assignment = sentAssignments.get(phone);
  if (!assignment) return;

  try {
    // Reply to tutor
    await message.reply('Thank you! We\'ve noted your interest and will be in touch shortly.');

    // Notify admin via Telegram if configured
    if (telegramNotifier) {
      const { botToken, adminChatId } = telegramNotifier;
      const text = `WhatsApp Reply: *${assignment.tutorName}* (${phone}) replied Yes to assignment *${assignment.assignmentTitle}* (ID: ${assignment.assignmentId})`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text,
          parse_mode: 'Markdown'
        })
      });
    }

    // Remove from map after handling
    sentAssignments.delete(phone);
    console.log(`Tutor ${assignment.tutorName} (${phone}) replied Yes to ${assignment.assignmentId}`);
  } catch (err) {
    console.error('Error handling Yes reply:', err);
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
    // Normalize phone: strip non-digits, ensure 65 prefix
    const digits = phoneNumber.replace(/\D/g, '').replace(/^65/, '');
    const chatId = `65${digits}@c.us`;

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

    // Track this assignment for "Yes" reply handling
    if (assignmentId) {
      sentAssignments.set(`65${digits}`, {
        assignmentId,
        assignmentTitle: assignmentTitle || '',
        tutorName: tutorName || ''
      });
    }

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

// --- Start ---
const PORT = process.env.WHATSAPP_PORT || 3001;

client.initialize();

app.listen(PORT, () => {
  console.log(`WhatsApp service running on port ${PORT}`);
  console.log('Waiting for QR code...');
});
