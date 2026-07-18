import mongoose from 'mongoose';
import { deriveRateNumeric } from '../utils/numericRates.js';

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
  // Set true once a cold-outreach DM to this tutor's linked Telegram fails to deliver (they
  // blocked the bot / deleted the chat / the id went stale). Outreach then skips straight to
  // WhatsApp for them instead of paying the try-fail-fallback tax on every future wave.
  // Cleared when they re-link by sharing their contact with the bot again (handleContact).
  telegramStale: { type: Boolean, default: false },
  // Set when the tutor tells us they're not currently tutoring (decline reason 'inactive').
  // A HARD filter in findMatchingTutors — a paused tutor is never matched or messaged again
  // until they come back. Cleared wherever telegramStale clears (handleContact): re-linking
  // is them re-engaging, which is the strongest available "I'm active" signal. Absent/null =
  // active, so every pre-existing tutor is unaffected.
  pausedAt: { type: Date, default: null },
  // Last time we had positive proof this tutor is active: any Telegram interaction with the bot
  // (handleContact) or any outreach reply, Yes or No (both reply recorders). Feeds Phase 10 dormancy
  // detection. Distinct from responseStats (lifetime counts) — this is a freshness timestamp.
  lastConfirmedActiveAt: { type: Date, default: null },
  // Postal district (roadmap Phase 7): data collection for later travel-time scoring, NOT a matching
  // filter yet (matching stays region-based). Captured on new intake; legacy tutors stay blank.
  postalDistrict: { type: String, trim: true },
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

  // Numeric mirror of hourlyRate (roadmap Phase 7), derived from the free-text strings above so
  // matching reads numbers instead of regex-parsing text on every query. Populated by the pre-save
  // hook below (registration + profile rate edits) and by a one-off backfill; matching prefers it
  // when present and falls back to parsing hourlyRate for legacy docs. Per-level { min, max }.
  rateNumeric: {
    preschool: { min: Number, max: Number },
    primary: { min: Number, max: Number },
    secondary: { min: Number, max: Number },
    jc: { min: Number, max: Number },
    ib: { min: Number, max: Number },
    music: { min: Number, max: Number },
    polytechnic: { min: Number, max: Number },
    university: { min: Number, max: Number },
    professional: { min: Number, max: Number },
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

  // Outreach responsiveness — drives ranking so chronic non-responders drift to later
  // waves. `contacted` = times messaged across assignments; `responded` = times they
  // replied Yes/No. Ratio (smoothed) feeds tutorMatcher's responsivenessScore.
  responseStats: {
    contacted: { type: Number, default: 0 },
    responded: { type: Number, default: 0 }
  },

  // Materialized performance stats (roadmap Phase 7), recomputed daily from the event sources
  // (outreach.contacts + placements) inside the escalation tick. A CACHE for ranking and the ops
  // console — events remain the source of truth; nothing here is incremented live. Absent until the
  // first materialization run touches this tutor.
  //   contacted/responded/interested — lifetime counts derived from outreach.contacts
  //   placed/survived30d             — from placements (placed = matched, survived30d = lasted 30d)
  //   medianResponseMins             — median reply latency across contacts with a recorded latency
  //   lastRepliedAt                  — most recent outreach reply
  //   computedAt                     — when this row was last recomputed
  stats: {
    contacted: { type: Number },
    responded: { type: Number },
    interested: { type: Number },
    placed: { type: Number },
    survived30d: { type: Number },
    medianResponseMins: { type: Number },
    lastRepliedAt: { type: Date },
    computedAt: { type: Date },
  },

  // Form metadata
  formType: String
}, { timestamps: true });

// Keep rateNumeric in sync with hourlyRate on every save (roadmap Phase 7): tutor registration
// (backend new Tutor().save()) and profile rate edits (tutor.save()) both flow through here, so the
// numeric fields are populated going forward without touching each call site. Recomputed whenever
// hourlyRate changed (or on a brand-new doc); a no-op otherwise. Pure derivation — never introduces
// validation risk on legacy docs.
tutorSchema.pre('save', function deriveRateNumericHook(next) {
  if (this.isNew || this.isModified('hourlyRate')) {
    this.rateNumeric = deriveRateNumeric(this.hourlyRate);
  }
  next();
});

const Tutor = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);

export default Tutor;
