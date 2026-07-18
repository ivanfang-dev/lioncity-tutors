import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { OPS_COOKIE, verifySessionToken } from '@/lib/opsAuth';
import { recordOutcome } from '@/lib/ops/botApi';

// The console's outcome buttons post here; this forwards to the bot's recorder. A thin proxy on
// purpose — it keeps the shared bot secret on the server (the browser only ever sees this route)
// and means the console records outcomes through the exact same code path as the Telegram buttons.
//
// This route sits under /api, which middleware doesn't cover, so it checks the session itself.
export async function POST(request) {
  if (!(await verifySessionToken(cookies().get(OPS_COOKIE)?.value))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { outcome, assignmentId, tutorId, reason } = await request.json();

  try {
    const result = await recordOutcome({ outcome, assignmentId, tutorId, reason });
    // The queue is derived from outreach state that just changed — drop the cached render so the
    // row disappears on the redirect back.
    revalidatePath('/ops');
    revalidatePath(`/ops/assignment/${assignmentId}`);
    return NextResponse.json(result);
  } catch (err) {
    console.error('ops outcome failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
