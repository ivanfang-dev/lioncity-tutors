import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import GuideSchema from '@/components/seo/GuideSchema';
import { GuideCTA, SectionHeading, ICON_STROKE } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import { GraduationCap, BookOpen, School } from 'lucide-react';

export const metadata = {
  title: 'How to Study for Every Singapore Exam Subject',
  description:
    'Study guides built from the published syllabuses — where the marks sit in each paper, what you are handed in the exam hall, and the mistakes that cost most.',
  keywords: [
    'how to study singapore',
    'how to study for o levels',
    'how to study for psle',
    'how to study for a levels',
    'exam marks breakdown Singapore',
    'SEAB syllabus study guide',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for Every Singapore Exam Subject',
    description:
      'Where the marks actually sit in each paper, what you are handed in the exam hall, and the mistakes that cost most — one guide per subject.',
    url: 'https://www.lioncitytutors.com/how-to-study',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study',
  },
};

/**
 * The series index. Each card leads with the one fact from that subject's
 * syllabus that changes how it should be revised — the whole point of the
 * series is that these are published and almost nobody reads them.
 */
const levels = [
  {
    id: 'psle',
    label: 'PSLE',
    icon: School,
    blurb: 'Primary 6, four core subjects, all four syllabuses published by SEAB.',
    guides: [
      { title: 'PSLE Maths', href: '/how-to-study/psle-math', hook: 'A wrong short answer still earns 1 of 2 marks if the method is there — and Booklet B has twelve of them.' },
      { title: 'PSLE Science', href: '/how-to-study/psle-science', hook: 'Sixty of the hundred marks are multiple choice, with no method mark to soften a wrong one.' },
      { title: 'PSLE English', href: '/how-to-study/psle-english', hook: 'Oral is 40 marks in about ten minutes — the densest marks in the exam.' },
      { title: 'PSLE Chinese', href: '/how-to-study/psle-chinese', hook: '口试 is a quarter of the grade, and a dictionary is permitted in the writing paper.' },
    ],
  },
  {
    id: 'o-level',
    label: 'O-Level',
    icon: BookOpen,
    blurb: 'Secondary 4 and 5, across the sciences, both maths papers, English and History.',
    guides: [
      { title: 'O-Level English', href: '/how-to-study/o-level-english', hook: 'Oral is 20% of the grade, and one listening section is played only once.' },
      { title: 'O-Level A-Math', href: '/how-to-study/o-level-a-math', hook: 'The printed formula list covers algebra and trigonometry — and no calculus at all.' },
      { title: 'O-Level E-Math', href: '/how-to-study/o-level-e-math', hook: 'The formula sheet gives you cones and spheres but not the quadratic formula.' },
      { title: 'O-Level Chemistry', href: '/how-to-study/o-level-chemistry', hook: 'The qualitative analysis notes are printed in Paper 3 and not in Paper 2.' },
      { title: 'O-Level Physics', href: '/how-to-study/o-level-physics', hook: 'Only about 15% of the theory marks are allocated to recall.' },
      { title: 'O-Level Biology', href: '/how-to-study/o-level-biology', hook: 'Most theory marks are for handling information, not for knowing content.' },
      { title: 'O-Level History', href: '/how-to-study/o-level-history', hook: 'Each source question type wants a different shape of answer.' },
    ],
  },
  {
    id: 'a-level',
    label: 'A-Level',
    icon: GraduationCap,
    blurb: 'H1 and H2 subjects, where the heaviest paper is rarely the one students drill.',
    guides: [
      { title: 'General Paper', href: '/how-to-study/general-paper', hook: 'Paper 2 language marks are awarded on the summary and application answers only.' },
      { title: 'H2 Maths', href: '/how-to-study/h2-maths', hook: 'A wrong answer with no working scores nothing — but calculator evidence can earn method marks.' },
      { title: 'H2 Chemistry', href: '/how-to-study/h2-chemistry', hook: 'Paper 3 carries 35% of the grade. Paper 1, the multiple choice, carries 15%.' },
      { title: 'H2 Physics', href: '/how-to-study/h2-physics', hook: 'The practical requires processing data with spreadsheet software.' },
      { title: 'H2 Biology', href: '/how-to-study/h2-biology', hook: 'Paper 3 is built on journal extracts that need not relate to the syllabus.' },
      { title: 'H2 Economics', href: '/how-to-study/h2-economics', hook: 'Questions including evaluation are about 60% of the marks on both papers.' },
    ],
  },
];

const total = levels.reduce((n, l) => n + l.guides.length, 0);

export default function HowToStudyIndex() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a tutor.

Student level:
Subject(s):
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'How to Study', url: '/how-to-study' },
        ]}
        article={{
          headline: 'How to Study for Every Singapore Exam Subject',
          description:
            'Study guides built from the published syllabuses — where the marks sit in each paper, what you are handed in the exam hall, and the mistakes that cost most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-29',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.22em] uppercase text-primary mb-4">
            PSLE · O-Level · A-Level
          </p>
          <h1 className="text-gray-900 mb-6">How to Study</h1>
          <p className="text-lg text-gray-800 leading-relaxed text-pretty">
            Every Singapore exam publishes how its marks are divided, what reference material you are handed in the hall, and which skills are actually assessed. Almost nobody reads those documents — so revision routinely aims at the smallest part of the paper.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed text-pretty">
            These {total} guides are written from the syllabuses themselves. Each one covers where the marks sit, what you are given, and the mistakes our tutors correct most often.
          </p>
        </header>

        <div className="mt-14 space-y-14">
          {levels.map((level) => (
            <section key={level.id} id={level.id} className="scroll-mt-24">
              <SectionHeading icon={level.icon}>{level.label}</SectionHeading>
              <p className="text-gray-700 mb-6 text-pretty">{level.blurb}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {level.guides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">{guide.hook}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Read the guide
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Practise on the real thing</h2>
          <p className="text-gray-700 text-pretty">
            Every guide here says the same thing about revision: unseen questions beat rereading notes. Our{' '}
            <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>{' '}
            holds school prelim and past-year papers across all three levels, and the{' '}
            <Link href="/free-notes" className="text-primary underline underline-offset-2">free notes library</Link>{' '}
            has revision material for a growing set of subjects. Both are free to download.
          </p>
          <p className="mt-3 text-gray-700 text-pretty">
            For subject coverage rather than exam technique, the{' '}
            <Link href="/guides" className="text-primary underline underline-offset-2">exam guides hub</Link>{' '}
            collects our syllabus guides by level.
          </p>
        </section>

        <div className="mt-14">
          <GuideCTA
            title="Still not sure where the marks are going?"
            description={`Tell us the subject and what the last report card said. We hand-match a vetted tutor who marks like an examiner, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
            buttonText="Find a tutor"
            whatsappHref={whatsappHref}
          />
        </div>
      </main>
    </>
  );
}
