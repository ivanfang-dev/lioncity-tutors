import express from 'express';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const app = express();
app.use(express.json());

// In-memory map: phone number -> { assignmentId, assignmentTitle, tutorName }
const sentAssignments = new Map();

// Telegram bot details (for notifying admin)
let telegramNotifier = null;

// --- WhatsApp Client Setup ---
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let isReady = false;

client.on('qr', (qr) => {
  console.log('Scan this QR code with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  isReady = true;
  console.log('WhatsApp client is ready!');
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

    await client.sendMessage(chatId, message);

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
    res.status(500).json({ error: err.message });
  }
});

// --- Start ---
const PORT = process.env.WHATSAPP_PORT || 3001;

client.initialize();

app.listen(PORT, () => {
  console.log(`WhatsApp service running on port ${PORT}`);
  console.log('Waiting for QR code...');
});
