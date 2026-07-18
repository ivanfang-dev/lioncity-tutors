// Sticky console header. Mobile-first: the primary flow is Telegram ping → deep link → phone,
// so the header stays thin and the back affordance is always reachable with a thumb.
import Link from 'next/link';

export default function OpsHeader({ title = 'Ops', backHref = null, subtitle = null }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="-ml-1 rounded-md px-2 py-1 text-lg leading-none text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-100)]"
          >
            ←
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight text-[var(--color-text-default)]">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>
          )}
        </div>
        <form action="/api/ops/logout" method="post">
          <button
            type="submit"
            className="rounded-md px-2 py-1 text-xs font-medium text-[var(--color-text-tertiary)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text-secondary)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
