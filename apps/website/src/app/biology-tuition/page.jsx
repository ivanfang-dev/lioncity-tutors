import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import biologyImage from '../../../public/biology.webp';
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: 'Best Biology Tuition Singapore | Secondary, JC H1/H2, IGCSE, IB Biology Tutors | Lion City Tutors',
  description: 'Top biology tuition in Singapore. Experienced tutors for Secondary (O/N), IGCSE, JC H1/H2 and IB. Practical lab skills, exam strategies, and personalised lesson plans to boost confidence and grades.',
  keywords: [
    "biology tuition Singapore",
    "secondary biology tuition",
    "N(A) biology tutor",
    "O level biology tuition",
    "JC H2 biology tutor",
    "H1 biology tutor Singapore",
    "IGCSE biology tuition",
    "IB biology tutor",
    "private biology tutor Singapore",
    "biology enrichment Singapore",
    "cell biology tuition",
    "genetics tuition Singapore",
    "biology practical tuition"
  ],
  openGraph: {
    title: 'Best Biology Tuition Singapore | Secondary, JC H1/H2, IGCSE, IB Biology Tutors | Lion City Tutors',
    description: 'Top biology tuition in Singapore. Improve your grades with our experienced tutors and proven teaching framework: concept-first teaching, practical mastery, and exam strategies.',
    url: 'https://www.lioncitytutors.com/biology-tuition',
    images: [
      {
        url: '/biology.webp',
        width: 1200,
        height: 630,
        alt: 'Biology Tuition Singapore - Lion City Tutors',
      },
    ],
    type: 'article',
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.lioncitytutors.com/biology-tuition"
  },
  "headline": "Best Biology Tuition Singapore — Secondary, JC, IGCSE, IB | Lion City Tutors",
  "description": "Experienced biology tutors in Singapore offering Secondary (O/N), JC H1/H2, IGCSE and IB tuition. Focus on lab skills, exam techniques, concept mastery and personalised lesson plans.",
  "image": "https://www.lioncitytutors.com/biology.webp",
  "author": {
    "@type": "Person",
    "name": "LionCity Tutors"
  },
  "publisher": {
    "@type": "Organization",
    "name": "LionCity Tutors",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.lioncitytutors.com/logo.png"
    }
  },
  "datePublished": "2023-01-01",
  "dateModified": "2025-08-26"
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What levels of biology tuition do you provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide tuition for Secondary (O-Level and N-Level), IGCSE, JC H1/H2, and IB (SL/HL). Lessons are customised to the syllabus you follow and your exam board."
      }
    },
    {
      "@type": "Question",
      "name": "How does one-to-one biology tuition help improve exam grades?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "One-to-one tuition targets knowledge gaps, reinforces exam technique, and offers focused practical training. Tutors use concept-first lessons, past-paper practice and personalised revision plans to accelerate improvement."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer online lessons and in-person tuition?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — we match students to tutors for both online and in-person lessons across Singapore with flexible scheduling."
      }
    },
    {
      "@type": "Question",
      "name": "Can tutors help with biology practical assessments and IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Our tutors coach practical techniques, data handling, experimental design and Internal Assessment (IA) support for IB and school projects, while emphasising safety and scientific methodology."
      }
    }
  ]
};

export default function BiologyTuition() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="p-6 max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-green-800">Master Biology — Expert Tutors for Every Level in Singapore</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            From Secondary (O/N) Biology and Combined Science to IGCSE, JC H1/H2 and IB Biology — our specialised tutors translate complex ideas like cell biology, genetics, physiology and ecology into clear concepts and exam-ready answers.
          </p>

          <div className="my-8 relative w-full max-w-4xl mx-auto aspect-video overflow-hidden rounded-xl shadow-xl">
            <Image
              src={biologyImage}
              alt="Biology tuition in Singapore - Students learning cell biology, genetics and laboratory techniques"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              placeholder="blur"
              priority
            />
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/request-tutor">
              <Button className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                Request a Biology Tutor
              </Button>
            </Link>

            <Link href="#why-tuition" className="inline-block">
              <Button className="text-lg px-6 py-4 bg-white border border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg shadow-sm transition-all duration-200">
                Why Biology Tuition?
              </Button>
            </Link>
          </div>
        </section>

        {/* Overview & Value Proposition */}
        <section id="why-tuition" className="space-y-4">
          <h2 className="text-3xl font-semibold text-green-700 text-center">Why families choose LionCity Tutors for Biology</h2>
          <p className="text-gray-700 max-w-4xl mx-auto text-center">
            Biology is both conceptual and practical — success requires strong understanding of biological systems, confident practical skills, and polished exam technique. Our tutors combine subject expertise with proven teaching frameworks to help students build conceptual clarity, practical competence and consistent exam performance.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-green-700">Curriculum-Aligned Lessons</h3>
                <p className="text-sm text-gray-700 mt-2">Lessons map exactly to MOE, Cambridge IGCSE, and IB syllabi so students master what's actually examined.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Practical & IA Support</h3>
                <p className="text-sm text-gray-700 mt-2">Hands-on lab coaching, data analysis, and IA guidance (IB) that improves practical marks and scientific methods.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Personalised Lesson Plans</h3>
                <p className="text-sm text-gray-700 mt-2">Targets knowledge gaps with diagnostic tests, personalised learning goals and progress tracking each term.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comprehensive Biology Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-green-700">Complete Biology Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each biology subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, practical skills, and expert tips.
          </p>
          
          {/* O Level Biology Guide */}
          <Card className="border-t-4 border-t-green-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-green-700 mb-4">O Level Biology Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master O Level Biology with our comprehensive guide covering cell biology, genetics, ecology, and human physiology. Perfect for Secondary 3 and 4 students preparing for their O Level examinations.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Complete syllabus coverage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Practical skills and experiments</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Data analysis techniques</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/o-level-biology" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-green-700 group-hover:text-green-900 font-medium">O Level Biology Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Cell structure and function</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Genetics and inheritance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Human physiology systems</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Exam preparation strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IGCSE Biology Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">IGCSE Biology Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive guide for IGCSE Biology covering all core and extended topics. Master international curriculum requirements with detailed explanations and practical skills.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/igcse-biology" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">IGCSE Biology Guide</span>
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
                  <p className="text-gray-600 text-sm">
                    Detailed coverage of all IGCSE Biology topics including practical skills and scientific methodology.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>International curriculum focus</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Practical skills development</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Scientific methodology</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Exam technique workshops</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* A Level Biology Guide */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level Biology Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Advanced guide for A Level H1 and H2 Biology covering molecular biology, genetics, ecology, and evolution with detailed mechanisms and advanced concepts.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/a-level-biology" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-purple-700 group-hover:text-purple-900 font-medium">A Level Biology Guide</span>
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
                    Comprehensive coverage of H1 and H2 Biology with advanced molecular biology and ecological concepts.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-3">Advanced Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Molecular biology mechanisms</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Advanced genetics concepts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Ecology and evolution</span>
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

          {/* IB Biology Guide */}
          <Card className="border-t-4 border-t-indigo-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 mb-4">IB Biology Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Complete guide for IB Diploma Programme Biology (HL/SL) with inquiry-based learning approach. Includes Internal Assessment support and extended essay guidance.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/ibdp-biology" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                          <span className="text-indigo-700 group-hover:text-indigo-900 font-medium">IB Biology Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Comprehensive IB Biology coverage with Internal Assessment support and inquiry-based learning techniques.
                  </p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-indigo-700 mb-3">IB Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span>Inquiry-based learning</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span>Internal Assessment support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span>Extended essay guidance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span>Option topics coverage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detailed levels */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-green-700 text-center">Comprehensive coverage for every exam board and level</h2>
          <p className="text-gray-700 max-w-4xl mx-auto text-center mb-6">We tailor lessons for: Secondary (O & N), Combined Science, IGCSE, JC H1/H2 and IB Biology. Below are highlighted focus areas for each level.</p>

          <div className="space-y-8">
            {/* Secondary */}
            <Card className="border-t-4 border-t-green-500 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl text-green-700 mb-3">🌱 Secondary Biology (O/N Level & Combined Science)</h3>
                <p className="text-gray-700 mb-4">We build strong foundations — cell structure, movement of substances, biological molecules, nutrition, transport, respiration and plant biology — and emphasise practical skills and common structured-question templates.</p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-1">
                    <li>• Cell structure and organelles</li>
                    <li>• Diffusion, osmosis, active transport</li>
                    <li>• Nutrition & digestion</li>
                    <li>• Circulation and respiration basics</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Plant transport & photosynthesis</li>
                    <li>• Infectious disease and immunity</li>
                    <li>• Practical training: microscopy, titrations (where relevant)</li>
                    <li>• Exam practice: structured answers, keywords & command terms</li>
                  </ul>
                </div>


              </CardContent>
            </Card>

            {/* IGCSE */}
            <Card className="border-t-4 border-t-blue-500 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl text-blue-700 mb-3">🌍 IGCSE Biology</h3>
                <p className="text-gray-700 mb-4">IGCSE students get extra emphasis on practical skills, scientific inquiry, and extended-response techniques that are common in Cambridge papers.</p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul>
                    <li>• Classification & biodiversity</li>
                    <li>• Biochemical molecules & enzymes</li>
                    <li>• Transport & gas exchange</li>
                  </ul>
                  <ul>
                    <li>• Ecology & human impact</li>
                    <li>• Practical skills & data analysis</li>
                    <li>• Examiner-focused past-paper training</li>
                  </ul>
                </div>


              </CardContent>
            </Card>

            {/* JC */}
            <Card className="border-t-4 border-t-purple-500 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl text-purple-700 mb-3">🎓 JC H1/H2 Biology</h3>
                <p className="text-gray-700 mb-4">Advanced coverage in molecular biology, genetics, physiology and biotechnology with a focus on critical thinking, research skills and exam technique for H1 and H2 papers.</p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul>
                    <li>• Gene expression & regulation</li>
                    <li>• Cellular respiration & photosynthesis in depth</li>
                    <li>• Systems physiology & homeostasis</li>
                  </ul>
                  <ul>
                    <li>• Biotechnology & molecular techniques</li>
                    <li>• Data interpretation & extended essays</li>
                    <li>• University-readiness & mentorship</li>
                  </ul>
                </div>


              </CardContent>
            </Card>

            {/* IB */}
            <Card className="border-t-4 border-t-teal-500 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl text-teal-700 mb-3">🌐 IB Diploma Biology (SL/HL)</h3>
                <p className="text-gray-700 mb-4">IB students receive IA coaching, lab technique refinement and support for higher-order thinking questions that require analysis, evaluation and synthesis.</p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul>
                    <li>• Internal assessment (IA) design & execution</li>
                    <li>• HL option topics and in-depth labs</li>
                  </ul>
                  <ul>
                    <li>• Data handling, error analysis & IA write-up</li>
                    <li>• Extended essay & research mentoring</li>
                  </ul>
                </div>


              </CardContent>
            </Card>
          </div>
        </section>

        {/* How we teach */}
        <section>
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-4">How our biology tuition works — the LionCity method</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg text-green-700 mb-2">1. Diagnostic & personalised plan</h4>
                <p className="text-sm text-gray-700">We begin with a short diagnostic assessment to locate knowledge gaps, then build a plan focused on concepts, practicals and exam technique.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg text-blue-700 mb-2">2. Concept-first lessons</h4>
                <p className="text-sm text-gray-700">We prioritise deep understanding before practice — students learn the 'why' behind processes, then practise applying concepts to exam-style questions.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg text-purple-700 mb-2">3. Practical mastery & IA support</h4>
                <p className="text-sm text-gray-700">Hands-on skill-building for school practicals, IB IA support, and lab report writing so students gain both marks and scientific confidence.</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Typical lesson structure (60 mins)</h4>
              <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
                <li>5–10 min recap & Q&A</li>
                <li>15–25 min explicit teaching (concepts & worked examples)</li>
                <li>15–20 min guided practice (past paper or data handling)</li>
                <li>5–10 min review, actions & resources for self-study</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Resources we provide</h4>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>Annotated notes & summary sheets</li>
                <li>Exam-style question packs with model answers</li>
                <li>Practical checklists and IA templates (IB)</li>
                <li>Revision timetables and progress reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials + trust */}
        <section>
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-4">Proven outcomes & student success stories</h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto">Our matched tutors have helped many local families improve confidence and exam grades through targeted lessons, consistent feedback and exam-focused practice.</p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <blockquote className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-l-4 border-l-green-500 shadow-md">
              <p className="italic mb-3">"After weekly tuition and focused IA support, my daughter improved across her practical and theory marks. The tutor’s structured feedback made all the difference."</p>
              <cite className="text-green-700 font-semibold">– Mrs Lim, Tampines</cite>
            </blockquote>

            <blockquote className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"Clear explanations, regular past-paper practice and lab coaching helped my son move from average to distinction in O-Level Biology."</p>
              <cite className="text-blue-700 font-semibold">– Mr Tan</cite>
            </blockquote>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Tutor vetting:</strong> All tutors are degree-qualified and undergo a background check, demo lesson and vetting of pedagogy before joining our network.</p>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-4">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">How quickly will my child see improvement?</h4>
                <p className="text-sm text-gray-700">Improvement depends on starting point and commitment to practice. Many students notice improved understanding within 4–8 lessons; exam-grade improvements usually require sustained tuition & deliberate practice.</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Do tutors teach both content and exam technique?</h4>
                <p className="text-sm text-gray-700">Yes — we teach concept mastery, practical skills, and targeted exam technique including time management, command-term interpretation, and structured answers.</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Online vs in-person — which is better?</h4>
                <p className="text-sm text-gray-700">Both work well. Online tuition is flexible and effective for theory and data practice; in-person may be preferred for hands-on practical coaching. We match based on needs and geography.</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">How are tutors matched?</h4>
                <p className="text-sm text-gray-700">We match students with tutors based on syllabus, level, learning style and scheduling. Trial lessons help confirm chemistry and teaching approach before committing.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <FinalCTA 
          title="Ready to improve in Biology?"
          description="Request a matched tutor for a free trial lesson and personalised study plan. Flexible scheduling — online or in-person across Singapore."
          buttonText="Request a Biology Tutor"
          subject="Biology"
        />

        {/* Footer mini-links */}
        <section className="text-center text-sm text-gray-600">
          <p>Explore more: <Link href="/o-level-biology" className="text-green-600 hover:underline">O-Level Biology</Link> • <Link href="/igcse-biology" className="text-blue-600 hover:underline">IGCSE Biology</Link> • <Link href="/a-level-biology" className="text-purple-600 hover:underline">JC / A-Level Biology</Link></p>
        </section>
      </div>
    </>
  );
}
