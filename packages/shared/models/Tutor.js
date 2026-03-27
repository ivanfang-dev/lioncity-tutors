import mongoose from 'mongoose';

// Define Tutor Schema
const tutorSchema = new mongoose.Schema({
  // Personal Information
  fullName: String,
  contactNumber: String,
  email: String,
  dob: {
    day: String,
    month: String,
    year: String
  },
  gender: String,
  age: String,
  nationality: String,
  nationalityOther: String,
  race: String,
  nricLast4: String,
  telegramId: { type: String, index: true },
  // Tutoring Preferences
  teachingLevels: {
  // Pre-School
    preschool: {
      englishLanguage: Boolean,
      chinese: Boolean,
      malay: Boolean,
      tamil: Boolean,
      mathematics: Boolean,
      phonics: Boolean,
      art: Boolean,
      music: Boolean,
      physicalEducation: Boolean
    },

    // Primary (Simplified - same subjects across P1-P6 with some variations)
    primary: {
      englishLanguage: Boolean,
      chinese: Boolean,
      malay: Boolean,
      tamil: Boolean,
      mathematics: Boolean,
      science: Boolean,
      art: Boolean,
      music: Boolean,
      physicalEducation: Boolean,
      socialStudies: Boolean, // From P3 onwards
      characterAndCitizenshipEducation: Boolean
    },

    // Secondary (Updated for Full SBB system - no more streaming)
    secondary: {
      englishLanguage: Boolean,
      chinese: Boolean,
      malay: Boolean,
      tamil: Boolean,
      mathematics: Boolean,
      elementaryMathematics: Boolean,
      additionalMathematics: Boolean,
      physics: Boolean,
      chemistry: Boolean,
      biology: Boolean,
      combinedSciencePhysicsChemistry: Boolean,
      combinedScienceChemistryBiology: Boolean,
      science: Boolean, // For lower secondary
      computing: Boolean,
      history: Boolean,
      geography: Boolean,
      socialStudies: Boolean,
      literatureInEnglish: Boolean,
      art: Boolean,
      music: Boolean,
      designAndTechnology: Boolean,
      nutritionAndFoodScience: Boolean,
      foodAndConsumerEducation: Boolean, // For lower secondary
      principlesOfAccounts: Boolean,
      physicalEducation: Boolean,
      characterAndCitizenshipEducation: Boolean
    },

    // Junior College (A-Level)
    jc: {
      generalPaper: Boolean,
      projectWork: Boolean,
      chineseLanguage: Boolean,
      malayLanguage: Boolean,
      tamilLanguage: Boolean,
      knowledgeAndInquiry: Boolean,

      // H1 Subjects
      h1Mathematics: Boolean,
      h1Physics: Boolean,
      h1Chemistry: Boolean,
      h1Biology: Boolean,
      h1Economics: Boolean,
      h1History: Boolean,
      h1Geography: Boolean,
      h1LiteratureInEnglish: Boolean,
      h1ChineseLanguageAndLiterature: Boolean,
      h1MalayLanguageAndLiterature: Boolean,
      h1TamilLanguageAndLiterature: Boolean,

      // H2 Subjects
      h2Mathematics: Boolean,
      h2Physics: Boolean,
      h2Chemistry: Boolean,
      h2Biology: Boolean,
      h2Computing: Boolean,
      h2Economics: Boolean,
      h2History: Boolean,
      h2Geography: Boolean,
      h2LiteratureInEnglish: Boolean,
      h2Art: Boolean,
      h2Music: Boolean,
      h2ChineseLanguageAndLiterature: Boolean,
      h2MalayLanguageAndLiterature: Boolean,
      h2TamilLanguageAndLiterature: Boolean,

      // H3 Subjects
      h3Mathematics: Boolean,
      h3Physics: Boolean,
      h3Chemistry: Boolean,
      h3Biology: Boolean,
      h3Economics: Boolean,
      h3History: Boolean,
      h3Geography: Boolean,
      h3LiteratureInEnglish: Boolean,
      h3Art: Boolean
    },

    // Millennia Institute (3-year A-Level program)
    millenniaInstitute: {
      generalPaper: Boolean,
      projectWork: Boolean,
      h1Mathematics: Boolean,
      h1Physics: Boolean,
      h1Chemistry: Boolean,
      h1Biology: Boolean,
      h1Economics: Boolean,
      h2Mathematics: Boolean,
      h2Physics: Boolean,
      h2Chemistry: Boolean,
      h2Biology: Boolean,
      h2Economics: Boolean,
      h2Geography: Boolean,
      h2History: Boolean,
      h2LiteratureInEnglish: Boolean
    },

    // IB Programme
    ib: {
      ibEnglishLanguageAndLiterature: Boolean,
      ibChinese: Boolean,
      ibMalay: Boolean,
      ibTamil: Boolean,
      ibMathematics: Boolean,
      ibPhysics: Boolean,
      ibChemistry: Boolean,
      ibBiology: Boolean,
      ibBusinessManagement: Boolean,
      ibEconomics: Boolean,
      ibGeography: Boolean,
      ibHistory: Boolean,
      ibVisualArts: Boolean,
      ibMusic: Boolean,
      ibTheatre: Boolean,
      ibTheoryOfKnowledge: Boolean,
      ibExtendedEssay: Boolean
    },

    // Polytechnic
    polytechnic: {
      english: Boolean,
      mathematics: Boolean,
      engineeringMathematics: Boolean,
      communicationSkills: Boolean,
      computerApplications: Boolean,
      businessStudies: Boolean,
      accounting: Boolean,
      science: Boolean,
      statistics: Boolean,
      projectManagement: Boolean,
      majorSubjects: Boolean // Specialized subjects based on course
    },

    // University
    university: {
      engineeringMathematics: Boolean,
      calculus: Boolean,
      linearAlgebra: Boolean,
      statistics: Boolean,
      universityPhysics: Boolean,
      chemistry: Boolean,
      biology: Boolean,
      economics: Boolean,
      psychology: Boolean,
      computerScience: Boolean,
      programming: Boolean,
      accounting: Boolean,
      businessStudies: Boolean,
      law: Boolean,
      medicine: Boolean,
      researchMethods: Boolean,
      majorSpecificSubjects: Boolean
    },

    // Music Academy
    music: {
      musicTheory: Boolean,
      piano: Boolean,
      violin: Boolean,
      guitar: Boolean,
      drums: Boolean,
      clarinet: Boolean,
      flute: Boolean,
      saxophone: Boolean,
      trumpet: Boolean,
      cello: Boolean,
      ukulele: Boolean,
      voiceSinging: Boolean,
      musicComposition: Boolean,
      ensemblePlaying: Boolean
    },

    // Professional Development & Skills
    professional: {
      // Test Preparation
      ielts: Boolean,
      toefl: Boolean,
      sat: Boolean,
      gmat: Boolean,
      gre: Boolean,

      // Programming & Technology (Not formal MOE subjects but popular for private tuition)
      pythonProgramming: Boolean,
      javaProgramming: Boolean,
      cppProgramming: Boolean,
      cSharpProgramming: Boolean,
      webDevelopment: Boolean,
      dataScience: Boolean,
      aiAndMachineLearning: Boolean,
      mobileAppDevelopment: Boolean,
      photoshop: Boolean,
      videoEditing: Boolean,

      // Soft Skills
      publicSpeaking: Boolean,
      creativeWriting: Boolean,
      essayWriting: Boolean,
      criticalThinking: Boolean,
      studySkills: Boolean,

      // Languages
      french: Boolean,
      german: Boolean,
      spanish: Boolean,
      japanese: Boolean,
      korean: Boolean,

      // Business & Professional
      leadership: Boolean,
      projectManagement: Boolean,
      digitalMarketing: Boolean,
      businessWriting: Boolean
    }
  },

  // Locations
  locations: {
    north: Boolean,
    south: Boolean,
    east: Boolean,
    west: Boolean,
    central: Boolean,
    northeast: Boolean,
    northwest: Boolean,
    online: Boolean
  },

  // Qualifications & Experience
  tutorType: String,
  yearsOfExperience: String,
  highestEducation: String,
  currentSchool: String,
  previousSchools: String,

  // Fee Structure
  hourlyRate: {
    preschool: String,
    primary: String,
    secondary: String,
    jc: String,
    ib: String,
    music: String,
    polytechnic: String,
    university: String,
    professional: String,
  },

  // Tutor Profile
  introduction: String,
  teachingExperience: String,
  trackRecord: String,

  // Availability
  availableTimeSlots: {
    weekdayMorning: Boolean,
    weekdayAfternoon: Boolean,
    weekdayEvening: Boolean,
    weekendMorning: Boolean,
    weekendAfternoon: Boolean,
    weekendEvening: Boolean
  },

  // Form metadata
  formType: String
}, { timestamps: true });

const Tutor = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);

export default Tutor;
