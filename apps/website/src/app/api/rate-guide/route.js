import { NextResponse } from 'next/server';
import { fetchRateGuide } from '@/lib/ops/botApi';

// Public proxy for the bot's rate-guide endpoint (roadmap Phase 8). The request-tutor form is
// parent-facing and unauthenticated, so this route is intentionally open — but it forwards only the
// aggregate percentile summary (no tutor identities), and the shared bot key stays server-side here
// (the browser only ever sees this same-origin route, never BOT_API_URL/WHATSAPP_API_KEY).
//
// GET /api/rate-guide?level=<str>&location=<str>&type=<str>
//   → { typical: { p25, p50, p75 } | null, sampleSize }
// Best-effort: any failure returns typical:null so the form simply shows no hint (never an error,
// never a gate on posting).

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const level = params.get('level');
  if (!level) return NextResponse.json({ typical: null, sampleSize: 0 });

  try {
    const guide = await fetchRateGuide({
      level,
      location: params.get('location') || undefined,
      type: params.get('type') || undefined,
    });
    // Cache briefly at the edge — the market rate barely moves minute-to-minute.
    return NextResponse.json(guide, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    });
  } catch (err) {
    console.error('rate-guide proxy failed:', err.message);
    return NextResponse.json({ typical: null, sampleSize: 0 });
  }
}
