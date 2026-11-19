// Look up one tutor by name or phone number, e.g. when they message first. Separate from the match search.
export default function LookupForm({ q }) {
  return (
    <form method="get" action="/ops/find" role="search" className="mb-4 flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Look up a tutor by name or number"
        aria-label="Look up a tutor by name or number"
        className="min-w-0 flex-1 rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-default)] focus:border-[var(--color-primary)] focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-gray-100)]"
      >
        Look up
      </button>
    </form>
  );
}
