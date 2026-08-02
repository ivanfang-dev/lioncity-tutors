/**
 * Corridor data for the regional tuition pages.
 *
 * Figures come from LionCity Tutors' own assignment and tutor records (298
 * assignments, 469 tutors, grouped by region on 2026-08-01). They are a
 * SNAPSHOT — REGIONS_REVIEWED dates them, and every page that renders a count
 * shows that date. See
 * docs/specs/2026-08-01-regional-pages-design.md for the queries that
 * produced them and the refresh procedure.
 *
 * Static by necessity: the website has no database access.
 *
 * Refresh cadence: quarterly, alongside tuition-rates/placements.mjs's
 * PLACEMENTS_REVIEWED.
 */

export const REGIONS_REVIEWED = 'August 2026';
export const TOTAL_TUTORS = 469;

/** Tutors who offer online lessons as well as home visits, of TOTAL_TUTORS. */
export const ONLINE_TUTORS = 263;

export const REGIONS = [
  {
    slug: 'tuition-punggol-sengkang',
    url: '/tuition-punggol-sengkang',
    name: 'Punggol & Sengkang',
    headline: 'Punggol, Sengkang, Hougang & Serangoon',
    regionKey: 'northeast',
    areas: ['Punggol', 'Sengkang', 'Hougang', 'Serangoon', 'Kovan', 'Ang Mo Kio'],
    tutorCount: 159,
    assignmentCount: 76,
    levelMix: { primary: 51, secondary: 19, jc: 5 },
    topSubjects: [
      { name: 'Mathematics', n: 22 },
      { name: 'English Language', n: 15 },
      { name: 'Chinese', n: 8 },
      { name: 'Science', n: 8 },
    ],
    transport: {
      lines: ['North East Line', 'Punggol LRT', 'Sengkang LRT', 'Cross Island Line (from 2030)'],
      note:
        'The northeast runs almost entirely on the North East Line, with the Punggol and Sengkang ' +
        'LRT loops covering the housing estates the MRT doesn’t reach directly. Tutors here are used ' +
        'to a last-mile LRT or bus leg, so a home visit can take a little longer door-to-door than the ' +
        'MRT distance alone suggests.',
    },
    // Not yet verified against MOE's school directory — ship empty until checked.
    // See docs/specs/2026-08-01-regional-pages-design.md open item 1.
    schools: { primary: [], secondary: [] },
  },
  {
    slug: 'tuition-tampines-bedok',
    url: '/tuition-tampines-bedok',
    name: 'Tampines & Bedok',
    headline: 'Tampines, Bedok, Pasir Ris & Simei',
    regionKey: 'east',
    areas: ['Tampines', 'Bedok', 'Pasir Ris', 'Simei', 'Marine Parade', 'Eunos'],
    tutorCount: 141,
    assignmentCount: 49,
    levelMix: { primary: 34, secondary: 13, jc: 1 },
    topSubjects: [
      { name: 'Mathematics', n: 14 },
      { name: 'Multiple Subjects', n: 11 },
      { name: 'Science', n: 5 },
      { name: 'Chinese', n: 5 },
    ],
    transport: {
      lines: ['East-West Line', 'Downtown Line', 'Thomson-East Coast Line'],
      note:
        'The East-West Line runs straight through Tampines, Simei, Bedok and Pasir Ris, with Marine ' +
        'Parade added by the Thomson-East Coast Line. It’s the most MRT-direct of the three ' +
        'corridors we cover, which is part of why home visits are the norm here rather than online ' +
        'lessons.',
    },
    schools: { primary: [], secondary: [] },
  },
  {
    slug: 'tuition-jurong-bukit-batok',
    url: '/tuition-jurong-bukit-batok',
    name: 'Jurong & Bukit Batok',
    headline: 'Jurong, Bukit Batok, Choa Chu Kang & Tengah',
    regionKey: 'west',
    areas: ['Jurong East', 'Jurong West', 'Bukit Batok', 'Choa Chu Kang', 'Tengah', 'Clementi'],
    tutorCount: 163,
    assignmentCount: 43,
    levelMix: { primary: 19, secondary: 15, jc: 8 },
    topSubjects: [
      { name: 'Multiple Subjects', n: 9 },
      { name: 'English Language', n: 6 },
      { name: 'H2 Physics', n: 6 },
      { name: 'Science', n: 4 },
    ],
    transport: {
      lines: ['East-West Line', 'Downtown Line', 'Jurong Region Line (under construction)'],
      note:
        'Jurong East and Jurong West sit on the East-West Line, while Bukit Batok and Choa Chu Kang ' +
        'connect via the North-South and Downtown Lines — two separate lines rather than one shared ' +
        'corridor, which is the main reason travel time varies more here than in our other two ' +
        'corridors. It’s also the only one of the three where JC bookings are common, which shapes ' +
        'who we match.',
    },
    schools: { primary: [], secondary: [] },
  },
];

export const regionFor = (slug) => REGIONS.find((r) => r.slug === slug);

/** "51 primary, 19 secondary and 5 JC" — prose form of the level mix. */
export const levelMixProse = (region) => {
  const { primary, secondary, jc } = region.levelMix;
  const parts = [];
  if (primary) parts.push(`${primary} primary`);
  if (secondary) parts.push(`${secondary} secondary`);
  if (jc) parts.push(`${jc} JC`);
  return parts.join(', ').replace(/, ([^,]*)$/, ' and $1');
};
