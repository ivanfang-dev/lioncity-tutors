import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OPS_COOKIE, verifySessionToken } from '@/lib/opsAuth';
import { recordMessaged, recordReply } from '@/lib/ops/manualContactStore';

// The Find page's chat buttons log a message here; the card's yes/no buttons record the reply.
// { tutorId, label } → messaged · { tutorId, entryId, reply: 'yes'|'no' } → reply. Session-checked.
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

export async function POST(request) {
  if (!(await verifySessionToken(cookies().get(OPS_COOKIE)?.value))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { tutorId, label, entryId, reply } = await request.json().catch(() => ({}));
  if (!OBJECT_ID.test(tutorId || '')) return NextResponse.json({ error: 'bad_tutor' }, { status: 400 });

  try {
    let found;
    if (entryId !== undefined) {
      if (!OBJECT_ID.test(entryId || '') || !['yes', 'no'].includes(reply)) {
        return NextResponse.json({ error: 'bad_reply' }, { status: 400 });
      }
      found = await recordReply(tutorId, entryId, reply);
    } else {
      if (typeof label !== 'string' || !label.trim() || label.length > 200) {
        return NextResponse.json({ error: 'bad_label' }, { status: 400 });
      }
      found = await recordMessaged(tutorId, label.trim());
    }
    return found ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'not_found' }, { status: 404 });
  } catch (err) {
    console.error('ops manual-contact failed:', err.message);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
