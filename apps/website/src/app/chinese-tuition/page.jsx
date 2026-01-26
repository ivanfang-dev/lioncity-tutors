import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FinalCTA from "@/components/FinalCTA";

export const metadata = {
  title: 'Best Chinese Tuition Singapore | PSLE, O Level, A Level Chinese Tutors | Lion City Tutors',
  description: 'Find the best Chinese tutors in Singapore for PSLE, O Level, A Level & JC H1 Chinese. Free matching service with handpicked private tutors. Results guaranteed within 24 hours.',
  keywords: [
    'Chinese tuition Singapore',
    'PSLE Chinese tutor',
    'O level Chinese tuition',
    'A level Chinese tutor',
    'H1 Chinese tuition',
    'JC Chinese tutor',
    'private Chinese tutor Singapore',
    'home tuition Chinese',
    'secondary Chinese tuition',
    'primary Chinese tuition'
  ],
  openGraph: {
    title: 'Best Chinese Tuition Singapore | Expert PSLE, O & A Level Chinese Tutors',
    description: "Connect with Singapore's top Chinese tutors for PSLE, O Level, A Level & H1 Chinese. Free matching service with proven results. Request your tutor today!",
    url: 'https://www.lioncitytutors.com/chinese-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/images/chinese-tuition_optimized.webp',
        alt: 'Chinese Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Chinese Tuition Singapore | Expert Chinese Tutors',
    description: 'Find qualified Chinese tutors for PSLE, O Level & A Level. Free matching service with handpicked tutors. Results within 24 hours.',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/chinese-tuition',
  },
};

export default function ChineseTuition() {
  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Section 1: Headline */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-800">Excel in Chinese with Singapore's Top Tutors – Fast & Free</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            From PSLE to A-Levels, Lion City Tutors connects you with expert Chinese tutors who understand Singapore's bilingual education system – at no cost to you.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image 
              src="/chinese-tuition_optimized.webp" 
              alt="Chinese tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/chinese-tuition_optimized.webp"
              priority 
            />
          </div>
          <Link href="/request-tutor">
            <Button className="text-lg px-8 py-4 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              Request a Chinese Tutor
            </Button>
          </Link>
        </section>

        {/* Section 2: Comprehensive Chinese Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">Complete Chinese Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each Chinese subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, writing strategies, and expert tips.
          </p>
          
          {/* PSLE Chinese Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">PSLE Chinese Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master PSLE Chinese with our comprehensive guide covering composition writing, comprehension, and oral communication. Perfect for Primary 5 and 6 students preparing for their PSLE.
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
                      <span>Oral communication strategies</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/psle-chinese" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">PSLE Chinese Guide</span>
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
                      <span>Chinese composition writing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Reading comprehension skills</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Oral communication techniques</span>
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
        </section>

        {/* Section 3: Who We Help */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Comprehensive Chinese Tuition for Every Level</h2>
          <p className="text-gray-700 mb-4">
            Our experienced Chinese tutors specialize in Singapore's education system, helping students excel in all aspects of Chinese language learning.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong className="text-blue-600">Primary School Chinese</strong> (PSLE Chinese preparation)</li>
            <li><strong className="text-blue-600">Secondary School Chinese</strong> (O Level Chinese)</li>
            <li><strong className="text-blue-600">Junior College Chinese</strong> (H1 Chinese)</li>
            <li><strong className="text-blue-600">Higher Chinese</strong> (HCL for all levels)</li>
            <li><strong className="text-blue-600">Conversational Chinese</strong> & Cultural Appreciation</li>
          </ul>
        </section>

        {/* Section 3: Why Parents Trust Us */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Why Singapore Parents Choose Lion City Tutors for Chinese</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Native & Bilingual Tutors</h3>
                <p className="text-gray-600 mt-2">Our tutors are not just academically qualified but also native or near-native Chinese speakers who understand Singapore's bilingual context.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Quick Matching (24h)</h3>
                <p className="text-gray-600 mt-2">Get matched with qualified Chinese tutors within 24 hours, ensuring your child can start improving their language skills immediately.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Free Service</h3>
                <p className="text-gray-600 mt-2">No agency fees or hidden charges. You only pay for Chinese tuition lessons directly to your chosen tutor.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Student Success Stories */}
        <section className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Proven Chinese Tuition Results</h2>
          <p className="text-gray-700 mb-4">
            Our Chinese tutors have helped students achieve remarkable improvements:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <strong className="text-emerald-700">Wei Jie (Sec 4):</strong> Improved from C5 to A2 in O Level Chinese through focused composition and oral practice
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong className="text-blue-700">Xiao Mei (P6):</strong> Achieved AL1 in PSLE Chinese with enhanced vocabulary and writing skills
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-2xl">🧠</span>
              <div>
                <strong className="text-purple-700">Jia Hui (JC2):</strong> Excelled in H1 Chinese, moving from average to distinction level
              </div>
            </li>
          </ul>
        </section>

        {/* Section 5: What We Cover */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Comprehensive Chinese Tuition Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-emerald-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-700">Primary Chinese Tuition</h3>
                <ul className="text-gray-600 space-y-2 mt-3">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>PSLE Chinese exam preparation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Composition writing skills</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Oral communication practice</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Character recognition & writing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-blue-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Secondary & JC Chinese</h3>
                <ul className="text-gray-600 space-y-2 mt-3">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>O Level & A Level Chinese</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Essay writing and analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Higher Chinese preparation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Cultural appreciation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: Our Approach */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Beyond Language – We Build Cultural Understanding</h2>
          <p className="text-gray-700">
            Our Chinese tutors don't just teach the syllabus – they inspire a love for the language and culture. We carefully select tutors who excel in both academic excellence and cultural understanding, ensuring they can make learning Chinese engaging and meaningful for students of all levels.
          </p>
        </section>

        {/* Section 7: Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">What Parents Say About Our Chinese Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <blockquote className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-xl border-l-4 border-l-emerald-500 shadow-md">
              <p className="italic mb-3">"My daughter's Chinese composition has improved tremendously. The tutor's approach to teaching Chinese characters and idioms is very effective."</p>
              <cite className="text-emerald-700 font-semibold">– Mrs Tan, Ang Mo Kio</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"The tutor's focus on oral communication has really helped my son gain confidence in speaking Chinese."</p>
              <cite className="text-blue-700 font-semibold">– Mr Lim, Tampines</cite>
            </blockquote>
          </div>
        </section>

        {/* Section 8: Areas We Serve */}
        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Chinese Tuition Available Across Singapore</h2>
          <p className="text-gray-700 mb-4">
            Our network of qualified Chinese tutors serves families island-wide, including:
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

        {/* Section 9: Call to Action */}
        <FinalCTA 
          title="Help Your Child Excel in Chinese with Singapore's Best Tutors"
          description="Tell us about your child's Chinese learning needs, and we'll match you with a qualified, caring tutor who can make a real difference."
          buttonText="Request a Chinese Tutor Today"
          subject="Chinese"
        />
      </div>
    </>
  );
} 