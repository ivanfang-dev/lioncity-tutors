import Link from 'next/link';
import Image from 'next/image';
import physbioImage from "../../../public/combined-physics-biology.webp";

export const metadata = {
  title:
    'Combined Physics + Biology: Master N Level Combined Science (N(A)) with Life-in-Motion Integration | LionCity Tutors',
  description:
    'Excel in N Level Combined Physics-Biology (Sec 4 N(A)). Singapore-focused guide aligning Physics and Biology topics: forces, energy, waves, EM spectrum, electricity, radioactivity with cells, diffusion, human/plant transport, respiration, nutrition, and infectious disease. Practical exam strategies and local applications.',
  keywords: [
    'Combined Science Physics Biology Singapore',
    'N Level Combined Science N(A) Physics Biology',
    'Sec 4 N(A) Physics Biology syllabus',
    'N Level Physics Biology integration 2025',
    'Singapore Physics Biology exam strategies',
    'Combined Science life and motion connections',
    'LionCity Tutors Combined Science'
  ],
  openGraph: {
    title: 'Combined Physics + Biology (N(A)): Singapore Success Through Life–Motion Integration',
    description:
      'Master the life–motion bridge in N Level Combined Physics/Biology (Sec 4 N(A)). Integration strategies, topic checklists, and Singapore applications.',
    url: 'https://www.lioncitytutors.com/combined-physics-biology',
    type: 'article'
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/combined-physics-biology'
  }
};

export default function CombinedPhysicsBiology() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="px-4 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">
          Combined Physics + Biology (N(A)): Master Your N Level Combined Science
        </h1>

        <div className="flex items-center space-x-4 mb-8">
          <div>
            <p className="font-semibold text-gray-800">By Sarah Goh, Combined Physics–Biology Tutor</p>
            <p className="text-sm text-gray-500">Updated August 26, 2025 • N(A) Integration Guide • 16 min read</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl mb-8 border-l-4 border-emerald-400">
          <h3 className="text-lg font-bold text-emerald-800 mb-2">🧬 The Life–in–Motion Bridge</h3>
          <p className="text-emerald-700">
            Combined Physics–Biology (Sec 4 <span className="font-semibold">N(A)</span>) connects how forces and energy shape living systems. Learn to explain biological
            processes with physics ideas like pressure, heat transfer, waves and electricity — the exact integration
            examiners love in Combined Science.
          </p>
        </div>

        <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg">
          <Image
            src={physbioImage}
            alt="Singapore students studying biomechanics, diffusion and thermoregulation for N Level Combined Physics-Biology"
            className="object-cover"
            placeholder="blur"
            priority
          />
        </div>

        <article className="space-y-8 text-gray-700 leading-relaxed">
          {/* WHY THIS COMBINATION */}
          <section className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-400">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-3">🎯 Why Physics + Biology (N(A))</h2>
            <p className="mb-4">
              Among Combined Science options, Physics–Biology suits students interested in healthcare, sports science,
              environmental technology, and public health. You will learn to analyse <span className="font-semibold">living functions using physics</span> —
              from blood pressure and ventilation to plant transport and light in photosynthesis (core ideas remain within
              the <span className="font-semibold">N(A) Combined Science</span> scope).
            </p>
            <div className="bg-white p-5 rounded-lg">
              <h4 className="font-semibold text-emerald-700 mb-3">Pathways This Builds:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Bullet>Healthcare support & nursing diplomas</Bullet>
                  <Bullet>Sports & exercise science foundations</Bullet>
                  <Bullet>Environmental health & vector control</Bullet>
                </div>
                <div className="space-y-2">
                  <Bullet>Biomedical engineering basics</Bullet>
                  <Bullet>Food science & nutrition</Bullet>
                  <Bullet>Urban farming & plant systems</Bullet>
                </div>
              </div>
            </div>
          </section>

          {/* SYLLABUS-ALIGNED TOPIC LISTS */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">📚 Syllabus-Aligned Topics (Sec 4 N(A))</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-blue-800 mb-3">Physics Topics</h3>
                <ul className="text-sm space-y-1">
                  <Topic>Physical Quantities, Units and Measurement</Topic>
                  <Topic>Kinematics</Topic>
                  <Topic>Force and Pressure</Topic>
                  <Topic>Dynamics</Topic>
                  <Topic>Energy</Topic>
                  <Topic>Kinetic Particle Model of Matter</Topic>
                  <Topic>Thermal Processes</Topic>
                  <Topic>General Wave Properties</Topic>
                  <Topic>Electromagnetic Spectrum</Topic>
                  <Topic>Electric Charge and Current of Electricity</Topic>
                  <Topic>D.C. Circuits</Topic>
                  <Topic>Practical Electricity</Topic>
                  <Topic>Radioactivity</Topic>
                </ul>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-green-800 mb-3">Biology Topics</h3>
                <ul className="text-sm space-y-1">
                  <Topic>Cell Structure and Organisation</Topic>
                  <Topic>Movement of Substances</Topic>
                  <Topic>Biological Molecules</Topic>
                  <Topic>Nutrition in Humans</Topic>
                  <Topic>Transport in Humans</Topic>
                  <Topic>Respiration in Humans</Topic>
                  <Topic>Infectious Diseases in Humans</Topic>
                  <Topic>Nutrition and Transport in Flowering Plants</Topic>
                </ul>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Note: This page is written specifically for <span className="font-semibold">Combined Science, Sec 4 N(A)</span>, not the Express syllabus.
            </p>
          </section>

          {/* ASSESSMENT OVERVIEW */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">🧪 Assessment Overview & Study Rhythm</h2>

            <div className="bg-indigo-50 p-5 rounded-lg mb-4">
              <h3 className="font-semibold text-indigo-800 mb-3">Paper Structure (Combined Science)</h3>
              <div className="bg-white p-4 rounded-lg text-sm">
                <ul className="space-y-2">
                  <li>• Each discipline has an <span className="font-semibold">MCQ paper</span> and a <span className="font-semibold">Structured paper</span>.</li>
                  <li>• MCQ assesses definitions, recall and quick applications across all topics.</li>
                  <li>• Structured questions test explanations, data handling and practical understanding.</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">Tip: Follow your school’s latest schedule for timings/marks; practise a split of ~40% time for MCQ, ~60% for Structured within each session.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-700 mb-3">⏱️ Session Management (Suggested)</h4>
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <p className="mb-2"><strong>Order:</strong> Start with your stronger subject’s MCQ → switch to its Structured → move to the other subject’s MCQ → finish with Structured.</p>
                <p className="mb-2"><strong>Checkpoints:</strong> Mark uncertain MCQs, return only if time allows. For Structured, write formula/definition first, then substitute values or key terms.</p>
                <p className="mb-0"><strong>Calculator hygiene:</strong> For physics calculations, show units; for biology, define processes (e.g., diffusion/osmosis) before applying.</p>
              </div>
            </div>
          </section>

          {/* INTEGRATION PATTERNS */}
          <section className="bg-violet-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-violet-800 mb-4">⚡ The Integration Advantage: Physics ⟷ Biology</h2>
            <p className="mb-4">
              High-scoring answers often link physics mechanisms to biological function. Use these <span className="font-semibold">N(A)-friendly</span> pairings when explaining.
            </p>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border-l-4 border-pink-400">
                <h3 className="text-xl font-semibold text-pink-700 mb-3">🔗 Core Integration Patterns</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">Force & Pressure ↔ Human Circulation</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Blood pressure relates to <span className="font-semibold">force/area</span> and vessel diameter.</li>
                      <li>• Valves create one-way flow (pressure differences).</li>
                      <li>• Pulse/heart rate changes with activity (work & energy demand).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">Kinetic Particle Model & Thermal ↔ Diffusion/Osmosis</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Higher temperature → faster particle motion → faster diffusion.</li>
                      <li>• Concentration gradients drive net movement across membranes.</li>
                      <li>• Osmosis explains water uptake in cells and plant roots.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">Waves & EM Spectrum ↔ Vision & Photosynthesis</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Visible light wavelengths enable human vision and plant photosynthesis.</li>
                      <li>• UV hazards and protection (skin, eyes; sunscreen/glasses).</li>
                      <li>• X-rays in medical imaging (safety awareness only).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">Electricity & Practical Electricity ↔ Medical Devices & Safety</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Electrical safety when using equipment (fuses, earthing, insulation).</li>
                      <li>• Sensors in thermometers/pulse oximeters relate current/voltage to readings.</li>
                      <li>• Simple circuits model how devices monitor body conditions.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">Energy & Work ↔ Respiration</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Respiration provides energy for muscular work (mechanical energy).</li>
                      <li>• During activity, higher energy demand → increased breathing/heart rate.</li>
                      <li>• Energy conversions: chemical (glucose) → thermal + mechanical.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">Radioactivity ↔ Medicine</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Tracer isotopes in diagnostics (conceptual awareness).</li>
                      <li>• Safety: exposure minimisation, shielding, distance, time.</li>
                      <li>• Distinguish contamination vs irradiation in healthcare contexts.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SINGAPORE APPLICATIONS */}
          <section className="bg-teal-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4">🇸🇬 Singapore Applications</h2>
            <p className="mb-4">Use local contexts to anchor explanations and raise evaluation marks.</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 mb-2">🏥 Health & Public Safety</h4>
                <div className="space-y-3">
                  <Context title="Hospital Imaging (SGH/NUH)">
                    EM spectrum in X-ray/CT usage (concept level) + radiation safety protocols.
                  </Context>
                  <Context title="Heat & Hydration in PE Lessons">
                    Thermal processes, evaporation and body temperature regulation.
                  </Context>
                  <Context title="Dengue Prevention (NEA)">
                    Movement of substances in water storage, mosquito life cycle; community measures.
                  </Context>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-teal-700 mb-2">🌿 Environment & Food</h4>
                <div className="space-y-3">
                  <Context title="Vertical Farms (e.g., Lim Chu Kang)">
                    Light wavelength impacts on plant growth; transpiration and water transport.
                  </Context>
                  <Context title="MRT Ventilation & Crowd Heat">
                    Airflow, convection and diffusion in enclosed spaces.
                  </Context>
                  <Context title="Food Labels & Nutrition">
                    Biological molecules (carbs, fats, proteins) and energy values.
                  </Context>
                </div>
              </div>
            </div>
          </section>

          {/* MASTERY MAP */}
          <section>
            <h2 className="text-2xl font-semibold text-red-700 mb-4">📈 Topic Mastery Map (N(A) Focus)</h2>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h3 className="font-bold text-red-700 mb-2">🧪 Biology Mastery Priorities</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-red-600">Foundation</h4>
                    <ul className="space-y-1">
                      <li>• Cell structure & organelles</li>
                      <li>• Diffusion & osmosis definitions</li>
                      <li>• Biological molecules basics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600">Core Human</h4>
                    <ul className="space-y-1">
                      <li>• Nutrition & enzymes</li>
                      <li>• Blood, heart & circulation</li>
                      <li>• Aerobic/anaerobic respiration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600">Plants & Health</h4>
                    <ul className="space-y-1">
                      <li>• Plant transport & leaf adaptations</li>
                      <li>• Infectious disease transmission & control</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-bold text-blue-700 mb-2">⚙️ Physics Mastery Priorities</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-600">Mechanics</h4>
                    <ul className="space-y-1">
                      <li>• Kinematics graphs & units</li>
                      <li>• Force, pressure & moments (concept)</li>
                      <li>• Work, power & energy</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Matter & Thermal</h4>
                    <ul className="space-y-1">
                      <li>• Kinetic particle model</li>
                      <li>• Conduction, convection, radiation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Waves & Electricity</h4>
                    <ul className="space-y-1">
                      <li>• General wave properties & sound/light</li>
                      <li>• EM spectrum uses & hazards</li>
                      <li>• Current, voltage, resistance; simple DC circuits</li>
                      <li>• Practical electricity & safety</li>
                      <li>• Radioactivity (basic ideas & safety)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STRATEGIES */}
          <section className="bg-orange-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-orange-800 mb-4">🎯 A1 Strategies for N(A) Combined Physics–Biology</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-l-3 border-green-400">
                <h3 className="font-semibold text-green-700 mb-2">🥇 Integration Method</h3>
                <ul className="text-sm space-y-2">
                  <li><strong>Define → Link → Apply:</strong> Define the biology process (e.g., osmosis), link the physics driver (e.g., kinetic motion/pressure), then apply to the scenario.</li>
                  <li><strong>Energy Flow Lens:</strong> Track energy form changes: chemical → mechanical/thermal in activities, or light → chemical in plants.</li>
                  <li><strong>Diagram Discipline:</strong> For circuits and anatomy, label arrows/units; marks are awarded for accuracy.</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-3 border-blue-400">
                <h3 className="font-semibold text-blue-700 mb-2">🥈 Problem-Solving Framework (BIO-PHY)</h3>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p><strong>B</strong>iology process first (name it clearly)</p>
                  <p><strong>I</strong>dentify the physics driver (force/pressure/heat/light/electricity)</p>
                  <p><strong>O</strong>utline key variables (concentration, area, temperature, voltage)</p>
                  <p><strong>P</strong>lan the steps (equation or sequence)</p>
                  <p><strong>H</strong>one the answer with units/keywords</p>
                  <p><strong>Y</strong>ield a final integrated conclusion</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-3 border-purple-400">
                <h3 className="font-semibold text-purple-700 mb-2">🥉 Exam Technique</h3>
                <ul className="text-sm space-y-1">
                  <li>• Aim ~1–1.5 min per MCQ; move on and revisit flagged items.</li>
                  <li>• For calculations: write formula, substitute numbers with units, show working.</li>
                  <li>• For biology explanations: use 2–3 linked sentences with the exact keyword (e.g., “net movement”, “partially permeable membrane”).</li>
                  <li>• Practicals: state sources of error and improvements tied to the correct physics or biology principle.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">❓ Combined Physics–Biology (N(A)) FAQs</h2>
            <div className="space-y-4">
              <FAQ q="Is this page meant for Sec 4 N(A) or Express?" a="Sec 4 N(A). Topic lists and strategies here are aligned to the N(A) Combined Science scope." />
              <FAQ q="How do I revise both subjects efficiently?" a="Do 70% single-subject practice to secure fundamentals, 30% integrated questions where you must link physics to biological function." />
              <FAQ q="What are common mistakes?" a="Missing units in physics, not naming the biology process, and vague keywords (e.g., saying 'movement' instead of 'diffusion' or 'osmosis')." />
              <FAQ q="Do I need advanced formulas not on the sheet?" a="No. Stick to formulae provided/learned in class; show working and keep units consistent." />
            </div>
          </section>

          {/* CTA / RELATED RESOURCES */}
          <section className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">🚀 Your Physics–Biology Mastery Journey</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
              By linking forces, energy and waves to living systems, you’ll write stronger, clearer answers. Practise with Singapore contexts and the BIO-PHY framework to consolidate both subjects together.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
              <h3 className="font-semibold text-emerald-700 mb-4">Next Steps</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Build</h4>
                  <ul className="space-y-1 text-left">
                    <li>• Secure definitions & units</li>
                    <li>• Master diffusion/osmosis vs active transport</li>
                    <li>• Practise circuits & graph questions</li>
                    <li>• Collect 10 local examples</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Measure</h4>
                  <ul className="space-y-1 text-left">
                    <li>• 80%+ on MCQ across topics</li>
                    <li>• Full working with correct units</li>
                    <li>• Biology answers with exact keywords</li>
                    <li>• Integrated explanations in 3–5 lines</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-emerald-800 text-white p-6 rounded-xl mt-8">
            <h3 className="text-lg font-semibold mb-2">🔬 Check out similar N-Level resources</h3>
            <p className="text-sm">Explore our curated guides to deepen your understanding and excel in your studies.</p>
            <div className="mt-4 pt-4 border-t border-emerald-700">
              <div className="grid grid-cols-3 gap-6 text-center">
                <Link href="/combined-science-overview" className="px-3 py-2 bg-emerald-700 rounded text-sm hover:bg-emerald-600 transition-colors">Overview Guide</Link>
                <Link href="/combined-chemistry-biology" className="px-3 py-2 bg-emerald-700 rounded text-sm hover:bg-emerald-600 transition-colors">Combined Chemistry–Biology</Link>
                <Link href="/combined-chemistry-physics" className="px-3 py-2 bg-emerald-700 rounded text-sm hover:bg-emerald-600 transition-colors">Combined Chemistry–Physics</Link>
              </div>
            </div>
          </div>
          <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12 px-6 sm:px-8 rounded-2xl text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Excel in Combined Physics/Biology?</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-white/80">
            Connect with our specialized combined physics/biology tutors who make complex concepts clear and help you achieve your academic goals.
          </p>
          <Link
            href="/request-tutor"
            className="inline-block bg-[#F17720] text-white hover:bg-[#d9691c] px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Request a Combined Physics/Biology Tutor
          </Link>
          <p className="text-xs sm:text-sm text-white/60 mt-2">Free matching service • Combined Physics/Biology specialists • Proven grade improvements</p>
        </section>
        </article>
      </main>
    </>
  );
}

function Bullet({ children }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function Topic({ children }) {
  return <li>• {children}</li>;
}

function Context({ title, children }) {
  return (
    <div className="border-l-4 border-teal-300 pl-3">
      <h5 className="font-semibold text-teal-600">{title}</h5>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h4 className="font-semibold text-gray-700 mb-2">Q: {q}</h4>
      <p className="text-sm">{a}</p>
    </div>
  );
}

// Schema for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    'Combined Physics + Biology (N(A)): Master N Level Combined Science with Life–Motion Integration',
  description:
    'Singapore-focused N(A) Combined Physics–Biology guide. Accurate topic lists, integration patterns, Singapore applications, and practical exam strategies.',
  author: {
    "@type": "Person",
    name: 'Sarah Goh',
    jobTitle: 'Combined Physics–Biology Tutor',
    worksFor: { "@type": "Organization", name: 'LionCity Tutors' }
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: 'Is this page meant for Sec 4 N(A) or Express?',
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Sec 4 N(A). Topic lists and strategies are aligned to the N(A) Combined Science scope.'
      }
    },
    {
      "@type": "Question",
      name: 'How do I revise both subjects efficiently?',
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Do 70% single-subject practice to secure fundamentals, 30% integrated questions to link physics to biological function.'
      }
    },
    {
      "@type": "Question",
      name: 'What are common mistakes?',
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Missing units in physics, not naming the biology process, and vague keywords (e.g., saying “movement” instead of “diffusion” or “osmosis”).'
      }
    },
    {
      "@type": "Question",
      name: 'Do I need advanced formulas not on the sheet?',
      acceptedAnswer: {
        "@type": "Answer",
        text: 'No. Stick to formulae provided/learned in class; show working and keep units consistent.'
      }
    }
  ]
};
