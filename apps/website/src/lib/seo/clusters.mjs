/**
 * The site's hub-and-spoke link graph.
 *
 * Adding a page means adding one entry here and listing its slug on the hub.
 * `links.test.mjs` enforces reciprocity and that every url resolves to a real
 * route, so a half-finished entry fails the build rather than shipping quietly.
 */

export const HUBS = {
  'psle-prep': {
    slug: 'psle-prep',
    url: '/blog/psle-preparation-guide',
    title: 'PSLE Preparation Guide',
    anchor: 'Complete PSLE preparation guide',
    spokes: [
      'psle-math', 'psle-english', 'psle-science', 'psle-chinese', 'primary-school-tuition',
      'chinese-tuition', 'tuition-rates', 'free-test-papers',
      'how-to-choose-a-tuition-agency-singapore',
    ],
  },
  'o-level-prep': {
    slug: 'o-level-prep',
    url: '/blog/o-level-preparation-guide',
    title: 'O-Level Preparation Guide',
    anchor: 'Complete O-Level preparation guide',
    spokes: [
      'o-level-english', 'o-level-math', 'o-level-physics', 'o-level-chemistry',
      'o-level-biology', 'o-level-history',
      'combined-science-overview', 'combined-chemistry-physics',
      'combined-chemistry-biology', 'combined-physics-biology', 'o-level-tuition',
      'math-tuition', 'science-tuition', 'chemistry-tuition', 'physics-tuition',
      'biology-tuition', 'english-tuition', 'chinese-tuition',
      'secondary-school-tuition', 'tuition-rates',
      'free-test-papers', 'free-notes',
      'how-to-choose-a-tuition-agency-singapore',
    ],
  },
  'n-level-prep': {
    slug: 'n-level-prep',
    url: '/blog/n-level-preparation-guide',
    title: 'N-Level Preparation Guide',
    anchor: 'Complete N-Level preparation guide',
    spokes: [
      'n-level-tuition', 'combined-science-overview', 'combined-chemistry-physics',
      'combined-chemistry-biology', 'combined-physics-biology',
      'secondary-school-tuition', 'tuition-rates', 'free-test-papers',
      'how-to-choose-a-tuition-agency-singapore',
    ],
  },
  'a-level-prep': {
    slug: 'a-level-prep',
    url: '/blog/a-level-preparation-guide',
    title: 'A-Level Preparation Guide',
    anchor: 'Complete A-Level preparation guide',
    spokes: [
      'a-level-math', 'a-level-physics', 'a-level-chemistry', 'a-level-biology',
      'a-level-general-paper', 'jc-tuition',
      'math-tuition', 'science-tuition', 'chemistry-tuition', 'physics-tuition',
      'biology-tuition', 'economics-tuition', 'tuition-rates',
      'free-notes', 'free-test-papers',
      'how-to-choose-a-tuition-agency-singapore',
    ],
  },
  'find-a-tutor': {
    slug: 'find-a-tutor',
    url: '/request-tutor',
    title: 'Find a Tutor',
    anchor: 'Request a hand-matched tutor',
    blurb: 'Tell us the level, subject and area — we match a vetted tutor, usually within 6 hours.',
    // "6 hours" above is hardcoded because this registry is a plain data file
    // that cannot import MATCH_HOURS from @/data/promises. If MATCH_HOURS
    // ever changes, this string must change too.
    //
    // This hub is a conversion page, not an editorial guide, so it carries
    // Service schema rather than the Article every other hub gets — see
    // scripts/verify-seo-cluster.mjs. It also legitimately links to itself:
    // the site-wide "Get Free Tutor Matching" nav CTA points here from every
    // page, including this one, so the usual hub-self-link check is skipped.
    schemaType: 'Service',
    allowSelfLink: true,
    spokes: [
      'tuition-punggol-sengkang',
      'tuition-tampines-bedok',
      'tuition-jurong-bukit-batok',
      'how-to-choose-a-tuition-agency-singapore',
      'tuition-rates',
    ],
  },
  'ib-igcse': {
    slug: 'ib-igcse',
    url: '/guides/ib-igcse',
    title: 'IB & IGCSE Guide',
    anchor: 'IB and IGCSE subject guide hub',
    // Hubs may override the generic description RelatedGuides shows on their
    // card. The exam-prep hubs are fine with the default; this one is not, since
    // IB and IGCSE have no single national timetable.
    blurb: 'How IB Diploma and IGCSE differ from the Singapore national track, subject by subject.',
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
  // A study-technique article rather than a subject landing page, so it carries
  // Article rather than the spoke default of Course.
  'o-level-history': {
    slug: 'o-level-history', url: '/blog/how-to-study-history-o-level', hub: 'o-level-prep',
    schemaType: 'Article',
    title: 'How to Study for O-Level History',
    anchor: 'how to study for O-Level History',
    blurb: 'Source-based question technique and essay structure, mistake by mistake.',
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

  // --- Site-wide resources ---
  // These serve every exam level, so they sit in several hubs at once via
  // alsoIn. `resource: true` marks a collection of downloads rather than a
  // subject guide: they carry CollectionPage schema instead of Course, which
  // verify-seo-cluster.mjs checks for. Their primary hub is whichever level
  // dominates their search demand, since a breadcrumb needs one parent.
  'free-test-papers': {
    slug: 'free-test-papers', url: '/free-test-papers', hub: 'o-level-prep',
    alsoIn: ['a-level-prep', 'n-level-prep', 'psle-prep'],
    schemaType: 'CollectionPage',
    title: 'Free Test Papers',
    anchor: 'free past-year and prelim papers',
    blurb: 'Prelim and past-year papers by level and subject, free to download.',
  },
  'free-notes': {
    slug: 'free-notes', url: '/free-notes', hub: 'a-level-prep',
    alsoIn: ['o-level-prep'],
    schemaType: 'CollectionPage',
    title: 'Free Study Notes',
    // Anchor and blurb describe what the page actually hosts today (GP
    // infopacks); update them as subjects land rather than promising ahead.
    anchor: 'free study notes and GP infopacks',
    blurb: 'Free revision notes to download, starting with JC General Paper.',
  },

  // --- Commercial pages ---
  // Subject-tuition pages sit in the exam hub their traffic comes from, so
  // they stop being dead ends and pass equity into the guides. `schemaType`
  // overrides the Course default that subject pages get: a rate card is a
  // Service with prices, not a course.
  'math-tuition': {
    slug: 'math-tuition', url: '/math-tuition', hub: 'o-level-prep',
    alsoIn: ['a-level-prep'],
    title: 'Maths Tuition', anchor: 'maths tuition in Singapore',
    blurb: 'Hand-matched maths tutors from primary through to H2.',
  },
  'science-tuition': {
    slug: 'science-tuition', url: '/science-tuition', hub: 'o-level-prep',
    alsoIn: ['a-level-prep'],
    title: 'Science Tuition', anchor: 'science tuition in Singapore',
    blurb: 'Physics, Chemistry and Biology tutors across every level.',
  },
  'chemistry-tuition': {
    slug: 'chemistry-tuition', url: '/chemistry-tuition', hub: 'o-level-prep',
    alsoIn: ['a-level-prep'],
    title: 'Chemistry Tuition', anchor: 'chemistry tuition in Singapore',
    blurb: 'O-Level and H2 Chemistry tutors, matched to your syllabus.',
  },
  'physics-tuition': {
    slug: 'physics-tuition', url: '/physics-tuition', hub: 'o-level-prep',
    alsoIn: ['a-level-prep'],
    title: 'Physics Tuition', anchor: 'physics tuition in Singapore',
    blurb: 'O-Level and H2 Physics tutors, matched to your syllabus.',
  },
  'biology-tuition': {
    slug: 'biology-tuition', url: '/biology-tuition', hub: 'o-level-prep',
    alsoIn: ['a-level-prep'],
    title: 'Biology Tuition', anchor: 'biology tuition in Singapore',
    blurb: 'O-Level and H2 Biology tutors, matched to your syllabus.',
  },
  'english-tuition': {
    slug: 'english-tuition', url: '/english-tuition', hub: 'o-level-prep',
    title: 'English Tuition', anchor: 'English tuition in Singapore',
    blurb: 'Composition, comprehension and oral, primary to O-Level.',
  },
  'chinese-tuition': {
    slug: 'chinese-tuition', url: '/chinese-tuition', hub: 'psle-prep',
    alsoIn: ['o-level-prep'],
    title: 'Chinese Tuition', anchor: 'Chinese tuition in Singapore',
    blurb: 'Mother tongue support from primary through to O-Level.',
  },
  'economics-tuition': {
    slug: 'economics-tuition', url: '/economics-tuition', hub: 'a-level-prep',
    title: 'Economics Tuition', anchor: 'economics tuition in Singapore',
    blurb: 'H1 and H2 Economics tutors for essays and case studies.',
  },
  'secondary-school-tuition': {
    slug: 'secondary-school-tuition', url: '/secondary-school-tuition', hub: 'o-level-prep',
    alsoIn: ['n-level-prep'],
    title: 'Secondary Tuition', anchor: 'secondary school tuition in Singapore',
    blurb: 'Sec 1 to Sec 5 tutors across the O-Level and N-Level tracks.',
  },
  'tuition-rates': {
    slug: 'tuition-rates', url: '/tuition-rates', hub: 'o-level-prep',
    // find-a-tutor listed last: tuition-rates already belongs to all four exam
    // hubs, and joining a fifth means RelatedGuides' default hubLimit (4) would
    // drop one of them. tuition-rates/page.jsx passes hubLimit={5} instead, so
    // all five render and none of the four existing prep-guide links are lost.
    alsoIn: ['a-level-prep', 'n-level-prep', 'psle-prep', 'find-a-tutor'],
    schemaType: 'Service',
    title: 'Tuition Rates', anchor: 'tuition rates in Singapore',
    blurb: 'What tutors charge by level and experience, with no agency fee.',
  },
  'how-to-choose-a-tuition-agency-singapore': {
    slug: 'how-to-choose-a-tuition-agency-singapore',
    url: '/how-to-choose-a-tuition-agency-singapore',
    hub: 'psle-prep',
    alsoIn: ['o-level-prep', 'n-level-prep', 'a-level-prep', 'find-a-tutor'],
    schemaType: 'Service',
    title: 'Choosing an Agency',
    anchor: 'how to choose a tuition agency',
    blurb: 'Agency, centre or independent tutor — what each costs and who each suits.',
  },

  // --- Regional pages ---
  // Corridor pages, not single-estate pages: each covers the cluster of areas
  // that actually co-occur in the assignment data. areaServed (a list of
  // Place names, not a Country) is passed by each page.jsx, not stored here.
  'tuition-punggol-sengkang': {
    slug: 'tuition-punggol-sengkang', url: '/tuition-punggol-sengkang',
    hub: 'find-a-tutor',
    schemaType: 'Service',
    title: 'Punggol & Sengkang', anchor: 'tuition in Punggol and Sengkang',
    blurb: 'Tutors covering Punggol, Sengkang, Hougang and Serangoon.',
  },
  'tuition-tampines-bedok': {
    slug: 'tuition-tampines-bedok', url: '/tuition-tampines-bedok',
    hub: 'find-a-tutor',
    schemaType: 'Service',
    title: 'Tampines & Bedok', anchor: 'tuition in Tampines and Bedok',
    blurb: 'Tutors covering Tampines, Bedok, Pasir Ris and Simei.',
  },
  'tuition-jurong-bukit-batok': {
    slug: 'tuition-jurong-bukit-batok', url: '/tuition-jurong-bukit-batok',
    hub: 'find-a-tutor',
    schemaType: 'Service',
    title: 'Jurong & Bukit Batok', anchor: 'tuition in Jurong and Bukit Batok',
    blurb: 'Tutors covering Jurong, Bukit Batok, Choa Chu Kang and Tengah.',
  },
};
