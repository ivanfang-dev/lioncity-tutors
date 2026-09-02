import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O-Level English Guide 2026 | LionCity Tutors',
  description: 'O-Level English Language and Literature guide for Singapore students — paper-by-paper strategy, a study timeline, and the techniques that earn an A1 in 2026.',
  keywords: [
    'O Level English 2026',
    'O Level English Singapore',
    'GCE O Level English guide',
    'English Language preparation',
    'English Literature study tips',
    'O Level English tuition Singapore',
    'English revision techniques'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'O Level English Guide 2026: Complete Preparation Strategy for Singapore Students',
    description: 'Comprehensive O Level English guide with proven strategies to help Singapore students achieve A1 grades in both Language and Literature components.',
    url: 'https://www.lioncitytutors.com/o-level-english',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/o-level-english',
  },
};

import TableOfContents from '@/components/TableOfContents';
import Link from 'next/link';
import GuideSchema from '@/components/seo/GuideSchema';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from '@/components/guide';
import {
  FileText, CalendarClock, PenLine, BookOpenText, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Lightbulb, GraduationCap, Users,
  Hourglass, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & component structure' },
  { id: 'exam-dates', label: '2026 exam timetable' },
  { id: 'timeline', label: '18-month study timeline' },
  { id: 'language', label: 'English Language (1184)' },
  { id: 'literature', label: 'English Literature (2065)' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: '10 common mistakes' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'mindset', label: 'Mental preparation & mindset' },
  { id: 'pathways', label: 'Future pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final month' },
];

const timeline = [
  {
    title: 'Secondary 3 · Foundation Phase',
    points: [
      'Build strong vocabulary through extensive reading',
      'Master fundamental grammar rules and sentence structures',
      'Develop basic essay writing skills and organization',
      'Practice reading comprehension strategies',
      'Begin exploring different text types and genres',
    ],
  },
  {
    title: 'Secondary 4 Term 1–2 · Skill Development Phase',
    points: [
      'Complete syllabus coverage for both Language and Literature',
      'Begin intensive practice with past year O Level papers',
      'Develop time management skills for different paper formats',
      'Identify and strengthen weak areas through targeted practice',
      'Master exam-specific writing techniques and formats',
    ],
  },
  {
    title: 'Secondary 4 Term 3 to Prelims · Application Phase',
    points: [
      'Daily practice with O Level standard questions',
      'Focus on exam techniques and answer presentation',
      'Simulate exam conditions with full paper attempts',
      'Review and analyze all mistakes systematically',
      'Prepare comprehensively for Preliminary Examinations',
    ],
  },
  {
    title: 'Post-Prelims to O Levels · Mastery Phase',
    points: [
      'Intensive revision based on prelim performance gaps',
      'Final consolidation of key concepts and techniques',
      'Practice papers under strict timing conditions daily',
      'Mental preparation and exam stress management',
      'Maintain a consistent study routine until exam day',
    ],
  },
];

// The mistakes our tutors correct most often on English scripts. Nearly all of
// them cost marks for reasons unrelated to how good the student's English is —
// which is why strong writers still lose marks here.
const commonMistakes = [
  {
    mistake: 'Situational writing that misses a required content point',
    detail: 'A polished, well-organised letter or email that addresses four of the five things the prompt asked for loses those marks regardless of how well it reads. This is the most common situational writing error we see.',
    fix: 'List every content point from the prompt before writing, and tick each one off as you cover it. Check the list again before moving on to Continuous Writing.',
  },
  {
    mistake: 'Tone that does not match the audience',
    detail: 'Grammatically correct English pitched wrongly — too casual for a formal reader, too stiff for an informal one, or written as an essay when the task is a real piece of communication.',
    fix: 'Identify who is reading it and why before the first sentence. Purpose and audience determine register, and register is marked.',
  },
  {
    mistake: 'Reaching for vocabulary you are not comfortable with',
    detail: 'Sophisticated words used slightly wrongly produce awkward, unnatural sentences — and often drag grammar errors in with them, in sentences that would have been correct in plain English.',
    fix: 'Use words you know you can control. Clear, accurate English scores better than ambitious English used imprecisely.',
  },
  {
    mistake: 'Memorised phrases forced in regardless of context',
    detail: 'Phrases learned in advance and inserted where they do not fit read as decoration rather than writing, and they interrupt the flow of an otherwise coherent piece.',
    fix: 'Memorise sentence structures and transitions rather than whole phrases, so what you have prepared can bend to the question in front of you.',
  },
  {
    mistake: 'Continuous writing that answers a nearby question, not the set one',
    detail: 'A well-written narrative or discursive piece that drifts from the exact question loses content marks no matter how strong the prose is.',
    fix: 'Underline the key words in the question and write them at the top of your plan. Check each paragraph against them as you go.',
  },
  {
    mistake: 'Not identifying the comprehension question type before answering',
    detail: 'Literal, inference, vocabulary-in-context, language effect and summary each want a different shape of answer. Answering all five the same way is the root cause of most Paper 2 losses.',
    fix: 'Name the question type before writing a word. The type tells you what the answer must contain.',
  },
  {
    mistake: 'Inference answers that quote the passage without explaining it',
    detail: 'The student locates exactly the right sentence and then stops, leaving the marker to infer the implication for them. Finding the evidence is half the question.',
    fix: 'After identifying the relevant line, write what it suggests and how you know. The explanation is where the marks are.',
  },
  {
    mistake: '"In your own words" answers that swap one or two words',
    detail: 'Substituting a synonym or two while keeping the sentence structure of the passage is not rephrasing, and it is marked as lifting.',
    fix: 'Read the line, cover it, then write the meaning from memory. If your version shares a long run of words with the original, rewrite it.',
  },
  {
    mistake: 'Naming a technique without explaining its effect',
    detail: '"This is a metaphor" identifies a device and stops. Language questions ask what the writer achieves by using it, which is a different question entirely.',
    fix: 'Say what the device suggests, what impression it creates and why the writer chose it. Identification alone is rarely worth a mark.',
  },
  {
    mistake: 'Summaries that include the wrong points, or too many words',
    detail: 'Relevant points missed, irrelevant ones included, whole phrases copied from the passage, and the word limit exceeded — often all four in the same answer.',
    fix: 'Establish exactly what the summary question is asking for first, select only points that serve it, paraphrase each one, then count the words before moving on.',
  },
];

export default function OLevelEnglish() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level English tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <GuideSchema
      slug="o-level-english"
      course={{
        name: 'O-Level English Tuition',
        description: 'One-to-one O-Level English tuition in Singapore, covering the Language paper (1184) and optional Literature (2065).',
        educationalLevel: 'GCE O-Level',
      }}
    />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="O Level English Guide 2026: Master Language & Literature"
            author="By the LionCity Tutors English Team"
            meta="Updated August 29, 2026 · 15 min read"
            imageSrc="/english-tuition.webp"
            imageAlt="A student writing at a desk — the language and literature skills at the heart of O Level English."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              O Level English is a fundamental subject that opens doors to higher education and career opportunities in Singapore. With both Language and Literature components testing different skills, strategic preparation is essential for achieving A1 grades. This comprehensive guide provides proven strategies for O Level English success in 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>O Level English is compulsory Language (1184) &mdash; four papers: Writing, Comprehension, Listening and Oral &mdash; with optional Literature (2065).</>,
                <>A steady Sec 3&rarr;Sec 4 timeline built on wide reading and regular writing beats last-minute cramming.</>,
                <>Marks come from technique as much as content &mdash; plan before you write, vary your language, and back points with evidence.</>,
                <>Struggling with essay structure, comprehension or literary analysis is the usual signal that targeted tuition will help.</>,
              ]}
            />

            {/* Inline table of contents — mobile / tablet only */}
            <nav aria-label="Table of contents" className="lg:hidden rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="h-5 w-5 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
                <p className="text-base font-semibold text-gray-900">In this guide</p>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="flex min-h-11 items-center text-gray-700 hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <section id="structure" className="scroll-mt-24">
              <SectionHeading icon={FileText}>Understanding O Level English Structure</SectionHeading>
              <p className="text-pretty">
                Singapore&rsquo;s O Level English offers two distinct components, each testing different aspects of language proficiency and literary appreciation.
              </p>
              <GuideCard className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">O Level English Components Breakdown</h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-gray-900">English Language (1184) &mdash; four papers</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Compulsory for all O Level students</li>
                      <li>Prerequisites for polytechnic and JC admission</li>
                      <li>Paper 1: Writing &mdash; 70 marks, 35%, 1 hour 50 minutes</li>
                      <li>Paper 2: Comprehension &mdash; 50 marks, 35%, 1 hour 50 minutes</li>
                      <li>Paper 3: Listening &mdash; 30 marks, 10%, about 45 minutes</li>
                      <li>Paper 4: Oral Communication &mdash; 30 marks, 20%, about 20 minutes including 10 minutes of preparation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">English Literature (2065) &mdash; Paper 1 &amp; 2</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Optional subject for higher-achieving students</li>
                      <li>Four questions in total across two sittings (3 hours 10 minutes combined)</li>
                      <li>Paper 1: Prose and Unseen Poetry &mdash; 1 hour 40 minutes, 50%</li>
                      <li>Paper 2: Drama &mdash; 1 hour 30 minutes, 50%</li>
                      <li>Each question is 25% of the subject; at least one Singapore text is set each year</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-dates" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>2026 O-Level English Exam Timetable</SectionHeading>
              <ExamTimetable
                examSlug="o-level"
                subjectSlugs={['english']}
                caption="Official 2026 SEAB dates for O-Level English."
              />
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>18-Month O Level English Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="language" className="scroll-mt-24">
              <SectionHeading icon={PenLine}>English Language (1184) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Paper 1: Writing (70 marks, 35%)"
                  chips={['Editing (10 marks)', 'Situational Writing (30 marks)', 'Continuous Writing (30 marks)']}
                  points={[
                    'Edit ten grammatical errors in a short text — the section most often rushed',
                    'Master different text types (letters, reports, speeches) for the 250–350 word situational task',
                    'Write 350–500 words on one of four topics, adapting tone and register',
                    'Plan before writing: situational marks split evenly between task fulfilment and language',
                  ]}
                />
                <TopicCard
                  title="Paper 2: Comprehension (50 marks, 35%)"
                  chips={['Visual Text (5 marks)', 'Narrative Text (20 marks)', 'Non-narrative & Summary (25 marks)']}
                  points={[
                    'Practice skimming and scanning techniques',
                    'Master inference and deduction skills',
                    'Learn to identify main ideas and supporting details',
                    'Practice answering different question types systematically',
                  ]}
                />
                <TopicCard
                  title="Papers 3 & 4: Listening (10%) and Oral (20%)"
                  chips={['Listening tasks (22 marks)', 'Note-taking (8 marks)', 'Planned Response (15 marks)', 'Spoken Interaction (15 marks)']}
                  points={[
                    'Section A of Listening is played twice; Section B note-taking is played once',
                    'Plan and deliver a response of up to 2 minutes to a video clip and prompt',
                    'Discuss a topic broadly related to that clip with the examiners',
                    'Together these two papers are 30% of the grade, and the least rehearsed',
                  ]}
                />
              </div>
            </section>

            <section id="literature" className="scroll-mt-24">
              <SectionHeading icon={BookOpenText}>English Literature (2065) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Paper 1: Prose and Unseen Poetry (1 h 40 min, 50%)"
                  chips={['Set Prose Text', 'Passage-based or Essay', 'Unseen Poetry']}
                  points={[
                    'Section A: one question on one of six set prose texts — a passage-based question or an essay',
                    'Section B: one of two unseen poems; one of the two poems is a Singapore text each year',
                    'There is no comparative set-text question on this paper',
                    'Each answer is 25% of the Literature grade',
                  ]}
                />
                <TopicCard
                  title="Paper 2: Drama (1 h 30 min, 50%)"
                  chips={['Set Drama Text', 'Compulsory Passage-based', 'Essay']}
                  points={[
                    'You answer two questions on the same set play: a compulsory passage-based question and one essay',
                    'Each question is 25% of the Literature grade',
                    'Understand dramatic conventions and staging, not only plot and character',
                    'One or two Singapore drama texts are set each year',
                  ]}
                />
                <TopicCard
                  title="Literary Analysis Skills"
                  chips={['Critical Thinking', 'Textual Evidence', 'Comparative Analysis']}
                  points={[
                    'Develop critical reading and thinking skills',
                    'Master the art of using textual evidence',
                    'Practice comparative analysis between texts',
                    'Learn to write sophisticated literary arguments',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>O Level English Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Proven O Level English Study Methods</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">The Reading-Writing Connection:</strong></p>
                    <p>Read diverse texts daily, analyze writing styles, and practice emulating successful techniques in your own writing.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Vocabulary Building System:</strong></p>
                    <p>Keep a vocabulary journal, learn 10 new words daily, and practice using them in context through writing exercises.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Essay Planning Framework:</strong></p>
                    <p>Always plan essays before writing &mdash; create outlines, identify key points, and structure arguments logically.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Comprehension Annotation Method:</strong></p>
                    <p>Mark key information, underline main ideas, and note relationships between ideas while reading passages.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>O Level English Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Paper 1 (Writing) Strategy</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Spend a few minutes on Editing (10 marks) before the two writing tasks</li>
                    <li>Allocate roughly 35 minutes for Situational Writing and 55 minutes for Continuous Writing</li>
                    <li>Plan both writing tasks before starting to write</li>
                    <li>Use varied sentence structures and vocabulary</li>
                    <li>Ensure appropriate tone and register for each task</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Paper 2 (Comprehension) Strategy</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read questions first to understand what to look for</li>
                    <li>Skim the passage for main ideas before detailed reading</li>
                    <li>Answer questions in order but mark difficult ones to return to</li>
                    <li>Use evidence from the text to support answers</li>
                    <li>Check that answers are complete and well-expressed</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Literature Paper Strategy</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Choose questions that play to your strengths</li>
                    <li>Always support arguments with textual evidence</li>
                    <li>Use literary terminology accurately and appropriately</li>
                    <li>Structure essays with a clear introduction, body, and conclusion</li>
                    <li>Manage time carefully &mdash; don&rsquo;t spend too long on one question</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>10 common O-Level English mistakes</SectionHeading>
              <p className="text-gray-700 mb-5">
                In English our tutors regularly see strong writers lose marks for reasons that have nothing to do with how good their English is. These are the ten we correct most often across Paper 1 and Paper 2, and what to do instead.
              </p>
              <div className="space-y-4">
                {commonMistakes.map((item, index) => (
                  <GuideCard key={item.mistake}>
                    <div className="flex gap-4">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary tabular-nums"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1.5">{item.mistake}</h3>
                        <p className="text-sm text-gray-700 mb-2">{item.detail}</p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">The fix: </span>
                          {item.fix}
                        </p>
                      </div>
                    </div>
                  </GuideCard>
                ))}
              </div>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your O Level English Study Schedule</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (Secondary 4)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days (Language)</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>30–45 minutes of daily reading practice</li>
                      <li>Focus on vocabulary building and grammar</li>
                      <li>Practice writing different text types</li>
                      <li>Complete comprehension exercises</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days (Literature)</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>45–60 minutes of daily literature study</li>
                      <li>Close reading of set texts</li>
                      <li>Practice essay writing and analysis</li>
                      <li>Memorize key quotes and themes</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="font-semibold text-gray-900 mb-1.5 text-sm">Weekends</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Complete 1–2 full practice papers</li>
                    <li>Review and analyze all weekly writing</li>
                    <li>Focus on weakest areas with intensive practice</li>
                    <li>Read widely for vocabulary and ideas</li>
                  </ul>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential O Level English Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Free from us</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>
                      <Link href="/free-notes" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">O-Level English Language study guide</Link>
                      {' '}&mdash; 20 pages on syllabus 1184: all four papers with their weightings, the six situational text-type formats, and the planning methods that make every content point visible to the marker
                    </li>
                    <li>
                      <Link href="/free-test-papers" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">Free test papers</Link>
                      {' '}&mdash; prelim and past-year O-Level English papers, to work to time
                    </li>
                    <li>
                      <Link href="/how-to-study/o-level-english" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">How to study for O-Level English</Link>
                      {' '}&mdash; why Oral at 20% is the most under-rehearsed paper on the syllabus
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>O Level English Language (Marshall Cavendish) &mdash; comprehensive coverage</li>
                    <li>English Literature Guide (Cambridge) &mdash; literature focused</li>
                    <li>Vocabulary Builder (Oxford) &mdash; vocabulary enhancement</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GCE O Level past papers (last 10 years minimum)</li>
                    <li>School preliminary examination papers</li>
                    <li>Topical practice books for weak areas</li>
                    <li>Online practice platforms (Grammarly, Vocabulary.com)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Reading Materials</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Quality newspapers and magazines</li>
                    <li>Classic and contemporary literature</li>
                    <li>Academic articles and essays</li>
                    <li>Online literary resources and analysis</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="mindset" className="scroll-mt-24">
              <SectionHeading icon={Lightbulb}>Mental Preparation for O Level English</SectionHeading>
              <p className="text-pretty">
                Language confidence is as important as language competence. Here&rsquo;s how to build both:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Build Reading Stamina:</strong> Practice reading for extended periods to improve concentration</li>
                <li><strong className="text-gray-900">Embrace Writing Practice:</strong> View writing as a skill that improves with regular practice</li>
                <li><strong className="text-gray-900">Practice Under Pressure:</strong> Simulate exam conditions regularly to build exam resilience</li>
                <li><strong className="text-gray-900">Develop Critical Thinking:</strong> Question and analyze everything you read</li>
                <li><strong className="text-gray-900">Maintain a Growth Mindset:</strong> Believe that language skills can be developed through effort</li>
                <li><strong className="text-gray-900">Seek Feedback:</strong> Don&rsquo;t let language gaps compound over time</li>
              </ul>
            </section>

            <section id="pathways" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>Post-O Level English Pathways</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Your O Level English Results Open These Doors</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A1-B3 in English Language:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for H1/H2 English in Junior College</li>
                      <li>Access to most polytechnic diploma courses</li>
                      <li>Strong foundation for university humanities programs</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">A1-B3 in English Literature:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for H2 Literature in Junior College</li>
                      <li>Access to arts and humanities university courses</li>
                      <li>Foundation for creative and analytical careers</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider O Level English Tuition</SectionHeading>
              <p>Consider professional O Level English tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Consistently struggles with writing skills despite self-study efforts</li>
                <li>Lacks confidence in comprehension and analysis</li>
                <li>Needs structured guidance for both Language and Literature preparation</li>
                <li>Requires personalized attention beyond classroom teaching</li>
                <li>Aims for A1 grades to meet JC or polytechnic course requirements</li>
                <li>Benefits from regular practice supervision and immediate feedback</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose O Level English tutors who:</strong> Have extensive experience with current O Level syllabi, understand common student misconceptions, can teach both language skills and exam techniques, and provide structured practice programs.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Month O Level English Preparation</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Last 30 Days Strategy</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Week 1–2: Intensive Practice</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 2 full papers daily (1 Language, 1 Literature if applicable)</li>
                      <li>Time all practice sessions strictly</li>
                      <li>Analyze performance patterns and focus areas</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 3: Consolidation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Review all key concepts and writing techniques</li>
                      <li>Practice weak areas with targeted questions</li>
                      <li>Ensure vocabulary and grammar proficiency</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 4: Final Preparation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Light revision and confidence building</li>
                      <li>Ensure adequate rest and stress management</li>
                      <li>Prepare all examination materials and logistics</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <RelatedGuides slug="o-level-english" />

            {/* Conversion block */}
            <GuideCTA
              title="Achieve your O Level English A1 goals with expert guidance"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar O Level English tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Get expert O Level English support"
              whatsappHref={whatsappHref}
            />
          </article>
        </div>

        {/* Sticky table of contents — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents items={tableOfContents} />
          </div>
        </aside>
      </div>
    </main>
    </>
  );
}
