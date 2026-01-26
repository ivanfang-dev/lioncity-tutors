import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: 'Best Chemistry Tuition Singapore | Secondary, JC H1/H2, IGCSE, IB Chemistry Tutors | Lion City Tutors',
  description: 'Expert chemistry tutors in Singapore for Secondary, JC H1/H2, IGCSE & IB Chemistry. Specialized in organic chemistry, stoichiometry, chemical bonding, thermochemistry, and exam preparation with proven results.',
  keywords: [
    'chemistry tuition Singapore',
    'JC H2 chemistry tutor',
    'secondary chemistry tuition',
    'IGCSE chemistry tutor',
    'IB chemistry tuition',
    'organic chemistry tutor',
    'physical chemistry Singapore',
    'A level chemistry tuition',
    'private chemistry tutor Singapore',
    'stoichiometry tutor',
    'chemical bonding',
    'thermochemistry'
  ],
  openGraph: {
    title: 'Best Chemistry Tuition Singapore | Expert H1/H2, IGCSE & IB Chemistry Tutors',
    description: "Master chemistry with Singapore's top tutors. Specialized in Secondary, JC H1/H2, IGCSE & IB Chemistry with proven grade improvements. Complete syllabus coverage from atomic structure to organic chemistry.",
    url: 'https://www.lioncitytutors.com/chemistry-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/public/chemistry.webp',
        alt: 'Chemistry Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Chemistry Tuition Singapore | Expert Chemistry Tutors',
    description: 'Find qualified chemistry tutors for Secondary, JC H1/H2, IGCSE & IB levels. Complete syllabus coverage with free matching service.',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/chemistry-tuition',
  },
};

export default function ChemistryTuition() {
  return (
    <>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 sm:space-y-12">
        {/* Section 1: Headline */}
        <section className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-800">Chemistry Made Simple: Find Your Perfect Chemistry Tutor Today</h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            From O-Level to A-Level Chemistry – our expert tutors make complex concepts crystal clear for Singapore students.
          </p>
          
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image
              src="/chemistry.webp"
              alt="Chemistry tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/chemistry.webp"
              priority 
            />
          </div>
          
          <Link href="/request-tutor">
            <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 mt-3 sm:mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              Request a Chemistry Tutor
            </Button>
          </Link>
        </section>

        {/* Section 2: Comprehensive Chemistry Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-emerald-700">Complete Chemistry Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each chemistry subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, problem-solving strategies, and expert tips.
          </p>
          
          {/* O Level Chemistry Guide */}
          <Card className="border-t-4 border-t-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">O Level Chemistry Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master O Level Chemistry with our comprehensive guide covering atomic structure, chemical bonding, acids and bases, and organic chemistry. Perfect for Secondary 3 and 4 students.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>Complete syllabus coverage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>Chemical calculations mastery</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>Practical skills and experiments</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/o-level-chemistry" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-emerald-700 group-hover:text-emerald-900 font-medium">O Level Chemistry Guide</span>
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
                </div>
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Atomic structure and bonding</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Chemical reactions and equations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Acids, bases, and salts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Exam preparation strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IGCSE Chemistry Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">IGCSE Chemistry Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive guide for IGCSE Chemistry covering all core and extended topics. Master international curriculum requirements with detailed explanations and exam techniques.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/igcse-chemistry" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">IGCSE Chemistry Guide</span>
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
                    Detailed coverage of all IGCSE Chemistry topics including practical skills and data analysis techniques.
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
                      <span>Data analysis techniques</span>
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

          {/* A Level Chemistry Guide */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level Chemistry Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Advanced guide for A Level H1 and H2 Chemistry covering organic chemistry, physical chemistry, and inorganic chemistry with detailed mechanisms and calculations.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/a-level-chemistry" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-purple-700 group-hover:text-purple-900 font-medium">A Level Chemistry Guide</span>
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
                    Comprehensive coverage of H1 and H2 Chemistry with advanced organic mechanisms and physical chemistry calculations.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-3">Advanced Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Organic chemistry mechanisms</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Physical chemistry calculations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Inorganic chemistry patterns</span>
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

          {/* IB Chemistry Guide */}
          <Card className="border-t-4 border-t-indigo-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 mb-4">IB Chemistry Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Complete guide for IB Diploma Programme Chemistry (HL/SL) with inquiry-based learning approach. Includes Internal Assessment support and extended essay guidance.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/ibdp-chemistry" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                          <span className="text-indigo-700 group-hover:text-indigo-900 font-medium">IB Chemistry Guide</span>
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
                    Comprehensive IB Chemistry coverage with Internal Assessment support and inquiry-based learning techniques.
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

        {/* Section 3: Proven Chemistry Tuition Results */}
        <section className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 sm:p-6 rounded-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-emerald-700 text-center">Proven Chemistry Tuition Results in Singapore</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 text-center max-w-3xl mx-auto">
            Our chemistry tutors have helped hundreds of Singapore students achieve remarkable grade improvements across all levels and curricula:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">🏆</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-emerald-700">Rachel (JC2 - RJC):</strong> Improved from E grade to A in H2 Chemistry in 8 months with intensive organic chemistry mechanism training and thermochemistry problem-solving
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">⚗️</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-blue-700">Kevin (Sec 4 - ACSI):</strong> Jumped from F9 to B3 in O Level Chemistry after mastering chemical bonding concepts, stoichiometry calculations, and qualitative analysis
                </div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">🌟</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-purple-700">Amanda (IB Year 2 - UWC):</strong> Achieved 7/7 in IB Chemistry HL with systematic approach to thermodynamics, kinetics, and successful completion of Internal Assessment
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">🎯</span>
                <div className="text-sm sm:text-base">
                  <strong className="text-emerald-700">Ben (IGCSE - ACS International):</strong> Scored A* in IGCSE Chemistry after overcoming difficulties with stoichiometry calculations and periodic table trends
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Detailed Chemistry Levels and Syllabus Coverage */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-emerald-700 text-center">Complete Chemistry Tuition Coverage Across All Levels</h2>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Our chemistry tutors are experts in Singapore's MOE curriculum and international programs, providing comprehensive coverage of all chemistry topics from atomic structure to advanced organic chemistry reactions.
          </p>
          
          {/* Secondary Chemistry Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-emerald-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-emerald-700 mb-4 flex items-center">
                  🧪 Secondary Chemistry (Pure & Combined)
                </h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive coverage of O-Level and N-Level Chemistry syllabus with focus on practical applications and exam techniques.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-700 mb-2">Fundamental Concepts</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Experimental Chemistry</li>
                      <li>• Atomic Structure & Stoichiometry</li>
                      <li>• The Particulate Nature of Matter</li>
                      <li>• Chemical Formulae</li>
                      <li>• Mole Concept & Calculations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Chemical Reactions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Chemistry of Reactions</li>
                      <li>• Electrolysis & Applications</li>
                      <li>• Energy from Chemicals</li>
                      <li>• Acids, Bases and Salts</li>
                      <li>• Redox Reactions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">Advanced Topics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Periodicity & Periodic Table</li>
                      <li>• Metals & Reactivity</li>
                      <li>• Atmosphere & Environmental Chemistry</li>
                      <li>• Organic Chemistry Basics</li>
                      <li>• Qualitative Analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* IGCSE Chemistry Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-blue-700 mb-4 flex items-center">
                  🌍 IGCSE Chemistry
                </h3>
                <p className="text-gray-600 mb-6">
                  International curriculum coverage with emphasis on practical skills, data analysis, and comprehensive understanding of chemical principles.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Core Principles</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Particulate Nature of Matter</li>
                      <li>• Measurement & Purity</li>
                      <li>• Atoms, Elements & Compounds</li>
                      <li>• Atomic Structure</li>
                      <li>• Periodic Table Trends</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">Chemical Bonding & Reactions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Structure and Bonding</li>
                      <li>• Stoichiometry & Mole Concept</li>
                      <li>• Energetics of Reaction</li>
                      <li>• Rate of Reaction</li>
                      <li>• Reversible Reactions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">Specialized Topics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Transition Elements</li>
                      <li>• Extraction of Metals</li>
                      <li>• Alkanes & Alkenes</li>
                      <li>• Alcohols & Organic Chemistry</li>
                      <li>• Environmental Chemistry</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* JC Chemistry Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-purple-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-purple-700 mb-4 flex items-centers">
                  🎓 JC H1/H2 Chemistry
                </h3>
                <p className="text-gray-600 mb-6">
                  Advanced level chemistry covering complex topics with mathematical applications, detailed mechanisms, and university-preparation content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">Foundation Topics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Atomic Structure</li>
                      <li>• Chemical Bonding</li>
                      <li>• The Gaseous State</li>
                      <li>• Theories of Acids and Bases</li>
                      <li>• The Periodic Table</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Physical Chemistry</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Mole Concept & Stoichiometry</li>
                      <li>• Chemical Energetics</li>
                      <li>• Thermochemistry</li>
                      <li>• Reaction Kinetics</li>
                      <li>• Chemical Equilibria</li>
                    </ul>
                  </div>
                  
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-700 mb-2">Advanced Topics (H2)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Nanomaterials & Polymers</li>
                      <li>• Aqueous Solutions Chemistry</li>
                      <li>• Organic Chemistry & Isomerism</li>
                      <li>• Electrochemistry</li>
                      <li>• Transition Elements</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 italic">
                    <strong>Additional H2 Topics:</strong> Hydrocarbons, Halogen Derivatives, Hydroxy Compounds, Carbonyl Compounds, Carboxylic Acids and Derivatives, Nitrogen Compounds, Advanced Equilibria, and many more specialized areas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* IBDP Chemistry Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-indigo-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-indigo-700 mb-4 flex items-center">
                  🌐 IB Diploma Programme Chemistry (HL/SL)
                </h3>
                <p className="text-gray-600 mb-6">
                  International Baccalaureate chemistry with inquiry-based learning, internal assessments, and connections to real-world applications.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Core Topics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Stoichiometric Relationships</li>
                      <li>• Atomic Structure</li>
                      <li>• Periodicity</li>
                      <li>• Chemical Bonding & Structure</li>
                      <li>• Energetics/Thermochemistry</li>
                    </ul>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-700 mb-2">Advanced Concepts</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Chemical Kinetics</li>
                      <li>• Equilibrium Systems</li>
                      <li>• Acids and Bases</li>
                      <li>• Redox Processes</li>
                      <li>• Organic Chemistry</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-700 mb-2">Option Topics & IA</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Materials Chemistry</li>
                      <li>• Biochemistry</li>
                      <li>• Energy Applications</li>
                      <li>• Medicinal Chemistry</li>
                      <li>• Internal Assessment Support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Chemistry Topics We Specialize In */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl">
          <h2 className="text-3xl font-semibold mb-6 text-emerald-700 text-center">Chemistry Topics Our Expert Tutors Master</h2>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Our tutors specialize in breaking down complex chemistry concepts into manageable, understandable segments with practical examples and exam-focused strategies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">🧪 Organic Chemistry</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Functional Groups & Nomenclature</li>
                <li>• Reaction Mechanisms & Pathways</li>
                <li>• Isomerism & Stereochemistry</li>
                <li>• Synthesis Planning & Strategy</li>
                <li>• Spectroscopy & Structure Determination</li>
                <li>• Alkanes, Alkenes, Alcohols</li>
                <li>• Carbonyl Compounds & Carboxylic Acids</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-blue-700 mb-3">⚗️ Physical Chemistry</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Chemical Kinetics & Rate Laws</li>
                <li>• Thermodynamics & Enthalpy</li>
                <li>• Chemical Equilibrium</li>
                <li>• Le Chatelier's Principle</li>
                <li>• Electrochemistry & Redox</li>
                <li>• Acids, Bases & pH Calculations</li>
                <li>• Gas Laws & Ideal Gas Behavior</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-purple-700 mb-3">🔬 Inorganic Chemistry</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Periodic Trends & Properties</li>
                <li>• Chemical Bonding Theory</li>
                <li>• Transition Metal Chemistry</li>
                <li>• Group Chemistry Patterns</li>
                <li>• Crystal Structures & Lattices</li>
                <li>• Qualitative Analysis</li>
                <li>• Industrial Chemical Processes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: What Makes Our Chemistry Tutors Different */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-emerald-700 text-center">Why LionCity's Chemistry Tutors Excel in Singapore</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-emerald-700 mb-3">🧬 Advanced Molecular Visualization</h3>
              <p className="text-gray-700 mb-4">
                Our tutors use 3D molecular models, digital simulations, and interactive visual aids to help students understand complex molecular structures, reaction mechanisms, and chemical processes. This visual approach is particularly effective for organic chemistry and stereochemistry concepts.
              </p>
              
              <h3 className="text-xl font-bold text-blue-700 mb-3">📋 Systematic Problem-Solving Frameworks</h3>
              <p className="text-gray-700 mb-4">
                Chemistry requires methodical approaches. Our tutors teach students structured frameworks for balancing complex equations, multi-step stoichiometric calculations, and systematic organic synthesis problems that frequently appear in A-Level, IGCSE, and IB examinations.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-purple-700 mb-3">⚡ Real-World Application Focus</h3>
              <p className="text-gray-700 mb-4">
                We connect abstract chemical concepts to practical applications in pharmaceuticals, environmental science, materials engineering, and biotechnology. This approach helps students understand the relevance and importance of theoretical chemistry concepts.
              </p>
              
              <h3 className="text-xl font-bold text-emerald-700 mb-3">🎯 Examination Mastery Techniques</h3>
              <p className="text-gray-700">
                Our tutors are specialists in Singapore's chemistry examination formats, teaching students how to approach different question types, use appropriate chemical terminology, maximize marks in practical assessments, and excel in both theory and applied chemistry papers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Why Choose Us */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-emerald-700 text-center">Why Singapore Families Choose Us for Chemistry Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Chemistry Degree Specialists</h3>
                <p className="text-gray-600 mt-2">All our chemistry tutors hold relevant degrees in Chemistry, Chemical Engineering, Biochemistry, or related fields with extensive teaching experience in Singapore's MOE and international curricula.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Concept-Based Learning Approach</h3>
                <p className="text-gray-600 mt-2">We focus on building strong foundational understanding of chemical principles rather than rote memorization, ensuring students can tackle any chemistry problem with confidence and analytical thinking.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Multi-Curriculum Expertise</h3>
                <p className="text-gray-600 mt-2">Whether your child is in local MOE schools, international schools, or private institutions, our tutors are well-versed in different chemistry curricula and examination requirements.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 7: Teaching Methods */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-emerald-700 text-center">Our Proven Chemistry Teaching Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-emerald-700 mb-3">🔬 Step-by-Step Mechanism Breakdown</h3>
                <p className="text-gray-700">
                  Complex organic reactions and inorganic processes become manageable when broken down into individual steps. Our tutors teach students to identify electron movement, intermediate structures, transition states, and reaction pathways systematically.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-blue-700 mb-3">📊 Data Analysis & Interpretation</h3>
                <p className="text-gray-700">
                  Chemistry involves analyzing experimental data, graphs, and spectra. Students learn to interpret IR, NMR, and mass spectrometry data to identify unknown compounds, understand reaction progress, and solve structural problems.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-purple-700 mb-3">🧮 Mathematical Chemistry Applications</h3>
                <p className="text-gray-700">
                  From stoichiometry to thermodynamic calculations, our tutors ensure students are comfortable with the mathematical aspects of chemistry, including unit conversions, significant figures, and complex equilibrium calculations.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-emerald-700 mb-3">💡 Memory Techniques & Mnemonics</h3>
                <p className="text-gray-700">
                  Chemistry involves remembering numerous facts, formulas, periodic trends, and reaction patterns. We teach effective memory techniques and create mnemonics to help students recall information during high-pressure examinations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Success Stories from Chemistry Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <blockquote className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-xl border-l-4 border-l-emerald-500 shadow-md">
              <p className="italic mb-3">"My son was struggling with organic chemistry mechanisms until he met his tutor. The visual approach and step-by-step breakdowns made everything click. He got A in H2 Chemistry!"</p>
              <cite className="text-emerald-700 font-semibold">– Mrs Lim, Tampines</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"The chemistry tutor explained equilibrium and kinetics so clearly. My daughter finally understood why reactions behave the way they do. Highly recommend!"</p>
              <cite className="text-blue-700 font-semibold">– Mr Tan, Bishan</cite>
            </blockquote>
          </div>
        </section>

        {/* Section 9: Service Areas */}
        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Chemistry Tuition Available Island-Wide</h2>
          <p className="text-gray-700 mb-4">
            Our experienced chemistry tutors serve families across Singapore:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Ang Mo Kio</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Bedok</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Bishan</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Bukit Timah</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Clementi</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Hougang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Jurong West</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Marine Parade</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Pasir Ris</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Punggol</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Sembawang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Tampines</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Toa Payoh</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Woodlands</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Yishun</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Serangoon</span>
          </div>
        </section>

        {/* Section 10: Final CTA */}
        <FinalCTA 
          title="Ready to Excel in Chemistry?"
          description="Connect with our specialized chemistry tutors who make complex concepts clear and help you achieve your academic goals."
          buttonText="Request a Chemistry Tutor"
          subject="Chemistry"
        />
      </div>
    </>
  );
}