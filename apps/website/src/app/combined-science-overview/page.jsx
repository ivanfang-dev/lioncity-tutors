import Link from 'next/link';
import Image from 'next/image';
import combinedscienceImage from "../../../public/combined-chemistry-biology.webp"

export const metadata = {
  title: 'N Level Combined Science 2025: Complete Guide to All Three Combinations | LionCity Tutors',
  description: 'Master N Level Combined Science with our comprehensive Singapore-focused guide. Physics-Chemistry, Physics-Biology, Chemistry-Biology combinations, local case studies, and proven exam techniques.',
  keywords: [
    'N Level Combined Science Singapore',
    'Combined Science study guide 2025',
    'Singapore Combined Science exam tips',
    '5105 5106 5107 Science',
    'N Level Combined Science tuition',
    'Combined Science revision strategies',
    'Singapore science education'
  ],
  openGraph: {
    title: 'N Level Combined Science 2025: Complete Singapore Success Guide',
    description: 'Master all three N Level Combined Science combinations. Physics-Chemistry, Physics-Biology, Chemistry-Biology strategies with Singapore examples.',
    url: 'https://www.lioncitytutors.com/combined-science-overview',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/combined-science-overview',
  },
};

export default function CombinedScienceOverview() {
  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

    <main className="px-4 py-12 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold text-blue-800 mb-4">N Level Combined Science 2025: Your Complete Guide to All Three Combinations</h1>
      <div className="flex items-center space-x-4 mb-8">
          <div>
            <p className="font-semibold text-gray-800">By Marcus Wong, Combined Science Tutor</p>
            <p className="text-sm text-gray-500">Updated August 26, 2025 • Comprehensive guide to all combinations • 15 min read</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8 border-l-4 border-purple-400">
          <h3 className="text-lg font-bold text-purple-800 mb-2">🔬 The Combined Science Advantage</h3>
          <p className="text-purple-700">
            N Level Combined Science isn't "easier science" - it's <span className="font-bold">integrated science</span>. 
            This guide reveals how to leverage the connections between different science subjects to achieve 
            deeper understanding and better exam performance in Singapore's N Level Combined Science.
          </p>
        </div>

      <div className="my-8 relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg"> 
        <Image 
          src={combinedscienceImage}
          alt="Singapore students conducting integrated science experiments in Combined Science laboratory"
          width={1400} 
          height={933}
          className="w-full h-auto rounded-xl shadow-lg"
          sizes="(max-width: 768px) 100vw, 1024px" 
          placeholder="blur"
          priority
        />
      </div>

      <article className="space-y-8 text-gray-700 leading-relaxed">
        
        <section className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
          <h2 className="text-2xl font-semibold text-amber-800 mb-3">🎯 Understanding N Level Combined Science</h2>
          <p className="mb-4">
            N Level Combined Science offers three distinct combinations, each designed to provide students 
            with a solid foundation in two complementary science subjects. Understanding which combination 
            suits your interests and career goals is crucial for success.
          </p>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-amber-700 mb-3">The Three N Level Combined Science Options:</h4>
            <div className="space-y-3">
              <div className="border-l-3 border-blue-400 pl-4">
                <h5 className="font-semibold text-blue-700">Combined Chemistry/Physics</h5>
                <p className="text-sm text-blue-600">Perfect for students interested in engineering, technology, and physical sciences</p>
              </div>
              <div className="border-l-3 border-green-400 pl-4">
                <h5 className="font-semibold text-green-700">Combined Physics/Biology</h5>
                <p className="text-sm text-green-600">Ideal for students pursuing healthcare, biomedical sciences, or environmental studies</p>
              </div>
              <div className="border-l-3 border-purple-400 pl-4">
                <h5 className="font-semibold text-purple-700">Combined Chemistry/Biology</h5>
                <p className="text-sm text-purple-600">Best for students interested in life sciences, medicine, or biochemistry</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">📋 N Level Combined Science Structure</h2>
          
          <div className="bg-blue-50 p-5 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-3">📚 Assessment Overview (All Combinations)</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-blue-100">
                  <tr className="text-sm">
                    <th className="p-3 text-left font-semibold">Combination</th>
                    <th className="p-3 text-left font-semibold">Papers</th>
                    <th className="p-3 text-left font-semibold">Duration</th>
                    <th className="p-3 text-left font-semibold">Marks</th>
                    <th className="p-3 text-left font-semibold">Weighting</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-3 font-semibold text-blue-700">Combined Chemistry/Physics</td>
                    <td className="p-3">Papers 1, 2, 3, 4</td>
                    <td className="p-3">1hr 15min each session</td>
                    <td className="p-3">100 marks total</td>
                    <td className="p-3">50% each subject</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold text-green-700">Combined Physics/Biology</td>
                    <td className="p-3">Papers 1, 2, 5, 6</td>
                    <td className="p-3">1hr 15min each session</td>
                    <td className="p-3">100 marks total</td>
                    <td className="p-3">50% each subject</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-700">Combined Chemistry/Biology</td>
                    <td className="p-3">Papers 3, 4, 5, 6</td>
                    <td className="p-3">1hr 15min each session</td>
                    <td className="p-3">100 marks total</td>
                    <td className="p-3">50% each subject</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-white p-4 rounded">
              <h4 className="font-semibold text-blue-700 mb-2">Paper Structure Breakdown:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>MCQ Papers (Papers 1, 3, 5):</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 20 questions each (20 marks)</li>
                    <li>• 30 minutes recommended</li>
                    <li>• 20% weighting each</li>
                  </ul>
                </div>
                <div>
                  <strong>Structured Papers (Papers 2, 4, 6):</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 30 marks each</li>
                    <li>• 45 minutes recommended</li>
                    <li>• 30% weighting each</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">🎯 Choosing Your Combined Science Combination</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg border-l-4 border-blue-400">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Combined Chemistry/Physics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Best For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Future engineers and technologists</li>
                    <li>• Students interested in materials science</li>
                    <li>• Those pursuing technical vocations</li>
                    <li>• Computer science enthusiasts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Career Pathways:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Engineering (all fields)</li>
                    <li>• Architecture</li>
                    <li>• Information technology</li>
                    <li>• Manufacturing and automation</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <strong>Integration Focus:</strong> Energy transformations, atomic structure, electrical and chemical processes, materials properties
              </div>
              <div className="mt-3">
                <Link href="/combined-chemistry-physics" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Explore Chemistry + Physics Guide →
                </Link>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border-l-4 border-green-400">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Combined Physics/Biology</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Future healthcare professionals</li>
                    <li>• Biomedical science students</li>
                    <li>• Environmental science enthusiasts</li>
                    <li>• Sports science interested students</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Career Pathways:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Nursing and allied health</li>
                    <li>• Biomedical engineering</li>
                    <li>• Environmental monitoring</li>
                    <li>• Sports and exercise science</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-green-50 rounded">
                <strong>Integration Focus:</strong> Energy in living systems, wave applications in medicine, electrical signals in biology, biomechanics
              </div>
              <div className="mt-3">
                <Link href="/combined-physics-biology" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Explore Physics + Biology Guide →
                </Link>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border-l-4 border-purple-400">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Combined Chemistry/Biology</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Best For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Aspiring medical professionals</li>
                    <li>• Life sciences enthusiasts</li>
                    <li>• Agricultural science students</li>
                    <li>• Pharmaceutical industry aspirants</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Career Pathways:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Medicine and dentistry</li>
                    <li>• Pharmacy and biotechnology</li>
                    <li>• Agricultural sciences</li>
                    <li>• Food science and nutrition</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <strong>Integration Focus:</strong> Biochemical processes, molecular biology, organic chemistry in living systems, environmental chemistry
              </div>
              <div className="mt-3">
                <Link href="/combined-chemistry-biology" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Explore Chemistry + Biology Guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-orange-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-orange-800 mb-4">🇸🇬 Singapore Context in Combined Science</h2>
          <p className="mb-4">
            All N Level Combined Science papers regularly include Singapore contexts. Understanding local 
            applications gives you a significant advantage regardless of your combination.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 mb-2">🏗️ Infrastructure Applications</h4>
              <ul className="text-sm space-y-1">
                <li>• Marina Barrage (Physics: pressure, Chemistry: water treatment)</li>
                <li>• MRT system (Physics: forces, Biology: air quality)</li>
                <li>• HDB flats (Physics: thermal, Chemistry: materials)</li>
                <li>• Gardens by the Bay (Biology: ecosystems, Physics: energy)</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 mb-2">🌴 Tropical Environment</h4>
              <ul className="text-sm space-y-1">
                <li>• High humidity effects (Physics: heat, Chemistry: corrosion)</li>
                <li>• Monsoon patterns (Physics: weather, Biology: plant adaptation)</li>
                <li>• Solar energy (Physics: radiation, Chemistry: photovoltaics)</li>
                <li>• Biodiversity conservation (Biology: ecosystems, Chemistry: pollution)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">📅 Universal Study Timeline for All Combinations</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-bold text-green-700 mb-2">📖 Secondary 3: Foundation Phase (All Combinations)</h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div>
                  <h4 className="font-semibold">Physics Basics:</h4>
                  <ul className="space-y-1">
                    <li>• Measurements & forces</li>
                    <li>• Light & sound</li>
                    <li>• Basic electricity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Chemistry Basics:</h4>
                  <ul className="space-y-1">
                    <li>• Atomic structure</li>
                    <li>• Chemical bonding</li>
                    <li>• Acids & bases</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Biology Basics:</h4>
                  <ul className="space-y-1">
                    <li>• Cell structure</li>
                    <li>• Human systems</li>
                    <li>• Plant processes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-bold text-yellow-700 mb-2">⚡ Secondary 4 Term 1-2: Integration Phase</h3>
              <p className="text-sm mb-2">Focus on connecting concepts between your two subjects</p>
              <ul className="text-sm space-y-1">
                <li>• Master advanced topics in both subjects</li>
                <li>• Identify cross-subject connections</li>
                <li>• Practice Singapore context questions</li>
                <li>• Develop integrated problem-solving skills</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h3 className="font-bold text-orange-700 mb-2">🎯 Secondary 4 Term 3-Prelims: Application Phase</h3>
              <ul className="text-sm space-y-1">
                <li>• Daily practice with past papers</li>
                <li>• Perfect MCQ speed and accuracy</li>
                <li>• Master structured question techniques</li>
                <li>• Solidify Singapore examples</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 className="font-bold text-red-700 mb-2">🏆 Post-Prelims to N Levels: Mastery Phase</h3>
              <ul className="text-sm space-y-1">
                <li>• Complete past papers under exam conditions</li>
                <li>• Final review of integration concepts</li>
                <li>• Exam technique refinement</li>
                <li>• Stress management preparation</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-teal-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-teal-800 mb-4">📊 Grade Achievement Strategies (All Combinations)</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-l-3 border-yellow-400">
              <h3 className="font-semibold text-yellow-700 mb-2">🥉 Targeting Grade 3-4 (Pass with Merit)</h3>
              <ul className="text-sm space-y-1">
                <li>• Master fundamental concepts in both subjects</li>
                <li>• Achieve 70%+ in MCQ sections</li>
                <li>• Complete structured questions competently</li>
                <li>• Understand basic integration concepts</li>
                <li><strong>Study Time:</strong> 8-10 hours per week</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-3 border-blue-400">
              <h3 className="font-semibold text-blue-700 mb-2">🥈 Targeting Grade 2 (Distinction)</h3>
              <ul className="text-sm space-y-1">
                <li>• Excel in cross-subject connections</li>
                <li>• Apply Singapore contexts effectively</li>
                <li>• Handle complex problem-solving</li>
                <li>• Achieve 85%+ across all components</li>
                <li><strong>Study Time:</strong> 12-15 hours per week</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-3 border-green-400">
              <h3 className="font-semibold text-green-700 mb-2">🥇 Targeting Grade 1 (High Distinction)</h3>
              <ul className="text-sm space-y-1">
                <li>• Demonstrate deep subject integration</li>
                <li>• Provide sophisticated explanations</li>
                <li>• Excel in Singapore application questions</li>
                <li>• Maintain 90%+ accuracy consistently</li>
                <li><strong>Study Time:</strong> 15-18 hours per week</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">❓ Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Q: Can I switch between Combined Science combinations?</h4>
              <p className="text-sm">
                Switching is possible early in Secondary 3, but becomes increasingly difficult as the year progresses. 
                Consult with your school's science department if considering a change.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Q: Which combination is "easiest"?</h4>
              <p className="text-sm">
                No combination is inherently easier. Success depends on your interests, strengths, and career goals. 
                Choose based on your intended pathway rather than perceived difficulty.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Q: Can I take Pure Sciences in JC after Combined Science?</h4>
              <p className="text-sm">
                Yes, but you may need bridging courses. Combined Science provides excellent foundation skills, 
                and many students successfully transition to H2 subjects in JC.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Q: How important is the integration aspect?</h4>
              <p className="text-sm">
                Very important! The strength of Combined Science lies in connecting concepts between subjects. 
                Questions often test your ability to apply knowledge from both subjects together.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">🚀 Your Combined Science Journey Starts Here</h2>
          
          <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
            N Level Combined Science opens doors to diverse career pathways while developing critical thinking 
            and integration skills. Choose your combination wisely, embrace the connections between subjects, 
            and leverage Singapore contexts for examination success.
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/combined-physics-chemistry" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-blue-700 mb-2">Combined Chemistry/Physics</h3>
              <p className="text-sm text-gray-600">For future engineers and technologists</p>
            </Link>
            <Link href="/combined-physics-biology" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-green-700 mb-2">Combined Physics/Biology</h3>
              <p className="text-sm text-gray-600">For healthcare and biomedical sciences</p>
            </Link>
            <Link href="/combined-chemistry-biology" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-purple-700 mb-2">Combined Chemistry/Biology</h3>
              <p className="text-sm text-gray-600">For medical and life sciences</p>
            </Link>
          </div>
        </section>

        <div className="bg-blue-800 text-white p-6 rounded-xl mt-8">
          <h3 className="text-lg font-semibold mb-2">📚 Specialized Combined Science Guides</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Combination-Specific Strategies:</h4>
              <ul className="space-y-1">
                <li>• Chemistry + Physics Integration Methods</li>
                <li>• Physics + Biology Cross-Connections</li>
                <li>• Chemistry + Biology Molecular Focus</li>
                <li>• Singapore Context Examples for Each</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Exam Preparation:</h4>
              <ul className="space-y-1">
                <li>• Subject-Specific MCQ Strategies</li>
                <li>• Integration Question Techniques</li>
                <li>• Practical Skills for Each Combination</li>
                <li>• Grade 1 Achievement Roadmaps</li>
              </ul>
            </div>
          </div>
        </div>
        <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12 px-6 sm:px-8 rounded-2xl text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Excel in Combined Science?</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-white/80">
            Connect with our specialized combined science tutors who make complex concepts clear and help you score your A1
          </p>
          <Link
            href="/request-tutor"
            className="inline-block bg-[#F17720] text-white hover:bg-[#d9691c] px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Request a Combined Science Tutor
          </Link>
          <p className="text-xs sm:text-sm text-white/60 mt-2">Free matching service • Combined Science specialists • Proven grade improvements</p>
        </section>
      </article>
    </main>
    </>
  );
}

// Schema for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "N Level Combined Science 2025: Your Complete Guide to All Three Combinations",
  "description": "Master N Level Combined Science with our comprehensive Singapore-focused guide. Physics-Chemistry, Physics-Biology, Chemistry-Biology combinations, local case studies, and proven exam techniques.",
  "author": {
    "@type": "Person",
    "name": "Marcus Wong",
    "jobTitle": "Senior Science Tutor",
    "worksFor": {
      "@type": "Organization",
      "name": "LionCity Tutors"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "LionCity Tutors",
    "url": "https://www.lioncitytutors.com"
  },
  "datePublished": "2025-08-26",
  "dateModified": "2025-08-26",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.lioncitytutors.com/combined-science-overview"
  },
  "articleSection": "Education",
  "keywords": [
    "N Level Combined Science Singapore",
    "Combined Science study guide 2025", 
    "Singapore Combined Science exam tips",
    "5105 5106 5107 Science",
    "N Level Combined Science tuition",
    "Combined Science revision strategies",
    "Singapore science education"
  ],
  "about": [
    {
      "@type": "Thing",
      "name": "N Level Combined Science",
      "description": "Integrated two-subject science combinations for Singapore N Level examinations"
    },
    {
      "@type": "Thing", 
      "name": "Singapore Education",
      "description": "Educational system and examination requirements in Singapore"
    }
  ],
  "mentions": [
    {
      "@type": "Place",
      "name": "Singapore",
      "description": "Southeast Asian city-state with advanced education system"
    },
    {
      "@type": "Organization",
      "name": "Singapore Examinations and Assessment Board",
      "description": "Examination board for Singapore N Level examinations"
    }
  ],
  "wordCount": 3500,
  "timeRequired": "PT15M",
  "educationalLevel": "Secondary Education",
  "educationalUse": "Study Guide",
  "interactivityType": "Informational",
  "learningResourceType": "Study Guide",
  "audience": {
    "@type": "EducationalAudience", 
    "educationalRole": "Student",
    "audienceType": "N Level Combined Science Students"
  }
};