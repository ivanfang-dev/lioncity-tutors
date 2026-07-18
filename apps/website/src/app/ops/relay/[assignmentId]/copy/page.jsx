import Link from 'next/link';
import OpsHeader from '../../../OpsHeader';
import { fetchParentDraft } from '@/lib/ops/botApi';

// The paste fallback for drafts too long to carry in a wa.me deep link (~2KB). Rare, but a
// shortlist of three verbose profiles can get there, and the owner still needs to send it.
export default async function RelayCopyPage({ params, searchParams }) {
  const kind = searchParams?.kind || 'shortlist';

  let draft = null;
  let error = null;
  try {
    draft = await fetchParentDraft({ assignmentId: params.assignmentId, kind });
  } catch (err) {
    error = err.message;
  }

  return (
    <>
      <OpsHeader title="Send to parent" backHref="/ops" />
      <div className="mx-auto max-w-3xl px-4 py-6">
        {error && (
          <p className="rounded-lg border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-error)]">
            Couldn’t draft the message: {error}
          </p>
        )}

        {draft && (
          <>
            <p className="text-sm text-[var(--color-text-secondary)]">
              This draft is too long for a one-tap link. Copy it, then open the chat with{' '}
              <span className="font-medium text-[var(--color-text-default)]">{draft.parentContact}</span>.
            </p>

            <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-white p-4 text-sm leading-relaxed text-[var(--color-text-default)]">
              {draft.text}
            </pre>

            <Link
              href={draft.chatUrl}
              className="mt-4 block rounded-md bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Open WhatsApp chat
            </Link>
          </>
        )}
      </div>
    </>
  );
}
