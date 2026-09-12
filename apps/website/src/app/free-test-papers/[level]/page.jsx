import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { GuideCTA, ICON_STROKE } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import { getAllPapers, getPaperGroups } from '@/lib/papers/registry.mjs';

const SITE_URL = 'https://www.lioncitytutors.com';

// The library renders papers inside tabs, and an inactive tab is not in the
// HTML, so most papers never reach a crawler from the shelf. These level indexes
// are the flat version, and the crawl path to every group page.
const LEVELS = {
  primary: {
    label: 'Primary',
    title: 'Free PSLE & Primary School Test Papers',
    blurb:
      'Every primary paper in the library, from P5 to P6, grouped by subject and exam. Prelims, SA and WA papers from Singapore schools — all free to download.',
  },
  secondary: {
    label: 'Secondary',
    title: 'Free O-Level & Secondary School Test Papers',
    blurb:
      'Every secondary paper in the library, grouped by subject and exam. School prelim papers across E-Math, A-Math, the sciences and the humanities — all free to download.',
  },
  jc: {
    label: 'Junior College',
    title: 'Free JC & A-Level Prelim Papers',
    blurb:
      'Every JC paper in the library, grouped by subject. H2 prelim papers from the top junior colleges, plus General Paper — all free to download.',
  },
};

export function generateStaticParams() {
  return Object.keys(LEVELS).map((level) => ({ level }));
}

export async function generateMetadata({ params }) {
  const { level } = await params;
  const meta = LEVELS[level];
  if (!meta) return {};

  const count = getAllPapers().filter((p) => p.level === level).length;
  const description = `${count} free ${meta.label.toLowerCase()} exam papers from Singapore schools, sorted by subject and exam. No payment, no subscription.`;
  const url = `${SITE_URL}/free-test-papers/${level}`;

  return {
    title: meta.title,
    description,
    openGraph: { title: meta.title, description, url, type: 'website' },
    alternates: { canonical: url },
  };
}

export default async function LevelIndexPage({ params }) {
  const { level } = await params;
  const meta = LEVELS[level];
  if (!meta) notFound();

  const papers = getAllPapers().filter((p) => p.level === level);
  const groups = getPaperGroups().filter((g) => g.level === level);

  // Subject → the group pages under it, newest year first.
  const bySubject = new Map();
  for (const group of groups) {
    if (!bySubject.has(group.subject)) bySubject.set(group.subject, []);
    bySubject.get(group.subject).push(group);
  }
  for (const list of bySubject.values()) {
    list.sort((a, b) => b.year - a.year || a.examLabel.localeCompare(b.examLabel));
  }

  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Free Test Papers', url: '/free-test-papers' },
          { name: `${meta.label} papers`, url: `/free-test-papers/${level}` },
        ]}
        collection={{
          url: `/free-test-papers/${level}`,
          name: meta.title,
          description: meta.blurb,
          items: groups.map((g) => ({ name: g.heading, url: g.url })),
        }}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-10">
          <nav aria-label="Breadcrumb">
            <Link
              href="/free-test-papers"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0474BA]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
              All free test papers
            </Link>
          </nav>

          <header className="space-y-4">
            <h1 className="page-title text-primary text-balance">{meta.title}</h1>
            <p className="text-lg text-gray-700 leading-relaxed text-pretty">{meta.blurb}</p>
            <p className="text-sm font-semibold text-gray-600">
              <span className="tabular-nums">{papers.length}</span> papers in this section
            </p>
          </header>

          <div className="space-y-10">
            {[...bySubject.entries()].map(([subject, subjectGroups]) => (
              <section key={subject} className="space-y-3">
                <h2 className="flex items-center gap-1.5 text-xl font-bold text-gray-900">
                  <FileText className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  {subject}
                </h2>
                <ul className="space-y-2">
                  {subjectGroups.map((group) => (
                    <li key={group.slug}>
                      <Link
                        href={group.url}
                        className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-primary"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {group.year} {group.examLabel}
                          <span className="text-gray-600">
                            {' '}&middot; <span className="tabular-nums">{group.papers.length}</span>{' '}
                            {group.papers.length === 1 ? 'paper' : 'papers'} from{' '}
                            <span className="tabular-nums">{group.schools.length}</span>{' '}
                            {group.schools.length === 1 ? 'school' : 'schools'}
                          </span>
                        </span>
                        <ArrowRight
                          className="h-4 w-4 flex-shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                          strokeWidth={ICON_STROKE}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <GuideCTA
            title="Papers only take you so far"
            description={`Tell us the subject and the grade you are aiming for. We hand-match a vetted tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
            buttonText="Find a tutor"
            whatsappHref={`https://wa.me/6588701152?text=${encodeURIComponent(
              `Hi LionCity Tutors! I've been using your free ${meta.label.toLowerCase()} test papers and I'd like help finding a tutor.\n\nStudent level:\nSubject:\nLocation:\nPreferred days & timing: `,
            )}`}
          />
        </div>
      </div>
    </>
  );
}
