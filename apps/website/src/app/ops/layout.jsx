// The ops console is an internal tool: never indexed, never cached. Its chrome is deliberately
// plain — this is a workspace, not a marketing surface (SiteChrome keeps the site nav out).
export const metadata = {
  title: 'Ops — LionCity Tutors',
  robots: { index: false, follow: false },
};

// Every view reads live outreach state; a cached render would show the owner a stale queue.
export const dynamic = 'force-dynamic';

export default function OpsLayout({ children }) {
  return <div className="min-h-screen bg-[var(--color-background-subtle)]">{children}</div>;
}
