import Link from 'next/link';
import {
  ArrowRight, BookOpen, CalendarDays, CircleHelp, ClipboardCheck, FileText, Layers, Link2, MapPin,
  MessageCircleQuestion, PencilLine, Target, Users,
} from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, GuideCTA, RelatedGuides, ExamTimetable, ICON_STROKE,
} from '@/components/guide';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'Combined Chemistry/Biology 2026: O & N-Level Guide',
  description:
    'Combined Chemistry/Biology guide for Singapore students. O-Level 5088 and N-Level 5107 syllabus — topics, paper structure and exam technique for both levels.',
  keywords: [
    'Combined Chemistry Biology Singapore',
    'O Level Combined Science 5088',
    'N Level Chemistry Biology integration',
    'Combined Science N(A) Chemistry Biology',
    'Sec 4 N(A) Combined Science guide',
    'Singapore O Level chemistry biology tips',
    'LionCity Tutors chemistry biology'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Combined Chemistry + Biology — O-Level & N-Level, Matter & Life Integrated',
    description:
      'Master Chemical reactions and Biological processes for Combined Science, at O-Level (5088) and N-Level (5107). Practical examples, exam strategies, and Singapore contexts.',
    url: 'https://www.lioncitytutors.com/combined-chemistry-biology',
    type: 'article'
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/combined-chemistry-biology'
  }
};

const COMBINED_SCIENCE_GUIDES = [
  { href: '/combined-science-overview', label: 'Overview Guide' },
  { href: '/combined-physics-biology', label: 'Combined Physics–Biology' },
  { href: '/combined-chemistry-physics', label: 'Combined Chemistry–Physics' },
];

export default function CombinedChemBioNA() {
  return (
    <>
      <GuideSchema
        slug="combined-chemistry-biology"
        course={{
          name: 'Combined Chemistry/Biology Tuition',
          description: 'One-to-one Combined Science (Chemistry/Biology) tuition in Singapore, at O-Level (syllabus 5088) and N-Level (syllabus 5107).',
          educationalLevel: 'GCE O-Level and N-Level',
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
        <GuideHeader
          title={<>Combined Chemistry/Biology: Matter &amp; Life — <span className="whitespace-nowrap">O-Level</span> &amp; <span className="whitespace-nowrap">N-Level</span> Mastery</>}
          author="By the LionCity Tutors science team"
          meta="Updated July 2, 2026 · O-Level & N-Level Combined Science · 20+ min read"
          imageSrc="/combined-chemistry-biology.webp"
          imageAlt="Singapore students conducting integrated science experiments in Combined Science laboratory"
        />

        <article className="space-y-12 text-gray-700 leading-relaxed">
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
            <h2 className="text-base leading-6 font-semibold text-gray-900 mb-2">Matter &amp; Life — Why this pairing works</h2>
            <p className="text-pretty">
              Combined Chemistry–Biology is all about <span className="font-semibold text-gray-900">how chemical reactions power life</span>. You will link chemical equations, reaction energy and rates, and the chemistry of molecules to biological processes like respiration,
              digestion and photosynthesis. This guide covers the N(A) syllabus (5107) in detail below, plus what changes for the O-Level version (5088) — accurate topics, clear examples, and exam-winning structures for both.
            </p>
          </div>

          <section>
            <SectionHeading id="who-benefits" icon={Users}>Who benefits most from Combined Chemistry + Biology?</SectionHeading>
            <p className="text-pretty">
              This combination is ideal for students curious about healthcare, nutrition, environmental science, forensic science and laboratory-based careers. It emphasizes the chemistry of molecules together with biological function — a practical pathway to polytechnic diplomas and technical health careers.
            </p>
            <GuideCard className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Typical pathways this supports:</h3>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Biomedical &amp; allied health foundations</li>
                  <li>Food science &amp; nutrition</li>
                  <li>Environmental monitoring roles</li>
                </ul>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Laboratory technician basics</li>
                  <li>Pharmacy support roles</li>
                  <li>Agricultural tech &amp; plant science</li>
                </ul>
              </div>
            </GuideCard>
          </section>

          <section>
            <SectionHeading id="topics" icon={BookOpen}>Syllabus-Aligned Topics (Sec 4 N(A))</SectionHeading>
            <div className="grid md:grid-cols-2 gap-4">
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Chemistry Topics (N(A))</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Kinetic Particle Theory</li>
                  <li>Atomic Structure</li>
                  <li>Chemical Bonding (Ionic, Covalent, Metallic basics)</li>
                  <li>Chemical Formulae &amp; Equations</li>
                  <li>Acids, Bases &amp; Salts — properties and neutralisation</li>
                  <li>The Periodic Table — trends and group properties</li>
                  <li>Chemical Reactions: Rates &amp; Energy changes (exothermic/endothermic)</li>
                  <li>Air &amp; Atmosphere basics (pollutants &amp; composition)</li>
                  <li>Simple Organic Chemistry: alkanes, alkenes, alcohols (basic reactions)</li>
                </ul>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Biology Topics (N(A))</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Cell Structure and Organisation</li>
                  <li>Movement of Substances (diffusion, osmosis, active transport)</li>
                  <li>Biological Molecules (carbohydrates, proteins, lipids)</li>
                  <li>Nutrition in Humans (digestive system, balanced diet)</li>
                  <li>Transport in Humans (blood, heart and circulation)</li>
                  <li>Respiration in Humans (aerobic &amp; anaerobic)</li>
                  <li>Infectious Diseases in Humans (pathogens and immunity basics)</li>
                  <li>Nutrition and Transport in Flowering Plants (photosynthesis, transpiration)</li>
                </ul>
              </GuideCard>
            </div>
          </section>

          <section>
            <SectionHeading id="n-level-assessment" icon={FileText}>N-Level (5107) Assessment Overview &amp; Exam Rhythm</SectionHeading>
            <div className="space-y-4">
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Paper Structure (N-Level general guide)</h3>
                <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                  <li>Each subject typically has a multiple-choice (MCQ) paper and a structured paper.</li>
                  <li>MCQs test recall and quick application (definitions, simple computations, data interpretation).</li>
                  <li>Structured questions assess explanation, experimental design, data handling, and integration across chemistry and biology.</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">Tip: check your school’s exam paper layout — marks and timings can vary. Practise both content recall and extended answers.</p>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Session Management (Suggested)</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong className="font-semibold text-gray-900">Order:</strong> Begin with your stronger subject’s MCQ → its Structured paper → then the other subject’s MCQ and Structured.</p>
                  <p><strong className="font-semibold text-gray-900">MCQ pacing:</strong> target 1–1.5 minutes per question, flag and return if unsure.</p>
                  <p><strong className="font-semibold text-gray-900">Structured answers:</strong> Always define key terms, show simple calculations with units, and link chemistry and biology when required.</p>
                </div>
              </GuideCard>
            </div>
          </section>

          <section>
            <SectionHeading id="o-level" icon={CircleHelp}>What is O-Level Combined Chemistry/Biology?</SectionHeading>
            <p className="text-pretty">
              O-Level Combined Chemistry/Biology (syllabus 5088) is sat by Secondary 4 Express-stream students, not
              N(A) students. It shares one multiple-choice paper across Chemistry and Biology, then a separate
              structured paper for each subject — unlike N-Level 5107, where each subject has its own full
              MCQ-plus-structured pair.
            </p>
            <GuideCard className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">O-Level 5088 paper structure:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-2 pr-4 font-semibold text-gray-900">Paper</th>
                      <th className="py-2 font-semibold text-gray-900">Content</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Paper 1</td>
                      <td className="py-2">MCQ, shared across Chemistry and Biology</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Paper 3</td>
                      <td className="py-2">Chemistry, structured</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">Paper 4</td>
                      <td className="py-2">Biology, structured</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">Who sits it: Secondary 4 Express-stream students taking the GCE O-Level exam.</p>
            </GuideCard>
          </section>

          <section>
            <SectionHeading id="timetables" icon={CalendarDays}>2026 Exam Timetables — Both Levels</SectionHeading>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">O-Level Combined Chemistry/Biology</h3>
                <ExamTimetable
                  examSlug="o-level"
                  subjectSlugs={['combined-science-chem-bio']}
                  caption="Official 2026 SEAB dates — O-Level Combined Science (Chemistry/Biology), syllabus 5088."
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">N-Level Combined Chemistry/Biology</h3>
                <ExamTimetable
                  examSlug="n-level"
                  subjectSlugs={['combined-science-chem-bio']}
                  caption="Official 2026 SEAB dates — N-Level Combined Science (Chemistry/Biology), syllabus 5107."
                />
              </div>
            </div>
          </section>

          <section>
            <SectionHeading id="integration" icon={Link2}>Integration Patterns: Where Chemistry Meets Biology</SectionHeading>
            <p className="text-pretty">High-scoring integrated answers explain the chemical basis of biological processes. Use the following short patterns for exam-ready links.</p>
            <GuideCard className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Core Integration Patterns</h3>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900">Respiration &amp; Energy (Chemistry of Life)</h4>
                  <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                    <li>Aerobic respiration: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + energy.</li>
                    <li>Link energy release to muscular activity, temperature regulation, and ATP production (conceptually).</li>
                    <li>Differentiate between aerobic (more ATP) and anaerobic (less ATP, lactic acid/ethanol) pathways at the N(A) level.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Enzymes &amp; Rates of Reaction</h4>
                  <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                    <li>Enzymes are biological catalysts — they lower activation energy and speed up reactions without being used up.</li>
                    <li>Chemistry: factors affecting rate (temperature, concentration, surface area, catalysts) map to biological factors (enzyme denaturation, substrate availability).</li>
                    <li>Practical tip: Use collision theory language in exams—more collisions = faster reaction.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Acids, Digestion &amp; pH</h4>
                  <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                    <li>Stomach acid (HCl) creates an acidic environment for pepsin to work—acid chemistry matters for enzyme activity.</li>
                    <li>pH changes affect enzyme shape and rate; explain using acid/base definitions and conjugate pairs at a conceptual level.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Photosynthesis &amp; Chemical Transformations</h4>
                  <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                    <li>Photosynthesis: 6CO<sub>2</sub> + 6H<sub>2</sub>O → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> (light energy ↔ chemical energy).</li>
                    <li>Chemistry of light absorption, chlorophyll as pigment, and role of wavelength (visible light) link to energy capture.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Organic Molecules &amp; Cell Structure</h4>
                  <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                    <li>Lipids in membranes (hydrophobic tails) and proteins as structural/functional molecules — connect chemical structure to biological role.</li>
                    <li>Carbohydrates as energy sources; relate chemical formulae to biological use.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Atmosphere &amp; Human Health</h4>
                  <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                    <li>Air pollutants (SO<sub>2</sub>, NO<sub>x</sub>, PM) chemistry links to respiratory disease and public health concerns.</li>
                    <li>Use local Singapore examples (PSI/NEA alerts) to strengthen answers.</li>
                  </ul>
                </div>
              </div>
            </GuideCard>
          </section>

          <section>
            <SectionHeading id="singapore-contexts" icon={MapPin}>Singapore Contexts &amp; Applications</SectionHeading>
            <p className="text-pretty">Exam questions reward localised examples. Use Singapore-relevant cases to demonstrate understanding.</p>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Healthcare &amp; Public Health</h3>
                <div className="space-y-3">
                  <Context title="Hospital Sterilisation">
                    Chemical disinfectants and sterilisation procedures (chlorine, alcohols) and how they prevent infection in clinical settings.
                  </Context>
                  <Context title="Air Quality (NEA)">
                    Chemistry of pollutants and biological impact on asthma and respiratory illnesses; discuss basic preventive measures.
                  </Context>
                  <Context title="Food & Nutrition">
                    Understanding food labels (macronutrients, energy values) and how chemistry affects digestion and nutrient absorption.
                  </Context>
                </div>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Environment &amp; Agriculture</h3>
                <div className="space-y-3">
                  <Context title="Vertical Farming">
                    Light wavelength selection, nutrient solutions chemistry, and plant transport under controlled environments.
                  </Context>
                  <Context title="Water Treatment">
                    Chemical coagulation, filtration, and biological safety in NEWater and municipal systems — high-level connections only.
                  </Context>
                  <Context title="Vector Control (Dengue)">
                    How breeding site chemistry and environmental management reduces mosquito populations and disease spread.
                  </Context>
                </div>
              </GuideCard>
            </div>
          </section>

          <section>
            <SectionHeading id="mastery-map" icon={Layers}>Mastery Map: What to prioritise</SectionHeading>
            <div className="space-y-4">
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Chemistry Priorities</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">Foundation</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-gray-700">
                      <li>Units, particle model, atomic structure</li>
                      <li>Formula writing &amp; balancing equations</li>
                      <li>Periodic table element groups</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Core</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-gray-700">
                      <li>Acids &amp; bases concepts</li>
                      <li>Reaction energetics (exo/endo)</li>
                      <li>Rates of reaction factors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Applied</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-gray-700">
                      <li>Air pollutant chemistry</li>
                      <li>Organic basics (identification &amp; simple reactions)</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Biology Priorities</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">Cell &amp; Molecules</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-gray-700">
                      <li>Organelles &amp; their functions</li>
                      <li>Biological molecules properties</li>
                      <li>Membrane transport mechanisms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Human Systems</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-gray-700">
                      <li>Nutrition, digestion &amp; enzymes</li>
                      <li>Circulatory &amp; respiratory interactions</li>
                      <li>Infectious disease basics &amp; prevention</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Plants &amp; Ecology</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-gray-700">
                      <li>Photosynthesis &amp; transpiration</li>
                      <li>Plant transport &amp; adaptations</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </div>
          </section>

          <section>
            <SectionHeading id="strategies" icon={Target}>A1 Strategies &amp; Examiner-Focused Tips</SectionHeading>
            <div className="space-y-4">
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-2">Integration Answer Structure</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong className="font-semibold text-gray-900">1) State the chemistry:</strong> Name the chemical reaction or molecule (e.g., hydrolysis, HCl, ATP).</li>
                  <li><strong className="font-semibold text-gray-900">2) Link to biology:</strong> Explain how that chemistry affects the biological function (e.g., enzyme activity, nutrient absorption).</li>
                  <li><strong className="font-semibold text-gray-900">3) Apply locally:</strong> Give a short local example when relevant (e.g., NEA air quality impact on asthma).</li>
                  <li><strong className="font-semibold text-gray-900">4) Conclude:</strong> One final sentence tying chemistry to biological outcome.</li>
                </ul>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-2">Practical &amp; Data Handling</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Always list variables and controls in experiments.</li>
                  <li>Use correct units for chemistry calculations and label graph axes in biology practicals.</li>
                  <li>When discussing errors, link them to chemical/biological causes (e.g., contamination, incomplete reaction, evaporation).</li>
                </ul>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-2">Common Examiner Traps</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Vague answers: say ‘diffusion’ not just ‘movement’.</li>
                  <li>Missing units: chemistry marks are often lost for unit mistakes.</li>
                  <li>Incorrect pH reasoning: link pH changes to enzyme activity explicitly.</li>
                </ul>
              </GuideCard>
            </div>
          </section>

          <section>
            <SectionHeading id="sample-questions" icon={PencilLine}>Sample Questions &amp; Model Answers</SectionHeading>
            <div className="space-y-4">
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3 text-pretty">Q1 (Structured): Explain how temperature affects the rate of enzyme-catalysed digestion in the human small intestine. <span className="font-normal text-gray-500 tabular-nums">(4 marks)</span></h3>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1.5">Model answer:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Enzymes are proteins that catalyse digestion by lowering activation energy.</li>
                    <li>As temperature rises, particles have more kinetic energy so collisions between enzyme and substrate increase, increasing rate (1–2 marks).</li>
                    <li>At high temperatures, enzymes denature (change shape) and active site is lost, decreasing rate (1 mark).</li>
                    <li>Conclusion: rate increases with temperature until optimum, then falls due to denaturation (1 mark).</li>
                  </ol>
                </div>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3 text-pretty">Q2 (Integration): Using chemical equations, explain the roles of glucose and oxygen in aerobic respiration and why vigorous exercise increases breathing rate. <span className="font-normal text-gray-500 tabular-nums">(6 marks)</span></h3>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1.5">Model answer:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Aerobic respiration: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + energy. Glucose is oxidised and oxygen acts as the final electron acceptor.</li>
                    <li>Energy released (in form of ATP) is used by muscles during exercise; more ATP required → higher respiration rate.</li>
                    <li>To supply oxygen and remove CO<sub>2</sub>, breathing and heart rate increase, increasing gas exchange at alveoli and oxygen delivery to muscles.</li>
                    <li>Conclusion linking chemistry to biology: chemical breakdown of glucose provides energy which drives increased physiological activity, hence increased breathing.</li>
                  </ol>
                </div>
              </GuideCard>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Q3 (MCQ style practice)</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Which of the following statements is correct?</p>
                  <p>(A) Enzymes are used up in reactions. (B) Increasing substrate concentration always increases enzyme rate indefinitely. (C) Photosynthesis stores light energy in chemical bonds. (D) Acidic conditions speed up all enzyme reactions.</p>
                  <p><strong className="font-semibold text-gray-900">Answer:</strong> (C) — photosynthesis stores light energy in chemical bonds. (A false; enzymes are not used up. B false; plateau occurs. D false; enzyme activity depends on specific pH.)</p>
                </div>
              </GuideCard>
            </div>
          </section>

          <section>
            <SectionHeading id="mastery-plan" icon={ClipboardCheck}>Your Chemistry–Biology Mastery Plan</SectionHeading>
            <p className="text-pretty">
              Combine clear chemical explanations with accurate biological terms. Practise integrated questions weekly, simulate timed papers, and use local examples to score higher in your O-Level or N(A) Combined Science papers.
            </p>
            <GuideCard className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick revision checklist</h3>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Balanced equations for respiration &amp; photosynthesis</li>
                  <li>Key organic groups: alcohols, alkenes</li>
                  <li>pH effects on enzymes</li>
                  <li>Particle model and diffusion basics</li>
                </ul>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Identify variables in practicals</li>
                  <li>Units and conversions for chemistry calculations</li>
                  <li>Common pathogens and prevention methods</li>
                  <li>Photosynthesis factors and leaf adaptations</li>
                </ul>
              </div>
            </GuideCard>
          </section>

          <section>
            <SectionHeading id="faq" icon={MessageCircleQuestion}>Frequently Asked Questions</SectionHeading>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              <FAQ q="Should I memorise chemical equations?" a="Yes: memorise the core equations (photosynthesis, respiration, neutralisation). But focus on being able to explain what each part of the equation means." />
              <FAQ q="How can I improve in practical skills?" a="Practice by writing step-by-step methods, listing variables and controls, and explaining likely sources of error and improvements." />
              <FAQ q="How to link chemistry in biology answers?" a="Always name the chemical (or reaction), explain its role in the biological process, and finish with the biological consequence." />
            </div>
          </section>

          <section aria-labelledby="combined-science-guides">
            <h2 id="combined-science-guides" className="text-base leading-6 font-semibold text-gray-900">Check out related Combined Science guides</h2>
            <p className="mt-1 text-sm text-gray-600">Explore our curated guides to deepen your understanding and excel in your studies.</p>
            <ul className="mt-4 grid sm:grid-cols-3 gap-3">
              {COMBINED_SCIENCE_GUIDES.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="group flex h-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-900 transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {guide.label}
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <RelatedGuides slug="combined-chemistry-biology" />

          <GuideCTA
            title="Ready to Excel in Combined Chemistry/Biology?"
            description="Connect with our specialized combined chemistry/biology tutors who make complex concepts clear and help you achieve your academic goals."
            buttonText="Get a Free Tutor Match"
            whatsappHref={`https://wa.me/6588701152?text=${encodeURIComponent("Hi LionCity Tutors! I'd like help finding a Combined Chemistry/Biology tutor.\n\nStudent level:\nCurrent grade:\nLocation:\nPreferred days & timing: ")}`}
          />
        </article>
      </main>
    </>
  );
}

// --- Small UI helpers ---
function Context({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="mt-0.5 text-sm text-gray-600">{children}</p>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <div className="py-5">
      <h3 className="font-semibold text-gray-900 mb-1.5">{q}</h3>
      <p className="text-gray-700 text-pretty">{a}</p>
    </div>
  );
}

// Schema for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    'Combined Chemistry + Biology: O-Level (5088) & N-Level (5107) — Matter & Life Integrated',
  description:
    'Comprehensive Combined Chemistry–Biology guide for Secondary 4 students in Singapore, covering both O-Level and N(A). Accurate syllabi, integration strategies, sample questions, practical tips, and exam-focused techniques.',
  author: { "@type": "Organization", name: 'LionCity Tutors' },
  datePublished: '2026-03-26',
  dateModified: '2026-07-02',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: 'Should I memorise chemical equations?',
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Yes: memorise the core equations (photosynthesis, respiration, neutralisation). But focus on being able to explain what each part of the equation means.'
      }
    },
    {
      "@type": "Question",
      name: 'How can I improve in practical skills?',
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Practice by writing step-by-step methods, listing variables and controls, and explaining likely sources of error and improvements.'
      }
    }
  ]
};
