import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FinalCTA from "@/components/FinalCTA";

// --- SEO & CONTENT DATA ---

const pageMetadata = {
  title: 'Expert English Tuition Singapore | PSLE, O & A Level Tutors',
  description: 'Unlock your child\'s potential with Singapore\'s top English tutors for PSLE, O-Level, and A-Level. Lion City Tutors offers a free, 24-hour matching service for qualified home tutors.',
  keywords: [
    'English tuition Singapore', 'PSLE English tutor', 'O level English tuition', 'A level English tutor',
    'H1 GP tuition', 'JC English tutor', 'private English tutor Singapore', 'home tuition English',
    'secondary English tuition', 'primary English tuition', 'english tutor rates singapore'
  ],
  url: 'https://www.lioncitytutors.com/english-tuition',
  imageUrl: 'https://www.lioncitytutors.com/images/english-tuition-og.webp', // Use a dedicated OG image
};

const faqData = [
  {
    question: "How do you select your English tutors?",
    answer: "We have a stringent selection process. Our English tutors are typically MOE-trained teachers, full-time tutors with years of experience, or top university graduates. We verify their academic qualifications and tutoring experience to ensure they can deliver results based on the latest MOE syllabus."
  },
  {
    question: "How quickly can we start the first lesson?",
    answer: "Our matching service is fast and efficient. After you submit a request, we typically find a suitable and qualified English tutor for you to review within 24 hours. The first lesson can often be arranged within a few days, depending on your and the tutor's availability."
  },
  {
    question: "What are the typical rates for English tuition?",
    answer: "Tuition rates vary depending on the tutor's qualifications and experience, and the student's level. Generally, rates range from $30/hr for Primary School to $80/hr or more for experienced JC A-Level tutors. Our team will provide you with specific quotes based on your requirements."
  },
  {
    question: "Is there a trial lesson?",
    answer: "While we don't offer free trial lessons, you are not locked into any long-term contract. You can decide whether to continue with the tutor after the first paid lesson. Our goal is to ensure a perfect match, and we can rematch you if you're not satisfied."
  }
];

// --- JSON-LD SCHEMA ---

const JsonLdSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.lioncitytutors.com" },
            { "@type": "ListItem", "position": 2, "name": "English Tuition", "item": pageMetadata.url }
          ]
        },
        {
          "@type": "Service",
          "name": "English Tuition Matching Service",
          "serviceType": "Tutoring",
          "provider": {
            "@type": "Organization",
            "name": "Lion City Tutors",
            "url": "https://www.lioncitytutors.com",
            "logo": "https://www.lioncitytutors.com/images/logo.webp"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Singapore"
          },
          "description": "A free matching service connecting students with qualified private English tutors in Singapore for PSLE, O-Level, A-Level, and IP/IB curriculums.",
          "broker": {
            "@type": "Organization",
            "name": "Lion City Tutors"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }
      ]
    })}}
  />
);

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
      <JsonLdSchema />
      <div className="p-6 max-w-5xl mx-auto space-y-16">

        {/* Section 1: Hero */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800">Expert English Tuition in Singapore for PSLE, O & A Levels</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Struggling with composition, comprehension, or GP essays? Lion City Tutors connects you with <strong className="text-blue-700">MOE-trained teachers and top-tier tutors</strong> who deliver results. Get your ideal tutor match in 24 hours—<strong className="text-emerald-600">it's fast and completely free.</strong>
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
            <Button size="lg" className="text-lg px-8 py-6 bg-[#F17720] hover:bg-[#d9691c] text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform">
              Request Your English Tutor Now
            </Button>
          </Link>
        </section>

        {/* Section 2: Comprehensive English Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">Complete English Guides for Every Level</h2>
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
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Tackling Common English Challenges Head-On</h2>
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
          <h2 className="text-3xl font-semibold mb-4 text-center text-blue-800">Transparent English Tuition Rates</h2>
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
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">The Lion City Tutors Advantage</h2>
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

        {/* Section 6: FAQ */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqData.map((item, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-gray-700">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Section 7: Final CTA */}
        <FinalCTA 
          title="Ready to Boost Your Child's English Grades?"
          description="Let's find the perfect English tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          subject="English"
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