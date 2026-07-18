export const metadata = {
  title: 'A Level General Paper Guide 2025: Complete GP Strategy for Singapore JC Students | LionCity Tutors',
  description: 'Ultimate A Level General Paper (GP) preparation guide for Singapore JC students. Expert strategies for essay and comprehension, critical thinking, and proven techniques to excel in Cambridge A Level GP 2025.',
  keywords: [
    'A Level General Paper 2025', 'A Level GP Singapore', 'Cambridge A Level GP guide', 'General Paper essay strategies', 'GP comprehension techniques', 'JC GP tuition Singapore', 'GP current affairs', 'Singapore A Level General Paper'
  ],
  openGraph: {
    title: 'A Level General Paper Guide 2025: Complete GP Strategy for Singapore JC Students | LionCity Tutors',
    description: 'Comprehensive A Level General Paper guide with proven strategies to help Singapore JC students achieve A grades in GP essays and comprehension.',
    url: 'https://www.lioncitytutors.com/a-level-general-paper',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/a-level-general-paper'
  }
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
  { id: 'structure', label: 'Exam & paper structure' },
  { id: 'timeline', label: '24-month study timeline' },
  { id: 'essay', label: 'Essay (Paper 1)' },
  { id: 'comprehension', label: 'Comprehension (Paper 2)' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'mindset', label: 'Mental preparation & mindset' },
  { id: 'pathways', label: 'University pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final month' },
];

const timeline = [
  {
    title: 'JC1 · Foundation Phase',
    points: [
      'Build strong foundation in grammar, vocabulary, and sentence structure',
      'Develop awareness of current affairs and global issues',
      'Practice basic essay planning and paragraphing',
      'Begin comprehension practice with short passages',
      'Read widely: newspapers, magazines, reputable online sources',
    ],
  },
  {
    title: 'JC1 Term 3–4 · Skill Development Phase',
    points: [
      'Master essay structures for different question types',
      'Develop critical thinking and argumentation skills',
      'Practice summary and application questions',
      'Expand knowledge of examples and case studies',
      'Start timed practice for both papers',
    ],
  },
  {
    title: 'JC2 Term 1–2 · Application Phase',
    points: [
      'Intensive practice with past year GP papers',
      'Refine essay writing and comprehension answering techniques',
      'Master time management for both papers',
      'Develop advanced analysis and evaluation skills',
      'Prepare for Mid-Year and Preliminary Examinations',
    ],
  },
  {
    title: 'JC2 Prelims to A Levels · Mastery Phase',
    points: [
      'Targeted revision based on prelim performance',
      'Final consolidation of essay outlines and content banks',
      'Daily timed practices under exam conditions',
      'Perfect language accuracy and argument clarity',
      'Mental preparation and stress management',
    ],
  },
];

export default function ALevelGeneralPaper() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an A Level General Paper tutor.

Student level (e.g. JC1 / JC2):
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
            title="A Level General Paper Guide 2025: Master Essay & Comprehension for University Success"
            author="By the LionCity Tutors General Paper Team"
            meta="Updated June 14, 2025 · 18 min read"
            imageSrc="/english-tuition.webp"
            imageAlt="A student writing at a desk — the essay craft and wide reading at the heart of General Paper."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              A Level General Paper (GP) is a critical subject for Singapore JC students, developing essential skills in argumentation, critical thinking, and global awareness. Excelling in GP opens doors to top university courses and demonstrates your ability to think, write, and analyze at a high level. This comprehensive guide provides proven strategies for A Level GP excellence in 2025.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>GP is two papers &mdash; Essay (8807/01) and Comprehension (8807/02), each <span className="tabular-nums">50</span> marks over <span className="tabular-nums">1h 30m</span>.</>,
                <>A steady JC1&rarr;JC2 timeline built on wide reading and regular writing beats last-minute cramming.</>,
                <>Essays are marked as much on argument, structure and language as on content &mdash; plan before you write, and back every point with a real example.</>,
                <>Struggling to move from description to analysis, or to find examples, is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding A Level General Paper Structure</SectionHeading>
              <p className="text-pretty">
                The A Level GP examination consists of two papers, each testing different but complementary skills:
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">A Level GP Papers Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 1: Essay (8807/01)</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Choose 1 out of 12 questions</li>
                      <li>Topics span current affairs, science, technology, environment, media, culture, and more</li>
                      <li>Marked for argument, content, organization, language</li>
                      <li>1 hour 30 minutes, 50 marks</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 2: Comprehension (8807/02)</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>1 passage with short-answer, summary, and application questions</li>
                      <li>Tests understanding, inference, summary, and critical response</li>
                      <li>1 hour 30 minutes, 50 marks</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>24-Month A Level GP Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="essay" className="scroll-mt-24">
              <SectionHeading icon={PenLine}>GP Essay Mastery Guide</SectionHeading>
              <TopicCard
                title="Essay Writing (Paper 1)"
                chips={['Argumentation', 'Content Development', 'Organization', 'Language']}
                points={[
                  'Master different essay types: argumentative, discursive, expository',
                  'Practice planning essays and developing thesis statements',
                  'Use real-world examples and case studies to support arguments',
                  'Develop clear introductions, topic sentences, and logical flow',
                  'Refine grammar, vocabulary, and sentence variety',
                ]}
              />
            </section>

            <section id="comprehension" className="scroll-mt-24">
              <SectionHeading icon={BookOpenText}>GP Comprehension Mastery Guide</SectionHeading>
              <TopicCard
                title="Comprehension (Paper 2)"
                chips={['Understanding', 'Inference', 'Summary', 'Application', 'Critical Response']}
                points={[
                  'Practice skimming, scanning, and close reading',
                  'Master summary writing and paraphrasing',
                  'Develop inference and evaluation skills',
                  'Answer application questions with real-world relevance',
                  'Check answers for clarity, accuracy, and completeness',
                ]}
              />
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>A Level GP Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven A Level GP Study Methods</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">Current Affairs Journal:</strong></p>
                    <p>Maintain a journal of news articles, statistics, and examples for essay use. Update weekly and categorize by theme (e.g. environment, technology, society).</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Essay Outlining Practice:</strong></p>
                    <p>Plan outlines for a variety of essay questions before writing full essays. Focus on thesis, topic sentences, and supporting points.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Comprehension Annotation:</strong></p>
                    <p>Annotate passages for main ideas, tone, and argument structure. Practice summarizing each paragraph in your own words.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Peer Review Sessions:</strong></p>
                    <p>Exchange essays and comprehension answers with classmates for feedback and improvement.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>A Level GP Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (Essay) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Spend 10–15 minutes planning before writing</li>
                    <li>Choose questions that play to your strengths and knowledge</li>
                    <li>Use clear, concise, and formal language</li>
                    <li>Support every point with relevant examples</li>
                    <li>Leave time to check for grammar and clarity</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Comprehension) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions before reading the passage</li>
                    <li>Underline key information and argument shifts</li>
                    <li>Answer summary and application questions last</li>
                    <li>Use evidence from the passage for every answer</li>
                    <li>Check that answers are precise and well-expressed</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common A Level GP Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 10 A Level GP Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Not planning essays before writing</li>
                      <li>Weak thesis statements and topic sentences</li>
                      <li>Insufficient real-world examples</li>
                      <li>Overly descriptive, not analytical, answers</li>
                      <li>Ignoring question requirements</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                      <li>Poor time management in both papers</li>
                      <li>Repetitive vocabulary and sentence structures</li>
                      <li>Incomplete comprehension answers</li>
                      <li>Not reviewing answers for errors</li>
                      <li>Weak conclusion or summary in essays</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your A Level GP Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (JC2)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>30–45 minutes of daily reading of news and opinion pieces</li>
                      <li>Practice essay outlines and paragraph writing</li>
                      <li>Complete 1–2 comprehension passages per week</li>
                      <li>Update your current affairs journal</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>Write 1 full essay and 1 full comprehension under timed conditions</li>
                      <li>Review and analyze all mistakes</li>
                      <li>Focus on weakest areas with targeted practice</li>
                      <li>Read widely for new examples and perspectives</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential A Level GP Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Cambridge General Paper (Hodder Education) &mdash; comprehensive coverage</li>
                    <li>General Paper Essays (Marshall Cavendish) &mdash; essay practice</li>
                    <li>GP Comprehension Skills (Pearson) &mdash; comprehension focused</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Cambridge A Level past year papers (last 10 years minimum)</li>
                    <li>School preliminary examination papers</li>
                    <li>Topical practice books for weak areas</li>
                    <li>Online platforms (Newsela, The Economist, BBC News)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Reading Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Quality newspapers and magazines</li>
                    <li>Academic journals and opinion pieces</li>
                    <li>Books on current affairs, science, and society</li>
                    <li>Online resources for global issues and debates</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="mindset" className="scroll-mt-24">
              <SectionHeading icon={Lightbulb}>Mental Preparation for A Level GP</SectionHeading>
              <p className="text-pretty">
                Confidence in argumentation and analysis is as important as language competence. Here&rsquo;s how to build both:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Build General Knowledge:</strong> Read widely and stay updated on current affairs</li>
                <li><strong className="text-gray-900">Embrace Writing Practice:</strong> View essay writing as a skill that improves with regular practice</li>
                <li><strong className="text-gray-900">Practice Under Pressure:</strong> Simulate exam conditions regularly to build exam resilience</li>
                <li><strong className="text-gray-900">Develop Critical Thinking:</strong> Question and analyze everything you read</li>
                <li><strong className="text-gray-900">Maintain a Growth Mindset:</strong> Believe that argument and analysis skills can be developed through effort</li>
                <li><strong className="text-gray-900">Seek Feedback:</strong> Don&rsquo;t let writing gaps compound over time</li>
              </ul>
            </section>

            <section id="pathways" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>Post-A Level GP Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your A Level GP Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A in GP:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for top university courses (Law, Medicine, Social Sciences, etc.)</li>
                      <li>Strong foundation for scholarship applications</li>
                      <li>Demonstrates critical thinking and communication skills</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">B/C in GP:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for most university courses</li>
                      <li>Foundation for business, humanities, and science programs</li>
                      <li>Valuable for professional and academic writing</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider A Level GP Tuition</SectionHeading>
              <p>Consider professional A Level GP tuition if you:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Consistently struggle with essay writing or comprehension despite self-study</li>
                <li>Lack confidence in argumentation and analysis</li>
                <li>Need structured guidance for both papers</li>
                <li>Require personalized attention beyond classroom teaching</li>
                <li>Aim for A grades to meet university or scholarship requirements</li>
                <li>Benefit from regular practice supervision and immediate feedback</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose A Level GP tutors who:</strong> Have extensive experience with the current GP syllabus, understand common student misconceptions, can teach both essay and comprehension skills, and provide structured practice programs.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Month A Level GP Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 30 Days Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Week 1–2: Intensive Practice</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Write 2–3 essays and 2–3 comprehensions per week under timed conditions</li>
                      <li>Analyze performance patterns and focus areas</li>
                      <li>Update content banks and example lists</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 3: Consolidation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Review all essay outlines and comprehension techniques</li>
                      <li>Practice weak areas with targeted questions</li>
                      <li>Ensure language and argument proficiency</li>
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
              title="Achieve your A Level GP goals with expert guidance"
              description="Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar General Paper tutor — usually within hours — and parents never pay an agency fee."
              buttonText="Get expert A Level GP support"
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
