import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { OPS_COOKIE, verifySessionToken } from '@/lib/opsAuth';
import { postAssignment } from '@/lib/ops/botApi';
import { missingPostFields } from '@/lib/ops/postAssignment.mjs';

// The Find page's "Post to channel" panel posts here; forwards to the bot so the shared key stays
// server-side. Session-checked (middleware doesn't cover /api).
export async function POST(request) {
  if (!(await verifySessionToken(cookies().get(OPS_COOKIE)?.value))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const missing = missingPostFields(body);
  if (missing.length) {
    return NextResponse.json({ error: 'missing_fields', fields: missing }, { status: 400 });
  }

  try {
    const { title, level, subject, location, rate, frequency, description } = body;
    const result = await postAssignment({ title, level, subject, location, rate, frequency, description });
    revalidatePath('/ops');
    return NextResponse.json(result);
  } catch (err) {
    console.error('ops post-assignment failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
