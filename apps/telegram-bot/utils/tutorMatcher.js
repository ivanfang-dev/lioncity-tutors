import Tutor from '../../../packages/shared/models/Tutor.js';

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

// Find up to `limit` tutors matching the assignment's level+subject, location, and tutor type
async function findMatchingTutors(assignment, limit = 5) {
  const levelCategory = getLevelCategory(assignment.level);
  const subjectField = subjectToFieldName(assignment.subject);
  const region = LOCATION_TO_REGION[assignment.location];

  if (!levelCategory || !subjectField || !region) {
    console.log('Could not map assignment for tutor matching:', {
      level: assignment.level, levelCategory,
      subject: assignment.subject, subjectField,
      location: assignment.location, region
    });
    return [];
  }

  const query = {
    contactNumber: { $exists: true, $ne: null, $ne: '' },
    [`teachingLevels.${levelCategory}.${subjectField}`]: true,
    [`locations.${region}`]: true,
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
