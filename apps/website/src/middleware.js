import { NextResponse } from 'next/server';
import { OPS_COOKIE, verifySessionToken } from '@/lib/opsAuth';

// Gate the whole ops console behind the session cookie. The matcher scopes this to /ops only —
// the public marketing site never runs through here.
export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const authed = await verifySessionToken(request.cookies.get(OPS_COOKIE)?.value);

  // Already signed in and hitting the login page → straight to the console.
  if (pathname === '/ops/login') {
    return authed ? NextResponse.redirect(new URL('/ops', request.url)) : NextResponse.next();
  }

  if (authed) return NextResponse.next();

  // Preserve where they were headed (a Telegram deep link lands on /ops#<id>) so login can
  // return them there. Fragments never reach the server, but the path/query survive.
  const login = new URL('/ops/login', request.url);
  if (pathname !== '/ops') login.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/ops', '/ops/:path*'],
};
