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

// Find up to `limit` tutors matching the assignment's level+subject, location, and tutor type
async function findMatchingTutors(assignment, limit = 5) {
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

  const tutors = await Tutor.find(query)
    .select('fullName contactNumber tutorType yearsOfExperience highestEducation introduction teachingExperience trackRecord hourlyRate createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return tutors;
}

export { findMatchingTutors, getLevelCategory, subjectToFieldName, LOCATION_TO_REGION };
