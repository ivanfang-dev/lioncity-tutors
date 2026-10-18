import React from "react";
import Link from 'next/link';
import { ArrowRight, Star, Users, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { GuideCTA, RelatedGuides, ICON_STROKE } from "@/components/guide";
import GuideSchema from "@/components/seo/GuideSchema";
import Reviews from "@/components/Reviews";
import ShortlistArtifact from "@/components/ShortlistArtifact";
import { PHYSICS_SHORTLIST, PHYSICS_TUTOR_COUNT } from "@/data/shortlists";
import { REVIEW_SOURCES } from "@/data/reviews.mjs";

const google = REVIEW_SOURCES.google;


export const metadata = {
  title: 'Physics Tuition Singapore: O-Level & H2 | LionCity Tutors',
  description: 'Physics tuition in Singapore for O-Level, H1 and H2 — kinematics, electricity and practical skills. Tutors matched in 6 hours, with no agency fee for parents.',
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
        url: 'https://www.lioncitytutors.com/physics.webp',
        alt: 'Physics Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Physics Tuition Singapore | Expert Physics Tutors',
    description: 'Find qualified physics tutors for Secondary, JC H1/H2, IGCSE & IB levels. Complete syllabus coverage with free matching service.',
    images: ['https://www.lioncitytutors.com/physics.webp'],
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/physics-tuition',
  },
};

const SERVICE_AREAS = [
  'Ang Mo Kio', 'Bedok', 'Bishan', 'Bukit Timah', 'Clementi', 'Hougang', 'Jurong West', 'Marine Parade',
  'Pasir Ris', 'Punggol', 'Sembawang', 'Tampines', 'Toa Payoh', 'Woodlands', 'Yishun', 'Serangoon',
];

export default function PhysicsTuition() {
  return (
    <>
      <GuideSchema
        slug="physics-tuition"
        course={{
          name: 'Physics Tuition in Singapore',
          description: 'One-to-one Physics tuition for O-Level, H1 and H2, covering kinematics, electricity and the practical paper.',
          educationalLevel: 'GCE O-Level to A-Level',
        }}
      />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {/* Section 1: Hero with the example shortlist */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] xl:-mx-16 items-center gap-12 lg:gap-14 pt-4 sm:pt-8">
          <div>
            <h1 className="page-title text-primary">Master Physics: Expert Tutors for Every Level in Singapore</h1>
            <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl text-pretty">
              From Secondary Pure/Combined Physics to JC H1/H2, IGCSE and IB Physics – our specialized tutors transform complex physical concepts including mechanics, electromagnetism, thermodynamics, and quantum physics into clear, understandable knowledge.
            </p>
            <Button asChild className="h-auto text-[18.7px] font-bold w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 mt-8 bg-accent-fill hover:bg-accent-fill-hover text-white rounded-full shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-[transform,box-shadow,background-color] duration-300">
              <a href="/request-tutor">Request a Physics Tutor</a>
            </Button>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <li>
                <a href={google.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-primary hover:underline">
                  <Star className="h-4 w-4 fill-rating text-rating" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  <span className="tabular-nums">{google.rating} on Google · {google.count} reviews</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
                {PHYSICS_TUTOR_COUNT} physics tutors
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
                No agency fee
              </li>
            </ul>
          </div>
          <ShortlistArtifact shortlist={PHYSICS_SHORTLIST} subject="physics" />
        </section>

        {/* Section 2: Comprehensive Physics Guides */}
        <section>
          <div className="max-w-3xl mb-8">
            <h2 className="section-title text-primary mb-3">Complete Physics Guides for Every Level</h2>
            <p className="text-gray-600 text-pretty">
              Access our comprehensive guides for each physics subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, problem-solving strategies, and expert tips.
            </p>
          </div>

          <div className="space-y-6">
            {/* O Level Physics Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">O Level Physics Guide</h3>
                  <p className="text-gray-700 mb-4 text-pretty">
                    Master O Level Physics with our comprehensive guide covering mechanics, waves, electricity, and thermal physics. Perfect for Secondary 3 and 4 students preparing for their O Level examinations.
                  </p>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-600 mb-6">
                    <li>Complete syllabus coverage</li>
                    <li>Problem-solving techniques</li>
                    <li>Practical skills and experiments</li>
                  </ul>
                  <Link href="/o-level-physics" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the O Level Physics Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What You’ll Learn:</h4>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-700">
                    <li>Mechanics and motion</li>
                    <li>Waves and sound</li>
                    <li>Electricity and magnetism</li>
                    <li>Exam preparation strategies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IGCSE Physics Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">IGCSE Physics Guide</h3>
                  <p className="text-gray-700 mb-5 text-pretty">
                    Comprehensive guide for IGCSE Physics covering all core and extended topics. Master international curriculum requirements with detailed explanations and exam techniques.
                  </p>
                  <Link href="/igcse-physics" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the IGCSE Physics Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-sm text-gray-600 text-pretty">
                    Detailed coverage of all IGCSE Physics topics including practical skills and data analysis techniques.
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-700">
                    <li>International curriculum focus</li>
                    <li>Practical skills development</li>
                    <li>Data analysis techniques</li>
                    <li>Exam technique workshops</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* A Level Physics Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">A Level Physics Guide</h3>
                  <p className="text-gray-700 mb-5 text-pretty">
                    Advanced guide for A Level H1 and H2 Physics covering complex topics with mathematical rigor. Master advanced mechanics, waves, electricity, and modern physics concepts.
                  </p>
                  <Link href="/a-level-physics" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the A Level Physics Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-sm text-gray-600 text-pretty">
                    Comprehensive coverage of H1 and H2 Physics with advanced mathematical techniques and modern physics concepts.
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Advanced Features:</h4>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-700">
                    <li>Advanced mathematical physics</li>
                    <li>Modern physics concepts</li>
                    <li>Quantum physics and relativity</li>
                    <li>University preparation guidance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IB Physics Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">IB Physics Guide</h3>
                  <p className="text-gray-700 mb-5 text-pretty">
                    Complete guide for IB Diploma Programme Physics (HL/SL) with inquiry-based learning approach. Includes Internal Assessment support and extended essay guidance.
                  </p>
                  <Link href="/ibdp-physics" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the IB Physics Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-sm text-gray-600 text-pretty">
                    Comprehensive IB Physics coverage with Internal Assessment support and inquiry-based learning techniques.
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">IB Features:</h4>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-700">
                    <li>Inquiry-based learning</li>
                    <li>Internal Assessment support</li>
                    <li>Extended essay guidance</li>
                    <li>Option topics coverage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Detailed Physics Levels and Syllabus Coverage */}
        <section>
          <div className="max-w-3xl mb-8">
            <h2 className="section-title text-primary mb-3">Complete Physics Tuition Coverage Across All Levels</h2>
            <p className="text-gray-600 text-pretty">
              Our physics tutors are experts in Singapore’s MOE curriculum and international programs, providing comprehensive coverage of all physics topics from kinematics to advanced quantum mechanics and relativity.
            </p>
          </div>

          <div className="space-y-6">
            {/* Secondary Physics Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secondary Physics (Pure & Combined)</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                Comprehensive coverage of O-Level and N-Level Physics syllabus with focus on practical applications, problem-solving techniques, and experimental skills.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Mechanics & Motion</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Physical Quantities & Units</li>
                    <li>Kinematics & Motion Graphs</li>
                    <li>Dynamics & Newton’s Laws</li>
                    <li>Forces & Equilibrium</li>
                    <li>Work, Energy & Power</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Thermal & Waves</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Thermal Physics & Heat</li>
                    <li>Kinetic Particle Theory</li>
                    <li>Wave Properties & Sound</li>
                    <li>Light & Electromagnetic Spectrum</li>
                    <li>Reflection & Refraction</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Electricity & Magnetism</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Static Electricity</li>
                    <li>Current Electricity & Circuits</li>
                    <li>D.C. Circuits & Ohm’s Law</li>
                    <li>Practical Electricity</li>
                    <li>Magnetism & Electromagnetism</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IGCSE Physics Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IGCSE Physics</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                International curriculum coverage with emphasis on practical skills, data analysis, and comprehensive understanding of physical principles across all major physics domains.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">General Physics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Length & Time Measurements</li>
                    <li>Motion & Speed-Time Graphs</li>
                    <li>Mass & Weight</li>
                    <li>Density & Pressure</li>
                    <li>Forces & Momentum</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Thermal & Wave Physics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Thermal Properties of Matter</li>
                    <li>Transfer of Thermal Energy</li>
                    <li>Properties of Waves</li>
                    <li>Light & Sound Waves</li>
                    <li>Electromagnetic Spectrum</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Electricity & Atomic Physics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Electrical Quantities & Circuits</li>
                    <li>Electric Charge & Current</li>
                    <li>Electromagnetic Effects</li>
                    <li>Radioactivity & Atomic Structure</li>
                    <li>Nuclear Physics Applications</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* JC Physics Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JC H1/H2 Physics</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                Advanced level physics covering complex topics with mathematical rigor, detailed derivations, and university-preparation content including modern physics concepts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Mechanics & Oscillations</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Kinematics & Dynamics</li>
                    <li>Forces & Newton’s Laws</li>
                    <li>Work, Energy & Power</li>
                    <li>Circular Motion</li>
                    <li>Simple Harmonic Motion</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Waves & Optics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Wave Motion & Superposition</li>
                    <li>Stationary Waves</li>
                    <li>Interference & Diffraction</li>
                    <li>Wave-Particle Duality</li>
                    <li>Polarization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Advanced Topics (H2)</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Gravitational Fields</li>
                    <li>Electric & Magnetic Fields</li>
                    <li>Electromagnetic Induction</li>
                    <li>Alternating Current</li>
                    <li>Quantum Physics & Lasers</li>
                  </ul>
                </div>
              </div>
              <p className="mt-6 border-t border-gray-100 pt-6 text-sm text-gray-600 text-pretty">
                <strong className="font-semibold text-gray-900">Additional H2 Topics:</strong> Thermal Physics, Atomic & Nuclear Physics, Medical Physics applications, Modern Physics concepts, Advanced Laboratory Skills, and Data Analysis techniques.
              </p>
            </div>

            {/* IBDP Physics Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IB Diploma Programme Physics (HL/SL)</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                International Baccalaureate physics with inquiry-based learning, internal assessments, extended essay support, and connections to real-world applications and current research.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Core Topics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Measurements & Uncertainties</li>
                    <li>Mechanics & Kinematics</li>
                    <li>Thermal Physics</li>
                    <li>Waves & Wave Phenomena</li>
                    <li>Electricity & Magnetism</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Advanced Concepts</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Circular Motion & Gravitation</li>
                    <li>Atomic, Nuclear & Particle Physics</li>
                    <li>Energy Production</li>
                    <li>Wave Phenomena</li>
                    <li>Fields (HL Only)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Option Topics & IA</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Relativity</li>
                    <li>Engineering Physics</li>
                    <li>Imaging</li>
                    <li>Astrophysics</li>
                    <li>Internal Assessment Support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Physics Topics We Specialize In */}
        <section className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 sm:p-10">
          <div className="max-w-3xl mb-8">
            <h2 className="section-title text-primary mb-3">Physics Topics Our Expert Tutors Master</h2>
            <p className="text-gray-700 text-pretty">
              Our tutors specialize in breaking down complex physics concepts into manageable, understandable segments with practical examples, visual demonstrations, and exam-focused problem-solving strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mechanics & Motion</h3>
              <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-sm text-gray-700">
                <li>Kinematics & Motion Graphs</li>
                <li>Newton’s Laws & Applications</li>
                <li>Forces & Free Body Diagrams</li>
                <li>Work, Energy & Power</li>
                <li>Momentum & Collisions</li>
                <li>Circular Motion & Gravitation</li>
                <li>Simple Harmonic Motion</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Waves & Optics</h3>
              <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-sm text-gray-700">
                <li>Wave Properties & Behavior</li>
                <li>Sound Waves & Acoustics</li>
                <li>Light & Electromagnetic Waves</li>
                <li>Interference & Diffraction</li>
                <li>Polarization & Wave-Particle Duality</li>
                <li>Optics & Lens Systems</li>
                <li>Doppler Effect & Applications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Electricity & Magnetism</h3>
              <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-sm text-gray-700">
                <li>Electric Fields & Coulomb’s Law</li>
                <li>Electric Potential & Capacitance</li>
                <li>Current Electricity & Circuits</li>
                <li>Magnetic Fields & Forces</li>
                <li>Electromagnetic Induction</li>
                <li>AC Circuits & Transformers</li>
                <li>Maxwell’s Equations Applications</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: What Makes Our Physics Tutors Different */}
        <section>
          <h2 className="section-title text-primary mb-8 max-w-3xl">Why LionCity’s Physics Tutors Excel in Singapore</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mathematical Problem-Solving Mastery</h3>
              <p className="text-gray-700 text-pretty">
                Our tutors excel at teaching the mathematical foundations essential for physics success. Students learn to set up equations systematically, handle vector calculations, apply calculus concepts, and interpret graphs and data with confidence across all physics topics.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conceptual Understanding First</h3>
              <p className="text-gray-700 text-pretty">
                Rather than memorizing formulas, our approach focuses on deep conceptual understanding. Students learn the ‘why’ behind physical laws, enabling them to tackle novel problems and apply principles to unfamiliar situations in examinations.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-World Physics Applications</h3>
              <p className="text-gray-700 text-pretty">
                We connect abstract physics concepts to everyday phenomena, technology applications, and current scientific research. This approach helps students understand the relevance of physics in fields like engineering, medicine, renewable energy, and space exploration.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exam Technique Specialization</h3>
              <p className="text-gray-700 text-pretty">
                Our tutors are experts in Singapore’s physics examination formats, teaching students effective strategies for multiple-choice questions, structured problems, practical assessments, and data analysis questions that appear in MOE, Cambridge, and IB physics papers.
              </p>
            </div>
          </div>
        </section>


        {/* Section 6: Why Choose Us */}
        <section>
          <h2 className="section-title text-primary mb-8 max-w-3xl">Why Singapore Families Choose Us for Physics Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 rounded-xl border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Physics Degree Specialists</h3>
              <p className="text-gray-600 mt-2 text-pretty">All our physics tutors hold relevant degrees in Physics, Engineering, Applied Physics, or related fields with extensive teaching experience in Singapore’s MOE and international curricula.</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Problem-Solving Focused Approach</h3>
              <p className="text-gray-600 mt-2 text-pretty">We emphasize systematic problem-solving techniques and mathematical rigor rather than rote memorization, ensuring students can tackle any physics problem with confidence and logical thinking.</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Multi-Curriculum Expertise</h3>
              <p className="text-gray-600 mt-2 text-pretty">Whether your child is in local MOE schools, international schools, or private institutions, our tutors are well-versed in different physics curricula and examination requirements.</p>
            </div>
          </div>
        </section>

        {/* Section 7: Teaching Methods */}
        <section>
          <h2 className="section-title text-primary mb-8 max-w-3xl">Our Proven Physics Teaching Methods</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mathematical Foundation Building</h3>
              <p className="text-gray-700 text-pretty">
                Physics success requires strong mathematical skills. Our tutors ensure students are comfortable with algebra, trigonometry, calculus applications, vector operations, and graph interpretation essential for solving complex physics problems systematically.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Experimental Skills & Data Analysis</h3>
              <p className="text-gray-700 text-pretty">
                Laboratory skills are crucial for physics success. Students learn proper experimental techniques, error analysis, data interpretation, graph plotting, and drawing valid conclusions from experimental observations and measurements.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Learning & Demonstrations</h3>
              <p className="text-gray-700 text-pretty">
                Complex physics concepts become clearer through visual demonstrations, animations, and interactive simulations. We use diagrams, models, and technology to help students visualize abstract concepts like electromagnetic fields, wave interference, and quantum phenomena.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analogies & Real-World Connections</h3>
              <p className="text-gray-700 text-pretty">
                We use everyday analogies and real-world examples to make abstract physics principles relatable and memorable. This approach helps students remember concepts during high-pressure examinations and understand their practical applications.
              </p>
            </div>
          </div>
        </section>

        <Reviews />

        {/* Section 9: Service Areas */}
        <section className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 sm:p-10">
          <h2 className="section-title text-primary mb-3">Physics Tuition Available Island-Wide</h2>
          <p className="text-gray-700 mb-6 max-w-3xl text-pretty">
            Our experienced physics tutors serve families across Singapore with specialized expertise in mechanics, electromagnetism, thermodynamics, and quantum physics:
          </p>
          <ul className="flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li key={area} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
                {area}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 10: Physics Tuition FAQ */}
        <section>
          <h2 className="section-title text-primary mb-6 max-w-3xl">Frequently Asked Questions About Physics Tuition</h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            <div className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What makes physics tuition different from other subjects?</h3>
              <p className="text-gray-700 max-w-3xl text-pretty">Physics requires strong mathematical foundations, conceptual understanding, and problem-solving skills. Our tutors focus on building these three pillars systematically, ensuring students can tackle complex mechanics, electromagnetism, and quantum physics problems with confidence.</p>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do you help students with physics practical assessments?</h3>
              <p className="text-gray-700 max-w-3xl text-pretty">Our tutors provide comprehensive training in experimental skills, data analysis, error calculation, and graph interpretation. Students learn proper laboratory techniques, measurement methods, and how to draw valid conclusions from experimental observations required for MOE, IGCSE, and IB physics practicals.</p>
            </div>

            <div className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can physics tutors help with both JC H1 and H2 Physics?</h3>
              <p className="text-gray-700 max-w-3xl text-pretty">Yes, our tutors are qualified to teach both H1 and H2 Physics levels. H2 Physics covers more advanced topics like gravitational fields, electromagnetic induction, and quantum physics, while H1 focuses on core concepts. We customize our approach based on your syllabus requirements.</p>
            </div>
          </div>
        </section>

        {/* Section 11: Final CTA */}
        <RelatedGuides slug="physics-tuition" heading="Guides for this subject" />

        <GuideCTA
          title="Ready to Boost Your Child’s Physics Grades?"
          description="Let’s find the perfect Physics tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          whatsappHref={`https://wa.me/6588701152?text=${encodeURIComponent("Hi LionCity Tutors! I'd like help finding a Physics tutor.\n\nStudent level:\nCurrent grade:\nLocation:\nPreferred days & timing: ")}`}
        />
        </div>
    </>
  );
}
