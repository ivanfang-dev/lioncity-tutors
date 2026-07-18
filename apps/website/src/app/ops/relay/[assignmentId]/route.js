import { NextResponse } from 'next/server';
import { fetchParentDraft } from '@/lib/ops/botApi';

// The wa.me button's target. Tapping it drafts the parent message (via the bot, through Gemini)
// and bounces straight to WhatsApp with the text pre-filled and addressed — one tap from the queue
// to a message the owner can send.
//
// A redirect rather than a link rendered on the page, because drafting is slow and paying for it
// on every queue render would make the console sluggish for rows the owner never taps. It also
// means the draft is composed at send time, so it reflects the shortlist as it stands now.
//
// GET /ops/relay/<assignmentId>?kind=shortlist|nudge  (behind the ops session — see middleware)
export async function GET(request, { params }) {
  const kind = request.nextUrl.searchParams.get('kind') || 'shortlist';

  try {
    const draft = await fetchParentDraft({ assignmentId: params.assignmentId, kind });

    // No waMeUrl means the draft was too long to ride in a deep link. Send the owner to the copy
    // view instead of silently opening an empty chat.
    if (!draft.waMeUrl) {
      const fallback = new URL(`/ops/relay/${params.assignmentId}/copy`, request.url);
      fallback.searchParams.set('kind', kind);
      return NextResponse.redirect(fallback);
    }

    return NextResponse.redirect(draft.waMeUrl);
  } catch (err) {
    console.error('ops relay failed:', err.message);
    const back = new URL('/ops', request.url);
    back.searchParams.set('error', 'draft_failed');
    return NextResponse.redirect(back);
  }
}
