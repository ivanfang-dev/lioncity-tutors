// Auth for the ops console (/ops). Single-operator: one credential in OPS_PASSWORD, exchanged
// for an httpOnly signed session cookie that middleware checks on every /ops request. No
// secret-URL auth — the console shows parent phone numbers and tutor contact details (PII).
//
// Uses Web Crypto (not node:crypto) throughout: middleware runs on the Edge runtime, and this
// module is imported from both there and from Node route handlers.

export const OPS_COOKIE = 'ops_session';
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 14; // 14 days — the owner shouldn't re-login daily on a phone

// The signing secret. OPS_SESSION_SECRET is preferred; falling back to OPS_PASSWORD keeps setup
// to one env var, at the cost of invalidating live sessions when the password is rotated (fine —
// that's the desirable behaviour anyway).
function sessionSecret() {
  const secret = process.env.OPS_SESSION_SECRET || process.env.OPS_PASSWORD;
  if (!secret) throw new Error('OPS_PASSWORD (or OPS_SESSION_SECRET) must be set to use /ops');
  return secret;
}

const encoder = new TextEncoder();

function b64urlEncode(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmac(message) {
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(sessionSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

// Length-independent equality — compares digests, so an attacker can't learn anything by timing
// (Edge has no crypto.timingSafeEqual).
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// Compare a submitted password against OPS_PASSWORD without leaking length or match position:
// both sides are hashed first, so the comparison is always over 32 fixed-length bytes.
export async function verifyPassword(submitted) {
  const expected = process.env.OPS_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(submitted ?? ''))),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  return safeEqual(new Uint8Array(a), new Uint8Array(b));
}

// `<payload>.<signature>` where payload carries only an expiry — there's one operator, so the
// session needs no identity, just proof it was issued by us and hasn't aged out.
export async function createSessionToken(now = Date.now()) {
  const payload = b64urlEncode(encoder.encode(JSON.stringify({ exp: Math.floor(now / 1000) + SESSION_MAX_AGE_S })));
  return `${payload}.${b64urlEncode(await hmac(payload))}`;
}

export async function verifySessionToken(token, now = Date.now()) {
  if (!token || typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  try {
    if (!safeEqual(b64urlDecode(signature), await hmac(payload))) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    return typeof exp === 'number' && exp * 1000 > now;
  } catch {
    return false; // malformed cookie — treat as unauthenticated rather than throwing into middleware
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE_S,
};
