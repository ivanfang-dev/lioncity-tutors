import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OPS_COOKIE } from '@/lib/opsAuth';

export async function POST(request) {
  cookies().delete(OPS_COOKIE);
  return NextResponse.redirect(new URL('/ops/login', request.url), { status: 303 });
}
