import { validateConsoleAssignment, sendChannelPost } from '../utils/consoleAssignment.js';
import { connectToDatabase } from '../utils/db.js';
import { Assignment } from '../../../packages/shared/server-exports.js';

// The ops console's "Post to channel". Posts only: outreach stays Pending, so no tutor is contacted.
// POST /api/post-assignment { title, level, subject, location, rate, frequency, description? }
//   → { ok, assignmentId } | 400 { error } | 502 { error: 'channel_post_failed' }

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = validateConsoleAssignment(req.body);
    if (!result.ok) return res.status(400).json({ error: result.error });

    await connectToDatabase();

    // Saved as a Draft first so the Apply button can carry its id; deleted if the post fails.
    const assignment = await new Assignment({ ...result.data, status: 'Draft' }).save();
    // Open in memory before formatting, or the post renders as closed; persisted only once it's sent.
    assignment.status = 'Open';
    let messageId;
    try {
      messageId = await sendChannelPost(assignment);
    } catch (err) {
      console.error('console post: channel send failed:', err.message);
      await Assignment.deleteOne({ _id: assignment._id });
      return res.status(502).json({ error: 'channel_post_failed' });
    }

    assignment.channelMessageId = messageId;
    await assignment.save();

    return res.status(200).json({ ok: true, assignmentId: String(assignment._id) });
  } catch (err) {
    console.error('post-assignment error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
