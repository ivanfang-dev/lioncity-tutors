import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, School, CalendarDays, BookOpen, FileText } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { GuideCTA, ICON_STROKE } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import { getPaperGroups, getGroupBySlug } from '@/lib/papers/registry.mjs';
import GroupDownload from './GroupDownload';

const SITE_URL = 'https://www.lioncitytutors.com';

/**
 * What to actually do with the papers, by exam type — a prelim is revision under
 * pressure, a WA is a topic check six months earlier, and they are not used the
 * same way. One shared paragraph across all 37 groups would also be 70 words of
 * pure duplication on pages whose whole purpose is to be distinguishable.
 */
function adviceFor(group) {
  const exam = group.examLabel.toLowerCase();
  const national = { primary: 'the PSLE', secondary: 'the O-Levels', jc: 'the A-Levels' }[group.level];

  if (exam.startsWith('prelim')) {
    return `Prelims are the last full rehearsal before ${national}, and schools pitch them harder than the national paper on purpose. Sit one to time, in one sitting, before looking at any answers — a prelim done in pieces tells you nothing about pacing, which is what most marks are lost to. Then compare two schools' ${group.year} papers: topics that appear in both are near-certain, and topics in only one are usually that school's habit.`;
  }
  if (exam.startsWith('wa')) {
    return `Weighted assessments cover a short stretch of the syllabus, so these are diagnostic rather than rehearsal. Use them while the topic is still being taught: work one, mark it the same day, and treat every wrong answer as a gap to close before the class moves on. They are far more useful in ${group.year} term time than saved for the revision period, when the topic is cold.`;
  }
  if (exam.startsWith('sa')) {
    return `Semestral assessments cover a whole half-year, which makes them the closest thing to a real exam a student sees before ${national}. Work one under timed conditions to find out which topics have faded since they were taught — that is the value here, rather than the score. Anything missed is revision that has to happen now, not in the final weeks.`;
  }
  return `Work one paper under timed conditions before looking at any answers, mark it honestly, then work back through every mark lost. Comparing two schools' ${group.year} papers shows which topics are examined everywhere and which are one school's habit.`;
}

// Prefilled so the reply names what the parent was just looking at.
function whatsappHrefFor(group) {
  const message = `Hi LionCity Tutors! I was looking at the ${group.shortSubject} ${group.year} ${group.examLabel} papers and I'd like help finding a tutor.

Student level: ${group.subject}
Subject: ${group.subject}
Location:
Preferred days & timing: `;
  return `https://wa.me/6588701152?text=${encodeURIComponent(message)}`;
}

export function generateStaticParams() {
  return getPaperGroups().map((group) => ({ level: group.level, slug: group.slug }));
}

export async function generateMetadata({ params }) {
  const { level, slug } = await params;
  const group = getGroupBySlug(level, slug);
  if (!group) return {};

  const title = `${group.shortSubject} ${group.year} ${group.examLabel} Papers — Free Download`;
  const url = `${SITE_URL}${group.url}`;

  return {
    title,
    description: group.description,
    openGraph: { title, description: group.description, url, type: 'website' },
    alternates: { canonical: url },
  };
}

export default async function PaperGroupPage({ params }) {
  const { level, slug } = await params;
  const group = getGroupBySlug(level, slug);
  if (!group) notFound();

  // Other exams and years for the same subject — the useful sideways move.
  const related = getPaperGroups()
    .filter((g) => g.slug !== group.slug && g.subject === group.subject)
    .sort((a, b) => b.year - a.year)
    .slice(0, 6);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: group.heading,
    description: group.description,
    url: `${SITE_URL}${group.url}`,
    numberOfItems: group.papers.length,
    itemListElement: group.papers.map((paper, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LearningResource',
        name: paper.title,
        learningResourceType: paper.isSolutions ? 'Worked solutions' : 'Exam paper',
        educationalLevel: group.subject,
        educationalUse: 'Exam preparation',
        inLanguage: 'en-SG',
        isAccessibleForFree: true,
        encodingFormat: 'application/pdf',
        provider: { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL },
      },
    })),
  };

  const facts = [
    { icon: BookOpen, label: 'Subject', value: group.subject },
    { icon: FileText, label: 'Exam', value: group.examLabel },
    { icon: CalendarDays, label: 'Year', value: String(group.year) },
    { icon: School, label: 'Schools', value: String(group.schools.length) },
  ];

  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Free Test Papers', url: '/free-test-papers' },
          { name: `${group.levelLabel} papers`, url: `/free-test-papers/${group.level}` },
          { name: group.heading, url: group.url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
          <nav aria-label="Breadcrumb">
            <Link
              href={`/free-test-papers/${group.level}`}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
              All {group.levelLabel.toLowerCase()} papers
            </Link>
          </nav>

          <header className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">
              {group.levelLabel} &middot; {group.examLabel} {group.year}
            </p>
            <h1 className="page-title text-gray-900 text-balance">{group.heading}</h1>
            <p className="text-lg leading-relaxed text-gray-700 text-pretty">
              <span className="tabular-nums">{group.papers.length}</span>{' '}
              {group.papers.length === 1 ? 'paper' : 'papers'} for {group.subject}, as sat in{' '}
              {group.year} at {group.schools.length === 1 ? '' : 'schools including '}
              {group.schools.slice(0, 3).join(', ')}
              {group.schools.length > 3 ? ' and others' : ''}. Free to download — no payment, no
              subscription.
            </p>
          </header>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white p-4">
                <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  <Icon className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="papers" className="space-y-4">
            <h2 id="papers" className="text-xl font-bold text-gray-900">
              Download the papers
            </h2>
            <GroupDownload group={group} />
          </section>

          <section aria-labelledby="how-to-use" className="space-y-3">
            <h2 id="how-to-use" className="text-xl font-bold text-gray-900">
              How to get the most from these
            </h2>
            <p className="leading-relaxed text-gray-700 text-pretty">
              {adviceFor(group)}
            </p>
          </section>

          {related.length > 0 && (
            <section aria-labelledby="related" className="space-y-4">
              <h2 id="related" className="text-xl font-bold text-gray-900">
                Other {group.subject} papers
              </h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.url}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-primary"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {item.year} {item.examLabel}
                        <span className="text-gray-600">
                          {' '}&middot; <span className="tabular-nums">{item.papers.length}</span>{' '}
                          {item.papers.length === 1 ? 'paper' : 'papers'}
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
          )}

          <GuideCTA
            title={`Stuck on ${group.subject}?`}
            description={`Tell us where the marks are going. We hand-match a vetted ${group.subject} tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
            buttonText="Find a tutor for this subject"
            whatsappHref={whatsappHrefFor(group)}
          />
        </div>
      </div>
    </>
  );
}
