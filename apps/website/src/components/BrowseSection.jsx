import Link from 'next/link';
import { levels, subjects, resources } from '@/data/navigation';

// Levels flatten their O/N-Level children so every page is one tap away.
const GROUPS = [
  {
    title: 'By level',
    className: 'lg:col-span-4',
    links: levels.flatMap((l) => [{ name: l.name, path: l.path }, ...(l.submenu ?? [])]),
  },
  { title: 'By subject', links: subjects, twoUp: true, className: 'sm:order-last sm:col-span-2 lg:order-none lg:col-span-5' },
  { title: 'Free for students', links: resources, className: 'lg:col-span-3' },
];

/**
 * The page's closing index: every level, subject and free resource as plain links.
 * On phones the subject list goes two-up so the whole index stays short.
 */
export default function BrowseSection() {
  return (
    <section className="section-padding-sm border-t border-gray-200 bg-background-default">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="section-title text-gray-900">Find tutors by level or subject</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-16">
          {GROUPS.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className={group.className}
            >
              <h3 className="border-b border-gray-200 pb-3 text-sm font-semibold text-gray-500">{group.title}</h3>
              <ul className={`mt-2 ${group.twoUp ? 'grid grid-cols-2 gap-x-6' : ''}`}>
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="flex min-h-11 items-center text-gray-800 underline-offset-4 transition-colors duration-200 hover:text-primary-deep hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </section>
  );
}
