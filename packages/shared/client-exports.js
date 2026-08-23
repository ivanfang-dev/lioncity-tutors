// Singapore education system: levels, the subjects offered at each, and rate bands.
// Levels that share a syllabus or a price band point at ONE frozen constant rather
// than repeating it, so the members of a group cannot drift apart on edit.

// ── Subject sets ──
// Named for the levels they cover. Frozen because several levels share each array.
const PRE_SCHOOL_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics',
  'Phonics', 'Art', 'Music', 'Physical Education',
]);

const PRIMARY_1_2_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics',
  'Art', 'Music', 'Physical Education', 'Character and Citizenship Education',
]);

const PRIMARY_3_6_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics', 'Science',
  'Art', 'Music', 'Physical Education', 'Social Studies',
  'Character and Citizenship Education',
]);

const SECONDARY_1_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics', 'Science',
  'Computing', 'History', 'Geography', 'Art', 'Music', 'Design and Technology',
  'Food and Consumer Education', 'Physical Education',
  'Character and Citizenship Education',
]);

const SECONDARY_2_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics', 'Science',
  'Computing', 'History', 'Geography', 'Literature in English', 'Art', 'Music',
  'Design and Technology', 'Food and Consumer Education', 'Physical Education',
  'Character and Citizenship Education',
]);

const SECONDARY_3_4_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics',
  'Elementary Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry',
  'Biology', 'Combined Science (Physics/Chemistry)',
  'Combined Science (Chemistry/Biology)', 'Computing', 'History', 'Geography',
  'Social Studies', 'Literature in English', 'Art', 'Music',
  'Design and Technology', 'Nutrition and Food Science', 'Principles of Accounts',
  'Physical Education', 'Character and Citizenship Education',
]);

const SECONDARY_5_SUBJECTS = Object.freeze([
  'English Language', 'Chinese', 'Malay', 'Tamil', 'Mathematics',
  'Elementary Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry',
  'Biology', 'History', 'Geography', 'Literature in English',
  'Principles of Accounts',
]);

// JC1 carries Project Work; JC2 is otherwise the same list.
const JC_CORE_SUBJECTS = Object.freeze([
  'General Paper', 'Chinese Language', 'Malay Language', 'Tamil Language',
  'Knowledge and Inquiry',
  'H1 Mathematics', 'H1 Physics', 'H1 Chemistry', 'H1 Biology', 'H1 Economics',
  'H1 History', 'H1 Geography', 'H1 Literature in English',
  'H1 Chinese Language and Literature', 'H1 Malay Language and Literature',
  'H1 Tamil Language and Literature',
  'H2 Mathematics', 'H2 Physics', 'H2 Chemistry', 'H2 Biology', 'H2 Computing',
  'H2 Economics', 'H2 History', 'H2 Geography', 'H2 Literature in English',
  'H2 Art', 'H2 Music', 'H2 Chinese Language and Literature',
  'H2 Malay Language and Literature', 'H2 Tamil Language and Literature',
  'H3 Mathematics', 'H3 Physics', 'H3 Chemistry', 'H3 Biology', 'H3 Economics',
  'H3 History', 'H3 Geography', 'H3 Literature in English', 'H3 Art',
]);

const JC_1_SUBJECTS = Object.freeze([
  'General Paper', 'Project Work', ...JC_CORE_SUBJECTS.slice(1),
]);

const IB_SUBJECTS = Object.freeze([
  'IB English Language and Literature', 'IB Chinese', 'IB Malay', 'IB Tamil',
  'IB Mathematics', 'IB Physics', 'IB Chemistry', 'IB Biology',
  'IB Business Management', 'IB Economics', 'IB Geography', 'IB History',
  'IB Visual Arts', 'IB Music', 'IB Theatre', 'IB Theory of Knowledge',
  'IB Extended Essay',
]);

const POLYTECHNIC_SUBJECTS = Object.freeze([
  'English', 'Mathematics', 'Engineering Mathematics', 'Communication Skills',
  'Computer Applications', 'Business Studies', 'Accounting', 'Science',
  'Statistics', 'Project Management', 'Major Subjects',
]);

// University Years 1-4 and Graduate Studies all draw on the same list.
const TERTIARY_SUBJECTS = Object.freeze([
  'Engineering Mathematics', 'Calculus', 'Linear Algebra', 'Statistics',
  'University Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology',
  'Computer Science', 'Programming', 'Accounting', 'Business Studies', 'Law',
  'Medicine', 'Research Methods', 'Major Specific Subjects',
]);

const MUSIC_ACADEMY_SUBJECTS = Object.freeze([
  'Music Theory', 'Piano', 'Violin', 'Guitar', 'Drums', 'Clarinet', 'Flute',
  'Saxophone', 'Trumpet', 'Cello', 'Ukulele', 'Voice/Singing',
  'Music Composition', 'Ensemble Playing',
]);

const PROFESSIONAL_SUBJECTS = Object.freeze([
  // Test Preparation
  'IELTS', 'TOEFL', 'SAT', 'GMAT', 'GRE',
  // Programming & Technology
  'Python Programming', 'Java Programming', 'C++ Programming', 'C# Programming',
  'Web Development', 'Data Science', 'AI and Machine Learning',
  'Mobile App Development', 'Photoshop', 'Video Editing',
  // Soft Skills
  'Public Speaking', 'Creative Writing', 'Essay Writing', 'Critical Thinking',
  'Study Skills',
  // Languages
  'French', 'German', 'Spanish', 'Japanese', 'Korean',
  // Business & Professional
  'Leadership', 'Project Management', 'Digital Marketing', 'Business Writing',
]);

export const LEVEL_SUBJECT_MAPPINGS = {
  'Pre-School': PRE_SCHOOL_SUBJECTS,

  'Primary 1': PRIMARY_1_2_SUBJECTS,
  'Primary 2': PRIMARY_1_2_SUBJECTS,
  'Primary 3': PRIMARY_3_6_SUBJECTS,
  'Primary 4': PRIMARY_3_6_SUBJECTS,
  'Primary 5': PRIMARY_3_6_SUBJECTS,
  'Primary 6': PRIMARY_3_6_SUBJECTS,

  'Secondary 1': SECONDARY_1_SUBJECTS,
  'Secondary 2': SECONDARY_2_SUBJECTS,
  'Secondary 3': SECONDARY_3_4_SUBJECTS,
  'Secondary 4': SECONDARY_3_4_SUBJECTS,
  'Secondary 5': SECONDARY_5_SUBJECTS,

  'Junior College 1': JC_1_SUBJECTS,
  'Junior College 2': JC_CORE_SUBJECTS,

  'International Baccalaureate Year 1': IB_SUBJECTS,
  'International Baccalaureate Year 2': IB_SUBJECTS,

  'Polytechnic Year 1': POLYTECHNIC_SUBJECTS,
  'Polytechnic Year 2': POLYTECHNIC_SUBJECTS,
  'Polytechnic Year 3': POLYTECHNIC_SUBJECTS,

  'University Year 1': TERTIARY_SUBJECTS,
  'University Year 2': TERTIARY_SUBJECTS,
  'University Year 3': TERTIARY_SUBJECTS,
  'University Year 4': TERTIARY_SUBJECTS,
  'Graduate Studies': TERTIARY_SUBJECTS,

  'Music Academy': MUSIC_ACADEMY_SUBJECTS,
  'Professional Development': PROFESSIONAL_SUBJECTS,
};

// Display order for level pickers. Declared explicitly because it is NOT the key
// order of LEVEL_SUBJECT_MAPPINGS — pickers list Polytechnic before IB, the subject
// map lists IB first. A test pins the two lists to the same 26 levels.
export const EDUCATION_LEVELS = [
  'Pre-School',

  'Primary 1',
  'Primary 2',
  'Primary 3',
  'Primary 4',
  'Primary 5',
  'Primary 6',

  'Secondary 1',
  'Secondary 2',
  'Secondary 3',
  'Secondary 4',
  'Secondary 5',

  'Junior College 1',
  'Junior College 2',

  'Polytechnic Year 1',
  'Polytechnic Year 2',
  'Polytechnic Year 3',

  'International Baccalaureate Year 1',
  'International Baccalaureate Year 2',

  'University Year 1',
  'University Year 2',
  'University Year 3',
  'University Year 4',
  'Graduate Studies',

  'Music Academy',
  'Professional Development',
];

const SPECIAL_CATEGORIES = Object.freeze([
  'Multiple Subjects', 'All Subjects', 'Exam Preparation', 'Homework Support', 'Other',
]);

export const SUBJECTS = [...new Set([
  ...Object.values(LEVEL_SUBJECT_MAPPINGS).flat(),
  ...SPECIAL_CATEGORIES,
])].sort();

export const isValidLevelSubjectCombination = (level, subject) => {
  if (SPECIAL_CATEGORIES.includes(subject)) return true;
  const subjects = LEVEL_SUBJECT_MAPPINGS[level];
  return subjects ? subjects.includes(subject) : false;
};

export const getSubjectsForLevel = (level) => [
  ...(LEVEL_SUBJECT_MAPPINGS[level] || []),
  ...SPECIAL_CATEGORIES,
];

// ── Rate bands ──
const rates = (pt, ft, moe) => Object.freeze({
  'PT (Part-Time)': pt,
  'FT (Full-Time)': ft,
  'MOE (Ex-MOE)': moe,
});

const PRE_SCHOOL_RATES = rates('$25-40/hr', '$40-65/hr', '$55-90/hr');
const PRIMARY_1_3_RATES = rates('$30-45/hr', '$45-70/hr', '$60-100/hr');
const PRIMARY_4_6_RATES = rates('$30-50/hr', '$50-75/hr', '$65-110/hr');
const SECONDARY_1_2_RATES = rates('$35-55/hr', '$55-85/hr', '$70-120/hr');
const SECONDARY_3_5_RATES = rates('$40-60/hr', '$60-90/hr', '$75-130/hr');
const JC_RATES = rates('$45-70/hr', '$70-100/hr', '$85-150/hr');
const POLYTECHNIC_RATES = rates('$40-65/hr', '$65-95/hr', '$80-140/hr');
const IB_AND_UNI_1_2_RATES = rates('$50-80/hr', '$80-120/hr', '$100-180/hr');
const UNI_3_4_RATES = rates('$55-85/hr', '$85-130/hr', '$110-200/hr');
const GRADUATE_RATES = rates('$60-100/hr', '$100-150/hr', '$130-250/hr');
const MUSIC_ACADEMY_RATES = rates('$40-70/hr', '$70-110/hr', '$90-160/hr');

export const RATE_MAPPINGS = {
  'Pre-School': PRE_SCHOOL_RATES,

  'Primary 1': PRIMARY_1_3_RATES,
  'Primary 2': PRIMARY_1_3_RATES,
  'Primary 3': PRIMARY_1_3_RATES,
  'Primary 4': PRIMARY_4_6_RATES,
  'Primary 5': PRIMARY_4_6_RATES,
  'Primary 6': PRIMARY_4_6_RATES,

  'Secondary 1': SECONDARY_1_2_RATES,
  'Secondary 2': SECONDARY_1_2_RATES,
  'Secondary 3': SECONDARY_3_5_RATES,
  'Secondary 4': SECONDARY_3_5_RATES,
  'Secondary 5': SECONDARY_3_5_RATES,

  'Junior College 1': JC_RATES,
  'Junior College 2': JC_RATES,

  'Polytechnic Year 1': POLYTECHNIC_RATES,
  'Polytechnic Year 2': POLYTECHNIC_RATES,
  'Polytechnic Year 3': POLYTECHNIC_RATES,

  'International Baccalaureate Year 1': IB_AND_UNI_1_2_RATES,
  'International Baccalaureate Year 2': IB_AND_UNI_1_2_RATES,
  'University Year 1': IB_AND_UNI_1_2_RATES,
  'University Year 2': IB_AND_UNI_1_2_RATES,
  'University Year 3': UNI_3_4_RATES,
  'University Year 4': UNI_3_4_RATES,

  'Graduate Studies': GRADUATE_RATES,
  'Music Academy': MUSIC_ACADEMY_RATES,
  'Professional Development': GRADUATE_RATES,
};
