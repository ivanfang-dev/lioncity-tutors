import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FinalCTA from "@/components/FinalCTA";


export const metadata = {
  title: 'Best Physics Tuition Singapore | Secondary, JC H1/H2, IGCSE, IB Physics Tutors | Lion City Tutors',
  description: 'Expert physics tutors in Singapore for Secondary, JC H1/H2, IGCSE & IB Physics. Specialized in mechanics, thermodynamics, electromagnetism, quantum physics, and exam preparation with proven results.',
  keywords: [
    'physics tuition Singapore',
    'JC H2 physics tutor',
    'secondary physics tuition',
    'IGCSE physics tutor',
    'IB physics tuition',
    'mechanics tutor',
    'electromagnetism Singapore',
    'A level physics tuition',
    'private physics tutor Singapore',
    'kinematics tutor',
    'thermodynamics',
    'quantum physics'
  ],
  openGraph: {
    title: 'Best Physics Tuition Singapore | Expert H1/H2, IGCSE & IB Physics Tutors',
    description: "Master physics with Singapore's top tutors. Specialized in Secondary, JC H1/H2, IGCSE & IB Physics with proven grade improvements. Complete syllabus coverage from mechanics to quantum physics.",
    url: 'https://www.lioncitytutors.com/physics-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/public/physics.webp',
        alt: 'Physics Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Physics Tuition Singapore | Expert Physics Tutors',
    description: 'Find qualified physics tutors for Secondary, JC H1/H2, IGCSE & IB levels. Complete syllabus coverage with free matching service.',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/physics-tuition',
  },
};

export default function PhysicsTuition() {
  return (
    <>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 sm:space-y-12">
        {/* Section 1: Hero with Image */}
        <section className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-800">Master Physics: Expert Tutors for Every Level in Singapore</h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            From Secondary Pure/Combined Physics to JC H1/H2, IGCSE and IB Physics – our specialized tutors transform complex physical concepts including mechanics, electromagnetism, thermodynamics, and quantum physics into clear, understandable knowledge.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image
              src="/physics.webp"
              alt="Physics tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/physics.webp"
              priority 
            />
          </div>    
          <a href="/request-tutor">
            <Button className="w-full sm:w-auto text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 mt-4 bg-[#F17720] hover:bg-[#d9691c] text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              Request a Physics Tutor
            </Button>
          </a>
        </section>

        {/* Section 2: Comprehensive Physics Guides */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">Complete Physics Guides for Every Level</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our comprehensive guides for each physics subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, problem-solving strategies, and expert tips.
          </p>
          
          {/* O Level Physics Guide */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">O Level Physics Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Master O Level Physics with our comprehensive guide covering mechanics, waves, electricity, and thermal physics. Perfect for Secondary 3 and 4 students preparing for their O Level examinations.
                  </p>
                  <ul className="text-gray-600 space-y-3 mb-6">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Complete syllabus coverage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Problem-solving techniques</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Practical skills and experiments</span>
                    </li>
                  </ul>
                  <div className="space-y-4 mb-6">
                    <Link href="/o-level-physics" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-blue-700 group-hover:text-blue-900 font-medium">O Level Physics Guide</span>
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
                      <span>Mechanics and motion</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Waves and sound</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Electricity and magnetism</span>
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

          {/* IGCSE Physics Guide */}
          <Card className="border-t-4 border-t-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">IGCSE Physics Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Comprehensive guide for IGCSE Physics covering all core and extended topics. Master international curriculum requirements with detailed explanations and exam techniques.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/igcse-physics" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span className="text-emerald-700 group-hover:text-emerald-900 font-medium">IGCSE Physics Guide</span>
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
                    Detailed coverage of all IGCSE Physics topics including practical skills and data analysis techniques.
                  </p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>International curriculum focus</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Practical skills development</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>Data analysis techniques</span>
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

          {/* A Level Physics Guide */}
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">A Level Physics Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Advanced guide for A Level H1 and H2 Physics covering complex topics with mathematical rigor. Master advanced mechanics, waves, electricity, and modern physics concepts.
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
                  </div>
                  <p className="text-gray-600 text-sm">
                    Comprehensive coverage of H1 and H2 Physics with advanced mathematical techniques and modern physics concepts.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-3">Advanced Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Advanced mathematical physics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Modern physics concepts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Quantum physics and relativity</span>
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

          {/* IB Physics Guide */}
          <Card className="border-t-4 border-t-indigo-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 mb-4">IB Physics Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Complete guide for IB Diploma Programme Physics (HL/SL) with inquiry-based learning approach. Includes Internal Assessment support and extended essay guidance.
                  </p>
                  <div className="space-y-4 mb-6">
                    <Link href="/ibdp-physics" className="block">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                          <span className="text-indigo-700 group-hover:text-indigo-900 font-medium">IB Physics Guide</span>
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
                    Comprehensive IB Physics coverage with Internal Assessment support and inquiry-based learning techniques.
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

        {/* Section 3: Detailed Physics Levels and Syllabus Coverage */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-blue-700 text-center">Complete Physics Tuition Coverage Across All Levels</h2>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Our physics tutors are experts in Singapore's MOE curriculum and international programs, providing comprehensive coverage of all physics topics from kinematics to advanced quantum mechanics and relativity.
          </p>
          
          {/* Secondary Physics Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-blue-700 mb-4 flex items-center">
                  ⚡ Secondary Physics (Pure & Combined)
                </h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive coverage of O-Level and N-Level Physics syllabus with focus on practical applications, problem-solving techniques, and experimental skills.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Mechanics & Motion</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Physical Quantities & Units</li>
                      <li>• Kinematics & Motion Graphs</li>
                      <li>• Dynamics & Newton's Laws</li>
                      <li>• Forces & Equilibrium</li>
                      <li>• Work, Energy & Power</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">Thermal & Waves</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Thermal Physics & Heat</li>
                      <li>• Kinetic Particle Theory</li>
                      <li>• Wave Properties & Sound</li>
                      <li>• Light & Electromagnetic Spectrum</li>
                      <li>• Reflection & Refraction</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">Electricity & Magnetism</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Static Electricity</li>
                      <li>• Current Electricity & Circuits</li>
                      <li>• D.C. Circuits & Ohm's Law</li>
                      <li>• Practical Electricity</li>
                      <li>• Magnetism & Electromagnetism</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* IGCSE Physics Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-green-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-green-700 mb-4 flex items-center">
                  🌍 IGCSE Physics
                </h3>
                <p className="text-gray-600 mb-6">
                  International curriculum coverage with emphasis on practical skills, data analysis, and comprehensive understanding of physical principles across all major physics domains.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">General Physics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Length & Time Measurements</li>
                      <li>• Motion & Speed-Time Graphs</li>
                      <li>• Mass & Weight</li>
                      <li>• Density & Pressure</li>
                      <li>• Forces & Momentum</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Thermal & Wave Physics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Thermal Properties of Matter</li>
                      <li>• Transfer of Thermal Energy</li>
                      <li>• Properties of Waves</li>
                      <li>• Light & Sound Waves</li>
                      <li>• Electromagnetic Spectrum</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">Electricity & Atomic Physics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Electrical Quantities & Circuits</li>
                      <li>• Electric Charge & Current</li>
                      <li>• Electromagnetic Effects</li>
                      <li>• Radioactivity & Atomic Structure</li>
                      <li>• Nuclear Physics Applications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* JC Physics Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-purple-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-purple-700 mb-4 flex items-center">
                  🎓 JC H1/H2 Physics
                </h3>
                <p className="text-gray-600 mb-6">
                  Advanced level physics covering complex topics with mathematical rigor, detailed derivations, and university-preparation content including modern physics concepts.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">Mechanics & Oscillations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Kinematics & Dynamics</li>
                      <li>• Forces & Newton's Laws</li>
                      <li>• Work, Energy & Power</li>
                      <li>• Circular Motion</li>
                      <li>• Simple Harmonic Motion</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Waves & Optics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Wave Motion & Superposition</li>
                      <li>• Stationary Waves</li>
                      <li>• Interference & Diffraction</li>
                      <li>• Wave-Particle Duality</li>
                      <li>• Polarization</li>
                    </ul>
                  </div>
                  
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-700 mb-2">Advanced Topics (H2)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gravitational Fields</li>
                      <li>• Electric & Magnetic Fields</li>
                      <li>• Electromagnetic Induction</li>
                      <li>• Alternating Current</li>
                      <li>• Quantum Physics & Lasers</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 italic">
                    <strong>Additional H2 Topics:</strong> Thermal Physics, Atomic & Nuclear Physics, Medical Physics applications, Modern Physics concepts, Advanced Laboratory Skills, and Data Analysis techniques.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* IBDP Physics Detailed Section */}
          <div className="mb-12">
            <Card className="border-t-4 border-t-indigo-500 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <h3 className="font-bold text-2xl text-indigo-700 mb-4 flex items-center">
                  🌐 IB Diploma Programme Physics (HL/SL)
                </h3>
                <p className="text-gray-600 mb-6">
                  International Baccalaureate physics with inquiry-based learning, internal assessments, extended essay support, and connections to real-world applications and current research.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-700 mb-2">Core Topics</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Measurements & Uncertainties</li>
                      <li>• Mechanics & Kinematics</li>
                      <li>• Thermal Physics</li>
                      <li>• Waves & Wave Phenomena</li>
                      <li>• Electricity & Magnetism</li>
                    </ul>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-700 mb-2">Advanced Concepts</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Circular Motion & Gravitation</li>
                      <li>• Atomic, Nuclear & Particle Physics</li>
                      <li>• Energy Production</li>
                      <li>• Wave Phenomena</li>
                      <li>• Fields (HL Only)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-700 mb-2">Option Topics & IA</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Relativity</li>
                      <li>• Engineering Physics</li>
                      <li>• Imaging</li>
                      <li>• Astrophysics</li>
                      <li>• Internal Assessment Support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Physics Topics We Specialize In */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700 text-center">Physics Topics Our Expert Tutors Master</h2>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Our tutors specialize in breaking down complex physics concepts into manageable, understandable segments with practical examples, visual demonstrations, and exam-focused problem-solving strategies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-blue-700 mb-3">⚡ Mechanics & Motion</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Kinematics & Motion Graphs</li>
                <li>• Newton's Laws & Applications</li>
                <li>• Forces & Free Body Diagrams</li>
                <li>• Work, Energy & Power</li>
                <li>• Momentum & Collisions</li>
                <li>• Circular Motion & Gravitation</li>
                <li>• Simple Harmonic Motion</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-purple-700 mb-3">🌊 Waves & Optics</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Wave Properties & Behavior</li>
                <li>• Sound Waves & Acoustics</li>
                <li>• Light & Electromagnetic Waves</li>
                <li>• Interference & Diffraction</li>
                <li>• Polarization & Wave-Particle Duality</li>
                <li>• Optics & Lens Systems</li>
                <li>• Doppler Effect & Applications</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-green-700 mb-3">⚡ Electricity & Magnetism</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Electric Fields & Coulomb's Law</li>
                <li>• Electric Potential & Capacitance</li>
                <li>• Current Electricity & Circuits</li>
                <li>• Magnetic Fields & Forces</li>
                <li>• Electromagnetic Induction</li>
                <li>• AC Circuits & Transformers</li>
                <li>• Maxwell's Equations Applications</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: What Makes Our Physics Tutors Different */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-blue-700 text-center">Why LionCity's Physics Tutors Excel in Singapore</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-3">📊 Mathematical Problem-Solving Mastery</h3>
              <p className="text-gray-700 mb-4">
                Our tutors excel at teaching the mathematical foundations essential for physics success. Students learn to set up equations systematically, handle vector calculations, apply calculus concepts, and interpret graphs and data with confidence across all physics topics.
              </p>
              
              <h3 className="text-xl font-bold text-purple-700 mb-3">🔬 Conceptual Understanding First</h3>
              <p className="text-gray-700 mb-4">
                Rather than memorizing formulas, our approach focuses on deep conceptual understanding. Students learn the 'why' behind physical laws, enabling them to tackle novel problems and apply principles to unfamiliar situations in examinations.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-3">🌟 Real-World Physics Applications</h3>
              <p className="text-gray-700 mb-4">
                We connect abstract physics concepts to everyday phenomena, technology applications, and current scientific research. This approach helps students understand the relevance of physics in fields like engineering, medicine, renewable energy, and space exploration.
              </p>
              
              <h3 className="text-xl font-bold text-blue-700 mb-3">🎯 Exam Technique Specialization</h3>
              <p className="text-gray-700">
                Our tutors are experts in Singapore's physics examination formats, teaching students effective strategies for multiple-choice questions, structured problems, practical assessments, and data analysis questions that appear in MOE, Cambridge, and IB physics papers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Outstanding Results */}
        <section className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <h2 className="text-3xl font-semibold mb-4 text-blue-700 text-center">Proven Physics Tuition Results in Singapore</h2>
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            Our physics tutors have helped hundreds of Singapore students achieve remarkable grade improvements across all levels and curricula:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <strong className="text-blue-700">Marcus (JC2 - NJC):</strong> Improved from D grade to A in H2 Physics in 6 months with intensive mechanics problem-solving and electromagnetic field theory mastery
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <strong className="text-purple-700">Sarah (Sec 4 - CHIJ):</strong> Jumped from F9 to B3 in O Level Physics after mastering kinematics, electricity concepts, and practical skills through systematic approach
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <strong className="text-green-700">David (IB Year 2 - UWCSEA):</strong> Achieved 7/7 in IB Physics HL with mastery of quantum mechanics, relativity, and successful completion of Internal Assessment investigation
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <strong className="text-blue-700">Emma (IGCSE - SAS):</strong> Scored A* in IGCSE Physics after overcoming difficulties with wave phenomena, electricity calculations, and radioactivity concepts
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Why Choose Us */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-blue-700 text-center">Why Singapore Families Choose Us for Physics Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700">Physics Degree Specialists</h3>
                <p className="text-gray-600 mt-2">All our physics tutors hold relevant degrees in Physics, Engineering, Applied Physics, or related fields with extensive teaching experience in Singapore's MOE and international curricula.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700">Problem-Solving Focused Approach</h3>
                <p className="text-gray-600 mt-2">We emphasize systematic problem-solving techniques and mathematical rigor rather than rote memorization, ensuring students can tackle any physics problem with confidence and logical thinking.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-green-700">Multi-Curriculum Expertise</h3>
                <p className="text-gray-600 mt-2">Whether your child is in local MOE schools, international schools, or private institutions, our tutors are well-versed in different physics curricula and examination requirements.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 7: Teaching Methods */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-blue-700 text-center">Our Proven Physics Teaching Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-700 mb-3">📐 Mathematical Foundation Building</h3>
                <p className="text-gray-700">
                  Physics success requires strong mathematical skills. Our tutors ensure students are comfortable with algebra, trigonometry, calculus applications, vector operations, and graph interpretation essential for solving complex physics problems systematically.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-purple-700 mb-3">🔬 Experimental Skills & Data Analysis</h3>
                <p className="text-gray-700">
                  Laboratory skills are crucial for physics success. Students learn proper experimental techniques, error analysis, data interpretation, graph plotting, and drawing valid conclusions from experimental observations and measurements.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-3">🎯 Visual Learning & Demonstrations</h3>
                <p className="text-gray-700">
                  Complex physics concepts become clearer through visual demonstrations, animations, and interactive simulations. We use diagrams, models, and technology to help students visualize abstract concepts like electromagnetic fields, wave interference, and quantum phenomena.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-blue-700 mb-3">💡 Analogies & Real-World Connections</h3>
                <p className="text-gray-700">
                  We use everyday analogies and real-world examples to make abstract physics principles relatable and memorable. This approach helps students remember concepts during high-pressure examinations and understand their practical applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Success Stories from Physics Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <blockquote className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-md">
              <p className="italic mb-3">"My daughter was struggling with electromagnetic induction until she met her physics tutor. The clear explanations and visual demonstrations made everything click. She improved from D to A in H2 Physics!"</p>
              <cite className="text-blue-700 font-semibold">– Mrs Chen, Orchard</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-purple-50 to-green-50 p-6 rounded-xl border-l-4 border-l-purple-500 shadow-md">
              <p className="italic mb-3">"The physics tutor explained kinematics and dynamics so clearly. My son finally understood Newton's laws and motion graphs. His O-Level Physics grades improved dramatically!"</p>
              <cite className="text-purple-700 font-semibold">– Mr Kumar, Jurong East</cite>
            </blockquote>
          </div>
        </section>

        {/* Section 9: Service Areas */}
        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Physics Tuition Available Island-Wide</h2>
          <p className="text-gray-700 mb-4">
            Our experienced physics tutors serve families across Singapore with specialized expertise in mechanics, electromagnetism, thermodynamics, and quantum physics:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Ang Mo Kio</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Bedok</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-green-400">• Bishan</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Bukit Timah</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Clementi</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-green-400">• Hougang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Jurong West</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Marine Parade</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-green-400">• Pasir Ris</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Punggol</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Sembawang</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-green-400">• Tampines</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Toa Payoh</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-purple-400">• Woodlands</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-green-400">• Yishun</span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm border-l-2 border-l-blue-400">• Serangoon</span>
          </div>
        </section>

        {/* Section 10: Physics Tuition FAQ */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-blue-700 text-center">Frequently Asked Questions About Physics Tuition</h2>
          <div className="space-y-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-700 mb-2">What makes physics tuition different from other subjects?</h3>
                <p className="text-gray-700">Physics requires strong mathematical foundations, conceptual understanding, and problem-solving skills. Our tutors focus on building these three pillars systematically, ensuring students can tackle complex mechanics, electromagnetism, and quantum physics problems with confidence.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-purple-700 mb-2">How do you help students with physics practical assessments?</h3>
                <p className="text-gray-700">Our tutors provide comprehensive training in experimental skills, data analysis, error calculation, and graph interpretation. Students learn proper laboratory techniques, measurement methods, and how to draw valid conclusions from experimental observations required for MOE, IGCSE, and IB physics practicals.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-green-700 mb-2">Can physics tutors help with both JC H1 and H2 Physics?</h3>
                <p className="text-gray-700">Yes, our tutors are qualified to teach both H1 and H2 Physics levels. H2 Physics covers more advanced topics like gravitational fields, electromagnetic induction, and quantum physics, while H1 focuses on core concepts. We customize our approach based on your syllabus requirements.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 11: Final CTA */}
        <FinalCTA 
          title="Ready to Boost Your Child's Physics Grades?"
          description="Let's find the perfect Physics tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          subject="Physics"
        />
        </div>
    </>
  );
}