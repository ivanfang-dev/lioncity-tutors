/**
 * The site's hub-and-spoke link graph.
 *
 * Adding a page means adding one entry here and listing its slug on the hub.
 * `links.test.mjs` enforces reciprocity and that every url resolves to a real
 * route, so a half-finished entry fails the build rather than shipping quietly.
 */

export const HUBS = {
  'o-level-prep': {
    slug: 'o-level-prep',
    url: '/blog/o-level-preparation-guide',
    title: 'O-Level Preparation Guide',
    anchor: 'complete O-Level preparation guide',
    spokes: [
      'o-level-english', 'o-level-math', 'o-level-physics', 'o-level-chemistry',
      'o-level-biology', 'combined-science-overview', 'combined-chemistry-physics',
      'combined-chemistry-biology', 'combined-physics-biology', 'o-level-tuition',
    ],
  },
  'a-level-prep': {
    slug: 'a-level-prep',
    url: '/blog/a-level-preparation-guide',
    title: 'A-Level Preparation Guide',
    anchor: 'complete A-Level preparation guide',
    spokes: [
      'a-level-math', 'a-level-physics', 'a-level-chemistry', 'a-level-biology',
      'a-level-general-paper', 'jc-tuition',
    ],
  },
  'n-level-prep': {
    slug: 'n-level-prep',
    url: '/blog/n-level-preparation-guide',
    title: 'N-Level Preparation Guide',
    anchor: 'complete N-Level preparation guide',
    spokes: [
      'n-level-tuition', 'combined-science-overview', 'combined-chemistry-physics',
      'combined-chemistry-biology', 'combined-physics-biology',
    ],
  },
  'psle-prep': {
    slug: 'psle-prep',
    url: '/blog/psle-preparation-guide',
    title: 'PSLE Preparation Guide',
    anchor: 'complete PSLE preparation guide',
    spokes: ['psle-math', 'psle-english', 'psle-science', 'psle-chinese', 'primary-school-tuition'],
  },
  'ib-igcse': {
    slug: 'ib-igcse',
    url: '/guides/ib-igcse',
    title: 'IB & IGCSE Guide',
    anchor: 'IB and IGCSE subject guide hub',
    spokes: [
      'ibdp-biology', 'ibdp-chemistry', 'ibdp-physics',
      'igcse-biology', 'igcse-chemistry', 'igcse-physics',
    ],
  },
};

export const SPOKES = {
  // --- O-Level cluster ---
  'o-level-english': {
    slug: 'o-level-english', url: '/o-level-english', hub: 'o-level-prep',
    title: 'O-Level English', anchor: 'O-Level English paper strategies',
    blurb: 'Essay, comprehension and oral technique, paper by paper.',
  },
  'o-level-math': {
    slug: 'o-level-math', url: '/o-level-math', hub: 'o-level-prep',
    title: 'O-Level Maths', anchor: 'O-Level E-Math and A-Math guide',
    blurb: 'E-Math and A-Math topics, with the marks most often dropped.',
  },
  'o-level-physics': {
    slug: 'o-level-physics', url: '/o-level-physics', hub: 'o-level-prep',
    title: 'O-Level Physics', anchor: 'O-Level Physics topic guide',
    blurb: 'Kinematics, electricity and practical skills, paper by paper.',
  },
  'o-level-chemistry': {
    slug: 'o-level-chemistry', url: '/o-level-chemistry', hub: 'o-level-prep',
    title: 'O-Level Chemistry', anchor: 'O-Level Chemistry topic guide',
    blurb: 'Mole calculations, organic chemistry and qualitative analysis.',
  },
  'o-level-biology': {
    slug: 'o-level-biology', url: '/o-level-biology', hub: 'o-level-prep',
    title: 'O-Level Biology', anchor: 'O-Level Biology topic guide',
    blurb: 'Cells, physiology and genetics with exam-ready phrasing.',
  },
  'combined-science-overview': {
    slug: 'combined-science-overview', url: '/combined-science-overview', hub: 'o-level-prep',
    alsoIn: ['n-level-prep'],
    title: 'Combined Science', anchor: 'O-Level Combined Science overview',
    blurb: 'How the three Combined Science pairings work at both O-Level and N-Level.',
  },
  'combined-chemistry-physics': {
    slug: 'combined-chemistry-physics', url: '/combined-chemistry-physics', hub: 'o-level-prep',
    alsoIn: ['n-level-prep'],
    title: 'Combined Chemistry/Physics', anchor: 'Combined Science Chemistry and Physics guide',
    blurb: 'Syllabus 5086 (O-Level) and 5105 (N-Level) topics and paper structure.',
  },
  'combined-chemistry-biology': {
    slug: 'combined-chemistry-biology', url: '/combined-chemistry-biology', hub: 'o-level-prep',
    alsoIn: ['n-level-prep'],
    title: 'Combined Chemistry/Biology', anchor: 'Combined Science Chemistry and Biology guide',
    blurb: 'Syllabus 5088 (O-Level) and 5107 (N-Level) topics and paper structure.',
  },
  'combined-physics-biology': {
    slug: 'combined-physics-biology', url: '/combined-physics-biology', hub: 'o-level-prep',
    alsoIn: ['n-level-prep'],
    title: 'Combined Physics/Biology', anchor: 'Combined Science Physics and Biology guide',
    blurb: 'Syllabus 5087 (O-Level) and 5106 (N-Level) topics and paper structure.',
  },
  'o-level-tuition': {
    slug: 'o-level-tuition', url: '/secondary-school-tuition/o-level-tuition', hub: 'o-level-prep',
    title: 'O-Level Tuition', anchor: 'O-Level tuition in Singapore',
    blurb: 'Find a tutor matched to your subjects and target grade.',
  },

  // --- A-Level cluster ---
  'a-level-math': {
    slug: 'a-level-math', url: '/a-level-math', hub: 'a-level-prep',
    title: 'A-Level Maths', anchor: 'H2 Mathematics topic guide',
    blurb: 'H1 and H2 Mathematics topics with worked exam technique.',
  },
  'a-level-physics': {
    slug: 'a-level-physics', url: '/a-level-physics', hub: 'a-level-prep',
    title: 'A-Level Physics', anchor: 'H2 Physics topic guide',
    blurb: 'Revised 9478 syllabus coverage, practical and paper strategy.',
  },
  'a-level-chemistry': {
    slug: 'a-level-chemistry', url: '/a-level-chemistry', hub: 'a-level-prep',
    title: 'A-Level Chemistry', anchor: 'H2 Chemistry topic guide',
    blurb: 'Revised 9476 syllabus coverage, practical and paper strategy.',
  },
  'a-level-biology': {
    slug: 'a-level-biology', url: '/a-level-biology', hub: 'a-level-prep',
    title: 'A-Level Biology', anchor: 'H2 Biology topic guide',
    blurb: 'Revised 9477 syllabus coverage, practical and paper strategy.',
  },
  'a-level-general-paper': {
    slug: 'a-level-general-paper', url: '/a-level-general-paper', hub: 'a-level-prep',
    title: 'General Paper', anchor: 'A-Level General Paper guide',
    blurb: 'Paper 1 essays and Paper 2 comprehension, with mark schemes.',
  },
  'jc-tuition': {
    slug: 'jc-tuition', url: '/jc-tuition', hub: 'a-level-prep',
    title: 'JC Tuition', anchor: 'JC tuition in Singapore',
    blurb: 'Find an H1/H2 tutor for your subject combination.',
  },

  // --- N-Level cluster ---
  'n-level-tuition': {
    slug: 'n-level-tuition', url: '/secondary-school-tuition/n-level-tuition', hub: 'n-level-prep',
    title: 'N-Level Tuition', anchor: 'N-Level tuition in Singapore',
    blurb: 'Support for N(A) and N(T) candidates, including the O-Level route.',
  },

  // --- PSLE cluster ---
  'psle-math': {
    slug: 'psle-math', url: '/psle-math', hub: 'psle-prep',
    title: 'PSLE Maths', anchor: 'PSLE Mathematics guide',
    blurb: 'Heuristics, model drawing and Paper 2 problem sums.',
  },
  'psle-english': {
    slug: 'psle-english', url: '/psle-english', hub: 'psle-prep',
    title: 'PSLE English', anchor: 'PSLE English guide',
    blurb: 'Composition, comprehension and oral across both papers.',
  },
  'psle-science': {
    slug: 'psle-science', url: '/psle-science', hub: 'psle-prep',
    title: 'PSLE Science', anchor: 'PSLE Science guide',
    blurb: 'Open-ended answering technique and the themes examined.',
  },
  'psle-chinese': {
    slug: 'psle-chinese', url: '/psle-chinese', hub: 'psle-prep',
    title: 'PSLE Chinese', anchor: 'PSLE Chinese guide',
    blurb: 'Paper weightings, oral technique and vocabulary building.',
  },
  'primary-school-tuition': {
    slug: 'primary-school-tuition', url: '/primary-school-tuition', hub: 'psle-prep',
    title: 'Primary Tuition', anchor: 'primary school tuition in Singapore',
    blurb: 'Find a primary tutor from P1 through to PSLE.',
  },

  // --- IB & IGCSE cluster ---
  'ibdp-biology': {
    slug: 'ibdp-biology', url: '/ibdp-biology', hub: 'ib-igcse',
    title: 'IBDP Biology', anchor: 'IB Diploma Biology guide',
    blurb: 'HL and SL coverage, internal assessment and paper strategy.',
  },
  'ibdp-chemistry': {
    slug: 'ibdp-chemistry', url: '/ibdp-chemistry', hub: 'ib-igcse',
    title: 'IBDP Chemistry', anchor: 'IB Diploma Chemistry guide',
    blurb: 'HL and SL coverage, internal assessment and paper strategy.',
  },
  'ibdp-physics': {
    slug: 'ibdp-physics', url: '/ibdp-physics', hub: 'ib-igcse',
    title: 'IBDP Physics', anchor: 'IB Diploma Physics guide',
    blurb: 'HL and SL coverage, internal assessment and paper strategy.',
  },
  'igcse-biology': {
    slug: 'igcse-biology', url: '/igcse-biology', hub: 'ib-igcse',
    title: 'IGCSE Biology', anchor: 'IGCSE Biology guide',
    blurb: 'Core and extended syllabus with practical paper technique.',
  },
  'igcse-chemistry': {
    slug: 'igcse-chemistry', url: '/igcse-chemistry', hub: 'ib-igcse',
    title: 'IGCSE Chemistry', anchor: 'IGCSE Chemistry guide',
    blurb: 'Core and extended syllabus with practical paper technique.',
  },
  'igcse-physics': {
    slug: 'igcse-physics', url: '/igcse-physics', hub: 'ib-igcse',
    title: 'IGCSE Physics', anchor: 'IGCSE Physics guide',
    blurb: 'Core and extended syllabus with practical paper technique.',
  },
};
