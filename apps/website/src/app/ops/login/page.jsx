// Plain form posting to the login route handler — no JS needed, so a cold phone load can sign in
// as fast as the network allows. Middleware bounces authed visitors away from here.
export default function OpsLoginPage({ searchParams }) {
  const failed = searchParams?.error === '1';
  const next = typeof searchParams?.next === 'string' ? searchParams.next : '';

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form action="/api/ops/login" method="post" className="w-full max-w-xs">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--color-text-default)]">Ops console</h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">Sign in to continue.</p>

        {next && <input type="hidden" name="next" value={next} />}

        <label htmlFor="password" className="mt-6 block text-sm font-medium text-[var(--color-text-secondary)]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-describedby={failed ? 'login-error' : undefined}
          className="mt-1.5 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-base text-[var(--color-text-default)] outline-none focus-visible:border-[var(--color-accent-fill)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-fill)]/40"
        />

        {failed && (
          <p id="login-error" role="alert" className="mt-2 text-sm text-[var(--color-error)]">
            Incorrect password.
          </p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition-colors hover:bg-[#03649f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-fill)]"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
