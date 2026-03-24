import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not found in environment. Make sure .env is set up.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB.');

const col = mongoose.connection.collection('tutors');
const total = await col.countDocuments();
console.log(`Total tutor documents: ${total}`);

// Step 1: Rename primary subject fields
let result = await col.updateMany(
  { 'teachingLevels.primary.english': { $exists: true } },
  { $rename: {
    'teachingLevels.primary.english': 'teachingLevels.primary.englishLanguage',
    'teachingLevels.primary.math': 'teachingLevels.primary.mathematics',
  }}
);
console.log(`Primary field renames: ${result.modifiedCount} documents updated`);

// Step 2: Rename secondary subject fields
result = await col.updateMany(
  { 'teachingLevels.secondary.english': { $exists: true } },
  { $rename: {
    'teachingLevels.secondary.english': 'teachingLevels.secondary.englishLanguage',
    'teachingLevels.secondary.math': 'teachingLevels.secondary.mathematics',
    'teachingLevels.secondary.aMath': 'teachingLevels.secondary.additionalMathematics',
    'teachingLevels.secondary.eMath': 'teachingLevels.secondary.elementaryMathematics',
    'teachingLevels.secondary.literature': 'teachingLevels.secondary.literatureInEnglish',
  }}
);
console.log(`Secondary field renames: ${result.modifiedCount} documents updated`);

// Step 3: Rename JC subject fields
result = await col.updateMany(
  { 'teachingLevels.jc.h1Math': { $exists: true } },
  { $rename: {
    'teachingLevels.jc.h1Math': 'teachingLevels.jc.h1Mathematics',
    'teachingLevels.jc.h2Math': 'teachingLevels.jc.h2Mathematics',
  }}
);
console.log(`JC field renames: ${result.modifiedCount} documents updated`);

// Step 4: Rename hourlyRate.international -> hourlyRate.ib
result = await col.updateMany(
  { 'hourlyRate.international': { $exists: true } },
  { $rename: { 'hourlyRate.international': 'hourlyRate.ib' } }
);
console.log(`hourlyRate.international renamed: ${result.modifiedCount} documents updated`);

// Step 5: Handle international teaching level (migrate ielts/toefl to professional, then delete)
const oldDocs = await col.find({ 'teachingLevels.international': { $exists: true } }).toArray();
console.log(`Documents with old 'international' level: ${oldDocs.length}`);
let intlMigrated = 0;
for (const doc of oldDocs) {
  const intl = doc.teachingLevels.international || {};
  const update = { $unset: { 'teachingLevels.international': '' } };
  const setFields = {};
  if (intl.ielts === true) setFields['teachingLevels.professional.ielts'] = true;
  if (intl.toefl === true) setFields['teachingLevels.professional.toefl'] = true;
  if (Object.keys(setFields).length) update.$set = setFields;
  await col.updateOne({ _id: doc._id }, update);
  intlMigrated++;
}
console.log(`International level removed and migrated: ${intlMigrated} documents`);

// Step 6: Add missing top-level teaching level keys with all subject fields initialized to false
const LEVEL_DEFAULTS = {
  preschool: {
    englishLanguage: false, chinese: false, malay: false, tamil: false,
    mathematics: false, phonics: false, art: false, music: false, physicalEducation: false,
  },
  primary: {
    englishLanguage: false, chinese: false, malay: false, tamil: false,
    mathematics: false, science: false, art: false, music: false, physicalEducation: false,
    socialStudies: false, characterAndCitizenshipEducation: false,
  },
  secondary: {
    englishLanguage: false, chinese: false, malay: false, tamil: false,
    mathematics: false, elementaryMathematics: false, additionalMathematics: false,
    physics: false, chemistry: false, biology: false,
    combinedSciencePhysicsChemistry: false, combinedScienceChemistryBiology: false,
    science: false, computing: false, history: false, geography: false,
    socialStudies: false, literatureInEnglish: false, art: false, music: false,
    designAndTechnology: false, nutritionAndFoodScience: false,
    foodAndConsumerEducation: false, principlesOfAccounts: false,
    physicalEducation: false, characterAndCitizenshipEducation: false,
  },
  jc: {
    generalPaper: false, projectWork: false,
    chineseLanguage: false, malayLanguage: false, tamilLanguage: false, knowledgeAndInquiry: false,
    h1Mathematics: false, h1Physics: false, h1Chemistry: false, h1Biology: false,
    h1Economics: false, h1History: false, h1Geography: false, h1LiteratureInEnglish: false,
    h1ChineseLanguageAndLiterature: false, h1MalayLanguageAndLiterature: false, h1TamilLanguageAndLiterature: false,
    h2Mathematics: false, h2Physics: false, h2Chemistry: false, h2Biology: false,
    h2Computing: false, h2Economics: false, h2History: false, h2Geography: false,
    h2LiteratureInEnglish: false, h2Art: false, h2Music: false,
    h2ChineseLanguageAndLiterature: false, h2MalayLanguageAndLiterature: false, h2TamilLanguageAndLiterature: false,
    h3Mathematics: false, h3Physics: false, h3Chemistry: false, h3Biology: false,
    h3Economics: false, h3History: false, h3Geography: false, h3LiteratureInEnglish: false, h3Art: false,
  },
  millenniaInstitute: {
    generalPaper: false, projectWork: false,
    h1Mathematics: false, h1Physics: false, h1Chemistry: false, h1Biology: false, h1Economics: false,
    h2Mathematics: false, h2Physics: false, h2Chemistry: false, h2Biology: false,
    h2Economics: false, h2Geography: false, h2History: false, h2LiteratureInEnglish: false,
  },
  ib: {
    ibEnglishLanguageAndLiterature: false, ibChinese: false, ibMalay: false, ibTamil: false,
    ibMathematics: false, ibPhysics: false, ibChemistry: false, ibBiology: false,
    ibBusinessManagement: false, ibEconomics: false, ibGeography: false, ibHistory: false,
    ibVisualArts: false, ibMusic: false, ibTheatre: false,
    ibTheoryOfKnowledge: false, ibExtendedEssay: false,
  },
  polytechnic: {
    english: false, mathematics: false, engineeringMathematics: false,
    communicationSkills: false, computerApplications: false, businessStudies: false,
    accounting: false, science: false, statistics: false, projectManagement: false, majorSubjects: false,
  },
  university: {
    engineeringMathematics: false, calculus: false, linearAlgebra: false, statistics: false,
    universityPhysics: false, chemistry: false, biology: false, economics: false,
    psychology: false, computerScience: false, programming: false, accounting: false,
    businessStudies: false, law: false, medicine: false, researchMethods: false, majorSpecificSubjects: false,
  },
  music: {
    musicTheory: false, piano: false, violin: false, guitar: false, drums: false,
    clarinet: false, flute: false, saxophone: false, trumpet: false, cello: false,
    ukulele: false, voiceSinging: false, musicComposition: false, ensemblePlaying: false,
  },
  professional: {
    ielts: false, toefl: false, sat: false, gmat: false, gre: false,
    pythonProgramming: false, javaProgramming: false, cppProgramming: false,
    cSharpProgramming: false, webDevelopment: false, dataScience: false,
    aiAndMachineLearning: false, mobileAppDevelopment: false, photoshop: false, videoEditing: false,
    publicSpeaking: false, creativeWriting: false, essayWriting: false,
    criticalThinking: false, studySkills: false,
    french: false, german: false, spanish: false, japanese: false, korean: false,
    leadership: false, projectManagement: false, digitalMarketing: false, businessWriting: false,
  },
};

for (const [level, defaults] of Object.entries(LEVEL_DEFAULTS)) {
  result = await col.updateMany(
    { [`teachingLevels.${level}`]: { $exists: false } },
    { $set: { [`teachingLevels.${level}`]: defaults } }
  );
  if (result.modifiedCount > 0) {
    console.log(`Added missing teachingLevels.${level} to ${result.modifiedCount} documents`);
  }
}

// Also fill in any missing subject fields within existing level objects (set to false if not present)
// This handles levels that exist as {} or are partially populated
for (const [level, defaults] of Object.entries(LEVEL_DEFAULTS)) {
  for (const [field, defaultVal] of Object.entries(defaults)) {
    result = await col.updateMany(
      {
        [`teachingLevels.${level}`]: { $exists: true },
        [`teachingLevels.${level}.${field}`]: { $exists: false },
      },
      { $set: { [`teachingLevels.${level}.${field}`]: defaultVal } }
    );
    if (result.modifiedCount > 0) {
      console.log(`  Filled missing ${level}.${field} on ${result.modifiedCount} documents`);
    }
  }
}

// Step 7: Add missing hourlyRate keys (set to "")
const rateKeys = ['preschool', 'primary', 'secondary', 'jc', 'ib', 'music', 'polytechnic', 'university', 'professional'];
for (const key of rateKeys) {
  result = await col.updateMany(
    { [`hourlyRate.${key}`]: { $exists: false } },
    { $set: { [`hourlyRate.${key}`]: '' } }
  );
  if (result.modifiedCount > 0) {
    console.log(`Added missing hourlyRate.${key} to ${result.modifiedCount} documents`);
  }
}

console.log('\nMigration complete.');
await mongoose.disconnect();
