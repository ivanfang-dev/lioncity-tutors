import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { OPS_COOKIE, verifySessionToken } from '@/lib/opsAuth';
import { recoverAssignment } from '@/lib/ops/botApi';

// The console's recovery buttons (widen / raise ceiling / relax type & retry) post here; this
// forwards to the bot's /api/recover so the mutation + retry wave run through the same code path as
// everything else. Thin proxy — keeps the shared bot secret server-side. Session-checked (this route
// sits under /api, which middleware doesn't cover).
export async function POST(request) {
  if (!(await verifySessionToken(cookies().get(OPS_COOKIE)?.value))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { assignmentId, action, amount } = await request.json();

  try {
    const result = await recoverAssignment({ assignmentId, action, amount });
    // The assignment's outreach state just changed — drop the cached queue render so the row updates.
    revalidatePath('/ops');
    revalidatePath(`/ops/assignment/${assignmentId}`);
    return NextResponse.json(result);
  } catch (err) {
    console.error('ops recover failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
