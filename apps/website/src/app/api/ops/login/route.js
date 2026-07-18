import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OPS_COOKIE, createSessionToken, sessionCookieOptions, verifyPassword } from '@/lib/opsAuth';

// Exchange the single-operator password for a session cookie. Kept as a route handler (not a
// server action) so the login form works without JS and the redirect target is explicit.
export async function POST(request) {
  const form = await request.formData();
  const password = form.get('password');
  const next = String(form.get('next') || '/ops');

  // Only ever redirect within this site — a crafted ?next= must not become an open redirect.
  const target = next.startsWith('/ops') ? next : '/ops';

  if (!(await verifyPassword(password))) {
    const retry = new URL('/ops/login', request.url);
    retry.searchParams.set('error', '1');
    if (target !== '/ops') retry.searchParams.set('next', target);
    return NextResponse.redirect(retry, { status: 303 });
  }

  cookies().set(OPS_COOKIE, await createSessionToken(), sessionCookieOptions);
  return NextResponse.redirect(new URL(target, request.url), { status: 303 });
}
