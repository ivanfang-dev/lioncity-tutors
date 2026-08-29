import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: "O-Level Chinese 1160: 实用文 Email Format & 口试 Technique",
  description:
    "O-Level Chinese (1160) guide — the 2026 paper structure, the 实用文 email format that carries 10% of the grade, and 口试 technique, from the SEAB syllabus.",
  keywords: [
    "O Level Chinese 1160", "O Level Chinese 实用文", "电邮格式 O Level",
    "O Level Chinese email format", "O Level 华文 口试", "Higher Chinese 1116",
    "O Level Chinese paper structure", "O Level Chinese tuition Singapore",
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: "O-Level Chinese Guide 2026 (1160) | LionCity Tutors",
    description:
      "The 2026 O-Level Chinese paper structure, the 实用文 email format and 口试 technique — written against the SEAB syllabus.",
    type: "article",
    url: "https://www.lioncitytutors.com/o-level-chinese",
  },
  alternates: { canonical: "https://www.lioncitytutors.com/o-level-chinese" },
};

import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, KeyTakeaways, GuideCTA,
  RelatedGuides, ICON_STROKE,
} from '@/components/guide';
import {
  FileText, Mail, Mic, BookOpen, Target, TriangleAlert,
  ListChecks, CalendarClock, Languages, PenLine, Search,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Paper structure & weightings' },
  { id: 'email', label: '实用文: the email question' },
  { id: 'email-format', label: 'The email format, line by line' },
  { id: 'email-marks', label: 'How the 20 marks are split' },
  { id: 'email-mistakes', label: 'Where the marks go missing' },
  { id: 'composition', label: '作文: the 40-mark essay' },
  { id: 'comprehension', label: '阅读理解二: the heaviest section' },
  { id: 'oral', label: '口试: reading aloud & conversation' },
  { id: 'sec-2027', label: 'What changes in 2027' },
];

// Paper structure, taken from the SEAB 1160 syllabus document for 2026.
const PAPERS = [
  {
    title: '试卷一 · 写作 (Writing)',
    weight: '60 marks · 30% · 2 hours',
    chips: ['实用文 20 marks', '作文 40 marks'],
    strategyLabel: 'What it asks',
    points: [
      '第一部分 实用文: choose 1 of 2 questions, 150 characters or more. Either reply to an email you are given, or write an email based on supplied material.',
      '第二部分 作文: choose 1 of 3 questions, 300 characters or more, across 记叙文, 说明文 and 议论文.',
      'A dictionary approved by SEAB may be used in this paper.',
    ],
  },
  {
    title: '试卷二 · 语文应用与阅读理解',
    weight: '70 marks · 35% · 1 hour 30 min',
    chips: ['30 questions', 'Largest single paper'],
    strategyLabel: 'What it asks',
    points: [
      '语文应用: 综合填空 (5 MCQ, 5 marks) and 词语替换 (5 open, 10 marks).',
      '阅读理解一: 10 MCQ over 2–3 practical texts — advertisements, flyers, news reports (20 marks).',
      '阅读理解二: 10 open-ended questions across 2 passages (35 marks) — the single heaviest section in the whole exam.',
    ],
  },
  {
    title: '试卷三 · 口试 (Oral)',
    weight: '50 marks · 25% · about 15 min',
    chips: ['朗读短文', '会话'],
    strategyLabel: 'What it asks',
    points: [
      '朗读短文: read one passage aloud.',
      '会话: a conversation with the examiner based on a video clip you are shown.',
      '10 minutes of preparation beforehand, during which you may silently reread the passage and rewatch the clip as many times as you like.',
    ],
  },
  {
    title: '试卷三 · 听力理解 (Listening)',
    weight: '20 marks · 10% · about 30 min',
    chips: ['10 MCQ'],
    strategyLabel: 'What it asks',
    points: [
      'Three short dialogues or passages, plus three comprehension passages.',
      'Ten multiple-choice questions covering everyday conversation, advertisements, instructions, stories and news reports.',
      'You hear the recording first, then answer.',
    ],
  },
];

// The 实用文 skeleton. Each line is a mark-bearing structural element.
const EMAIL_SKELETON = [
  {
    part: '称呼',
    english: 'Salutation',
    detail:
      'The recipient’s name or title, followed by a colon rather than a comma. 陈老师： for a teacher, 亲爱的美玲： for a friend. Getting the honorific wrong here signals the wrong register for the entire email.',
  },
  {
    part: '问候语',
    english: 'Greeting',
    detail:
      '您好！ to someone senior, 你好！ to a peer. One line, on its own. Skipping it is the single most common structural omission.',
  },
  {
    part: '正文',
    english: 'Body',
    detail:
      'Two to three paragraphs. Open by stating why you are writing, develop the points the question asks for, then close with what you want to happen next. This is where 内容 marks live.',
  },
  {
    part: '祝颂语',
    english: 'Closing wish',
    detail:
      '祝 on one line, then the wish indented on the next: 身体健康 to an elder, 学业进步 to a classmate, 工作顺利 to someone at work. Match the wish to the recipient.',
  },
  {
    part: '署名',
    english: 'Signature',
    detail:
      'Your relationship then your name: 学生 陈志明 or 你的朋友 美玲. The question tells you who you are — use it rather than inventing a name.',
  },
];

const EMAIL_MISTAKES = [
  {
    title: 'Writing to the wrong person',
    body: 'The scenario names an audience and the register follows from it. A student emailing 校长 who writes 你好 instead of 您好, or signs off 你的朋友, loses 语文与结构 marks before the content is even read.',
  },
  {
    title: 'Treating 150 characters as the target',
    body: '字数在150以上 is a floor, not a goal. An email that stops at 155 characters rarely has room for 内容有层次 — layered content — which is what separates band 1 from band 2 in the rubric.',
  },
  {
    title: 'Answering only half the prompt',
    body: 'These questions usually carry two or three explicit requirements. Marks for 切合题意 are awarded against all of them, so covering two out of three caps the content band no matter how well written the email is.',
  },
  {
    title: 'Dropping the 祝颂语 or 署名',
    body: 'Both are structural marks under 组织得当、段落分明. They take fifteen seconds to write and are the cheapest marks on the paper to recover.',
  },
  {
    title: 'Copying the stimulus wholesale',
    body: 'When the question supplies an email to reply to, lifting its phrasing back verbatim reads as 重复 in the rubric. Paraphrase, then add the information the reply is actually meant to carry.',
  },
];

// The three essay types 作文 draws from, per 试卷格式. Each is 3-choose-1.
const COMPOSITION_TYPES = [
  {
    title: '记叙文',
    weight: 'Narrative',
    chips: ['One incident', 'Concrete detail'],
    strategyLabel: 'What earns 内容有层次',
    points: [
      'Pick one incident and stay inside it. Two thin events score below one developed event every time.',
      'The rubric wants 说明详尽 — thorough. That means sensory detail and what you thought at the time, not just a sequence of actions.',
      'Something has to change: a realisation, a relationship, a decision. A narrative that only reports what happened reads as 没有层次.',
    ],
  },
  {
    title: '说明文',
    weight: 'Expository',
    chips: ['Organise by aspect', 'Use examples'],
    strategyLabel: 'What earns 内容有层次',
    points: [
      'Organise by aspect rather than chronology — three clear facets of the subject, one per paragraph.',
      'Examples and figures are what make 说明详尽 real. A paragraph of general claims scores in the middle bands however fluent it is.',
      'Define your terms early. Markers reward 有条理, and an essay that assumes the reader already knows the subject rarely reads as ordered.',
    ],
  },
  {
    title: '议论文',
    weight: 'Argumentative',
    chips: ['论点 · 论据 · 论证', 'Handle the other side'],
    strategyLabel: 'What earns 内容有层次',
    points: [
      'Every paragraph needs all three parts: the claim, the evidence, and the reasoning that connects them. Most lost marks are a missing 论证.',
      'Address the opposing view somewhere. This is the clearest way to demonstrate 层次 — layering — to a marker.',
      'Singapore examples date fast. A 2019 statistic in a 2026 script is the sort of thing that quietly caps the content band.',
    ],
  },
];

// 阅读理解二 question types. The syllabus publishes no band rubric for this
// section, so these describe what each question type requires, not mark bands.
const COMPREHENSION_MOVES = [
  {
    title: 'Read the mark allocation before you write',
    body: 'Ten questions carry 35 marks, so they are not equally weighted. A 2-mark question wants one clean point; a 5-mark question wants three or four distinct ones. Students who write the same-sized answer for every question systematically underwrite the big ones and waste time on the small ones.',
  },
  {
    title: '用自己的话 means exactly that',
    body: 'When a question asks you to answer in your own words, copying the sentence out of the passage scores near zero however correct it is. Change the vocabulary and the sentence pattern, keep the meaning. When the question does not say so, quoting is usually safe — but paraphrasing is never penalised.',
  },
  {
    title: 'Word-meaning questions are contextual',
    body: '词语在文中的意思 asks what the word means here, not what the dictionary says. The answer almost always has to be inferred from the sentences either side of it, and a correct dictionary definition that does not fit the passage is still wrong.',
  },
  {
    title: 'Cause questions are usually scattered',
    body: 'For 为什么 questions, the reasons are rarely in one place. The passage typically gives one cause early and another late, and the mark scheme wants both. Before writing, scan the whole passage for a second reason rather than answering from the first one you find.',
  },
  {
    title: '概括 questions need coverage, not depth',
    body: 'Summary questions are marked on whether you covered the whole span asked about. One richly explained point from paragraph two will lose to four brief points drawn from across the passage. Work paragraph by paragraph and take one idea from each.',
  },
  {
    title: 'Opinion questions still need textual support',
    body: 'When asked for the author’s view — or your own — an unsupported assertion caps the mark. Name the view, then point to what in the passage produced it. The two passages often take contrasting positions, which is usually what the final questions are built on.',
  },
];

export default function OLevelChinese() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O-Level Chinese tutor.

Student level (e.g. Sec 3 / Sec 4):
Chinese or Higher Chinese:
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="o-level-chinese"
        course={{
          name: 'O-Level Chinese Tuition',
          description:
            'One-to-one O-Level Chinese (1160) and Higher Chinese (1116) tuition in Singapore, covering 实用文, 作文, 理解 and 口试.',
          educationalLevel: 'GCE O-Level',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="O-Level Chinese Guide 2026 (1160): the 实用文 Email, 口试 and Where the Marks Actually Are"
              author="By the LionCity Tutors Chinese Team"
              meta="Updated August 22, 2026 · 9 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                Most O-Level Chinese revision goes into 作文 and 理解, which is reasonable &mdash; between
                them they carry over half the paper. But the 实用文 email is worth 20 marks for roughly
                twenty-five minutes of work, it is the most formulaic question in the entire exam, and
                it is where well-prepared students still drop marks on things that take seconds to fix.
                This guide works through the 2026 paper structure as SEAB defines it, then takes the
                email, the essay and the oral apart against their official marking rubrics.
              </p>

              <KeyTakeaways
                items={[
                  '实用文 is 20 marks (10% of the grade) for a single email of 150 characters or more.',
                  'Half those marks — 10 of 20 — are for 语文与结构, not content. Format and register are literally half the question.',
                  '会话 is 40 marks — as big as the 作文 essay — while 朗读 is only 10. Most students split their oral practice the other way round.',
                  '阅读理解二 is the heaviest single section on any written paper at 35 marks.',
                  'The 2026 sitting is the last O-Level. From 2027 the qualification becomes the Singapore-Cambridge SEC.',
                ]}
              />

              <section id="structure" className="scroll-mt-24">
                <SectionHeading icon={FileText}>Paper structure &amp; weightings</SectionHeading>
                <p className="text-pretty">
                  O-Level Chinese (syllabus 1160) is examined across three papers totalling 200 marks,
                  with listening grouped under Paper 3 alongside the oral. The figures below come from
                  the SEAB 2026 syllabus document.
                </p>
                <div className="mt-6 grid gap-5">
                  {PAPERS.map((paper) => (
                    <TopicCard key={paper.title} {...paper} />
                  ))}
                </div>
                <p className="mt-6 text-pretty">
                  Higher Chinese (syllabus 1116) follows the same shape with a heavier reading load and
                  more demanding 作文 topics. The email format below applies to both.
                </p>
              </section>

              <section id="email" className="scroll-mt-24">
                <SectionHeading icon={Mail}>实用文: the email question</SectionHeading>
                <p className="text-pretty">
                  Paper 1 opens with 实用文. You choose one of two questions and write at least 150
                  characters. One version gives you an email and asks you to reply to it; the other
                  gives you material &mdash; a notice, a poster, a set of details &mdash; and asks you
                  to write an email based on it.
                </p>
                <p className="mt-3 text-pretty">
                  What makes this question winnable is that the marker is working from a fixed skeleton.
                  Unlike 作文, where a strong essay can take many shapes, a strong 实用文 answer looks
                  substantially the same every time. Learn the shape once and the only variable left is
                  content.
                </p>
                <GuideCard className="mt-6">
                  <p className="font-semibold text-gray-900">Budget about 25 minutes</p>
                  <p className="mt-2 text-pretty">
                    Paper 1 runs two hours for both 实用文 and 作文. The 40-mark essay deserves the bulk
                    of that. Five minutes planning the email, fifteen writing, five checking 称呼、祝颂语
                    and 署名 is enough &mdash; and the checking pass is the highest-value five minutes on
                    the paper.
                  </p>
                </GuideCard>
              </section>

              <section id="email-format" className="scroll-mt-24">
                <SectionHeading icon={ListChecks}>The email format, line by line</SectionHeading>
                <p className="text-pretty">
                  Five structural elements, in this order. Each one is visible to the marker at a glance,
                  which is exactly why omissions are so expensive.
                </p>
                <div className="mt-6 space-y-4">
                  {EMAIL_SKELETON.map((row, index) => (
                    <GuideCard key={row.part}>
                      <div className="flex items-baseline gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0474BA]/10 text-sm font-bold tabular-nums text-[#0474BA]">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-gray-900">
                          {row.part}
                          <span className="ml-2 font-normal text-sm text-gray-500">{row.english}</span>
                        </h4>
                      </div>
                      <p className="mt-2 pl-10 text-pretty">{row.detail}</p>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <section id="email-marks" className="scroll-mt-24">
                <SectionHeading icon={Target}>How the 20 marks are split</SectionHeading>
                <p className="text-pretty">
                  This is the part most students never see, and it changes how you should revise. SEAB
                  splits the 20 marks into two equal halves:
                </p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900">内容 &middot; 10 marks</h4>
                    <p className="mt-2 text-pretty">
                      The top band asks for 内容充实，切合题意 &mdash; substantial content, on the point of
                      the question &mdash; and 内容有层次，说明详尽、有条理: layered, thoroughly explained,
                      logically ordered. &ldquo;Layered&rdquo; is the operative word. A list of facts scores
                      lower than the same facts with reasons attached.
                    </p>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900">语文与结构 &middot; 10 marks</h4>
                    <p className="mt-2 text-pretty">
                      Sentence fluency, characters, vocabulary, grammar and punctuation &ldquo;almost all
                      correct, and any errors minor&rdquo;; expression that is clear; and 组织得当，衔接紧凑，
                      段落分明 &mdash; well organised, tightly linked, clearly paragraphed.
                    </p>
                  </GuideCard>
                </div>
                <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
                  <p className="font-semibold text-gray-900">
                    Half the email question is not about what you say. A student who writes accurate,
                    well-punctuated Chinese in a correctly structured email starts from ten marks before
                    the content is judged at all &mdash; which is why format drilling pays off faster
                    here than anywhere else on the paper.
                  </p>
                </div>
              </section>

              <section id="email-mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>Where the marks go missing</SectionHeading>
                <div className="mt-2 space-y-4">
                  {EMAIL_MISTAKES.map((item) => (
                    <GuideCard key={item.title}>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="mt-2 text-pretty">{item.body}</p>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <section id="composition" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>作文: the 40-mark essay</SectionHeading>
                <p className="text-pretty">
                  作文 is the largest single question in Paper 1 &mdash; 40 marks against the email&rsquo;s
                  20. You choose one of three questions and write at least 300 characters, across
                  记叙文, 说明文 and 议论文.
                </p>
                <p className="mt-3 text-pretty">
                  The marks divide the same way as the email, but at double the weight: 内容 20 and
                  语文与结构 20, each graded across five bands with 17&ndash;20 as the top band.
                </p>

                <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
                  <p className="font-semibold text-gray-900">
                    The difference between the two rubrics is worth knowing
                  </p>
                  <p className="mt-2 text-pretty">
                    For 实用文, the top language band asks only that expression is 清楚 &mdash; clear.
                    For 作文 it asks for 用词丰富适当，句式正确且多样化: rich, apt vocabulary and correct,
                    <em> varied</em> sentence patterns. Variety is explicitly rewarded in the essay and
                    merely tolerated in the email. A student who writes both in the same flat, safe
                    register is capping their essay mark for a reason no one has told them.
                  </p>
                </div>

                <h3 className="mt-8 text-lg font-bold text-gray-900">The three 文体</h3>
                <div className="mt-4 grid gap-5">
                  {COMPOSITION_TYPES.map((type) => (
                    <TopicCard key={type.title} {...type} />
                  ))}
                </div>

                <GuideCard className="mt-6">
                  <p className="font-semibold text-gray-900">Choosing between the three</p>
                  <p className="mt-2 text-pretty">
                    Pick on evidence, not on comfort. 议论文 rewards students who read the news and can
                    marshal examples; 记叙文 rewards students with control of descriptive language. The
                    worst outcome is choosing 议论文 for a topic you have no examples for &mdash; you will
                    spend the paper padding, and 内容不足 is the hardest band to climb out of.
                  </p>
                </GuideCard>
              </section>

              <section id="comprehension" className="scroll-mt-24">
                <SectionHeading icon={Search}>阅读理解二: the heaviest section</SectionHeading>
                <p className="text-pretty">
                  At 35 marks &mdash; 17.5% of the whole grade &mdash; 阅读理解二 is the largest single
                  section on any written paper, bigger than the 作文 essay and bigger than 会话. Ten
                  open-ended questions across two passages, sitting inside a 90-minute paper that also
                  contains 语文应用 and 阅读理解一.
                </p>
                <p className="mt-3 text-pretty">
                  It also gets the least revision attention, because unlike 作文 and 口试 there is no
                  published marking rubric to revise against. SEAB defines the format &mdash; 2 篇短文,
                  10 questions, 开放式 &mdash; and nothing further. What follows is technique rather than
                  rubric: the recurring question types and what each one is actually testing.
                </p>

                <GuideCard className="mt-6">
                  <p className="font-semibold text-gray-900">Budget it properly</p>
                  <p className="mt-2 text-pretty">
                    Half of Paper 2&rsquo;s marks sit in this one section. On a 90-minute paper that
                    argues for roughly 40 minutes here, leaving about 20 for 语文应用 and 25 for
                    阅读理解一. Students who work through the paper in order and arrive at 阅读理解二 with
                    twenty minutes left have lost marks to the clock rather than to comprehension.
                  </p>
                </GuideCard>

                <h3 className="mt-8 text-lg font-bold text-gray-900">Six things the questions reward</h3>
                <div className="mt-4 space-y-4">
                  {COMPREHENSION_MOVES.map((move) => (
                    <GuideCard key={move.title}>
                      <h4 className="font-semibold text-gray-900">{move.title}</h4>
                      <p className="mt-2 text-pretty">{move.body}</p>
                    </GuideCard>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
                  <p className="font-semibold text-gray-900">A note on where this section comes from</p>
                  <p className="mt-2 text-pretty">
                    The format and mark figures above are from the SEAB syllabus. The technique is not
                    &mdash; SEAB publishes no band descriptors for 阅读理解二, so the guidance here reflects
                    established teaching practice rather than an official document. Treat it as a
                    starting framework and check it against your own school&rsquo;s marking.
                  </p>
                </div>
              </section>

              <section id="oral" className="scroll-mt-24">
                <SectionHeading icon={Mic}>口试: reading aloud &amp; conversation</SectionHeading>
                <p className="text-pretty">
                  At 50 marks, 口试 is worth more than the entire writing paper&rsquo;s 作文 section, and
                  students routinely under-prepare it because it cannot be practised silently.
                </p>
                <p className="mt-3 text-pretty">
                  The 50 marks are not split evenly, and the imbalance is the single most useful fact
                  about this paper: 朗读短文 carries 10, 会话 carries 40.
                </p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900">
                      朗读短文
                      <span className="ml-2 font-normal text-sm text-gray-500 tabular-nums">10 marks</span>
                    </h4>
                    <p className="mt-2 text-pretty">
                      Graded on two things only: 语音和清晰度 (accurate, clear pronunciation) and
                      语速、语调和流利度 &mdash; pace with a sense of rhythm, natural intonation
                      <em> with variation</em>, and fluent delivery with well-placed pauses. Use the
                      preparation time to mark where the sentences break. Reading a paragraph aloud daily
                      fixes more here than vocabulary revision does.
                    </p>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900">
                      会话
                      <span className="ml-2 font-normal text-sm text-gray-500 tabular-nums">40 marks</span>
                    </h4>
                    <p className="mt-2 text-pretty">
                      Four times the weight of the reading, split into 个人意见和内容的组织 (20) and
                      语文表达和流利度 (20). The examiner is assessing whether you can hold a view and
                      support it, so a one-sentence answer is the failure mode. Answer, give a reason,
                      then relate it to your own experience &mdash; three beats, every time.
                    </p>
                  </GuideCard>
                </div>

                <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
                  <p className="font-semibold text-gray-900">
                    The top 会话 band is defined by how little the examiner has to help you
                  </p>
                  <p className="mt-2 text-pretty">
                    Band 1 requires that you converse 无需主考员的引导 &mdash; without needing the
                    examiner&rsquo;s prompting. Band 2 allows that you 偶尔需要引导, occasionally need
                    leading. Band 3 is 在引导下才能交谈: you can only converse when led. The bands are
                    literally graded on how much the examiner has to pull answers out of you, and 举例说明
                    &mdash; supporting a view with an example &mdash; appears in the top two bands and
                    nowhere below them. Practise finishing your own answers rather than waiting for the
                    next question.
                  </p>
                </div>
                <GuideCard className="mt-5">
                  <p className="font-semibold text-gray-900">Use all ten minutes of preparation</p>
                  <p className="mt-2 text-pretty">
                    You may reread the passage and rewatch the clip as often as you like within the
                    preparation window. Students who watch the clip once and then sit waiting have thrown
                    away the only part of the oral they fully control.
                  </p>
                </GuideCard>
              </section>

              <section id="sec-2027" className="scroll-mt-24">
                <SectionHeading icon={CalendarClock}>What changes in 2027</SectionHeading>
                <p className="text-pretty">
                  2026 is the final Singapore-Cambridge GCE O-Level sitting. From 2027, Secondary 4
                  students take the Singapore-Cambridge Secondary Education Certificate (SEC) instead.
                  If you are currently in Secondary 3 or below, check the SEC syllabus for Chinese when
                  it is published rather than assuming the 1160 structure carries over unchanged.
                </p>
                <p className="mt-3 text-pretty">
                  The underlying skills &mdash; register control in 实用文, structured argument in 议论文,
                  holding a conversation in 会话 &mdash; are not going anywhere, so nothing on this page is
                  wasted preparation.
                </p>
              </section>

              <section id="sources" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Where these figures come from</SectionHeading>
                <p className="text-pretty">
                  Every mark allocation, duration and rubric description on this page is taken from the
                  SEAB syllabus document for Chinese (1160), 2026 examination, including 附录 A, the
                  official 实用文 marking guide. SEAB publishes the syllabus free on its own site, and it
                  is worth reading the four pages of 试卷格式 and 试卷蓝图 yourself &mdash; it is the only
                  document in Singapore that tells you exactly what the marks are for.
                </p>
                <a
                  href="https://www.seab.gov.sg/gce-o-level/o-level-syllabuses-examined-for-school-candidates-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F17720]"
                >
                  <Languages className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  Read the SEAB 1160 syllabus in full
                </a>
              </section>

              <RelatedGuides slug="o-level-chinese" />

              <GuideCTA
                title="Find your O-Level Chinese tutor"
                description={`Tell us whether it's Chinese or Higher Chinese and where the marks are going missing. We hand-match a vetted tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
                buttonText="Find your O-Level Chinese tutor"
                whatsappHref={whatsappHref}
              />
            </article>
          </div>

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
