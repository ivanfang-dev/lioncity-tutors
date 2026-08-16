import Link from 'next/link';
import { RelatedGuides } from '@/components/guide';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import GuideSchema from '@/components/seo/GuideSchema';

export const metadata = {
  title: 'Pinpointing Your Child\'s Learning Gaps | LionCity Tutors',
  description: "Grades slipping? A diagnostic guide to identifying the specific learning gaps behind it — PSLE English, Secondary A Maths and more — for Singapore parents.",
  keywords: [
    'child struggling in school', 
    'pinpoint learning gaps', 
    'PSLE learning gaps', 
    'secondary school struggles', 
    'why is my child failing math', 
    'Singapore education help for parents'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'A Parent\'s Guide to Pinpointing Your Child\'s Learning Gaps in Singapore',
    description: 'A structured guide with checklists to help Singaporean parents identify the root cause of their child\'s academic struggles before hiring a tutor.',
    url: 'https://www.lioncitytutors.com/blog/pinpointing-learning-gaps',
    type: 'article',
  },
   alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/pinpointing-learning-gaps',
  },
};

export default function PinpointingLearningGaps() {
  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: "Pinpointing Your Child's Learning Gaps", url: '/blog/pinpointing-learning-gaps' },
        ]}
        article={{
          url: '/blog/pinpointing-learning-gaps',
          headline: "Pinpointing Your Child's Learning Gaps | LionCity Tutors",
          description: "Grades slipping? A diagnostic guide to identifying the specific learning gaps behind it — PSLE English, Secondary A Maths and more — for Singapore parents.",
          datePublished: '2025-09-16',
          dateModified: '2026-08-05',
        }}
      />
      <main className="px-4 py-12 max-w-3xl mx-auto">
        <h1 className="page-title text-primary mb-4">The Parent's Diagnostic Toolkit: Find Out Exactly Why Your Child is Struggling in School</h1>
        <p className="text-sm text-gray-500 mb-8">Updated July 5, 2026 • 9 min read</p>

        <article className="space-y-8 text-gray-700 leading-relaxed">
          <p className="text-lg font-medium text-gray-800">
            It’s a uniquely stressful feeling for a parent: you see your child's grades slipping, but the report card doesn't tell the whole story. You're left with a dozen unanswered questions. Is it the teacher? Is it a specific topic? Is it something more?
          </p>
          <p>
            Before you can find the right solution, you need the right diagnosis. This guide provides the same structured, 4-step diagnostic process our top tutors use to uncover the real root cause of academic struggles.
          </p>

          {/* Animated Step-by-Step Section */}
          <div className="space-y-8 mt-12">
            
            {/* Step 1 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm animate-fadeInUp">
              <h3 className="text-2xl font-semibold text-blue-700 mb-3"><span className="text-blue-300 font-bold mr-2">Step 1:</span> Become a Detective - Analyse the Evidence</h3>
              <p>Gather your child’s recent worksheets and exam papers. Don't just look at the scores; look for patterns. The mistakes are clues.</p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Diagnostic Checklist: Primary School Math (PSLE Focus)</h4>
                <ul className="list-disc ml-4 space-y-2 text-sm">
                  <li><strong>Conceptual Gaps:</strong> Are mistakes clustered around topics like <strong>Fractions, Ratios, or Percentage</strong>? This points to a weak foundation.</li>
                  <li><strong>Application Gaps:</strong> Can they solve direct questions but fail at multi-step word problems? This reveals a weakness in <strong>Problem-Solving Heuristics</strong>.</li>
                  <li><strong>Careless Mistakes:</strong> Are marks lost to calculation errors or misreading instructions? This might be a focus issue, not a knowledge gap.</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
             <div className="p-6 bg-white rounded-lg border shadow-sm animate-fadeInUp animation-delay-300">
              <h3 className="text-2xl font-semibold text-green-700 mb-3"><span className="text-green-300 font-bold mr-2">Step 2:</span> Conduct an 'Interview' - Ask "How," Not "Why"</h3>
              <p>Sit with your child and ask them to explain *how* they arrived at a wrong answer. "Why did you get this wrong?" can feel accusatory. "Show me how you did it," is an invitation to share their thought process.</p>
              <blockquote className="border-l-4 border-green-300 pl-4 italic text-gray-600 mt-4">
                  "A child's explanation is a window into their learning gaps. Phrases like 'I just guessed' or 'I forgot the formula' are goldmines of information for a tutor."
              </blockquote>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm animate-fadeInUp animation-delay-600">
              <h3 className="text-2xl font-semibold text-purple-700 mb-3"><span className="text-purple-300 font-bold mr-2">Step 3:</span> Stress-Test the Foundation</h3>
              <p>Learning is like building blocks. A shaky block at the bottom will cause everything above it to crumble. Give your child a question from a previous year's topic that underpins their current weak area.</p>
               <div className="bg-purple-50 p-4 rounded-lg mt-4 text-sm">
                <strong>Example:</strong> If your child is struggling with Secondary 3's <strong>Algebraic Manipulation</strong>, give them a Secondary 2 question on <strong>Expansion and Factorisation</strong>. If they struggle with that, you’ve likely found the real source of the problem.
              </div>
            </div>

             {/* Step 4 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm animate-fadeInUp animation-delay-900">
              <h3 className="text-2xl font-semibold text-orange-700 mb-3"><span className="text-orange-300 font-bold mr-2">Step 4:</span> Form a Game Plan</h3>
              <p>Now that you have a clearer diagnosis, you can take targeted action. Your plan might be:</p>
               <ul className="list-disc ml-6 mt-4 space-y-2">
                <li><strong>For Conceptual Gaps:</strong> Dedicate revision time specifically to that foundational topic using assessment books.</li>
                <li><strong>For Application Gaps:</strong> Practice one type of word problem or heuristic per day to build confidence.</li>
                <li><strong>For Widespread or Deep Gaps:</strong> This is the point where seeking an expert who can create a structured recovery plan becomes the most effective strategy.</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-gray-50 rounded-lg border text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">You've Done the Diagnosis. Let Us Handle the Treatment.</h3>
            <p className="text-gray-700 mb-6 max-w-xl mx-auto">
              Pinpointing a learning gap is challenging work. Our experienced tutors are experts at creating personalized 'treatment plans' to close these gaps for good, rebuilding your child's knowledge and confidence from the ground up.
            </p>
            <Link 
              href="/request-tutor" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Get a Personalised Learning Plan
            </Link>
          </div>
        </article>
      
      {/* Reciprocal cluster links. This post is a registry spoke as of
          Aug 2026; before that it had a single inbound editorial link. */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <RelatedGuides slug="pinpointing-learning-gaps" heading="Continue your revision" hubLimit={4} />
      </div>
    </main>
    </>
  );
}