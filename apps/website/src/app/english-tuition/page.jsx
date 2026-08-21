import { MATCH_TIME } from '@/data/promises';
import { rangeFor } from '../tuition-rates/rates.mjs';
import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GuideCTA, RelatedGuides } from "@/components/guide";
import GuideSchema from "@/components/seo/GuideSchema";

// --- SEO & CONTENT DATA ---

const PRIMARY = rangeFor('primary');
const JC = rangeFor('jc');

const pageMetadata = {
  title: 'English Tuition Singapore, P1 to O-Level | LionCity Tutors',
  description: `English tuition in Singapore from primary to O-Level — composition, comprehension and oral technique. Tutors hand-matched in ${MATCH_TIME}, with no agency fee.`,
  keywords: [
    'English tuition Singapore', 'PSLE English tutor', 'O level English tuition', 'A level English tutor',
    'H1 GP tuition', 'JC English tutor', 'private English tutor Singapore', 'home tuition English',
    'secondary English tuition', 'primary English tuition', 'english tutor rates singapore'
  ],
  url: 'https://www.lioncitytutors.com/english-tuition',
  imageUrl: 'https://www.lioncitytutors.com/english-tuition_optimized.webp',
};

const faqData = [
  {
    question: "How do you select your English tutors?",
    answer: "We have a stringent selection process. Our English tutors are typically MOE-trained teachers, full-time tutors with years of experience, or top university graduates. We verify their academic qualifications and tutoring experience to ensure they can deliver results based on the latest MOE syllabus."
  },
  {
    question: "How quickly can we start the first lesson?",
    answer: `Our matching service is fast and efficient. After you submit a request, we typically find a suitable and qualified English tutor for you to review within ${MATCH_TIME}. The first lesson can often be arranged within a few days, depending on your and the tutor's availability.`
  },
  {
    question: "What are the typical rates for English tuition?",
    // Figures read from the rate card so this page and /tuition-rates can
    // never quote different numbers to the same parent.
    answer: `Rates depend on the tutor's qualifications and the student's level. Primary tuition runs $${PRIMARY.min} to $${PRIMARY.max} an hour and JC $${JC.min} to $${JC.max}, which is our published rate card rather than a quote — we confirm the exact rate with you before you commit.`
  },
  {
    question: "Is there a trial lesson?",
    answer: "While we don't offer free trial lessons, you are not locked into any long-term contract. You can decide whether to continue with the tutor after the first paid lesson. Our goal is to ensure a perfect match, and we can rematch you if you're not satisfied."
  }
];

export const metadata = {
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  alternates: { canonical: pageMetadata.url },
  openGraph: {
    title: pageMetadata.title,
    description: pageMetadata.description,
    url: pageMetadata.url,
    type: 'website',
    images: [{ url: pageMetadata.imageUrl, alt: 'A student receiving English tuition in Singapore' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.title,
    description: pageMetadata.description,
    images: [pageMetadata.imageUrl],
  },
};


export default function EnglishTuitionPage() {
  return (
    <>
      <GuideSchema
        slug="english-tuition"
        course={{
          name: 'English Tuition in Singapore',
          description: 'One-to-one English tuition covering composition, comprehension and oral from primary through to O-Level.',
          educationalLevel: 'Primary to GCE O-Level',
        }}
        faqs={faqData}
      />
      <div className="p-6 max-w-5xl mx-auto space-y-16">

        {/* Section 1: Hero */}
        <section className="text-center space-y-4">
          <h1 className="page-title text-primary">Expert English Tuition in Singapore for PSLE, O & A Levels</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Struggling with composition, comprehension, or GP essays? Lion City Tutors connects you with <strong className="text-blue-700">MOE-trained teachers and top-tier tutors</strong> who deliver results. Get your ideal tutor match in {MATCH_TIME}—<strong className="text-emerald-600">it's fast and completely free.</strong>
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/english-tuition_optimized.webp"
              alt="Students engaged in an English tuition lesson in Singapore"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <Link href="/request-tutor">
            <Button size="lg" className="h-auto text-[18.7px] font-bold max-w-full whitespace-normal px-6 py-4 sm:px-8 sm:py-6 bg-accent-fill hover:bg-accent-fill-hover text-white rounded-full shadow-lg transform hover:scale-105 transition-transform">
              Request Your English Tutor Now
            </Button>
          </Link>
        </section>

        {/* Section 2: Comprehensive English Guides */}
        <section className="space-y-8">
          <h2 className="section-title text-primary mb-6">Complete English Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each English subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, scoring strategies, and expert tips.
          </p>
          
          {/* PSLE English Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">PSLE English Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master PSLE English with our comprehensive guide covering essential skills, exam strategies, and proven techniques for success. Perfect for Primary 5 and 6 students preparing for their PSLE.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Complete exam format breakdown</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Composition writing techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Comprehension and oral strategies</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/psle-english" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">PSLE English Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Continuous writing skills</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Comprehension techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Oral communication skills</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Exam preparation strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* O Level English Guide */}
          <Card className="border-t-4 border-t-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">O Level English Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive guide for O Level English Language covering all papers and components. Master essay writing, summary skills, and comprehension techniques to achieve excellent results.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/o-level-english" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-emerald-700 group-hover:text-emerald-900 font-medium">O Level English Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Detailed coverage of all papers including essay writing, summary writing, and comprehension techniques for O Level success.
                  </p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Essay writing mastery</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Summary writing techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Comprehension strategies</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Exam technique workshops</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* A Level GP Guide */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level General Paper Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Advanced guide for A Level General Paper covering essay writing, comprehension, and application questions. Master complex arguments and critical analysis for H1 GP success.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/a-level-general-paper" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-purple-700 group-hover:text-purple-900 font-medium">A Level GP Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Comprehensive coverage of essay writing, comprehension, and application questions with advanced analytical techniques.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-3">Advanced Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Advanced essay techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Critical analysis skills</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Comprehension mastery</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>University preparation guidance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Tackling Common English Challenges */}
        <section>
          <h2 className="section-title text-primary mb-6 text-center">Tackling Common English Challenges Head-On</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChallengeCard
              title="Primary & PSLE English"
              points={[
                "Building a strong vocabulary and grammar foundation.",
                "Developing creative and structured composition writing.",
                "Mastering comprehension cloze and synthesis techniques.",
                "Preparing for oral communication and listening exams."
              ]}
              icon="✍️"
            />
            <ChallengeCard
              title="Secondary, O-Level & A-Level GP"
              points={[
                "Crafting persuasive essays and argumentative responses.",
                "Analyzing complex literary texts for English Literature.",
                "Advanced summary and critical analysis skills.",
                "Developing clarity and confidence in oral presentations."
              ]}
              icon="📚"
            />
          </div>
        </section>

        {/* Section 4: Tuition Rates */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="section-title text-primary mb-4 text-center">Transparent English Tuition Rates</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-6">
            No hidden costs. Find a qualified English tutor that fits your budget. Rates are based on tutor experience and academic level.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-blue-200 font-semibold text-blue-800">Level</th>
                  <th className="p-4 border-b-2 border-blue-200 font-semibold text-blue-800">Part-Time Tutors</th>
                  <th className="p-4 border-b-2 border-blue-200 font-semibold text-blue-800">Full-Time Tutors / MOE Teachers</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50">
                  <td className="p-4 border-b border-gray-200">Primary School</td>
                  <td className="p-4 border-b border-gray-200">$30 - $45 / hr</td>
                  <td className="p-4 border-b border-gray-200">$45 - $65 / hr</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="p-4 border-b border-gray-200">Secondary School</td>
                  <td className="p-4 border-b border-gray-200">$35 - $50 / hr</td>
                  <td className="p-4 border-b border-gray-200">$50 - $80 / hr</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="p-4 border-b border-gray-200">Junior College (JC)</td>
                  <td className="p-4 border-b border-gray-200">$50 - $70 / hr</td>
                  <td className="p-4 border-b border-gray-200">$70 - $120 / hr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Why Parents Trust Us */}
        <section>
          <h2 className="section-title text-primary mb-6 text-center">The Lion City Tutors Advantage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <AdvantageCard
              icon="🎯"
              title="Precision Matching"
              description="We don't just find any tutor. We find the right tutor for your child's specific needs and learning style."
            />
            <AdvantageCard
              icon="✅"
              title="Verified Tutors"
              description="All our tutors undergo a strict verification process for their qualifications and teaching experience."
            />
            <AdvantageCard
              icon="🚀"
              title="Fast & Free Service"
              description="Our matching service is 100% free. You only pay for the lessons conducted, directly to the tutor."
            />
          </div>
        </section>

        {/* Section 6: FAQ. Rendered open, not in an accordion: the FAQPage
            markup claims these answers are on the page, and a Radix accordion
            unmounts closed content, so they were absent from the HTML. */}
        <section>
          <h2 className="section-title text-primary mb-6 text-center">Frequently Asked Questions</h2>
          <div className="w-full max-w-3xl mx-auto space-y-6">
            {faqData.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                <p className="mt-2 text-base text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Final CTA */}
        <RelatedGuides slug="english-tuition" heading="Guides for this subject" />

        <GuideCTA
          title="Ready to Boost Your Child's English Grades?"
          description="Let's find the perfect English tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          whatsappHref={`https://wa.me/6588701152?text=${encodeURIComponent("Hi LionCity Tutors! I'd like help finding an English tutor.\n\nStudent level:\nCurrent grade:\nLocation:\nPreferred days & timing: ")}`}
        />
      </div>
    </>
  );
}


// --- HELPER COMPONENTS (Place these in your components folder) ---

const ChallengeCard = ({ title, points, icon }) => (
  <Card className="shadow-lg">
    <CardContent className="p-6">
      <h3 className="font-bold text-xl text-blue-700 mb-3 flex items-center">
        <span className="text-2xl mr-3">{icon}</span> {title}
      </h3>
      <ul className="text-gray-600 space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-emerald-500 mr-2 mt-1">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const AdvantageCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-bold text-lg text-blue-800">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);