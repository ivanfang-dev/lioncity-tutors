import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { OPS_COOKIE, verifySessionToken } from '@/lib/opsAuth';
import { recordCheckIn } from '@/lib/ops/botApi';

// The console's day-30 check-in buttons post here; this forwards to the bot's recorder. A thin proxy
// on purpose (like /api/ops/outcome): it keeps the shared bot secret on the server and records
// through the exact same code path as the Telegram check-in buttons, so the two surfaces can't drift.
//
// This route sits under /api, which middleware doesn't cover, so it checks the session itself.
export async function POST(request) {
  if (!(await verifySessionToken(cookies().get(OPS_COOKIE)?.value))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { outcome, placementId, rating, endReason } = await request.json();

  try {
    const result = await recordCheckIn({ outcome, placementId, rating, endReason });
    // The check-in queue is derived from placement state that just changed — drop the cached render
    // so the row disappears on the refresh.
    revalidatePath('/ops');
    return NextResponse.json(result);
  } catch (err) {
    console.error('ops checkin failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
