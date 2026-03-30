import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FinalCTA from "@/components/FinalCTA";     

export const metadata = {
  title: 'Best Math Tuition Singapore | PSLE, O Level, A Level Math Tutors | Lion City Tutors',
  description: 'Find the best math tutors in Singapore for PSLE, O Level, A Level & JC H2 Math. Free matching service with handpicked private tutors. Results guaranteed within 24 hours. Expert tutors for E Math, A Math, H2 Math, and more.',
  keywords: [
    'math tuition Singapore',
    'PSLE math tutor',
    'O level math tuition',
    'A math tutor',
    'H2 math tuition',
    'JC math tutor',
    'private math tutor Singapore',
    'home tuition math',
    'secondary math tuition',
    'primary math tuition',
    'E math tuition',
    'A math tuition',
    'H2 math tuition',
    'PSLE math guide',
    'O level math guide',
    'A level math guide'
  ],
  openGraph: {
    title: 'Best Math Tuition Singapore | Expert PSLE, O & A Level Math Tutors',
    description: "Connect with Singapore's top math tutors for PSLE, O Level, A Level & H2 Math. Free matching service with proven results. Expert tutors for E Math, A Math, and H2 Math. Request your tutor today!",
    url: 'https://www.lioncitytutors.com/math-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/images/math-tuition.webp',
        alt: 'Math Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Math Tuition Singapore | Expert Math Tutors',
    description: 'Find qualified math tutors for PSLE, O Level & A Level. Free matching service with handpicked tutors. Expert in E Math, A Math, and H2 Math. Results within 24 hours.',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/math-tuition',
  },
  robots: 'index, follow',
  language: 'English',
  author: 'Lion City Tutors',
};

export default function MathTuition() {
  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Section 1: Headline */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-800">Struggling with Math? We'll Find You the Perfect Tutor – Fast & Free</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Whether it's PSLE, O-Level, or JC H2 Math, Lion City Tutors connects you with handpicked private tutors in Singapore – at no cost to you.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image
              src="/math-tuition_optimized.webp"
              alt="Math tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/math-tuition_optimized.webp"
              priority 
            />
          </div>
          <Link href="/request-tutor">
            <Button className="text-lg px-8 py-4 mt-4 bg-[#F17720] hover:bg-[#d9691c] text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              Request a Math Tutor
            </Button>
          </Link>
        </section>

        {/* New Section: Why Math Matters */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">Why Strong Math Skills Matter for Your Child's Future</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-bold text-lg text-blue-700">Academic Success</h3>
              <p className="text-gray-600 mt-2">Math is crucial for STEM subjects and university admissions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="font-bold text-lg text-blue-700">Career Opportunities</h3>
              <p className="text-gray-600 mt-2">Opens doors to high-demand tech and finance careers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="font-bold text-lg text-blue-700">Critical Thinking</h3>
              <p className="text-gray-600 mt-2">Develops problem-solving and logical reasoning skills</p>
            </div>
          </div>
        </section>

        {/* Section 2: Who We Help */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Expert Math Tuition for Every Level in Singapore</h2>
          <p className="text-gray-700 mb-4">
            Our experienced math tutors specialize in Singapore's education system, helping students excel across all levels and curricula.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong className="text-blue-600">Primary School Math Tuition</strong> (including PSLE Math preparation)</li>
            <li><strong className="text-blue-600">Secondary School Math Tuition</strong> (E Math & A Math for O Levels)</li>
            <li><strong className="text-blue-600">Junior College Math Tuition</strong> (H1, H2, H3 Mathematics)</li>
            <li><strong className="text-blue-600">International Curriculum Math</strong> (IB, IP, IGCSE programs)</li>
            <li><strong className="text-blue-600">Adult Math Learning</strong> & exam retakers support</li>
          </ul>
        </section>

        {/* New Section: Comprehensive Math Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">Complete Math Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each math subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, scoring strategies, and expert tips.
          </p>
          
          {/* PSLE Math Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">PSLE Math Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master PSLE Math with our comprehensive guide covering essential concepts, exam strategies, and proven techniques for success. Perfect for Primary 5 and 6 students preparing for their PSLE.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Complete exam format breakdown</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Step-by-step problem-solving techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Common misconceptions and how to avoid them</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/psle-math" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">PSLE Math Guide</span>
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
                      <span>Number concepts and operations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Problem-solving heuristics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Model drawing techniques</span>
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

          {/* O Level Math Guides */}
          <Card className="border-t-4 border-t-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">O Level Math Guides</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive guides for O Level Elementary Mathematics and Additional Mathematics. Each guide is tailored to help students master their chosen math subject and achieve excellent results.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/o-level-math" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-emerald-700 group-hover:text-emerald-900 font-medium">O Level Math Guide</span>
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
                    Each guide includes detailed syllabus coverage, problem-solving strategies, and exam techniques for both E Math and A Math students.
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
                      <span>Step-by-step solutions</span>
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

          {/* A Level Math Guides */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level Math Guides</h3>
                  <p className="text-gray-700 mb-4">
                    Advanced guides for H1, H2, and H3 Mathematics. These comprehensive resources help JC students master complex concepts and excel in their A Level examinations.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/a-level-math" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-purple-700 group-hover:text-purple-900 font-medium">A Level Math Guide</span>
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
                    Each guide includes advanced concepts, problem-solving techniques, and detailed exam strategies for H1, H2, and H3 Mathematics.
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
                      <span>Calculus and applications</span>
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

        {/* Section 3: Why Parents Trust Lion City Tutors */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Why Singapore Parents Choose Lion City Tutors for Math Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Handpicked Math Tutors</h3>
                <p className="text-gray-600 mt-2">We manually vet each math tutor, ensuring they have excellent academic credentials and proven teaching ability to help students improve their math grades.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Fast Tutor Matching (Within 24h)</h3>
                <p className="text-gray-600 mt-2">Submit a math tuition request and we'll match you with suitable qualified tutors in under a day, so your child can start improving immediately.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Completely Free Service</h3>
                <p className="text-gray-600 mt-2">No agency fees or hidden charges. You only pay for math tuition lessons directly to your chosen tutor – we handle everything else at no cost.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Real Student Progress */}
        <section className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Proven Math Tuition Results from Singapore Students</h2>
          <p className="text-gray-700 mb-4">
            Our math tutors have helped hundreds of Singapore students achieve remarkable improvements in their math grades:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <strong className="text-emerald-700">Ryan (Sec 4):</strong> Jumped from C5 to A2 in Additional Mathematics in just 4 months of weekly tuition
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong className="text-blue-700">Clara (P6):</strong> Improved from 60 to 88 marks in PSLE Math prelims – confidence skyrocketed
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-2xl">🧠</span>
              <div>
                <strong className="text-purple-700">Wei Jie (JC2):</strong> Advanced from 20th percentile to top 5 in H2 Mathematics with targeted tuition
              </div>
            </li>
          </ul>
        </section>

        {/*Math Subjects We Cover */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Comprehensive Math Tuition Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-t-4 border-t-emerald-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Primary Math Tuition</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">Numbers & Operations</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Whole Numbers up to 1,000,000</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Four Operations (Addition, Subtraction, Multiplication, Division)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Order of Operations (BODMAS)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Factors & Multiples</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">Fractions & Decimals</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Proper & Improper Fractions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Mixed Numbers & Conversions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Decimal Place Value & Operations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Percentage & Ratio</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">Measurement & Geometry</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Length, Mass & Volume</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Area & Perimeter</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>2D & 3D Shapes</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Angles & Symmetry</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">Problem Solving</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Model Drawing & Bar Models</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Guess & Check Method</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Working Backwards</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>PSLE Math Heuristics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-blue-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Secondary Math Tuition</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">E Math Topics</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Numbers & Algebra</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Functions & Graphs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Geometry & Trigonometry</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Mensuration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Coordinate Geometry</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Statistics & Probability</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Matrices & Transformations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Vectors in Two Dimensions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">A Math Topics</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Quadratic Functions & Equations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Logarithms & Indices</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Polynomials & Partial Fractions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Binomial Theorem</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Exponential & Logarithmic Functions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Trigonometric Functions & Identities</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Coordinate Geometry in Two Dimensions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Linear Law</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Differentiation & Applications</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Integration & Applications</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Kinematics</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">O Level Exam Preparation</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Past Year Paper Analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Common Question Types</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Problem-solving Strategies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Time Management Techniques</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Mock Exams & Practice Papers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-purple-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">JC H2 Math Tuition</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Functions & Graphs</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Functions & Inverse Functions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Exponential & Logarithmic Functions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Trigonometric Functions & Identities</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Graph Transformations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Calculus</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Differentiation Techniques</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Integration Methods</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Applications of Calculus</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Differential Equations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Vectors & Complex Numbers</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Vector Operations & Properties</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Lines & Planes in 3D</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Complex Number Arithmetic</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Statistics & Probability</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Probability Distributions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Normal Distribution</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Sampling & Estimation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Hypothesis Testing</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Sequences & Series</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Arithmetic & Geometric Sequences</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Sum of Series</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Convergence & Divergence</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Power Series & Taylor Series</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">A Level Exam Preparation</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Past Year Paper Analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Exam Techniques & Time Management</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Common Pitfalls & Solutions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Mock Exams & Practice Papers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 5: Our Tutor Philosophy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Beyond Academic Excellence – We Look for Patience and Passion in Math Teaching</h2>
          <p className="text-gray-700">
            We believe effective math tutors aren't just academically strong – they inspire confidence and make complex concepts accessible. That's why we carefully screen for teaching experience, communication skills, and student testimonials before any tutor joins our network. Our math tutors understand the Singapore education system and MOE syllabus requirements thoroughly.
          </p>
        </section>

        {/* Section 6: Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">What Parents Say About Our Math Tuition Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <blockquote className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-xl border-l-4 border-l-emerald-500 shadow-md">
              <p className="italic mb-3">"Amazing service – I received 3 qualified math tutor profiles within a day. My son actually looks forward to math lessons now and his grades have improved significantly!"</p>
              <cite className="text-emerald-700 font-semibold">– Mrs Tan, Tampines</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"Compared to other tuition agencies I tried before, Lion City Tutors really understood my daughter's specific math learning needs and found the perfect tutor."</p>
              <cite className="text-blue-700 font-semibold">– Mr Lim, Bishan</cite>
            </blockquote>
          </div>
        </section>

        {/* New Section: Areas We Serve */}
        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Math Tuition Available Across Singapore</h2>
          <p className="text-gray-700 mb-4">
            Our network of qualified math tutors serves families island-wide, including:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Ang Mo Kio</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Bedok</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Bishan</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Bukit Timah</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Clementi</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Hougang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Jurong</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Pasir Ris</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Punggol</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Sembawang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-emerald-400">• Tampines</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Woodlands</span>
          </div>
        </section>

        {/* Section 7: Call to Action */}
        <FinalCTA 
          title="Ready to Boost Your Child's Math Grades?"
          description="Let's find the perfect Math tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          subject="Math"
        />
      </div>
    </>
  );
}
