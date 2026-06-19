import Tutor from '../../../packages/shared/models/Tutor.js';
import { LEVEL_SUBJECT_MAPPINGS } from '../../../packages/shared/index.js';

// Maps assignment location (from inline keyboard) to tutor region boolean key
const LOCATION_TO_REGION = {
  'Sengkang': 'northeast', 'Punggol': 'northeast', 'Hougang': 'northeast',
  'Serangoon': 'northeast', 'Kovan': 'northeast', 'Buangkok': 'northeast',
  'Tampines': 'east', 'Pasir Ris': 'east', 'Bedok': 'east',
  'Simei': 'east', 'East Coast': 'east', 'Katong': 'east', 'Marine Parade': 'east',
  'Jurong East': 'west', 'Jurong West': 'west', 'Clementi': 'west',
  'Boon Lay': 'west', 'Pioneer': 'west', 'Buona Vista': 'west', 'Dover': 'west', 'Tengah': 'west',
  'Woodlands': 'north', 'Sembawang': 'north', 'Yishun': 'north', 'Admiralty': 'north',
  'Bukit Batok': 'northwest', 'Bukit Panjang': 'northwest', 'Choa Chu Kang': 'northwest',
  'Bishan': 'central', 'Toa Payoh': 'central', 'Ang Mo Kio': 'central',
  'Novena': 'central', 'Bukit Timah': 'central', 'Orchard': 'central', 'Thomson': 'central',
  'Tiong Bahru': 'south', 'Queenstown': 'south', 'Redhill': 'south', 'Harbourfront': 'south',
  'Online': 'online'
};

// Maps assignment level string prefix to tutor teachingLevels key
function getLevelCategory(level) {
  const prefixes = [
    ['Pre-School', 'preschool'],
    ['Primary', 'primary'],
    ['Secondary', 'secondary'],
    ['Junior College', 'jc'],
    ['International Baccalaureate', 'ib'],
    ['Millennia Institute', 'millenniaInstitute'],
    ['Polytechnic', 'polytechnic'],
    ['University', 'university'],
    ['Graduate Studies', 'university'],
    ['Music Academy', 'music'],
    ['Professional Development', 'professional'],
  ];
  for (const [prefix, category] of prefixes) {
    if (level === prefix || level.startsWith(prefix)) return category;
  }
  return null;
}

// Maps subject display name to tutor schema camelCase field name
function subjectToFieldName(subject) {
  const overrides = {
    'C++ Programming': 'cppProgramming',
    'C# Programming': 'cSharpProgramming',
  };
  if (overrides[subject]) return overrides[subject];

  const cleaned = subject
    .replace(/[()]/g, '')
    .replace(/\//g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.map((w, i) =>
    i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join('');
}

// Maps assignment tutor type preference to possible DB values (mixed formats from website + telegram)
const TUTOR_TYPE_MAP = {
  'Part-time': ['Part-time Tutor', 'Parttime', 'Undergraduate'],
  'Full-time': ['Full-time Tutor', 'Fulltime'],
  'MOE/Ex-MOE': ['MOE Teacher', 'Ex-MOE Teacher', 'Moe', 'Exmoe', 'Nie'],
};

// Subject values that don't map to a single tutor field — require title parsing
const SPECIAL_SUBJECTS = new Set([
  'Multiple Subjects', 'All Subjects', 'Exam Preparation', 'Homework Support', 'Other'
]);

// Alias (lowercase) → canonical subject name or array of names
// Sorted longest-first at use time so "H2 Maths" matches before "Maths", "A Maths" before "Maths"
const TITLE_ALIASES = {
  // JC H-level subjects
  'h1 mathematics': 'H1 Mathematics', 'h2 mathematics': 'H2 Mathematics', 'h3 mathematics': 'H3 Mathematics',
  'h1 maths': 'H1 Mathematics', 'h2 maths': 'H2 Mathematics', 'h3 maths': 'H3 Mathematics',
  'h1 physics': 'H1 Physics', 'h2 physics': 'H2 Physics', 'h3 physics': 'H3 Physics',
  'h1 chemistry': 'H1 Chemistry', 'h2 chemistry': 'H2 Chemistry', 'h3 chemistry': 'H3 Chemistry',
  'h1 biology': 'H1 Biology', 'h2 biology': 'H2 Biology', 'h3 biology': 'H3 Biology',
  'h1 economics': 'H1 Economics', 'h2 economics': 'H2 Economics', 'h3 economics': 'H3 Economics',
  'h1 history': 'H1 History', 'h2 history': 'H2 History', 'h3 history': 'H3 History',
  'h1 geography': 'H1 Geography', 'h2 geography': 'H2 Geography', 'h3 geography': 'H3 Geography',
  'h2 computing': 'H2 Computing',
  'h2 literature': 'H2 Literature in English', 'h3 literature': 'H3 Literature in English',
  'general paper': 'General Paper',
  // Secondary-specific
  'additional mathematics': 'Additional Mathematics', 'additional maths': 'Additional Mathematics',
  'add maths': 'Additional Mathematics', 'a maths': 'Additional Mathematics',
  'elementary mathematics': 'Elementary Mathematics', 'elementary maths': 'Elementary Mathematics',
  'elem maths': 'Elementary Mathematics', 'e maths': 'Elementary Mathematics',
  // Combined Science → both variants (title won't say which combination)
  'combined science': ['Combined Science (Physics/Chemistry)', 'Combined Science (Chemistry/Biology)'],
  'combined': ['Combined Science (Physics/Chemistry)', 'Combined Science (Chemistry/Biology)'],
  'principles of accounts': 'Principles of Accounts',
  'literature in english': 'Literature in English',
  'design and technology': 'Design and Technology',
  // Common abbreviations
  'english language': 'English Language',
  'english': 'English Language',
  'mathematics': 'Mathematics', 'maths': 'Mathematics', 'math': 'Mathematics',
  'physics': 'Physics', 'phy': 'Physics',
  'chemistry': 'Chemistry', 'chem': 'Chemistry',
  'biology': 'Biology', 'bio': 'Biology',
  'science': 'Science', 'sci': 'Science',
  'economics': 'Economics', 'econs': 'Economics',
  'geography': 'Geography', 'geo': 'Geography',
  'history': 'History',
  'literature': 'Literature in English', 'lit': 'Literature in English',
  'accounts': 'Principles of Accounts', 'poa': 'Principles of Accounts',
  'computing': 'Computing',
  'chinese': 'Chinese',
  'malay': 'Malay',
  'tamil': 'Tamil',
  'art': 'Art',
  'music': 'Music',
  'gp': 'General Paper',
};

// Sort aliases longest-first once at module load
const SORTED_ALIASES = Object.keys(TITLE_ALIASES).sort((a, b) => b.length - a.length);

// Parse subject DB field names from a free-text assignment title
function parseSubjectsFromTitle(title) {
  const normalized = title
    .replace(/\([^)]*\)/g, '') // strip (NA), (Express), (IP), (Foundation) etc.
    .toLowerCase();

  const matched = new Set();
  let remaining = normalized;

  for (const alias of SORTED_ALIASES) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i');
    if (regex.test(remaining)) {
      const value = TITLE_ALIASES[alias];
      const canonicals = Array.isArray(value) ? value : [value];
      for (const canonical of canonicals) {
        const field = subjectToFieldName(canonical);
        if (field) matched.add(field);
      }
      // Remove the matched text so shorter aliases don't double-match
      remaining = remaining.replace(regex, ' ');
    }
  }

  return [...matched];
}

// --- Candidate quality ranking (pre-AI) ------------------------------------
// A cheap deterministic score that narrows the matched pool to the strongest
// `poolSize` tutors BEFORE the (paid, slower) AI re-ranker looks at them.
//
// Weights — tuned to how the agency actually reaches out. Tune freely:
//   • Budget is enforced first as a hard filter (over-budget tutors are dropped —
//     no point messaging someone the assignment can't afford), so its real weight
//     lives in the filter, not this number.
//   • Experience and commitment sit close together on purpose: a tutor who put real
//     effort into their profile can outrank a more senior one who left theirs blank.
const WEIGHTS = { experience: 0.40, commitment: 0.35, budget: 0.25 };

// A tutor asking up to this fraction over the assignment ceiling is still worth
// messaging (rates are negotiable at the margin); beyond it, drop them.
const BUDGET_GRACE = 0.20;

// yearsOfExperience is a fixed dropdown on the register-tutor form (website
// register-tutor/page.jsx) — these are the only five possible values.
const EXPERIENCE_RANK = {
  '0-1 year': 1,
  '1-3 years': 2,
  '3-5 years': 3,
  '5-10 years': 4,
  '10+ years': 5,
};

// Pull every number out of a free-text money string. "$30-45/hr" → [30, 45].
function extractNumbers(text) {
  return (String(text ?? '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

// Parse the assignment's free-text rate into spending ceilings per tutor-type band.
// Real examples the owner types:
//   "$30-45/hr (PT), $40-50/hr (FT)" → { partTime: 45, fullTime: 50 }
//   "$40-50/hr"                       → { default: 50 }
// FT/MOE bands are typically higher than PT — we honour whichever band the text tags.
function parseBudget(rateText) {
  const bands = {};
  let overallMax = null;
  for (const segment of String(rateText ?? '').split(',')) {
    const nums = extractNumbers(segment);
    if (nums.length === 0) continue;
    const ceiling = Math.max(...nums);
    overallMax = overallMax === null ? ceiling : Math.max(overallMax, ceiling);
    if (/\b(pt|part|undergrad)\w*/i.test(segment)) bands.partTime = ceiling;
    else if (/\b(ft|full)\w*/i.test(segment)) bands.fullTime = ceiling;
    else if (/\b(moe|nie)\w*/i.test(segment)) bands.moe = ceiling;
    else bands.default = ceiling;
  }
  return { bands, overallMax };
}

// The spending ceiling that applies to THIS tutor, based on their type. Full-time /
// MOE tutors fall back to the highest band available (they cost more); part-timers
// fall back to the default/overall band.
function ceilingForTutor(tutor, budget) {
  const { bands, overallMax } = budget;
  const type = (tutor.tutorType || '').toLowerCase();
  if (/part|undergrad/.test(type) && bands.partTime != null) return bands.partTime;
  if (/full/.test(type) && bands.fullTime != null) return bands.fullTime;
  if (/moe|nie/.test(type) && bands.moe != null) return bands.moe;
  return bands.default ?? overallMax ?? null;
}

// The tutor's own asking rate for this level (lower bound of any range = the least
// they'd accept). null when they never filled it in for this level.
function tutorFloorRate(tutor, levelCategory) {
  const nums = extractNumbers(tutor.hourlyRate?.[levelCategory]);
  return nums.length ? Math.min(...nums) : null;
}

// How well a tutor fits the budget → { affordable, comfort } where comfort is 0..1
// (1 = comfortably cheap, very likely to say yes; 0.5 = right at the ceiling).
// Unknowns get the benefit of the doubt so we never silently drop a good tutor.
function budgetFit(tutor, budget, levelCategory) {
  const ceiling = ceilingForTutor(tutor, budget);
  const floor = tutorFloorRate(tutor, levelCategory);
  if (ceiling == null || floor == null) return { affordable: true, comfort: 0.5 };
  if (floor > ceiling * (1 + BUDGET_GRACE)) return { affordable: false, comfort: 0 };
  if (floor > ceiling) return { affordable: true, comfort: 0.3 }; // in the grace zone
  return { affordable: true, comfort: 0.5 + 0.5 * (1 - floor / ceiling) };
}

// 0..1 measure of effort the tutor put into their profile. Rewards depth, not mere
// presence — a senior who wrote only "a few lines" scores low here by design.
function commitmentScore(tutor) {
  const TARGET = 200; // chars that represent a genuinely filled-out field
  const fields = [tutor.introduction, tutor.teachingExperience, tutor.trackRecord];
  const perField = fields.map(f => Math.min((f?.trim().length || 0) / TARGET, 1));
  return perField.reduce((sum, v) => sum + v, 0) / perField.length;
}

// Blended 0..1 quality score for ordering the affordable pool.
function scoreTutor(tutor, fit) {
  const experience = (EXPERIENCE_RANK[tutor.yearsOfExperience] || 0) / 5;
  return (
    WEIGHTS.experience * experience +
    WEIGHTS.commitment * commitmentScore(tutor) +
    WEIGHTS.budget * fit.comfort
  );
}

// Find the best `poolSize` tutors matching the assignment's level+subject, location,
// and tutor type — quality-ranked, ready to hand to the AI re-ranker.
async function findMatchingTutors(assignment, poolSize = 40) {
  const levelCategory = getLevelCategory(assignment.level);
  const region = LOCATION_TO_REGION[assignment.location];

  if (!levelCategory || !region) {
    console.log('Could not map assignment for tutor matching:', {
      level: assignment.level, levelCategory,
      location: assignment.location, region
    });
    return [];
  }

  let subjectQuery;
  if (SPECIAL_SUBJECTS.has(assignment.subject)) {
    // Try to parse subjects from the assignment title
    const fields = parseSubjectsFromTitle(assignment.title || '');
    if (fields.length > 0) {
      console.log(`Parsed subjects from title "${assignment.title}":`, fields);
      subjectQuery = { $or: fields.map(f => ({ [`teachingLevels.${levelCategory}.${f}`]: true })) };
    } else {
      // Fallback: match any tutor who teaches any subject at this level
      console.log(`No subjects parsed from title "${assignment.title}", matching any ${levelCategory} tutor`);
      const allFields = (LEVEL_SUBJECT_MAPPINGS[assignment.level] || [])
        .map(s => subjectToFieldName(s)).filter(Boolean);
      subjectQuery = allFields.length > 0
        ? { $or: allFields.map(f => ({ [`teachingLevels.${levelCategory}.${f}`]: true })) }
        : {};
    }
  } else {
    const subjectField = subjectToFieldName(assignment.subject);
    if (!subjectField) {
      console.log('Could not map subject:', assignment.subject);
      return [];
    }
    subjectQuery = { [`teachingLevels.${levelCategory}.${subjectField}`]: true };
  }

  const query = {
    contactNumber: { $exists: true, $ne: null, $ne: '' },
    [`locations.${region}`]: true,
    ...subjectQuery,
  };

  // Filter by tutor type if preference is specified
  if (assignment.preferredTutorTypes?.length > 0) {
    const allowedTypes = assignment.preferredTutorTypes.flatMap(t => TUTOR_TYPE_MAP[t] || []);
    query.tutorType = { $in: allowedTypes };
  }

  // Fetch the full matching set (bounded for safety), then quality-rank in JS.
  // We deliberately avoid a DB `.limit()` on a recency sort here: that was discarding
  // our most experienced tutors (who often registered earliest) before the AI ever saw
  // them. yearsOfExperience/hourlyRate are stored as strings, so ranking has to happen
  // in application code anyway. The createdAt sort only bounds which 300 we pull in the
  // rare case a single subject+level+region+type query matches more than that.
  const MAX_CANDIDATE_FETCH = 300;
  const candidates = await Tutor.find(query)
    .select('fullName contactNumber tutorType yearsOfExperience highestEducation introduction teachingExperience trackRecord hourlyRate createdAt')
    .sort({ createdAt: -1 })
    .limit(MAX_CANDIDATE_FETCH)
    .lean();

  // Drop tutors the assignment clearly can't afford, then quality-rank the rest and
  // hand the strongest `poolSize` to the AI re-ranker.
  const budget = parseBudget(assignment.rate);
  const ranked = candidates
    .map((tutor) => ({ tutor, fit: budgetFit(tutor, budget, levelCategory) }))
    .filter(({ fit }) => fit.affordable)
    .map(({ tutor, fit }) => ({ tutor, score: scoreTutor(tutor, fit) }))
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, poolSize).map(({ tutor }) => tutor);
}

export { findMatchingTutors, getLevelCategory, subjectToFieldName, LOCATION_TO_REGION };
