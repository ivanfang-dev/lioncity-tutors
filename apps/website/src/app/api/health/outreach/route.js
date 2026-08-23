import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongoose';
import { Assignment, Meta } from '@lioncity/shared/server-exports.js';
import { assessOutreachHealth, formatHealthAlert } from '@lioncity/shared/utils/outreachHealth.js';

// Outreach watchdog. The escalation tick is the only thing that releases a held shortlist, so when
// it stops, parents silently stop receiving tutors — and nothing surfaces that.
//
// This lives on the WEBSITE deployment on purpose. On 2026-08-23 a bad commit made the bot's
// functions fail at module load; every bot endpoint 500'd for ~16h and no one noticed. A watchdog
// hosted there would have been just as dead. Different Vercel project = different failure domain.
// It talks to Telegram directly rather than through the bot for the same reason.
export const dynamic = 'force-dynamic';

// A wave is due this long after the last one; past this an Active assignment is being neglected.
const WAVE_INTERVAL_MS = Number(process.env.OUTREACH_WAVE_INTERVAL_MS) || 30 * 60 * 1000;

async function sendTelegram(text) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.WHATSAPP_ALERT_CHAT_ID || process.env.ADMIN_USERS?.split(',')[0]?.trim();
  if (!botToken || !chatId) {
    console.warn('outreach watchdog: BOT_TOKEN or admin chat id not set — alert skipped');
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
    if (!res.ok) console.error('outreach watchdog: Telegram send failed', res.status);
    return res.ok;
  } catch (err) {
    console.error('outreach watchdog: Telegram send threw', err.message);
    return false;
  }
}

export async function GET(request) {
  // Vercel signs its own cron calls; anything else needs the shared secret. Without CRON_SECRET
  // set this is a read-only health summary, which is harmless to leave open.
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');
  const isVercelCron = auth === `Bearer ${secret}`;
  if (secret && !isVercelCron) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const now = new Date();

    const [meta, holdingOverdue, wavesOverdue] = await Promise.all([
      Meta.findOne({ key: 'escalationTick' }).select('lastRunAt').lean(),
      // Held past the window the tick was supposed to release them in.
      Assignment.countDocuments({
        'outreach.status': 'Holding',
        'outreach.holdUntil': { $lte: now },
      }),
      Assignment.countDocuments({
        status: 'Open',
        'outreach.status': 'Active',
        'outreach.lastWaveAt': { $lte: new Date(now.getTime() - WAVE_INTERVAL_MS * 4) },
      }),
    ]);

    const assessment = assessOutreachHealth(
      { lastTickAt: meta?.lastRunAt ?? null, holdingOverdue, wavesOverdue },
      now
    );

    const alert = formatHealthAlert(assessment);
    let alerted = false;
    if (alert) alerted = await sendTelegram(alert);

    return NextResponse.json({
      healthy: assessment.healthy,
      problems: assessment.problems,
      lastTickAt: meta?.lastRunAt ?? null,
      tickAgeMs: assessment.tickAgeMs,
      holdingOverdue,
      wavesOverdue,
      alerted,
    }, { status: assessment.healthy ? 200 : 503 });
  } catch (err) {
    console.error('outreach watchdog failed:', err);
    // The watchdog failing is itself worth knowing about — say so out loud rather than 200-ing.
    await sendTelegram(`🚨 *Outreach watchdog* could not run: ${err.message}`);
    return NextResponse.json({ error: 'watchdog_failed', message: err.message }, { status: 500 });
  }
}
