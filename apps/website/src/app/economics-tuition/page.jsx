import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: 'Best Economics Tuition Singapore | H1, H2, IB Economics Tutors | Lion City Tutors',
  description: 'Find the best economics tutors in Singapore for H1, H2, IB SL & HL Economics. Free matching service with handpicked private tutors. Results guaranteed within 24 hours.',
  keywords: [
    'economics tuition Singapore',
    'H1 economics tutor',
    'H2 economics tuition',
    'IB economics tutor',
    'JC economics tuition',
    'private economics tutor Singapore',
    'home tuition economics',
    'A level economics tuition',
    'IB HL economics',
    'IB SL economics'
  ],
  openGraph: {
    title: 'Best Economics Tuition Singapore | Expert H1, H2 & IB Economics Tutors',
    description: "Connect with Singapore's top economics tutors for H1, H2, IB SL & HL Economics. Free matching service with proven results. Request your tutor today!",
    url: 'https://www.lioncitytutors.com/economics-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/images/economics.webp',
        alt: 'Economics Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Economics Tuition Singapore | Expert Economics Tutors',
    description: 'Find qualified economics tutors for H1, H2 & IB Economics. Free matching service with handpicked tutors. Results within 24 hours.',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/economics-tuition',
  },
};

export default function EconomicsTuition() {
  return (
    <>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 sm:space-y-12">
        {/* Section 1: Headline */}
        <section className="text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-800">Struggling with Economics? We'll Find You the Perfect Tutor – Fast & Free</h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Whether it's H1, H2, or IB Economics, Lion City Tutors connects you with handpicked private tutors in Singapore – at no cost to you.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image
              src="/economics.webp"
              alt="Economics tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/economics.webp"
              priority 
            />
          </div>
          <Link href="/request-tutor">
            <Button className="w-full sm:w-auto text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              Request an Economics Tutor
            </Button>
          </Link>
        </section>

        {/* New Section: Why Economics Matters */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8 rounded-xl">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-700">Why Strong Economics Skills Matter for Your Child's Future</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏛️</div>
              <h3 className="font-bold text-base sm:text-lg text-blue-700">University Preparation</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Essential for business, finance, law, and public policy programs</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💼</div>
              <h3 className="font-bold text-base sm:text-lg text-blue-700">Career Opportunities</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Opens doors to banking, consulting, government, and business careers</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🧠</div>
              <h3 className="font-bold text-base sm:text-lg text-blue-700">Critical Analysis</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Develops analytical thinking and real-world problem-solving skills</p>
            </div>
          </div>
        </section>

        {/* Section 2: Comprehensive Economics Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">Complete Economics Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each economics subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, essay techniques, and expert tips.
          </p>
          
          {/* A Level Economics Guide */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level Economics Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master A Level H1 and H2 Economics with our comprehensive guide covering microeconomics, macroeconomics, and case study analysis. Perfect for JC students preparing for their A Level examinations.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Complete syllabus coverage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Essay writing techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>Case study analysis methods</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/economics-tuition" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-purple-700 group-hover:text-purple-900 font-medium">A Level Economics Guide</span>
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
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Microeconomics principles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Macroeconomics concepts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Economic analysis techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Exam preparation strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Who We Help */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Expert Economics Tuition for Every Level in Singapore</h2>
          <p className="text-gray-700 mb-4">
            Our experienced economics tutors specialize in Singapore's education system and international curricula, helping students excel across all levels.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong className="text-blue-600">H1 Economics Tuition</strong> (Junior College A Level preparation)</li>
            <li><strong className="text-blue-600">H2 Economics Tuition</strong> (Advanced A Level Economics)</li>
            <li><strong className="text-blue-600">IB SL Economics Tuition</strong> (International Baccalaureate Standard Level)</li>
            <li><strong className="text-blue-600">IB HL Economics Tuition</strong> (International Baccalaureate Higher Level)</li>
            <li><strong className="text-blue-600">University Economics Support</strong> & exam retakers assistance</li>
          </ul>
        </section>

        {/* Section 3: Why Parents Trust Lion City Tutors */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Why Singapore Parents Choose Lion City Tutors for Economics Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Handpicked Economics Tutors</h3>
                <p className="text-gray-600 mt-2">We manually vet each economics tutor, ensuring they have excellent academic credentials and proven ability to help students master economic concepts and improve grades.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Fast Tutor Matching (Within 24h)</h3>
                <p className="text-gray-600 mt-2">Submit an economics tuition request and we'll match you with suitable qualified tutors in under a day, so your child can start improving immediately.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Completely Free Service</h3>
                <p className="text-gray-600 mt-2">No agency fees or hidden charges. You only pay for economics tuition lessons directly to your chosen tutor – we handle everything else at no cost.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Real Student Progress */}
        <section className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Proven Economics Tuition Results from Singapore Students</h2>
          <p className="text-gray-700 mb-4">
            Our economics tutors have helped hundreds of Singapore students achieve remarkable improvements in their economics grades:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <strong className="text-emerald-700">Sarah (JC2):</strong> Improved from D grade to A in H2 Economics in 6 months with focused essay writing and case study practice
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong className="text-blue-700">Marcus (IB Year 2):</strong> Boosted IB HL Economics from 4 to 7 points with targeted IA and exam preparation support
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-2xl">🧠</span>
              <div>
                <strong className="text-purple-700">Li Wei (JC1):</strong> Gained confidence in H1 Economics analysis, moving from failing to consistent B+ grades
              </div>
            </li>
          </ul>
        </section>

        {/* Economics Subjects We Cover */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Comprehensive Economics Tuition Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-emerald-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">H1 & H2 Economics Tuition</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">Microeconomics</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Demand & Supply Analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Price Elasticity & Market Equilibrium</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Consumer & Producer Theory</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Market Structures & Competition</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Market Failure & Government Intervention</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">Macroeconomics</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>National Income & GDP</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Inflation & Unemployment</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Fiscal & Monetary Policy</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Economic Growth & Development</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Balance of Payments & Exchange Rates</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-2">A Level Exam Preparation</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Essay Writing Techniques</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Case Study Analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Data Response Questions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Past Year Paper Practice</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Time Management Strategies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-purple-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">IB SL & HL Economics Tuition</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Core Topics (SL & HL)</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Introduction to Economics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Microeconomics Foundations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Macroeconomics Principles</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>International Economics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Development Economics</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">HL Extension Topics</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Theory of the Firm</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Market Power & Strategic Behavior</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Welfare Economics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Behavioral Economics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Public Choice Theory</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Assessment Components</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Paper 1: Extended Response Questions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Paper 2: Data Response Questions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Paper 3: Policy Paper (HL Only)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Internal Assessment (IA) Portfolio</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Extended Essay Support (if Economics-focused)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Key Economic Concepts</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Scarcity & Resource Allocation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Opportunity Cost & Trade-offs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Economic Systems & Models</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Sustainability & Environmental Economics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Globalization & Economic Integration</span>
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
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Beyond Academic Excellence – We Look for Real-World Application in Economics Teaching</h2>
          <p className="text-gray-700">
            We believe effective economics tutors don't just teach theory – they connect economic concepts to current events and real-world scenarios. That's why we carefully screen for teaching experience, analytical skills, and the ability to make economics relevant and engaging. Our economics tutors understand both Singapore A Level requirements and IB assessment criteria thoroughly.
          </p>
        </section>

        {/* Section 6: Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">What Parents Say About Our Economics Tuition Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <blockquote className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-xl border-l-4 border-l-emerald-500 shadow-md">
              <p className="italic mb-3">"The economics tutor we found through Lion City Tutors transformed my daughter's understanding of the subject. Her essays improved dramatically and she actually enjoys economics now!"</p>
              <cite className="text-emerald-700 font-semibold">– Mrs Chen, Orchard</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"Amazing IB Economics support! The tutor helped my son with his IA and he scored a 7 in HL Economics. The service was professional and completely free."</p>
              <cite className="text-blue-700 font-semibold">– Mr Kumar, Bukit Timah</cite>
            </blockquote>
          </div>
        </section>

        {/* New Section: Areas We Serve */}
        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Economics Tuition Available Across Singapore</h2>
          <p className="text-gray-700 mb-4">
            Our network of qualified economics tutors serves families island-wide, including:
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
          title="Help Your Child Excel in Economics with Singapore's Best Tutors"
          description="Tell us about your child's economics learning needs, and we'll match you with a qualified, experienced tutor who can make a real difference."
          buttonText="Request an Economics Tutor Today"
          subject="Economics"
        />
      </div>
    </>
  );
}