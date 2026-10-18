import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { GuideCTA, RelatedGuides, ICON_STROKE } from "@/components/guide";
import GuideSchema from "@/components/seo/GuideSchema";
import Reviews from "@/components/Reviews";

export const metadata = {
  title: 'Chemistry Tuition Singapore: O-Level & H2 | LionCity Tutors',
  description: 'Chemistry tuition in Singapore for O-Level, H1 and H2 — mole calculations, organic chemistry and practicals. Tutors matched in 6 hours, with no agency fee.',
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
        url: 'https://www.lioncitytutors.com/chemistry.webp',
        alt: 'Chemistry Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Chemistry Tuition Singapore | Expert Chemistry Tutors',
    description: 'Find qualified chemistry tutors for Secondary, JC H1/H2, IGCSE & IB levels. Complete syllabus coverage with free matching service.',
    images: ['https://www.lioncitytutors.com/chemistry.webp'],
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/chemistry-tuition',
  },
};

const SERVICE_AREAS = [
  'Ang Mo Kio', 'Bedok', 'Bishan', 'Bukit Timah', 'Clementi', 'Hougang', 'Jurong West', 'Marine Parade',
  'Pasir Ris', 'Punggol', 'Sembawang', 'Tampines', 'Toa Payoh', 'Woodlands', 'Yishun', 'Serangoon',
];

export default function ChemistryTuition() {
  return (
    <>
      <GuideSchema
        slug="chemistry-tuition"
        course={{
          name: 'Chemistry Tuition in Singapore',
          description: 'One-to-one Chemistry tuition for O-Level, H1 and H2, covering the mole, organic chemistry and the practical paper.',
          educationalLevel: 'GCE O-Level to A-Level',
        }}
      />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {/* Section 1: Headline */}
        <section className="text-center space-y-4 sm:space-y-6">
          <h1 className="page-title text-primary">Chemistry Made Simple: Find Your Perfect Chemistry Tutor Today</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
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
          <Button asChild className="h-auto text-[18.7px] font-bold px-6 sm:px-8 py-3 sm:py-4 mt-3 sm:mt-4 bg-accent-fill hover:bg-accent-fill-hover text-white rounded-full shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-[transform,box-shadow,background-color] duration-300">
            <Link href="/request-tutor">Request a Chemistry Tutor</Link>
          </Button>
        </section>

        {/* Section 2: Comprehensive Chemistry Guides */}
        <section>
          <div className="max-w-3xl mb-8">
            <h2 className="section-title text-primary mb-3">Complete Chemistry Guides for Every Level</h2>
            <p className="text-gray-600 text-pretty">
              Access our comprehensive guides for each chemistry subject and level, designed to help students excel in their examinations. Each guide includes detailed exam formats, problem-solving strategies, and expert tips.
            </p>
          </div>

          <div className="space-y-6">
            {/* O Level Chemistry Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">O Level Chemistry Guide</h3>
                  <p className="text-gray-700 mb-4 text-pretty">
                    Master O Level Chemistry with our comprehensive guide covering atomic structure, chemical bonding, acids and bases, and organic chemistry. Perfect for Secondary 3 and 4 students.
                  </p>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-600 mb-6">
                    <li>Complete syllabus coverage</li>
                    <li>Chemical calculations mastery</li>
                    <li>Practical skills and experiments</li>
                  </ul>
                  <Link href="/o-level-chemistry" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the O Level Chemistry Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What You’ll Learn:</h4>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-700">
                    <li>Atomic structure and bonding</li>
                    <li>Chemical reactions and equations</li>
                    <li>Acids, bases, and salts</li>
                    <li>Exam preparation strategies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IGCSE Chemistry Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">IGCSE Chemistry Guide</h3>
                  <p className="text-gray-700 mb-5 text-pretty">
                    Comprehensive guide for IGCSE Chemistry covering all core and extended topics. Master international curriculum requirements with detailed explanations and exam techniques.
                  </p>
                  <Link href="/igcse-chemistry" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the IGCSE Chemistry Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-sm text-gray-600 text-pretty">
                    Detailed coverage of all IGCSE Chemistry topics including practical skills and data analysis techniques.
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

            {/* A Level Chemistry Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">A Level Chemistry Guide</h3>
                  <p className="text-gray-700 mb-5 text-pretty">
                    Advanced guide for A Level H1 and H2 Chemistry covering organic chemistry, physical chemistry, and inorganic chemistry with detailed mechanisms and calculations.
                  </p>
                  <Link href="/a-level-chemistry" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the A Level Chemistry Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-sm text-gray-600 text-pretty">
                    Comprehensive coverage of H1 and H2 Chemistry with advanced organic mechanisms and physical chemistry calculations.
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Advanced Features:</h4>
                  <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-gray-700">
                    <li>Organic chemistry mechanisms</li>
                    <li>Physical chemistry calculations</li>
                    <li>Inorganic chemistry patterns</li>
                    <li>University preparation guidance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IB Chemistry Guide */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">IB Chemistry Guide</h3>
                  <p className="text-gray-700 mb-5 text-pretty">
                    Complete guide for IB Diploma Programme Chemistry (HL/SL) with inquiry-based learning approach. Includes Internal Assessment support and extended essay guidance.
                  </p>
                  <Link href="/ibdp-chemistry" className="group inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
                    Read the IB Chemistry Guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-sm text-gray-600 text-pretty">
                    Comprehensive IB Chemistry coverage with Internal Assessment support and inquiry-based learning techniques.
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

        {/* Section 3: Detailed Chemistry Levels and Syllabus Coverage */}
        <section>
          <div className="max-w-3xl mb-8">
            <h2 className="section-title text-primary mb-3">Complete Chemistry Tuition Coverage Across All Levels</h2>
            <p className="text-gray-600 text-pretty">
              Our chemistry tutors are experts in Singapore’s MOE curriculum and international programs, providing comprehensive coverage of all chemistry topics from atomic structure to advanced organic chemistry reactions.
            </p>
          </div>

          <div className="space-y-6">
            {/* Secondary Chemistry Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secondary Chemistry (Pure & Combined)</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                Comprehensive coverage of O-Level and N-Level Chemistry syllabus with focus on practical applications and exam techniques.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Fundamental Concepts</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Experimental Chemistry</li>
                    <li>Atomic Structure & Stoichiometry</li>
                    <li>The Particulate Nature of Matter</li>
                    <li>Chemical Formulae</li>
                    <li>Mole Concept & Calculations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Chemical Reactions</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Chemistry of Reactions</li>
                    <li>Electrolysis & Applications</li>
                    <li>Energy from Chemicals</li>
                    <li>Acids, Bases and Salts</li>
                    <li>Redox Reactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Advanced Topics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Periodicity & Periodic Table</li>
                    <li>Metals & Reactivity</li>
                    <li>Atmosphere & Environmental Chemistry</li>
                    <li>Organic Chemistry Basics</li>
                    <li>Qualitative Analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IGCSE Chemistry Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IGCSE Chemistry</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                International curriculum coverage with emphasis on practical skills, data analysis, and comprehensive understanding of chemical principles.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Core Principles</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Particulate Nature of Matter</li>
                    <li>Measurement & Purity</li>
                    <li>Atoms, Elements & Compounds</li>
                    <li>Atomic Structure</li>
                    <li>Periodic Table Trends</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Chemical Bonding & Reactions</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Structure and Bonding</li>
                    <li>Stoichiometry & Mole Concept</li>
                    <li>Energetics of Reaction</li>
                    <li>Rate of Reaction</li>
                    <li>Reversible Reactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialized Topics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Transition Elements</li>
                    <li>Extraction of Metals</li>
                    <li>Alkanes & Alkenes</li>
                    <li>Alcohols & Organic Chemistry</li>
                    <li>Environmental Chemistry</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* JC Chemistry Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JC H1/H2 Chemistry</h3>
              <p className="text-gray-600 mb-4 max-w-3xl text-pretty">
                Advanced level chemistry covering complex topics with mathematical applications, detailed mechanisms, and university-preparation content.
              </p>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                Free to download:{' '}
                <Link href="/free-notes" className="text-primary underline underline-offset-2">H2 and H1 Chemistry study notes</Link>
                {' '}&mdash; every topic at each level, the Paper 4 practical technique H2 candidates are assessed on, and a list of what H1 leaves to H2.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Foundation Topics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Atomic Structure</li>
                    <li>Chemical Bonding</li>
                    <li>The Gaseous State</li>
                    <li>Theories of Acids and Bases</li>
                    <li>The Periodic Table</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Physical Chemistry</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Mole Concept & Stoichiometry</li>
                    <li>Chemical Energetics</li>
                    <li>Thermochemistry</li>
                    <li>Reaction Kinetics</li>
                    <li>Chemical Equilibria</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Advanced Topics (H2)</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Nanomaterials & Polymers</li>
                    <li>Aqueous Solutions Chemistry</li>
                    <li>Organic Chemistry & Isomerism</li>
                    <li>Electrochemistry</li>
                    <li>Transition Elements</li>
                  </ul>
                </div>
              </div>
              <p className="mt-6 border-t border-gray-100 pt-6 text-sm text-gray-600 text-pretty">
                <strong className="font-semibold text-gray-900">Additional H2 Topics:</strong> Hydrocarbons, Halogen Derivatives, Hydroxy Compounds, Carbonyl Compounds, Carboxylic Acids and Derivatives, Nitrogen Compounds, Advanced Equilibria, and many more specialized areas.
              </p>
            </div>

            {/* IBDP Chemistry Detailed Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IB Diploma Programme Chemistry (HL/SL)</h3>
              <p className="text-gray-600 mb-6 max-w-3xl text-pretty">
                International Baccalaureate chemistry with inquiry-based learning, internal assessments, and connections to real-world applications.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 border-t border-gray-100 pt-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Core Topics</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Stoichiometric Relationships</li>
                    <li>Atomic Structure</li>
                    <li>Periodicity</li>
                    <li>Chemical Bonding & Structure</li>
                    <li>Energetics/Thermochemistry</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Advanced Concepts</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Chemical Kinetics</li>
                    <li>Equilibrium Systems</li>
                    <li>Acids and Bases</li>
                    <li>Redox Processes</li>
                    <li>Organic Chemistry</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Option Topics & IA</h4>
                  <ul className="list-disc pl-4 marker:text-primary/50 space-y-1 text-sm text-gray-600">
                    <li>Materials Chemistry</li>
                    <li>Biochemistry</li>
                    <li>Energy Applications</li>
                    <li>Medicinal Chemistry</li>
                    <li>Internal Assessment Support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Chemistry Topics We Specialize In */}
        <section className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 sm:p-10">
          <div className="max-w-3xl mb-8">
            <h2 className="section-title text-primary mb-3">Chemistry Topics Our Expert Tutors Master</h2>
            <p className="text-gray-700 text-pretty">
              Our tutors specialize in breaking down complex chemistry concepts into manageable, understandable segments with practical examples and exam-focused strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Organic Chemistry</h3>
              <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-sm text-gray-700">
                <li>Functional Groups & Nomenclature</li>
                <li>Reaction Mechanisms & Pathways</li>
                <li>Isomerism & Stereochemistry</li>
                <li>Synthesis Planning & Strategy</li>
                <li>Spectroscopy & Structure Determination</li>
                <li>Alkanes, Alkenes, Alcohols</li>
                <li>Carbonyl Compounds & Carboxylic Acids</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Physical Chemistry</h3>
              <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-sm text-gray-700">
                <li>Chemical Kinetics & Rate Laws</li>
                <li>Thermodynamics & Enthalpy</li>
                <li>Chemical Equilibrium</li>
                <li>Le Chatelier’s Principle</li>
                <li>Electrochemistry & Redox</li>
                <li>Acids, Bases & pH Calculations</li>
                <li>Gas Laws & Ideal Gas Behavior</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Inorganic Chemistry</h3>
              <ul className="list-disc pl-5 marker:text-primary/50 space-y-1.5 text-sm text-gray-700">
                <li>Periodic Trends & Properties</li>
                <li>Chemical Bonding Theory</li>
                <li>Transition Metal Chemistry</li>
                <li>Group Chemistry Patterns</li>
                <li>Crystal Structures & Lattices</li>
                <li>Qualitative Analysis</li>
                <li>Industrial Chemical Processes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: What Makes Our Chemistry Tutors Different */}
        <section>
          <h2 className="section-title text-primary mb-8 max-w-3xl">Why LionCity’s Chemistry Tutors Excel in Singapore</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Molecular Visualization</h3>
              <p className="text-gray-700 text-pretty">
                Our tutors use 3D molecular models, digital simulations, and interactive visual aids to help students understand complex molecular structures, reaction mechanisms, and chemical processes. This visual approach is particularly effective for organic chemistry and stereochemistry concepts.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Systematic Problem-Solving Frameworks</h3>
              <p className="text-gray-700 text-pretty">
                Chemistry requires methodical approaches. Our tutors teach students structured frameworks for balancing complex equations, multi-step stoichiometric calculations, and systematic organic synthesis problems that frequently appear in A-Level, IGCSE, and IB examinations.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-World Application Focus</h3>
              <p className="text-gray-700 text-pretty">
                We connect abstract chemical concepts to practical applications in pharmaceuticals, environmental science, materials engineering, and biotechnology. This approach helps students understand the relevance and importance of theoretical chemistry concepts.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Examination Mastery Techniques</h3>
              <p className="text-gray-700 text-pretty">
                Our tutors are specialists in Singapore’s chemistry examination formats, teaching students how to approach different question types, use appropriate chemical terminology, maximize marks in practical assessments, and excel in both theory and applied chemistry papers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Why Choose Us */}
        <section>
          <h2 className="section-title text-primary mb-8 max-w-3xl">Why Singapore Families Choose Us for Chemistry Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 rounded-xl border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Chemistry Degree Specialists</h3>
              <p className="text-gray-600 mt-2 text-pretty">All our chemistry tutors hold relevant degrees in Chemistry, Chemical Engineering, Biochemistry, or related fields with extensive teaching experience in Singapore’s MOE and international curricula.</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Concept-Based Learning Approach</h3>
              <p className="text-gray-600 mt-2 text-pretty">We focus on building strong foundational understanding of chemical principles rather than rote memorization, ensuring students can tackle any chemistry problem with confidence and analytical thinking.</p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Multi-Curriculum Expertise</h3>
              <p className="text-gray-600 mt-2 text-pretty">Whether your child is in local MOE schools, international schools, or private institutions, our tutors are well-versed in different chemistry curricula and examination requirements.</p>
            </div>
          </div>
        </section>

        {/* Section 7: Teaching Methods */}
        <section>
          <h2 className="section-title text-primary mb-8 max-w-3xl">Our Proven Chemistry Teaching Methods</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step-by-Step Mechanism Breakdown</h3>
              <p className="text-gray-700 text-pretty">
                Complex organic reactions and inorganic processes become manageable when broken down into individual steps. Our tutors teach students to identify electron movement, intermediate structures, transition states, and reaction pathways systematically.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Analysis & Interpretation</h3>
              <p className="text-gray-700 text-pretty">
                Chemistry involves analyzing experimental data, graphs, and spectra. Students learn to interpret IR, NMR, and mass spectrometry data to identify unknown compounds, understand reaction progress, and solve structural problems.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mathematical Chemistry Applications</h3>
              <p className="text-gray-700 text-pretty">
                From stoichiometry to thermodynamic calculations, our tutors ensure students are comfortable with the mathematical aspects of chemistry, including unit conversions, significant figures, and complex equilibrium calculations.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Memory Techniques & Mnemonics</h3>
              <p className="text-gray-700 text-pretty">
                Chemistry involves remembering numerous facts, formulas, periodic trends, and reaction patterns. We teach effective memory techniques and create mnemonics to help students recall information during high-pressure examinations.
              </p>
            </div>
          </div>
        </section>

        <Reviews />

        {/* Section 9: Service Areas */}
        <section className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 sm:p-10">
          <h2 className="section-title text-primary mb-3">Chemistry Tuition Available Island-Wide</h2>
          <p className="text-gray-700 mb-6 max-w-3xl text-pretty">
            Our experienced chemistry tutors serve families across Singapore:
          </p>
          <ul className="flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li key={area} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
                {area}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 10: Final CTA */}
        <RelatedGuides slug="chemistry-tuition" heading="Guides for this subject" />

        <GuideCTA
          title="Ready to Boost Your Child’s Chemistry Grades?"
          description="Let’s find the perfect Chemistry tutor to build confidence and achieve academic excellence. The process is simple, fast, and completely free."
          buttonText="Get a Free Tutor Match"
          whatsappHref={`https://wa.me/6588701152?text=${encodeURIComponent("Hi LionCity Tutors! I'd like help finding a Chemistry tutor.\n\nStudent level:\nCurrent grade:\nLocation:\nPreferred days & timing: ")}`}
        />
      </div>
    </>
  );
}
