import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FinalCTA from "@/components/FinalCTA";


export const metadata = {
  title: 'Best Science Tuition Singapore | PSLE, O Level, A Level Science Tutors | Lion City Tutors',
  description: 'Find expert science tutors in Singapore for PSLE, O Level & A Level Physics, Chemistry, Biology. Free matching with experienced tutors who make science engaging and understandable.',
  keywords: [
    'science tuition Singapore',
    'PSLE science tutor',
    'O level science tuition',
    'A level science tuition',
    'physics tutor Singapore',
    'chemistry tutor Singapore',
    'biology tutor Singapore',
    'private science tutor',
    'home tuition science'
  ],
  openGraph: {
    title: 'Best Science Tuition Singapore | Expert Physics, Chemistry & Biology Tutors',
    description: "Connect with Singapore's top science tutors for PSLE, O Level & A Level. Specialized in Physics, Chemistry & Biology with proven results.",
    url: 'https://www.lioncitytutors.com/science-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/public/science3.webp',
        alt: 'Science Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Science Tuition Singapore | Expert Science Tutors',
    description: 'Find qualified science tutors for PSLE, O Level & A Level. Free matching service with experienced tutors.',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/science-tuition',
  },
};

export default function ScienceTuition() {
  return (
    <>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 sm:space-y-12">
        {/* Section 1: Hero with Image */}
        <section className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-800">Science Made Simple: Find Your Perfect Science Tutor Today</h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            From PSLE Science to A-Level Physics, Chemistry, and Biology – our expert tutors make complex concepts crystal clear for Singapore students.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image
              src="/science3.webp"
              alt="Science tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/science3.webp"
              priority 
            />
          </div>

          <a href="/request-tutor">
            <Button className="w-full sm:w-auto text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 mt-4 bg-[#F17720] hover:bg-[#d9691c] text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              Request a Science Tutor
            </Button>
          </a>
        </section>

        {/* Section 2: Comprehensive Science Guides */}
        <section className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-blue-700">Complete Science Guides for Every Level</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
            Access our comprehensive guides for each science subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, scoring strategies, and expert tips.
          </p>
          
          {/* PSLE Science Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">PSLE Science Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master PSLE Science with our comprehensive guide covering essential concepts, exam strategies, and proven techniques for success. Perfect for Primary 5 and 6 students preparing for their PSLE.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Complete exam format breakdown</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Step-by-step answering techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Common misconceptions and how to avoid them</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/psle-science" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">PSLE Science Guide</span>
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
                      <span>Scientific concepts and processes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Experimental skills and techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Data analysis and interpretation</span>
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

          {/* O Level Science Guides */}
          <Card className="border-t-4 border-t-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">O Level Science Guides</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive guides for O Level Physics, Chemistry, and Biology. Each guide is tailored to help students master their chosen science subject and achieve excellent results.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/o-level-physics" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-emerald-700 group-hover:text-emerald-900 font-medium">O Level Physics Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
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
                    <Link href="/o-level-biology" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-emerald-700 group-hover:text-emerald-900 font-medium">O Level Biology Guide</span>
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
                    Each guide includes detailed syllabus coverage, practical skills, and exam strategies for both Pure and Combined Science students.
                  </p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Comprehensive topic coverage</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Practical experiment guides</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Past year paper analysis</span>
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

          {/* A Level Science Guides */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level Science Guides</h3>
                  <p className="text-gray-700 mb-4">
                    Advanced guides for H2 Physics, Chemistry, and Biology. These comprehensive resources help JC students master complex concepts and excel in their A Level examinations.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/a-level-physics" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-purple-700 group-hover:text-purple-900 font-medium">A Level Physics Guide</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">New</span>
                          <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
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
                    Each guide includes advanced concepts, practical skills, and detailed exam strategies for H2 Science subjects.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-3">Advanced Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Advanced concept explanations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Complex problem-solving techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Research and analysis skills</span>
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

        {/* Section 3: What Makes Our Science Tutors Different */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">What Makes LionCity's Science Tutors Different</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-emerald-700 mb-3">🔬 Hands-On Learning Approach</h3>
              <p className="text-gray-700 mb-4">
                Our science tutors don't just teach theory – they bring science to life with practical examples, virtual experiments, and real-world applications that make abstract concepts tangible and memorable.
              </p>
              
              <h3 className="text-xl font-bold text-blue-700 mb-3">📊 Data-Driven Progress Tracking</h3>
              <p className="text-gray-700 mb-4">
                Each tutor uses diagnostic assessments to identify knowledge gaps and tracks improvement with regular progress reports. Parents receive detailed updates on their child's conceptual understanding and exam readiness.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-purple-700 mb-3">🎯 Exam Strategy Specialists</h3>
              <p className="text-gray-700 mb-4">
                Our tutors are experts in Singapore's science examination formats. They teach students how to tackle different question types, manage time effectively, and maximize marks with proper scientific terminology and methodology.
              </p>
              
              <h3 className="text-xl font-bold text-emerald-700 mb-3">🧪 Subject Integration Skills</h3>
              <p className="text-gray-700">
                Science subjects are interconnected. Our tutors help students see the links between Physics, Chemistry, and Biology, making learning more cohesive and helping students excel across multiple science subjects.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Proven Results */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Outstanding Science Tuition Results</h2>
          <p className="text-gray-700 mb-4">
            Our science tutors have helped hundreds of Singapore students achieve remarkable improvements:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <strong className="text-blue-700">Sarah (Sec 4):</strong> Improved from F9 to B3 in O Level Chemistry in 6 months
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <strong className="text-emerald-700">Marcus (JC2):</strong> Jumped from U grade to A in H2 Physics with targeted problem-solving techniques
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <strong className="text-purple-700">Priya (P6):</strong> Scored 85+ in PSLE Science after struggling with scientific concepts
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <strong className="text-blue-700">David (Sec 3):</strong> Became top 10% in school after our Biology tutor's systematic approach
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Why Choose Us */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Why Singapore Families Trust Us for Science Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Qualified Science Graduates</h3>
                <p className="text-gray-600 mt-2">All our science tutors hold relevant degrees in their subjects and have proven track records of helping students improve grades significantly.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Personalized Learning Plans</h3>
                <p className="text-gray-600 mt-2">Each student receives a customized learning plan based on their current level, learning style, and specific areas needing improvement.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Flexible Scheduling</h3>
                <p className="text-gray-600 mt-2">Weekend classes, evening sessions, or holiday intensives – we work around your family's schedule to ensure consistent learning.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: Teaching Methods */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Our Proven Science Teaching Methods</h2>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image
              src="/science2.webp"
              alt="Interactive science teaching methods used by LionCity tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/science2.webp"
              priority 
            />
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-emerald-700">🔍 Concept Mapping</h3>
              <p className="text-gray-700">
                We help students visualize connections between scientific concepts, making complex topics easier to understand and remember during exams.
              </p>
              
              <h3 className="text-xl font-bold text-blue-700">📝 Active Recall Techniques</h3>
              <p className="text-gray-700">
                Rather than passive reading, our tutors use questioning techniques that force students to actively retrieve information, strengthening long-term memory.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-700">🧮 Problem-Solving Frameworks</h3>
              <p className="text-gray-700">
                Students learn systematic approaches to tackle different types of science problems, from calculation-heavy Physics questions to analytical Biology essays.
              </p>
              
              <h3 className="text-xl font-bold text-emerald-700">💡 Real-World Applications</h3>
              <p className="text-gray-700">
                We connect classroom science to everyday life, helping students understand why they're learning these concepts and how they apply in the real world.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Success Stories from Science Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <blockquote className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"My daughter used to hate Chemistry, but her tutor made it so interesting with real-life examples. She went from failing to getting A2 in O Levels!"</p>
              <cite className="text-blue-700 font-semibold">– Mrs Wong, Jurong</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-purple-50 to-emerald-50 p-6 rounded-xl border-l-4 border-l-emerald-500 shadow-md">
              <p className="italic mb-3">"The Physics tutor didn't just teach formulas – he explained the 'why' behind everything. My son finally understood Physics and scored A in A Levels."</p>
              <cite className="text-emerald-700 font-semibold">– Mr Chen, Ang Mo Kio</cite>
            </blockquote>
          </div>
        </section>

        {/* Section 8: Service Areas */}
        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Science Tuition Available Island-Wide</h2>
          <p className="text-gray-700 mb-4">
            Our experienced science tutors serve families across Singapore:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Ang Mo Kio</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Bedok</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Bishan</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Bukit Timah</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Clementi</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Hougang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Jurong West</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Pasir Ris</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Punggol</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Sembawang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Tampines</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Woodlands</span>
          </div>
        </section>

        {/* Section 9: Final CTA */}
        <FinalCTA 
          title="Ready to Boost Your Child's Science Grades?"
          description="Let's find the perfect Science tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          subject="Science"
        />
      </div>
    </>
  );
}