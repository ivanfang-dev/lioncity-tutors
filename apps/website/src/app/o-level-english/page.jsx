import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O Level English Guide 2026: Complete Preparation Strategy for Singapore Students | LionCity Tutors',
  description: 'Ultimate O Level English preparation guide for Singapore students. Expert strategies, language skills, and proven tips to score A1 in O Level English 2026.',
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
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
} from '@/components/guide';
import {
  FileText, CalendarClock, PenLine, BookOpenText, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Lightbulb, GraduationCap, Users,
  Hourglass, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & component structure' },
  { id: 'timeline', label: '18-month study timeline' },
  { id: 'language', label: 'English Language (1128)' },
  { id: 'literature', label: 'English Literature (2065)' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
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

export default function OLevelEnglish() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level English tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="O Level English Guide 2026: Master Language & Literature"
            author="By the LionCity Tutors English Team"
            meta="Updated May 19, 2026 · 15 min read"
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
                <>O Level English is compulsory Language (1128) &mdash; Writing and Comprehension &mdash; with optional Literature (2065).</>,
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
                    <a href={`#${item.id}`} className="text-gray-700 hover:text-primary transition-colors">{item.label}</a>
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
                <h4 className="font-semibold text-gray-900 mb-4">O Level English Components Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">English Language (1128) &mdash; Paper 1 &amp; 2</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Compulsory for all O Level students</li>
                      <li>Prerequisites for polytechnic and JC admission</li>
                      <li>Paper 1: Writing (70 marks, 1 hour 50 minutes)</li>
                      <li>Paper 2: Comprehension (50 marks, 1 hour 50 minutes)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">English Literature (2065) &mdash; Paper 1 &amp; 2</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Optional subject for higher-achieving students</li>
                      <li>Enhances critical thinking and analytical skills</li>
                      <li>Valuable for humanities and arts university courses</li>
                      <li>Paper 1: Poetry &amp; Prose (50 marks, 2 hours)</li>
                      <li>Paper 2: Drama (50 marks, 2 hours)</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>18-Month O Level English Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="language" className="scroll-mt-24">
              <SectionHeading icon={PenLine}>English Language (1128) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Paper 1: Writing (70 marks)"
                  chips={['Situational Writing (30 marks)', 'Continuous Writing (40 marks)']}
                  points={[
                    'Master different text types (letters, reports, speeches)',
                    'Practice formal and informal writing styles',
                    'Develop strong argumentative and narrative skills',
                    'Learn to adapt tone and register appropriately',
                  ]}
                />
                <TopicCard
                  title="Paper 2: Comprehension (50 marks)"
                  chips={['Visual Text', 'Narrative Text', 'Non-narrative Text']}
                  points={[
                    'Practice skimming and scanning techniques',
                    'Master inference and deduction skills',
                    'Learn to identify main ideas and supporting details',
                    'Practice answering different question types systematically',
                  ]}
                />
                <TopicCard
                  title="Listening & Oral Communication"
                  chips={['Listening Comprehension', 'Reading Aloud', 'Spoken Interaction']}
                  points={[
                    'Practice listening to various accents and speech patterns',
                    'Master pronunciation and intonation',
                    'Develop conversation skills and topic discussion',
                    'Learn to express opinions clearly and confidently',
                  ]}
                />
              </div>
            </section>

            <section id="literature" className="scroll-mt-24">
              <SectionHeading icon={BookOpenText}>English Literature (2065) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Paper 1: Poetry & Prose (50 marks)"
                  chips={['Unseen Poetry', 'Set Text Analysis', 'Comparative Questions']}
                  points={[
                    'Master poetic devices and literary techniques',
                    'Practice close reading and textual analysis',
                    'Learn to write structured literary essays',
                    'Memorize key quotes and their significance',
                  ]}
                />
                <TopicCard
                  title="Paper 2: Drama (50 marks)"
                  chips={['Set Drama Text', 'Character Analysis', 'Theme Exploration']}
                  points={[
                    'Understand dramatic conventions and staging',
                    'Analyze character development and motivations',
                    'Explore themes and their dramatic presentation',
                    'Practice writing about dramatic techniques',
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
                <h4 className="font-semibold text-gray-900 mb-3">Proven O Level English Study Methods</h4>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (Writing) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 35 minutes for Situational Writing, 55 minutes for Continuous Writing</li>
                    <li>Plan both essays before starting to write</li>
                    <li>Use varied sentence structures and vocabulary</li>
                    <li>Check grammar, punctuation, and spelling carefully</li>
                    <li>Ensure appropriate tone and register for each task</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Comprehension) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read questions first to understand what to look for</li>
                    <li>Skim the passage for main ideas before detailed reading</li>
                    <li>Answer questions in order but mark difficult ones to return to</li>
                    <li>Use evidence from the text to support answers</li>
                    <li>Check that answers are complete and well-expressed</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Literature Paper Strategy</h4>
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
              <SectionHeading icon={TriangleAlert}>Common O Level English Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 10 O Level English Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Poor time management in writing papers</li>
                      <li>Not reading questions carefully enough</li>
                      <li>Weak essay structure and organization</li>
                      <li>Insufficient textual evidence in literature</li>
                      <li>Grammatical and spelling errors</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                      <li>Inappropriate tone and register</li>
                      <li>Not planning essays before writing</li>
                      <li>Weak vocabulary and repetitive language</li>
                      <li>Incomplete comprehension answers</li>
                      <li>Poor handwriting affecting readability</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your O Level English Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (Secondary 4)</h4>
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
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>O Level English Language (Marshall Cavendish) &mdash; comprehensive coverage</li>
                    <li>English Literature Guide (Cambridge) &mdash; literature focused</li>
                    <li>Vocabulary Builder (Oxford) &mdash; vocabulary enhancement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GCE O Level past papers (last 10 years minimum)</li>
                    <li>School preliminary examination papers</li>
                    <li>Topical practice books for weak areas</li>
                    <li>Online practice platforms (Grammarly, Vocabulary.com)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Reading Materials</h4>
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
                <h4 className="font-semibold text-gray-900 mb-3">Your O Level English Results Open These Doors</h4>
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
                <h4 className="font-semibold text-gray-900 mb-3">Last 30 Days Strategy</h4>
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
