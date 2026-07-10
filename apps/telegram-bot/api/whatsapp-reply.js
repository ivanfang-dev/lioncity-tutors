import { recordTutorReply } from '../utils/recordTutorReply.js';

// Legacy reply endpoint: the whatsapp-web.js service (VM) parses a tutor's Yes/No and POSTs
// { phone, reply } here. Kept working during the Cloud API migration; once the VM is retired
// the Meta webhook (/api/whatsapp-webhook) becomes the sole entry point. Both share
// recordTutorReply() so the matching/alert logic can never drift between the two.
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    // Shared-secret auth: same key the WhatsApp /send endpoint already uses.
    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { phone, reply } = req.body || {};
    const result = await recordTutorReply(phone, reply);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('whatsapp-reply error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
