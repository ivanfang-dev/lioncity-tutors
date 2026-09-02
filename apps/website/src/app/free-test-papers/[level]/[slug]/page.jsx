import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, School, CalendarDays, BookOpen } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { GuideCTA, ICON_STROKE } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import { getAllPapers, getPaperBySlug, getRelatedPapers } from '@/lib/papers/registry.mjs';
import PaperDownloadPanel from './PaperDownloadPanel';

const SITE_URL = 'https://www.lioncitytutors.com';

// Prefilled so the reply names the paper the parent was just looking at.
function whatsappHrefFor(paper) {
  const message = `Hi LionCity Tutors! I was looking at the ${paper.school} ${paper.shortSubject} ${paper.year} ${paper.examLabel} paper and I'd like help finding a tutor.

Student level: ${paper.subject}
Subject: ${paper.subject}
Location:
Preferred days & timing: `;
  return `https://wa.me/6588701152?text=${encodeURIComponent(message)}`;
}

export function generateStaticParams() {
  return getAllPapers().map((paper) => ({ level: paper.level, slug: paper.slug }));
}

export async function generateMetadata({ params }) {
  const { level, slug } = await params;
  const paper = getPaperBySlug(level, slug);
  if (!paper) return {};

  const title = `${paper.school} ${paper.shortSubject} ${paper.year} ${paper.examLabel} ${
    paper.isSolutions ? 'Solutions' : 'Paper'
  }`;
  const url = `${SITE_URL}${paper.url}`;

  return {
    title: `${title} — Free Download`,
    description: paper.description,
    openGraph: { title, description: paper.description, url, type: 'article' },
    alternates: { canonical: url },
  };
}

export default async function PaperPage({ params }) {
  const { level, slug } = await params;
  const paper = getPaperBySlug(level, slug);
  if (!paper) notFound();

  const related = getRelatedPapers(paper);
  const heading = `${paper.school} ${paper.shortSubject} ${paper.year} ${paper.examLabel} ${
    paper.isSolutions ? 'Worked Solutions' : 'Paper'
  }`;

  const learningResource = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: paper.title,
    description: paper.description,
    url: `${SITE_URL}${paper.url}`,
    learningResourceType: paper.isSolutions ? 'Worked solutions' : 'Exam paper',
    educationalLevel: paper.subject,
    educationalUse: 'Exam preparation',
    inLanguage: 'en-SG',
    isAccessibleForFree: true,
    encodingFormat: 'application/pdf',
    about: { '@type': 'Thing', name: paper.subject },
    provider: { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL },
  };

  const facts = [
    { icon: School, label: 'School', value: paper.school },
    { icon: BookOpen, label: 'Subject', value: paper.subject },
    { icon: FileText, label: 'Exam', value: paper.examLabel },
    { icon: CalendarDays, label: 'Year', value: String(paper.year) },
  ];

  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Free Test Papers', url: '/free-test-papers' },
          { name: `${paper.levelLabel} papers`, url: `/free-test-papers/${paper.level}` },
          { name: heading, url: paper.url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
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
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">
              {paper.levelLabel} &middot; {paper.examLabel} {paper.year}
            </p>
            <h1 className="page-title text-gray-900 text-balance">{heading}</h1>
            <p className="text-lg text-gray-700 leading-relaxed text-pretty">
              {paper.isSolutions
                ? `Full worked solutions for the ${paper.school} ${paper.shortSubject} ${paper.year} ${paper.examLabel} paper.`
                : `The ${paper.school} ${paper.year} ${paper.examLabel} paper for ${paper.subject}, exactly as it was sat.`}{' '}
              {paper.hasAnswers && !paper.isSolutions ? 'Answers are included. ' : ''}
              Free to download — no payment, no subscription.
            </p>
          </header>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white p-4">
                <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <Icon className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>

          <PaperDownloadPanel paper={paper} />

          <section aria-labelledby="about-paper" className="space-y-3">
            <h2 id="about-paper" className="text-xl font-bold text-gray-900">
              What&apos;s in this paper
            </h2>
            <p className="text-gray-700 leading-relaxed text-pretty">
              This is the {paper.year} {paper.examLabel} {paper.subject} paper set by {paper.school}.
              School papers run ahead of the textbook and are pitched harder than the national exam,
              which is exactly what makes them worth timing yourself against. Sit it under exam
              conditions first, mark it honestly, then work back through everything you lost marks on.
            </p>
            <p className="text-gray-700 leading-relaxed text-pretty">
              Every paper in this library is free. Nothing is behind a paywall and nothing expires.
            </p>
          </section>

          {related.length > 0 && (
            <section aria-labelledby="related-papers" className="space-y-4">
              <h2 id="related-papers" className="text-xl font-bold text-gray-900">
                More {paper.subject} papers
              </h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={item.url}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-[#0474BA]"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {item.school} {item.year} {item.examLabel}
                        {item.isSolutions ? ' — Solutions' : ''}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 flex-shrink-0 text-[#0474BA] transition-transform group-hover:translate-x-0.5"
                        strokeWidth={ICON_STROKE}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/free-test-papers/${paper.level}`}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#0474BA]"
              >
                Browse every {paper.levelLabel.toLowerCase()} paper
                <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </Link>
            </section>
          )}

          <GuideCTA
            title={`Stuck on ${paper.subject}?`}
            description={`Tell us where the marks are going. We hand-match a vetted ${paper.subject} tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
            buttonText="Find a tutor for this subject"
            whatsappHref={whatsappHrefFor(paper)}
          />
        </div>
      </div>
    </>
  );
}
