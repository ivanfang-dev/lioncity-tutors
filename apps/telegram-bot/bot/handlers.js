import { EDUCATION_LEVELS, getSubjectsForLevel, RATE_MAPPINGS } from '../../../packages/shared/index.js';
import { generatePhoneVariations } from '../../../packages/shared/utils/phoneUtils.js';
import { recordApplicationInterest } from '../../../packages/shared/utils/applicationInterest.js';
import { TIME_SLOTS, formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';
import { formatTutorProfileForParent, formatTutorProfilesForParent } from '../utils/parentProfile.js';
import { formatAssignmentForChannel } from '../utils/channelFormat.js';
import { escapeMd } from '../utils/markdown.js';
import RateValidator from '../../../packages/shared/utils/RateValidator.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { notifyMatchedTutors, escalateAssignment } from '../utils/tutorNotifier.js';
import { budgetCalibration } from '../utils/tutorMatcher.js';
import { runExtractionForTutor } from '../utils/profileExtractor.js';
import { recordTutorReplyByTutorId } from '../utils/recordTutorReply.js';
import { declineReasonKeyboard, recordDeclineReason } from '../utils/declineReason.js';
import { recordQuotedRate } from '../utils/rateCapture.js';
import { sendWhatsApp } from '../utils/whatsappSender.js';
import { getTutorNameByNumber } from '../utils/tutorLookup.js';
import { SINGAPORE_LOCATIONS } from '../utils/locations.js';
import { draftParentMessage, buildWaMeButton } from '../utils/parentMessage.js';
import { recordParentPick, recordParentReject, resumeOutreach } from '../utils/parentOutcome.js';
import { recordCheckInWell, recordCheckInEnded, recordCheckInEndReason, recordCheckInNoReply } from '../utils/checkInOutcome.js';
import { checkInRatingRows } from '../utils/checkInButtons.js';
import { opsButtonRow } from '../utils/ownerAlert.js';
import { handleLateInterest, nextShortlistRank } from '../utils/lateInterest.js';
import { applyRecovery } from '../utils/recovery.js';
import { waitUntil } from '@vercel/functions';

/* global process */

// Application states for session management
const ApplicationStates = {
  IDLE: 'idle',
  AWAITING_CONTACT: 'awaiting_contact',
  AWAITING_RATE: 'awaiting_rate',
  VERIFIED: 'verified',
  CREATING_ASSIGNMENT: 'creating_assignment',
  EDITING_BIO: 'editing_bio',
  EDITING_EXPERIENCE: 'editing_experience',
  EDITING_QUALIFICATIONS: 'editing_qualifications'
};

function initializeTeachingLevels(tutor) {
  if (!tutor.teachingLevels) {
    tutor.teachingLevels = {
      preschool: {},
      primary: {},
      secondary: {},
      jc: {},
      ib: {},
      polytechnic: {},
      university: {},
      music: {},
      professional: {},
    };
  }
}

function initializeAvailability(tutor) {
  if (!tutor.availableTimeSlots) {
    tutor.availableTimeSlots = {
      weekdayMorning: false,
      weekdayAfternoon: false,
      weekdayEvening: false,
      weekendMorning: false,
      weekendAfternoon: false,
      weekendEvening: false
    };
  }
}

function initializeLocations(tutor) {
  if (!tutor.locations) {
    tutor.locations = {
      north: false,
      south: false,
      east: false,
      west: false,
      central: false,
      northeast: false,
      northwest: false
    };
  }
}

// Helper function to get tutor from session
async function getTutorFromSession(chatId, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    if (!session) return null;

    // Try by tutorId first
    if (session.tutorId) {
      try {
        const tutorById = await Tutor.findById(session.tutorId);
        if (tutorById) return tutorById;
      } catch {
        console.warn(`⚠️ Invalid tutorId for chatId ${chatId}:`, session.tutorId);
      }
    }

    // Fallback: Try matching by contactNumber
    if (session.contactNumber) {
      const phoneVariations = generatePhoneVariations(session.contactNumber);
      const tutorByPhone = await Tutor.findOne({ contactNumber: { $in: phoneVariations } });
      if (tutorByPhone) return tutorByPhone;
    }

    return null; 
  } catch (error) {
    console.error(`❌ Error in getTutorFromSession for chatId ${chatId}:`, error);
    return null;
  }
}


function getTick(value) {
  return value ? '✅' : '❌';
}

function formatTutorProfileSummary(tutor) {
  let profile = `*📋 Your Profile*\n\n`;
  
  // Personal Information
  profile += `*👤 Personal Information*\n`;
  profile += `*Name:* ${escapeMd(tutor.fullName) || 'Not set'}\n`;
  profile += `*Contact:* ${escapeMd(tutor.contactNumber) || 'Not set'}\n`;
  profile += `*Email:* ${escapeMd(tutor.email) || 'Not set'}\n`;
  profile += `*Gender:* ${escapeMd(tutor.gender) || 'Not set'}\n`;
  profile += `*Age:* ${tutor.age || 'Not set'}\n`;
  profile += `*Race:* ${escapeMd(tutor.race) || 'Not set'}\n`;
  profile += `*Nationality:* ${escapeMd(tutor.nationality) || 'Not set'}\n`;
  if (tutor.nationality === 'Other' && tutor.nationalityOther) {
    profile += `*Other Nationality:* ${escapeMd(tutor.nationalityOther)}\n`;
  }
  profile += `*NRIC (Last 4):* ${tutor.nricLast4 ? '****' + escapeMd(tutor.nricLast4) : 'Not set'}\n`;
  
  // Date of Birth
  if (tutor.dob) {
    const dob = tutor.dob;
    const dobStr = [dob.day, dob.month, dob.year].filter(Boolean).join('/');
    profile += `*Date of Birth:* ${dobStr || 'Not set'}\n`;
  } else {
    profile += `*Date of Birth:* Not set\n`;
  }
  
  // Education & Experience
  profile += `\n*🎓 Education & Experience*\n`;
  profile += `*Highest Education:* ${escapeMd(tutor.highestEducation) || 'Not set'}\n`;
  profile += `*Current School:* ${escapeMd(tutor.currentSchool) || 'Not set'}\n`;
  profile += `*Previous Schools:* ${escapeMd(tutor.previousSchools) || 'Not set'}\n`;
  profile += `*Tutor Type:* ${escapeMd(tutor.tutorType) || 'Not set'}\n`;
  profile += `*Years of Experience:* ${tutor.yearsOfExperience || 'Not set'}\n`;
  
  // Teaching Levels
  if (tutor.teachingLevels) {
    profile += `\n*📚 Teaching Levels*\n`;
    const levels = [];
    if (Object.values(tutor.teachingLevels.primary || {}).some(v => v)) levels.push('Primary');
    if (Object.values(tutor.teachingLevels.secondary || {}).some(v => v)) levels.push('Secondary');
    if (Object.values(tutor.teachingLevels.jc || {}).some(v => v)) levels.push('JC');
    if (Object.values(tutor.teachingLevels.ib || {}).some(v => v)) levels.push('IB/IGCSE');
    if (Object.values(tutor.teachingLevels.polytechnic || {}).some(v => v)) levels.push('Polytechnic');
    if (Object.values(tutor.teachingLevels.university || {}).some(v => v)) levels.push('University');
    if (Object.values(tutor.teachingLevels.music || {}).some(v => v)) levels.push('Music');
    if (Object.values(tutor.teachingLevels.professional || {}).some(v => v)) levels.push('Professional');
    
    profile += `*Levels:* ${levels.length ? levels.join(', ') : 'Not set'}\n`;
  }

  // Locations
  if (tutor.locations) {
    profile += `\n*📍 Teaching Locations*\n`;
    const locations = [];
    Object.entries(tutor.locations).forEach(([key, value]) => {
      if (value) locations.push(key.charAt(0).toUpperCase() + key.slice(1));
    });
    profile += `*Areas:* ${locations.length ? locations.join(', ') : 'Not set'}\n`;
  }

  // Availability
  if (tutor.availableTimeSlots) {
    profile += `\n*⏰ Availability*\n`;
    const slots = [];
    Object.entries(tutor.availableTimeSlots).forEach(([key, value]) => {
      if (value) {
        const formatted = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        slots.push(formatted.charAt(0).toUpperCase() + formatted.slice(1));
      }
    });
    profile += `*Time Slots:* ${slots.length ? slots.join(', ') : 'Not set'}\n`;
  }

  // Hourly Rates
  if (tutor.hourlyRate) {
    profile += `\n*💰 Hourly Rates*\n`;
    const rates = [];
    if (tutor.hourlyRate.primary) rates.push(`Primary: $${tutor.hourlyRate.primary}`);
    if (tutor.hourlyRate.secondary) rates.push(`Secondary: $${tutor.hourlyRate.secondary}`);
    if (tutor.hourlyRate.jc) rates.push(`JC: $${tutor.hourlyRate.jc}`);
    if (tutor.hourlyRate.ib) rates.push(`IB/IGCSE: $${tutor.hourlyRate.ib}`);
    if (tutor.hourlyRate.polytechnic) rates.push(`Polytechnic: $${tutor.hourlyRate.polytechnic}`);
    if (tutor.hourlyRate.university) rates.push(`University: $${tutor.hourlyRate.university}`);
    if (tutor.hourlyRate.music) rates.push(`Music: $${tutor.hourlyRate.music}`);
    if (tutor.hourlyRate.professional) rates.push(`Professional: $${tutor.hourlyRate.professional}`);

    profile += `*Rates:* ${rates.length ? rates.join('\n') : 'Not set'}\n`;
  }

  return profile;
}

function formatAssignment(assignment) {
  let msg = `*🎯 ${escapeMd(assignment.title) || 'Assignment'}*\n\n`;
  msg += `*Level:* ${escapeMd(assignment.level)}\n`;
  msg += `*Subject:* ${escapeMd(assignment.subject)}\n`;
  msg += `*Location:* ${escapeMd(assignment.location)}\n`;
  msg += `*Frequency:* ${escapeMd(assignment.frequency)}\n`;
  msg += `*Rate:* ${escapeMd(assignment.rate)}\n`;  
  
  if (assignment.description) {
    msg += `\n*Description:* ${escapeMd(assignment.description)}\n`;
  }
  
  msg += `\n*Status:* ${assignment.status}`;
  return msg;
}

async function handleProfileFieldEdit(bot, chatId, text, userSessions, Tutor, fieldName, successMessage) {
  try {
    const session = userSessions[chatId];
    const tutor = await Tutor.findById(session.tutorId);

    tutor[fieldName] = text;
    await tutor.save();

    session.state = ApplicationStates.IDLE;
    await safeSend(bot, chatId, successMessage);
    return showProfileEditMenu();
  } catch (error) {
    console.error(`Error updating ${fieldName}:`, error);
    await safeSend(bot, chatId, `❌ Error updating ${fieldName}. Please try again.`);
  }
}

// Handle rate input during application process
async function handleRateInput(bot, chatId, text, userSessions, Assignment, Tutor) {
  try {
    const session = userSessions[chatId];
    
    // Enhanced session validation
    if (!ErrorHandler.isSessionValid(session)) {
      await ErrorHandler.handleSessionTimeout(bot, chatId, userSessions);
      return;
    }

    // Update session activity
    ErrorHandler.updateSessionActivity(session);

    // Validate that we have the necessary session data
    if (!session.tutorId || !session.pendingAssignmentId) {
      await ErrorHandler.handleSessionTimeout(bot, chatId, userSessions);
      return;
    }

    // Handle cancellation during rate input
    if (text.toLowerCase().trim() === 'cancel' || text.toLowerCase().trim() === '/cancel') {
      try {
        // Return to assignment details view as per requirement 5.3
        const assignment = await Assignment.findById(session.pendingAssignmentId);
        
        if (assignment) {
          // Clear rate input state and return to assignment details
          session.state = ApplicationStates.IDLE;
          delete session.pendingRate;
          
          // Show assignment details with apply button
          const assignmentMsg = formatAssignment(assignment);
          await safeSend(bot, chatId, 
            `🎯 *Assignment Details*\n\n${assignmentMsg}`, 
            {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '📝 Apply for Assignment', callback_data: `apply_assignment_${assignment._id}` }],
                  [{ text: '🔙 Back to Assignments', callback_data: 'view_assignments' }],
                  [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
                ]
              }
            }
          );
          return;
        } else {
          await ErrorHandler.handleAssignmentNotFound(bot, chatId, userSessions, session.pendingAssignmentId);
          return;
        }
      } catch (dbError) {
        const errorType = await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'assignment lookup during cancellation');
        if (errorType === 'network_error') {
          // For network errors, clear session and return to main menu
          session.state = ApplicationStates.IDLE;
          delete session.pendingAssignmentId;
          delete session.pendingRate;
        }
        return;
      }
    }

    // Validate the rate input using RateValidator
    const validation = RateValidator.validate(text);
    
    if (!validation.valid) {
      // Re-prompt with error message using the dedicated prompt function
      await safeSend(bot, chatId, `❌ ${validation.error}`);
      await sendRateInputPrompt(bot, chatId);
      return;
    }

    // Store the validated rate in session
    session.pendingRate = validation.rate;

    // Show warning if rate is outside typical range
    if (validation.warning) {
      await safeSend(bot, chatId, `⚠️ ${validation.warning}`);
    }

    // Get assignment and tutor details for confirmation screen with error handling
    let assignment, tutor;
    
    try {
      assignment = await Assignment.findById(session.pendingAssignmentId);
    } catch (dbError) {
      await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'assignment retrieval');
      return;
    }

    try {
      tutor = await Tutor.findById(session.tutorId);
    } catch (dbError) {
      await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'tutor profile retrieval');
      return;
    }

    // Handle assignment not found
    if (!assignment) {
      await ErrorHandler.handleAssignmentNotFound(bot, chatId, userSessions, session.pendingAssignmentId);
      return;
    }

    // Handle tutor not found
    if (!tutor) {
      await ErrorHandler.handleTutorNotFound(bot, chatId, userSessions);
      return;
    }

    // Transition to confirmation screen
    session.state = ApplicationStates.VERIFIED;

    // Format confirmation message with rate included
    const profileMsg = formatTutorProfileSummary(tutor);
    const assignmentMsg = formatAssignment(assignment);
    
    await safeSend(bot, chatId, 
      `${profileMsg}\n\n` +
      `ℹ️ Your *Introduction* and *Teaching Experience* is not shown here to avoid long messages. If you want to review or edit them, please click *Update Profile* in the menu.\n\n` +
      `*Assignment Details*\n\n${assignmentMsg}\n\n` +
      `💰 *Your Rate*\n${validation.formatted}\n\n` +
      `Please review your profile, the assignment details, and your rate above. Would you like to update your profile or proceed with the application?`, 
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📝 Update Profile', callback_data: 'profile_edit' }],
            [{ text: '✅ Confirm Application', callback_data: `confirm_apply_${assignment._id}` }],
            [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
          ]
        }
      }
    );

  } catch (error) {
    console.error('Unexpected error in handleRateInput:', error);
    await safeSend(bot, chatId, '❌ An unexpected error occurred. Please try again or contact support.');
    
    // Reset session state on unexpected error
    if (userSessions[chatId]) {
      userSessions[chatId].state = ApplicationStates.IDLE;
      delete userSessions[chatId].pendingRate;
      delete userSessions[chatId].pendingAssignmentId;
    }
  }
}
// Menu functions
function showProfileEditMenu() {
  // This should return a keyboard object, NOT call safeSend
  return {
    inline_keyboard: [
      [{ text: '👤 Personal Info', callback_data: 'edit_personal_info' }],
      [{ text: '📚 Teaching Levels', callback_data: 'edit_teaching_levels' }],
      [{ text: '📍 Locations', callback_data: 'edit_locations' }],
      [{ text: '⏰ Availability', callback_data: 'edit_availability' }],
      [{ text: '💰 Hourly Rates', callback_data: 'edit_hourly_rates' }],
      [{ text: '🔙 Back to Main Menu', callback_data: 'main_menu' }]
    ]
  };
}

function getPersonalInfoMenu(tutor) {
  return {
    inline_keyboard: [
      [{ text: '👤 Full Name', callback_data: 'edit_full_name' }],
      [{ text: '📱 Contact Number', callback_data: 'edit_contact_number' }],
      [{ text: '🎂 Age', callback_data: 'edit_age' }],
      [{ text: '👫 Gender', callback_data: 'edit_gender_menu' }],
      [{ text: '🌍 Race', callback_data: 'edit_race_menu' }],
      [{ text: '🏛️ Nationality', callback_data: 'edit_nationality' }],
      [{ text: '🆔 NRIC (Last 4)', callback_data: 'edit_nric' }],
      [{ text: '📧 Email', callback_data: 'edit_email' }],
      [{ text: '📅 Date of Birth', callback_data: 'edit_dob' }],
      [{ text: '🎓 Education', callback_data: 'edit_education_menu' }],
      [{ text: '👨‍🏫 Tutor Type', callback_data: 'edit_tutor_type' }],
      [{ text: '🏫 Current School', callback_data: 'edit_current_school' }],
      [{ text: '📝 Introduction', callback_data: 'edit_introduction' }],
      [{ text: '👨‍🏫 Teaching Experience', callback_data: 'edit_teaching_experience' }],
      [{ text: '🏆 Track Record', callback_data: 'edit_track_record' }],
      [{ text: '🔙 Back', callback_data: 'profile_edit' }]
    ]
  };
}

function getTeachingLevelsMenu(tutor) {
  initializeTeachingLevels(tutor);
  
  const preschoolCount = Object.values(tutor.teachingLevels.preschool || {}).filter(v => v).length;
  const primaryCount = Object.values(tutor.teachingLevels.primary || {}).filter(v => v).length;
  const secondaryCount = Object.values(tutor.teachingLevels.secondary || {}).filter(v => v).length;
  const jcCount = Object.values(tutor.teachingLevels.jc || {}).filter(v => v).length;
  const ibCount = Object.values(tutor.teachingLevels.ib || {}).filter(v => v).length;
  const polytechnicCount = Object.values(tutor.teachingLevels.polytechnic || {}).filter(v => v).length;
  const universityCount = Object.values(tutor.teachingLevels.university || {}).filter(v => v).length;
  const musicCount = Object.values(tutor.teachingLevels.music || {}).filter(v => v).length;
  const professionalCount = Object.values(tutor.teachingLevels.professional || {}).filter(v => v).length;

  return {
    inline_keyboard: [
      [{ text: `🧸 Preschool (${preschoolCount} subjects)`, callback_data: 'edit_preschool_subjects' }],
      [{ text: `📚 Primary (${primaryCount} subjects)`, callback_data: 'edit_primary_subjects' }],
      [{ text: `📖 Secondary (${secondaryCount} subjects)`, callback_data: 'edit_secondary_subjects' }],
      [{ text: `🎓 JC (${jcCount} subjects)`, callback_data: 'edit_jc_subjects' }],
      [{ text: `🌍 IB (${ibCount} subjects)`, callback_data: 'edit_ib_subjects' }],
      [{ text: `🏫 Polytechnic (${polytechnicCount} subjects)`, callback_data: 'edit_polytechnic_subjects' }],
      [{ text: `🎓 University (${universityCount} subjects)`, callback_data: 'edit_university_subjects' }],
      [{ text: `🎵 Music (${musicCount} subjects)`, callback_data: 'edit_music_subjects' }],
      [{ text: `💼 Professional (${professionalCount} subjects)`, callback_data: 'edit_professional_subjects' }],
      [{ text: '🔙 Back to Profile Edit', callback_data: 'profile_edit' }]
    ]
  };
}

function getLocationsMenu(tutor) {
  initializeLocations(tutor);
  
  const locations = [
    { key: 'north', label: 'North' },
    { key: 'south', label: 'South' },
    { key: 'east', label: 'East' },
    { key: 'west', label: 'West' },
    { key: 'central', label: 'Central' },
    { key: 'northeast', label: 'Northeast' },
    { key: 'northwest', label: 'Northwest' }
  ];
  
  const keyboard = locations.map(location => [
    { 
      text: `${getTick(tutor.locations[location.key])} ${location.label}`, 
      callback_data: `toggle_location_${location.key}` 
    }
  ]);
  
  keyboard.push([{ text: '🔙 Back to Profile Edit', callback_data: 'profile_edit' }]);
  
  return { inline_keyboard: keyboard };
}

function getAvailabilityMenu(tutor) {
  initializeAvailability(tutor);
  
  const slots = [
    { key: 'weekdayMorning', label: 'Weekday Morning' },
    { key: 'weekdayAfternoon', label: 'Weekday Afternoon' },
    { key: 'weekdayEvening', label: 'Weekday Evening' },
    { key: 'weekendMorning', label: 'Weekend Morning' },
    { key: 'weekendAfternoon', label: 'Weekend Afternoon' },
    { key: 'weekendEvening', label: 'Weekend Evening' }
  ];
  
  const keyboard = slots.map(slot => [
    { 
      text: `${getTick(tutor.availableTimeSlots[slot.key])} ${slot.label}`, 
      callback_data: `toggle_availability_${slot.key}` 
    }
  ]);
  
  keyboard.push([{ text: '🔙 Back to Profile Edit', callback_data: 'profile_edit' }]);
  
  return { inline_keyboard: keyboard };
}

function getPreschoolSubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);
  
  const subjects = [
    { key: 'englishLanguage', label: 'English Language' },
    { key: 'chinese', label: 'Chinese' },
    { key: 'malay', label: 'Malay' },
    { key: 'tamil', label: 'Tamil' },
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'phonics', label: 'Phonics' },
    { key: 'art', label: 'Art' },
    { key: 'music', label: 'Music' },
    { key: 'physicalEducation', label: 'Physical Education' }
  ];
  
  const keyboard = subjects.map(subject => [
    { 
      text: `${getTick(tutor.teachingLevels.preschool[subject.key])} ${subject.label}`, 
      callback_data: `toggle_preschool_${subject.key}` 
    }
  ]);
  
  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  
  return { inline_keyboard: keyboard };
}

function getPrimarySubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);
  
  const subjects = [
    { key: 'englishLanguage', label: 'English Language' },
    { key: 'chinese', label: 'Chinese' },
    { key: 'malay', label: 'Malay' },
    { key: 'tamil', label: 'Tamil' },
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'science', label: 'Science' },
    { key: 'art', label: 'Art' },
    { key: 'music', label: 'Music' },
    { key: 'physicalEducation', label: 'Physical Education' },
    { key: 'socialStudies', label: 'Social Studies' },
    { key: 'characterAndCitizenshipEducation', label: 'Character & Citizenship Education' }
  ];
  
  const keyboard = subjects.map(subject => [
    { 
      text: `${getTick(tutor.teachingLevels.primary[subject.key])} ${subject.label}`, 
      callback_data: `toggle_primary_${subject.key}` 
    }
  ]);
  
  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  
  return { inline_keyboard: keyboard };
}

function getSecondarySubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);
  
  const subjects = [
    { key: 'englishLanguage', label: 'English Language' },
    { key: 'chinese', label: 'Chinese' },
    { key: 'malay', label: 'Malay' },
    { key: 'tamil', label: 'Tamil' },
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'elementaryMathematics', label: 'Elementary Mathematics' },
    { key: 'additionalMathematics', label: 'Additional Mathematics' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'biology', label: 'Biology' },
    { key: 'combinedSciencePhysicsChemistry', label: 'Combined Science (Physics/Chemistry)' },
    { key: 'combinedScienceChemistryBiology', label: 'Combined Science (Chemistry/Biology)' },
    { key: 'science', label: 'Science' },
    { key: 'computing', label: 'Computing' },
    { key: 'history', label: 'History' },
    { key: 'geography', label: 'Geography' },
    { key: 'socialStudies', label: 'Social Studies' },
    { key: 'literatureInEnglish', label: 'Literature in English' },
    { key: 'art', label: 'Art' },
    { key: 'music', label: 'Music' },
    { key: 'designAndTechnology', label: 'Design & Technology' },
    { key: 'nutritionAndFoodScience', label: 'Nutrition & Food Science' },
    { key: 'foodAndConsumerEducation', label: 'Food & Consumer Education' },
    { key: 'principlesOfAccounts', label: 'Principles of Accounts' },
    { key: 'physicalEducation', label: 'Physical Education' },
    { key: 'characterAndCitizenshipEducation', label: 'Character & Citizenship Education' }
  ];
  
  const keyboard = subjects.map(subject => [
    { 
      text: `${getTick(tutor.teachingLevels.secondary[subject.key])} ${subject.label}`, 
      callback_data: `toggle_secondary_${subject.key}` 
    }
  ]);
  
  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  
  return { inline_keyboard: keyboard };
}

function getJCSubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);
  
  const subjects = [
    { key: 'generalPaper', label: 'General Paper' },
    { key: 'projectWork', label: 'Project Work' },
    { key: 'chineseLanguage', label: 'Chinese Language' },
    { key: 'malayLanguage', label: 'Malay Language' },
    { key: 'tamilLanguage', label: 'Tamil Language' },
    { key: 'knowledgeAndInquiry', label: 'Knowledge & Inquiry' },
    { key: 'h1Mathematics', label: 'H1 Mathematics' },
    { key: 'h1Physics', label: 'H1 Physics' },
    { key: 'h1Chemistry', label: 'H1 Chemistry' },
    { key: 'h1Biology', label: 'H1 Biology' },
    { key: 'h1Economics', label: 'H1 Economics' },
    { key: 'h1History', label: 'H1 History' },
    { key: 'h1Geography', label: 'H1 Geography' },
    { key: 'h1LiteratureInEnglish', label: 'H1 Literature in English' },
    { key: 'h1ChineseLanguageAndLiterature', label: 'H1 Chinese Language & Literature' },
    { key: 'h1MalayLanguageAndLiterature', label: 'H1 Malay Language & Literature' },
    { key: 'h1TamilLanguageAndLiterature', label: 'H1 Tamil Language & Literature' },
    { key: 'h2Mathematics', label: 'H2 Mathematics' },
    { key: 'h2Physics', label: 'H2 Physics' },
    { key: 'h2Chemistry', label: 'H2 Chemistry' },
    { key: 'h2Biology', label: 'H2 Biology' },
    { key: 'h2Computing', label: 'H2 Computing' },
    { key: 'h2Economics', label: 'H2 Economics' },
    { key: 'h2History', label: 'H2 History' },
    { key: 'h2Geography', label: 'H2 Geography' },
    { key: 'h2LiteratureInEnglish', label: 'H2 Literature in English' },
    { key: 'h2Art', label: 'H2 Art' },
    { key: 'h2Music', label: 'H2 Music' },
    { key: 'h2ChineseLanguageAndLiterature', label: 'H2 Chinese Language & Literature' },
    { key: 'h2MalayLanguageAndLiterature', label: 'H2 Malay Language & Literature' },
    { key: 'h2TamilLanguageAndLiterature', label: 'H2 Tamil Language & Literature' },
    { key: 'h3Mathematics', label: 'H3 Mathematics' },
    { key: 'h3Physics', label: 'H3 Physics' },
    { key: 'h3Chemistry', label: 'H3 Chemistry' },
    { key: 'h3Biology', label: 'H3 Biology' },
    { key: 'h3Economics', label: 'H3 Economics' },
    { key: 'h3History', label: 'H3 History' },
    { key: 'h3Geography', label: 'H3 Geography' },
    { key: 'h3LiteratureInEnglish', label: 'H3 Literature in English' },
    { key: 'h3Art', label: 'H3 Art' }
  ];
  
  const keyboard = subjects.map(subject => [
    { 
      text: `${getTick(tutor.teachingLevels.jc[subject.key])} ${subject.label}`, 
      callback_data: `toggle_jc_${subject.key}` 
    }
  ]);
  
  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  
  return { inline_keyboard: keyboard };
}

function getIBSubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);

  const subjects = [
    { key: 'ibEnglishLanguageAndLiterature', label: 'IB English Language & Literature' },
    { key: 'ibChinese', label: 'IB Chinese' },
    { key: 'ibMalay', label: 'IB Malay' },
    { key: 'ibTamil', label: 'IB Tamil' },
    { key: 'ibMathematics', label: 'IB Mathematics' },
    { key: 'ibPhysics', label: 'IB Physics' },
    { key: 'ibChemistry', label: 'IB Chemistry' },
    { key: 'ibBiology', label: 'IB Biology' },
    { key: 'ibBusinessManagement', label: 'IB Business Management' },
    { key: 'ibEconomics', label: 'IB Economics' },
    { key: 'ibGeography', label: 'IB Geography' },
    { key: 'ibHistory', label: 'IB History' },
    { key: 'ibVisualArts', label: 'IB Visual Arts' },
    { key: 'ibMusic', label: 'IB Music' },
    { key: 'ibTheatre', label: 'IB Theatre' },
    { key: 'ibTheoryOfKnowledge', label: 'IB Theory of Knowledge' },
    { key: 'ibExtendedEssay', label: 'IB Extended Essay' }
  ];

  const keyboard = subjects.map(subject => [
    {
      text: `${getTick(tutor.teachingLevels.ib?.[subject.key])} ${subject.label}`,
      callback_data: `toggle_ib_${subject.key}`
    }
  ]);

  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  return { inline_keyboard: keyboard };
}

function getPolytechnicSubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);

  const subjects = [
    { key: 'english', label: 'English' },
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'engineeringMathematics', label: 'Engineering Mathematics' },
    { key: 'communicationSkills', label: 'Communication Skills' },
    { key: 'computerApplications', label: 'Computer Applications' },
    { key: 'businessStudies', label: 'Business Studies' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'science', label: 'Science' },
    { key: 'statistics', label: 'Statistics' },
    { key: 'projectManagement', label: 'Project Management' },
    { key: 'majorSubjects', label: 'Major Subjects' }
  ];

  const keyboard = subjects.map(subject => [
    {
      text: `${getTick(tutor.teachingLevels.polytechnic?.[subject.key])} ${subject.label}`,
      callback_data: `toggle_polytechnic_${subject.key}`
    }
  ]);

  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  return { inline_keyboard: keyboard };
}

function getUniversitySubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);

  const subjects = [
    { key: 'engineeringMathematics', label: 'Engineering Mathematics' },
    { key: 'calculus', label: 'Calculus' },
    { key: 'linearAlgebra', label: 'Linear Algebra' },
    { key: 'statistics', label: 'Statistics' },
    { key: 'universityPhysics', label: 'University Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'biology', label: 'Biology' },
    { key: 'economics', label: 'Economics' },
    { key: 'psychology', label: 'Psychology' },
    { key: 'computerScience', label: 'Computer Science' },
    { key: 'programming', label: 'Programming' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'businessStudies', label: 'Business Studies' },
    { key: 'law', label: 'Law' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'researchMethods', label: 'Research Methods' },
    { key: 'majorSpecificSubjects', label: 'Major Specific Subjects' }
  ];

  const keyboard = subjects.map(subject => [
    {
      text: `${getTick(tutor.teachingLevels.university?.[subject.key])} ${subject.label}`,
      callback_data: `toggle_university_${subject.key}`
    }
  ]);

  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  return { inline_keyboard: keyboard };
}

function getMusicSubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);

  const subjects = [
    { key: 'musicTheory', label: 'Music Theory' },
    { key: 'piano', label: 'Piano' },
    { key: 'violin', label: 'Violin' },
    { key: 'guitar', label: 'Guitar' },
    { key: 'drums', label: 'Drums' },
    { key: 'clarinet', label: 'Clarinet' },
    { key: 'flute', label: 'Flute' },
    { key: 'saxophone', label: 'Saxophone' },
    { key: 'trumpet', label: 'Trumpet' },
    { key: 'cello', label: 'Cello' },
    { key: 'ukulele', label: 'Ukulele' },
    { key: 'voiceSinging', label: 'Voice/Singing' },
    { key: 'musicComposition', label: 'Music Composition' },
    { key: 'ensemblePlaying', label: 'Ensemble Playing' }
  ];

  const keyboard = subjects.map(subject => [
    {
      text: `${getTick(tutor.teachingLevels.music?.[subject.key])} ${subject.label}`,
      callback_data: `toggle_music_${subject.key}`
    }
  ]);

  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  return { inline_keyboard: keyboard };
}

function getProfessionalSubjectsMenu(tutor) {
  initializeTeachingLevels(tutor);

  const subjects = [
    // Test Preparation
    { key: 'ielts', label: 'IELTS' },
    { key: 'toefl', label: 'TOEFL' },
    { key: 'sat', label: 'SAT' },
    { key: 'gmat', label: 'GMAT' },
    { key: 'gre', label: 'GRE' },
    
    // Programming & Technology
    { key: 'pythonProgramming', label: 'Python Programming' },
    { key: 'javaProgramming', label: 'Java Programming' },
    { key: 'cppProgramming', label: 'C++ Programming' },
    { key: 'cSharpProgramming', label: 'C# Programming' },
    { key: 'webDevelopment', label: 'Web Development' },
    { key: 'dataScience', label: 'Data Science' },
    { key: 'aiAndMachineLearning', label: 'AI & Machine Learning' },
    { key: 'mobileAppDevelopment', label: 'Mobile App Development' },
    { key: 'photoshop', label: 'Photoshop' },
    { key: 'videoEditing', label: 'Video Editing' },
    
    // Soft Skills
    { key: 'publicSpeaking', label: 'Public Speaking' },
    { key: 'creativeWriting', label: 'Creative Writing' },
    { key: 'essayWriting', label: 'Essay Writing' },
    { key: 'criticalThinking', label: 'Critical Thinking' },
    { key: 'studySkills', label: 'Study Skills' },
    
    // Languages
    { key: 'french', label: 'French' },
    { key: 'german', label: 'German' },
    { key: 'spanish', label: 'Spanish' },
    { key: 'japanese', label: 'Japanese' },
    { key: 'korean', label: 'Korean' },
    
    // Business & Professional
    { key: 'leadership', label: 'Leadership' },
    { key: 'projectManagement', label: 'Project Management' },
    { key: 'digitalMarketing', label: 'Digital Marketing' },
    { key: 'businessWriting', label: 'Business Writing' }
  ];

  const keyboard = subjects.map(subject => [
    {
      text: `${getTick(tutor.teachingLevels.professional?.[subject.key])} ${subject.label}`,
      callback_data: `toggle_professional_${subject.key}`
    }
  ]);

  keyboard.push([{ text: '🔙 Back to Teaching Levels', callback_data: 'edit_teaching_levels' }]);
  return { inline_keyboard: keyboard };
}

function getGenderMenu() {
  return {
    inline_keyboard: [
      [{ text: '👨 Male', callback_data: 'set_gender_male' }],
      [{ text: '👩 Female', callback_data: 'set_gender_female' }],
      [{ text: '🔙 Back', callback_data: 'edit_personal_info' }]
    ]
  };
}

function getRaceMenu() {
  return {
    inline_keyboard: [
      [{ text: 'Chinese', callback_data: 'set_race_chinese' }],
      [{ text: 'Malay', callback_data: 'set_race_malay' }],
      [{ text: 'Indian', callback_data: 'set_race_indian' }],
      [{ text: 'Eurasian', callback_data: 'set_race_eurasian' }],
      [{ text: 'Others', callback_data: 'set_race_others' }],
      [{ text: '🔙 Back', callback_data: 'edit_personal_info' }]
    ]
  };
}

function getTutorTypeMenu() {
  return {
    inline_keyboard: [
      [
        { text: '👨‍🏫 Full-time Tutor', callback_data: 'set_tutor_type_fulltime' },
        { text: '👩‍🏫 Part-time Tutor', callback_data: 'set_tutor_type_parttime' }
      ],
      [
        { text: '🎓 MOE Teacher', callback_data: 'set_tutor_type_moe' },
        { text: '👨‍🎓 Ex-MOE Teacher', callback_data: 'set_tutor_type_exmoe' }
      ],
      [
        { text: '🎓 NIE Trainee', callback_data: 'set_tutor_type_nie' },
        { text: '👨‍🎓 Undergraduate', callback_data: 'set_tutor_type_undergraduate' }
      ],
      [
        { text: '← Back', callback_data: 'edit_personal_info' }
      ]
    ]
  };
}

function getEducationMenu() {
  return {
    inline_keyboard: [
      [{ text: 'A Levels', callback_data: 'set_education_alevels' }],
      [{ text: 'Diploma', callback_data: 'set_education_diploma' }],
      [{ text: 'Degree', callback_data: 'set_education_degree' }],
      [{ text: 'Masters', callback_data: 'set_education_masters' }],
      [{ text: 'PhD', callback_data: 'set_education_phd' }],
      [{ text: 'Others', callback_data: 'set_education_others' }],
      [{ text: '🔙 Back', callback_data: 'edit_personal_info' }]
    ]
  };
}

function getNationalityMenu() {
  return {
    inline_keyboard: [
      [{ text: 'Singaporean', callback_data: 'set_nationality_singaporean' }],
      [{ text: 'PR', callback_data: 'set_nationality_pr' }],
      [{ text: 'Malaysian', callback_data: 'set_nationality_malaysian' }],
      [{ text: 'Chinese', callback_data: 'set_nationality_chinese' }],
      [{ text: 'Indian', callback_data: 'set_nationality_indian' }],
      [{ text: 'Others', callback_data: 'set_nationality_other' }],
      [{ text: '🔙 Back', callback_data: 'edit_personal_info' }]
    ]
  };
}

function getDOBMenu(tutor) {
  const dob = tutor.dob || { day: null, month: null, year: null };
  const dayText = dob.day ? `📅 Day: ${dob.day}` : '📅 Set Day';
  const monthText = dob.month ? `📅 Month: ${dob.month}` : '📅 Set Month';
  const yearText = dob.year ? `📅 Year: ${dob.year}` : '📅 Set Year';
  
  return {
    inline_keyboard: [
      [{ text: dayText, callback_data: 'edit_dob_day' }],
      [{ text: monthText, callback_data: 'edit_dob_month' }],
      [{ text: yearText, callback_data: 'edit_dob_year' }],
      [{ text: '🔙 Back', callback_data: 'edit_personal_info' }]
    ]
  };
}

function getHourlyRatesMenu(tutor) {
  return {
    inline_keyboard: [
      [{ text: `💰 Preschool Rate: $${tutor.hourlyRate?.preschool || 'Not set'}/hour`, callback_data: 'edit_rate_preschool' }],
      [{ text: `💰 Primary Rate: $${tutor.hourlyRate?.primary || 'Not set'}/hour`, callback_data: 'edit_rate_primary' }],
      [{ text: `💰 Secondary Rate: $${tutor.hourlyRate?.secondary || 'Not set'}/hour`, callback_data: 'edit_rate_secondary' }],
      [{ text: `💰 JC Rate: $${tutor.hourlyRate?.jc || 'Not set'}/hour`, callback_data: 'edit_rate_jc' }],
      [{ text: `💰 IB Rate: $${tutor.hourlyRate?.ib || 'Not set'}/hour`, callback_data: 'edit_rate_ib' }],
      [{ text: `💰 Music Rate: $${tutor.hourlyRate?.music || 'Not set'}/hour`, callback_data: 'edit_rate_music' }],
      [{ text: `💰 Polytechnic Rate: $${tutor.hourlyRate?.polytechnic || 'Not set'}/hour`, callback_data: 'edit_rate_polytechnic' }],
      [{ text: `💰 University Rate: $${tutor.hourlyRate?.university || 'Not set'}/hour`, callback_data: 'edit_rate_university' }],
      [{ text: `💰 Professional Rate: $${tutor.hourlyRate?.professional || 'Not set'}/hour`, callback_data: 'edit_rate_professional' }],
      [{ text: '🔙 Back to Profile Edit', callback_data: 'profile_edit' }]
    ]
  };
}


const ITEMS_PER_PAGE = 5;

// Send rate input prompt message
async function sendRateInputPrompt(bot, chatId) {
  await safeSend(bot, chatId, 
    `💰 *Please enter your tuition rate for this assignment*\n\n` +
    `📝 *Format Examples:*\n` +
    `• 30 (will be formatted as $30/hr)\n` +
    `• $30 (will be formatted as $30/hr)\n` +
    `• 30/hr (will be formatted as $30/hr)\n` +
    `• $30/hr (will be formatted as $30/hr)\n` +
    `Please enter your rate:`, 
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 Back to Assignment Details', callback_data: 'back_to_assignment' }],
          [{ text: '❌ Cancel', callback_data: 'main_menu' }]
        ]
      }
    }
  );
}

// Safe send function with enhanced logging
function safeSend(bot, chatId, text, options = {}) {
  // Convert text to string if it's not already
  const messageText = String(text);
  
  console.log(`📤 Sending to ${chatId}:`, messageText.substring(0, 80));
  if (options?.reply_markup) {
    console.log(`📦 Reply markup:`, JSON.stringify(options.reply_markup, null, 2));
  }
  
  return bot.sendMessage(chatId, messageText, options)
    .then(result => {
      console.log(`✅ Message sent successfully to ${chatId}`);
      return result;
    })
    .catch(err => {
      console.error(`❌ Failed to send message to ${chatId}:`, err.message);
      throw err;
    });
}

// Check if user is admin
function isAdmin(userId, ADMIN_USERS) {
  return ADMIN_USERS && ADMIN_USERS.includes(userId.toString());
}

// Handle initial start and contact sharing
async function handleStart(bot, chatId, userId, Tutor, userSessions, startParam = null) {
  try {
    const existingSession = userSessions[chatId] || {};

    // Prepare updated session without overwriting everything
    const updatedSession = {
      ...existingSession,
      state: ApplicationStates.AWAITING_CONTACT,
      userId,
      startParam,
      pendingRate: null  // Initialize pendingRate field
    };

    // If it's an application, extract assignment ID
    if (startParam && startParam.startsWith('apply_')) {
      updatedSession.pendingAssignmentId = startParam.replace('apply_', '');
    }

    // Save updated session
    userSessions[chatId] = updatedSession;

    // Prompt user for contact. A ?start=link deep link means the tutor came specifically to
    // connect Telegram (so future outreach can reach them here, free, instead of WhatsApp) —
    // give them linking-specific copy rather than the generic apply welcome.
    const contactPrompt = startParam === 'link'
      ? '🔗 *Link your Telegram* to get tuition assignment matches right here — faster than WhatsApp.\n\nTap below to share your number so we can confirm it\'s you.'
      : '👋 Welcome! To get started, please share your contact number by clicking the button below.';
    await safeSend(bot, chatId, contactPrompt, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [[{
          text: '📞 Share Contact Number',
          request_contact: true
        }]],
        one_time_keyboard: true,
        resize_keyboard: true
      }
    });
    
  } catch (error) {
    console.error('Error handling start:', error);
    await safeSend(bot, chatId, 'There was an error setting up your account. Please try again.');
  }
}

// Handle contact sharing
async function handleContact(bot, chatId, userId, contact, Tutor, userSessions, ADMIN_USERS, Assignment) {
  try {
    // Normalize phone number
    const phoneVariations = generatePhoneVariations(contact.phone_number);
    
    const tutors = await Tutor.find({ contactNumber: { $in: phoneVariations } });
    if (tutors.length > 1) {
      await safeSend(bot, chatId, 'Multiple accounts detected. Please contact support at 8870 1152 / @ivanfang on telegram for assistance.');
      return;
    }
    const tutor = tutors[0];
    
    if (!tutor) {
      // Instead of creating a new tutor, send registration message
      await safeSend(bot, chatId, 'Please register yourself first at https://www.lioncitytutors.com/register-tutor');
      return; // Exit the function
    } 
    const telegramIdCheck = await Tutor.findOne({ telegramId: userId, _id: { $ne: tutor._id } });
    if (telegramIdCheck) {
      await safeSend(bot, chatId, 'This Telegram account is linked to another tutor profile. Please contact support at support@lioncitytutors.com.');
      return;
    }
    
    // Update telegramId if changed, and clear any telegramStale flag: sharing their contact
    // proves the tutor is reachable on Telegram again, so future outreach can prefer the free
    // DM. Sharing it ALSO un-pauses a tutor who once told us they'd stopped tutoring (decline
    // reason 'inactive' → pausedAt, a hard filter in findMatchingTutors): coming back and
    // re-linking is the strongest "I'm active again" signal we get, and without this a paused
    // tutor would be excluded from matching forever with no way back.
    // Targeted update (not tutor.save()) to avoid re-validating legacy profile fields. Always stamp
    // lastConfirmedActiveAt (Phase 7): sharing their contact is positive proof the tutor is active,
    // and it's the broadest "interacted with the bot" signal we have. The telegram/pause fields only
    // change when needed, but the activity timestamp updates every time.
    await Tutor.updateOne(
      { _id: tutor._id },
      { $set: { telegramId: userId, telegramStale: false, pausedAt: null, lastConfirmedActiveAt: new Date() } }
    );
    tutor.telegramId = userId;
    tutor.telegramStale = false;
    tutor.pausedAt = null;
    
    // Store tutor ID and preserve existing session data
    const currentSession = userSessions[chatId] || {};
    userSessions[chatId] = {
      ...currentSession,
      tutorId: tutor._id,
      state: ApplicationStates.VERIFIED,
      fullName: tutor.fullName,
      pendingRate: currentSession.pendingRate || null  // Preserve or initialize pendingRate
    };
    
    // Check for pending applications
    const pendingApplications = await Assignment.find({
      appliedTutors: tutor._id,
      status: 'Open'
    });
    
    if (currentSession.pendingAssignmentId) {
      const assignmentId = currentSession.pendingAssignmentId;
      const assignment = await Assignment.findOne({ _id: assignmentId, status: 'Open' });
      
      if (!assignment) {
        delete userSessions[chatId].pendingAssignmentId;
        await safeSend(bot, chatId, '❌ This assignment is no longer available.');
        // Show main menu with pending applications info
        let message = `Welcome back, ${tutor.fullName}! `;
        if (pendingApplications.length > 0) {
          message += `You have ${pendingApplications.length} pending application(s).\n\n`;
        }
        message += 'What would you like to do?';
        await showMainMenu(chatId, bot, userId, ADMIN_USERS);
        return;
      }
      
      // Show profile and assignment details
      const profileMsg = formatTutorProfileSummary(tutor);
      const assignmentMsg = formatAssignment(assignment);
      
      await safeSend(bot, chatId, 
        `📋 ${profileMsg}\n\n` +
        `ℹ️ Your *Introduction* and *Teaching Experience* is not shown here to avoid long messages. If you want to review or edit them, please click *Update Profile* in the menu.\n\n` +
        `🎯 *Assignment Details*\n\n${assignmentMsg}\n\n` +
        (currentSession.pendingRate ? `💰 *Your Rate*\n$${currentSession.pendingRate}/hr\n\n` : '') +
        `Please review your profile and the assignment details above. Would you like to update your profile or proceed with the application?`, 
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📝 Update Profile', callback_data: 'profile_edit' }],
              [{ text: '✅ Confirm Application', callback_data: `confirm_apply_${assignmentId}` }],
              [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
            ]
          }
        }
      );
      return;
    }
    
    // If there was a start parameter, handle it
    if (userSessions[chatId].startParam) {
      const param = userSessions[chatId].startParam;
      delete userSessions[chatId].startParam;
      await handleStartParameter(bot, chatId, userId, param, Assignment, Tutor, userSessions, ADMIN_USERS);
      return;
    }
    
   let welcomeMessage = `Welcome back, ${tutor.fullName}!`;
    if (pendingApplications.length > 0) {
      welcomeMessage += ` You have ${pendingApplications.length} pending application(s).`;
    }
    await safeSend(bot, chatId, welcomeMessage);

    const profileSummary = formatTutorProfileSummary(tutor);
    await safeSend(bot, chatId, `Here is your profile summary:\n\n${profileSummary}`, { parse_mode: 'Markdown' });

    if (tutor.introduction) {
      await safeSend(bot, chatId, `*📝 Your Introduction:*\n\n${escapeMd(tutor.introduction)}`, { parse_mode: 'Markdown' });
    }

    if (tutor.teachingExperience) {
      await safeSend(bot, chatId, `*👨‍🏫 Your Teaching Experience:*\n\n${escapeMd(tutor.teachingExperience)}`, { parse_mode: 'Markdown' });
    }

    // 5. Finally, show the main menu
    await showMainMenu(chatId, bot, userId, ADMIN_USERS);
    
  } catch (error) {
    console.error('Error handling contact:', {
      message: error.message,
      stack: error.stack,
      phoneNumber: contact.phone_number,
      userId,
      chatId
    });
    await safeSend(bot, chatId, 'There was an error verifying your account. Please try again.');
  }
}

// Main menu function
async function showMainMenu(chatId, bot, userId, ADMIN_USERS) {
  const isUserAdmin = isAdmin(userId, ADMIN_USERS);
  
  const keyboard = [
    [{ text: '📋 View Available Assignments', callback_data: 'view_assignments' }],
    [{ text: '📝 My Applications', callback_data: 'view_applications' }],
    [{ text: '👤 Update Profile', callback_data: 'profile_edit' }]
  ];

  if (isUserAdmin) {
    keyboard.push([{ text: '⚙️ Admin Panel', callback_data: 'admin_panel' }]);
  }

  await safeSend(bot, chatId, 'Main Menu - What would you like to do?', {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// Admin panel menu
async function showAdminPanel(chatId, bot) {
  await safeSend(bot, chatId, '⚙️ Admin Panel - What would you like to do?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎯 Post New Assignment', callback_data: 'admin_post_assignment' }],
        [{ text: '📊 View All Applications', callback_data: 'admin_view_all_applications' }],
        [{ text: '📋 Manage Assignments', callback_data: 'admin_manage_assignments' }],
        [{ text: '🔙 Back to Main Menu', callback_data: 'main_menu' }]
      ]
    }
  });
}

// Assignment creation flow - step by step
async function startAssignmentCreation(bot, chatId, userSessions) {
  userSessions[chatId] = {
    ...userSessions[chatId],
    state: ApplicationStates.CREATING_ASSIGNMENT,
    assignmentData: {},
    currentStep: 'title',
    pendingRate: userSessions[chatId]?.pendingRate || null  // Preserve pendingRate
  };
  
  await safeSend(bot, chatId, '🎯 *Creating New Assignment*\n\nStep 1 of 11: Enter the assignment title:', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'admin_panel' }]]
    }
  });
}

function parseNaturalDate(text) {
  const today = new Date();
  const lowerText = text.toLowerCase().trim();
  
  // Handle common natural language dates
  if (lowerText === 'today') {
    return today;
  } else if (lowerText === 'tomorrow') {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  } else if (lowerText === 'asap' || lowerText === 'immediately') {
    return today;
  } else if (lowerText.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek;
  } else {
    // Try to parse as a regular date
    const parsedDate = new Date(text);
    if (isNaN(parsedDate.getTime())) {
      // If parsing fails, just return the text as is for flexible handling
      return text;
    }
    return parsedDate;
  }
}

function buildTutorTypeKeyboard(selectedTypes) {
  const check = (type) => selectedTypes.includes(type) ? '✅' : '⬜';
  return [
    [
      { text: `${check('Part-time')} Part-time`, callback_data: 'toggle_tutor_pref_parttime' },
      { text: `${check('Full-time')} Full-time`, callback_data: 'toggle_tutor_pref_fulltime' }
    ],
    [
      { text: `${check('MOE/Ex-MOE')} MOE/Ex-MOE`, callback_data: 'toggle_tutor_pref_moe' }
    ],
    [
      { text: selectedTypes.length > 0 ? '✅ Done' : '✅ Done - Any type is fine', callback_data: 'confirm_tutor_types' }
    ],
    [{ text: '❌ Cancel', callback_data: 'admin_panel' }]
  ];
}

function buildTimeSlotKeyboard(selectedSlots = {}) {
  const tick = (key) => selectedSlots[key] ? '✅' : '⬜';
  const anySelected = TIME_SLOTS.some(s => selectedSlots[s.key]);
  const rows = TIME_SLOTS.map(s => [
    { text: `${tick(s.key)} ${s.label}`, callback_data: `toggle_assignment_slot_${s.key}` }
  ]);
  rows.push([{
    text: anySelected ? '✅ Done' : '✅ Done - Any timing is fine',
    callback_data: 'confirm_assignment_slots'
  }]);
  rows.push([{ text: '❌ Cancel', callback_data: 'admin_panel' }]);
  return rows;
}

function buildGenderKeyboard() {
  return [
    [{ text: '👨 Male', callback_data: 'set_assignment_gender_male' }],
    [{ text: '👩 Female', callback_data: 'set_assignment_gender_female' }],
    [{ text: '🙂 No preference', callback_data: 'set_assignment_gender_none' }],
    [{ text: '❌ Cancel', callback_data: 'admin_panel' }]
  ];
}

function createInlineKeyboard(options, callbackPrefix, columns = 2) {
  const keyboard = [];
  
  for (let i = 0; i < options.length; i += columns) {
    const row = [];
    for (let j = 0; j < columns && i + j < options.length; j++) {
      const option = options[i + j];
      row.push({
        text: option,
        callback_data: `${callbackPrefix}_${encodeURIComponent(option)}`
      });
    }
    keyboard.push(row);
  }
  
  // Add cancel button
  keyboard.push([{ text: '❌ Cancel', callback_data: 'admin_panel' }]);
  
  return keyboard;
}

// Handle assignment creation steps
async function handleAssignmentStep(bot, chatId, text, userSessions, Assignment) {
  const session = userSessions[chatId];
  const { currentStep, assignmentData } = session;
  
  try {
    switch (currentStep) {
      case 'title':
        assignmentData.title = text.trim();
        session.currentStep = 'level';
        
        // Show level selection with inline keyboard
        await safeSend(bot, chatId, '🎯 *Creating New Assignment*\n\nStep 2 of 11: Select the education level:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: createInlineKeyboard(EDUCATION_LEVELS, 'select_level', 1)
          }
        });
        break;
      
      case 'level':
        // This case is now handled by callback query
        break;
      
      case 'subject':
        // This case is now handled by callback query
        break;
      
      case 'location':
        // Location is now handled by callback query (inline keyboard)
        break;
      
      case 'frequency':
        assignmentData.frequency = text.trim();
        session.currentStep = 'rate';

        await safeSend(bot, chatId, '🎯 *Creating New Assignment*\n\nStep 7 of 11: Select the rate type:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📈 Market Rate', callback_data: 'select_rate_market' }],
              [{ text: '💰 Custom Amount', callback_data: 'select_rate_custom' }]
            ]
          }
        });
        session.currentStep = 'rate';
        break;
      
      case 'rate':
        if (session.waitingForCustomRate) {
          assignmentData.rate = text.trim();
          session.waitingForCustomRate = false;
          assignmentData.preferredTimeSlots = assignmentData.preferredTimeSlots || {};
          session.currentStep = 'timing';

          await safeSend(bot, chatId, '🎯 *Creating New Assignment*\n\nStep 8 of 11: Select preferred lesson timing\n\n_Tap all slots that work, then press Done_', {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: buildTimeSlotKeyboard(assignmentData.preferredTimeSlots)
            }
          });
        }
        break;

      case 'confirmRate':
        // User typed a custom rate to override the market rate
        assignmentData.rate = text.trim();
        assignmentData.preferredTimeSlots = assignmentData.preferredTimeSlots || {};
        session.currentStep = 'timing';

        await safeSend(bot, chatId, '🎯 *Creating New Assignment*\n\nStep 8 of 11: Select preferred lesson timing\n\n_Tap all slots that work, then press Done_', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: buildTimeSlotKeyboard(assignmentData.preferredTimeSlots)
          }
        });
        break;
        
      
      case 'description': {
        if (text.toLowerCase().trim() !== 'skip') {
          assignmentData.description = text.trim();
        }
        session.currentStep = 'parentContact';

        await safeSend(bot, chatId, '🎯 *Creating New Assignment*\n\nStep 11 of 11: Enter the parent\'s WhatsApp number\n\n_Used to send interested tutors\' profiles to the parent._\n\n*Type "skip" to leave empty*', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'admin_panel' }]]
          }
        });
        break;
      }

      case 'parentContact': {
        if (text.toLowerCase().trim() !== 'skip') {
          assignmentData.parentContact = text.trim();
        }

        // Save as Draft to survive serverless cold starts between preview and confirm
        assignmentData.status = 'Draft';
        assignmentData.createdAt = new Date();
        assignmentData.updatedAt = new Date();

        const draft = new Assignment(assignmentData);
        const savedDraft = await draft.save();

        const confirmationMsg = formatAssignmentPreview(assignmentData);
        await safeSend(bot, chatId, `📋 *Assignment Preview*\n\n${confirmationMsg}\n\n✅ *Ready to post this assignment?*`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '✅ Confirm & Post Assignment', callback_data: `confirm_post_assignment_${savedDraft._id}` }],
              [{ text: '❌ Cancel', callback_data: `cancel_draft_${savedDraft._id}` }]
            ]
          }
        });
        break;
      }
    }
  } catch (error) {
    console.error('Error in assignment step:', error);
    await safeSend(bot, chatId, '❌ An error occurred. Please try again.');
    // Reset the session. state goes back to IDLE rather than being deleted — every reader
    // below treats it as a string (session.state.startsWith), so an absent state throws.
    userSessions[chatId].state = ApplicationStates.IDLE;
    delete userSessions[chatId].assignmentData;
    delete userSessions[chatId].currentStep;
  }
}

// `ack` is handleCallbackQuery's answer-once helper, passed in so the parent's finally-block
// and this function can't both answer the same query. Defaults to answering directly, for a
// caller that doesn't have one.
async function handleAssignmentCallbackQuery(
  bot, callbackQuery, userSessions,
  ack = (options) => bot.answerCallbackQuery(callbackQuery.id, options).catch(() => {})
) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const session = userSessions[chatId];
  
  if (!session || !session.assignmentData) {
    return;
  }
  
  try {
    if (data.startsWith('select_level_')) {
      const level = decodeURIComponent(data.replace('select_level_', ''));
      session.assignmentData.level = level;
      session.currentStep = 'subject';
      
      // Get subjects specific to the selected level using the mapping
      const availableSubjects = getSubjectsForLevel(level);
      
      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 3 of 11: Select the subject:', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: createInlineKeyboard(availableSubjects, 'select_subject', 1)
        }
      });
      
    } else if (data.startsWith('select_subject_')) {
      const subject = decodeURIComponent(data.replace('select_subject_', ''));
      session.assignmentData.subject = subject;
      session.currentStep = 'location';

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 4 of 11: Select the location:', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: createInlineKeyboard(SINGAPORE_LOCATIONS, 'select_location', 2)
        }
      });

    } else if (data.startsWith('select_location_')) {
      const location = decodeURIComponent(data.replace('select_location_', ''));
      session.assignmentData.location = location;
      session.assignmentData.preferredTutorTypes = session.assignmentData.preferredTutorTypes || [];
      session.currentStep = 'tutorType';

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 5 of 11: What type of tutor is the parent looking for?\n\n_Tap to toggle, then press Done_', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: buildTutorTypeKeyboard([])
        }
      });

    } else if (data.startsWith('toggle_tutor_pref_')) {
      const type = data.replace('toggle_tutor_pref_', '');
      const typeMap = { parttime: 'Part-time', fulltime: 'Full-time', moe: 'MOE/Ex-MOE' };
      const typeName = typeMap[type];
      if (!typeName) return;

      const prefs = session.assignmentData.preferredTutorTypes || [];
      const idx = prefs.indexOf(typeName);
      if (idx >= 0) {
        prefs.splice(idx, 1);
      } else {
        prefs.push(typeName);
      }
      session.assignmentData.preferredTutorTypes = prefs;

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 5 of 11: What type of tutor is the parent looking for?\n\n_Tap to toggle, then press Done_', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: buildTutorTypeKeyboard(prefs)
        }
      });

    } else if (data === 'confirm_tutor_types') {
      session.currentStep = 'frequency';

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 6 of 11: Enter the frequency\n\n*Examples:* Once a week, Twice a week, 3 times a week, Daily, Flexible, etc.\n\n*Please type your response:*', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'admin_panel' }]]
        }
      });

    } else if (data.startsWith('select_rate_')) {

        // User clicked "📈 Market Rate"
        if (data === 'select_rate_market') {
          const level = session.assignmentData.level;
          const rates = RATE_MAPPINGS[level];
          const prefs = session.assignmentData.preferredTutorTypes || [];

          // If only Part-time is selected, show only the PT rate
          const isPartTimeOnly = prefs.length === 1 && prefs[0] === 'Part-time';

          let finalRateString;
          if (isPartTimeOnly) {
            finalRateString = rates['PT (Part-Time)'] || '';
          } else {
            // Build the combined rate string for all tutor types
            const rateParts = Object.entries(rates).map(([type, rate]) => {
              const abbreviation = type.split(' ')[0];
              return `${rate} (${abbreviation})`;
            });
            finalRateString = rateParts.join(', ');
          }

          // Save the market rate and let user confirm or edit
          session.assignmentData.rate = finalRateString;
          session.currentStep = 'confirmRate';

          await bot.editMessageText(`🎯 *Creating New Assignment*\n\nStep 7 of 11: Market rate for *${level}*:\n\n💰 *${finalRateString}*\n\nAccept this rate or type a custom rate below:`, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '✅ Accept Rate', callback_data: 'select_rate_accept' }],
                [{ text: '❌ Cancel', callback_data: 'admin_panel' }]
              ]
            }
          });

        // User clicked "✅ Accept Rate" (market rate confirmed)
        } else if (data === 'select_rate_accept') {
          session.assignmentData.preferredTimeSlots = session.assignmentData.preferredTimeSlots || {};
          session.currentStep = 'timing';

          await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 8 of 11: Select preferred lesson timing\n\n_Tap all slots that work, then press Done_', {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: buildTimeSlotKeyboard(session.assignmentData.preferredTimeSlots)
            }
          });

        // User clicked "💰 Custom Amount"
        } else if (data === 'select_rate_custom') {
          session.waitingForCustomRate = true;
          session.currentStep = 'rate';
          
          await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 7 of 11: Enter your custom rate\n\n*Examples:* 55-75/hr, Negotiable\n\n*Please type your response:*', {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'admin_panel' }]]
            }
          });
        }

    } else if (data.startsWith('toggle_assignment_slot_')) {
      const key = data.replace('toggle_assignment_slot_', '');
      const slots = session.assignmentData.preferredTimeSlots || {};
      slots[key] = !slots[key];
      session.assignmentData.preferredTimeSlots = slots;

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 8 of 11: Select preferred lesson timing\n\n_Tap all slots that work, then press Done_', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: buildTimeSlotKeyboard(slots)
        }
      });

    } else if (data === 'confirm_assignment_slots') {
      session.currentStep = 'gender';

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 9 of 11: Preferred tutor gender?', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: buildGenderKeyboard()
        }
      });

    } else if (data.startsWith('set_assignment_gender_')) {
      const choice = data.replace('set_assignment_gender_', '');
      const genderMap = { male: 'Male', female: 'Female', none: 'No preference' };
      session.assignmentData.preferredGender = genderMap[choice] || 'No preference';
      session.currentStep = 'description';

      await bot.editMessageText('🎯 *Creating New Assignment*\n\nStep 10 of 11: Enter additional description or requirements\n\n*Type "skip" to leave empty*\n\n*Examples:* Student needs exam prep, prefers a patient tutor, etc.', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '❌ Cancel', callback_data: 'admin_panel' }]]
        }
      });
    }

    await ack();

  } catch (error) {
    console.error('Error handling assignment callback query:', error);
    await ack({ text: 'Error occurred. Please try again.' });
  }
}

// Update formatAssignmentPreview to match the simplified schema
function formatAssignmentPreview(assignment) {
  let msg = `*🎯 ${escapeMd(assignment.title)}*\n\n`;
  msg += `*📚 Level:* ${escapeMd(assignment.level)}\n`;
  msg += `*📖 Subject:* ${escapeMd(assignment.subject)}\n`;
  msg += `*📍 Location:* ${escapeMd(assignment.location)}\n`;
  msg += `*📅 Frequency:* ${escapeMd(assignment.frequency)}\n`;
  msg += `*💰 Rate:* ${escapeMd(assignment.rate)}\n`;
  msg += `*👨‍🏫 Tutor Type:* ${assignment.preferredTutorTypes?.length > 0 ? assignment.preferredTutorTypes.join(', ') : 'Any'}\n`;

  const previewSlots = formatTimeSlots(assignment.preferredTimeSlots);
  if (previewSlots) msg += `*⏰ Timing:* ${previewSlots}\n`;
  if (assignment.preferredGender && assignment.preferredGender !== 'No preference') {
    msg += `*🧑 Tutor Gender:* ${assignment.preferredGender}\n`;
  }

  if (assignment.description) {
    msg += `\n*📝 Description:* ${escapeMd(assignment.description)}\n`;
  }
  // Owner-only preview: parent contact is NOT included in the public channel post.
  if (assignment.parentContact) {
    msg += `*📞 Parent Contact:* ${escapeMd(assignment.parentContact)}\n`;
  }

  msg += `\n*💼 Status:* ${assignment.status}`;
  return msg;
}

// A thin pre-budget pool (this many tutors or fewer match everything but budget) is a SUPPLY
// problem, not a price one — raising the rate won't help, so we name the real bottleneck instead.
const CALIB_THIN_POOL = 6;

// Human phrasing for the attrition funnel's dominant filter (roadmap Phase 3/8), for the "thin pool"
// line of the budget check. Owner-facing, so it names what to widen.
const CALIB_FILTER_LABEL = {
  region: 'in this region',
  subject: 'for this subject & level',
  tutorType: 'of the tutor type requested',
  gender: 'of the gender preference',
  timeSlots: 'for the timing requested',
  budget: 'within budget',
  contactable: 'we can contact',
  active: 'still active',
};

// Compose the owner-facing "budget check" for the creation confirmation from a budgetCalibration()
// result (roadmap Phase 8). Purely informational — returns null when there's nothing worth showing
// (assignment unmappable, or neither a pool count nor a typical range could be computed), so the
// caller simply skips it and never blocks posting.
function formatBudgetCalibration(calib, assignment) {
  if (!calib || !calib.ok) return null;
  const { currentCeiling, poolAtCurrent, typical, suggested, poolAtSuggested, poolTotal, dominantFilter } = calib;
  const n = (count, noun = 'tutor') => `*${count}* ${noun}${count === 1 ? '' : 's'}`;

  const lines = [];
  if (currentCeiling != null && poolAtCurrent != null) {
    lines.push(`• ${n(poolAtCurrent)} fit at $${currentCeiling}/hr.`);
  }
  if (typical) {
    lines.push(`• Typical ${assignment.level} rate: *$${typical.p25}–$${typical.p75}/hr* (median $${typical.p50}).`);
  }
  if (suggested != null && poolAtSuggested != null) {
    lines.push(`• Raising to *$${suggested}/hr* would reach ${n(poolAtSuggested)}.`);
  }
  if (poolTotal <= CALIB_THIN_POOL && dominantFilter) {
    const where = CALIB_FILTER_LABEL[dominantFilter] || `(${dominantFilter})`;
    lines.push(`⚠️ Only ${n(poolTotal)} match ${where} at *any* budget — a thin pool here is about supply, not price.`);
  }

  if (lines.length === 0) return null;
  return `📊 *Budget check* — before outreach:\n${lines.join('\n')}`;
}

async function confirmPostAssignment(bot, chatId, userSessions, Assignment, channelId, botUsername, draftId) {
  try {
    console.log('Channel ID being used:', channelId);

    // Retrieve the draft saved during preview (survives serverless cold starts)
    const savedAssignment = await Assignment.findById(draftId);
    if (!savedAssignment) {
      return await safeSend(bot, chatId, '❌ Assignment draft not found or expired. Please create the assignment again.');
    }

    // Idempotency guard: Telegram retries webhooks if we don't respond 200 in time.
    // Check channelMessageId (post completed) and status (post started) to cover both windows.
    if (savedAssignment.channelMessageId) {
      console.log(`Duplicate webhook for assignment ${draftId} — already posted (msg ${savedAssignment.channelMessageId}), skipping.`);
      return await safeSend(bot, chatId, '✅ Assignment already posted to channel.');
    }
    if (savedAssignment.status === 'Open') {
      console.log(`Duplicate webhook for assignment ${draftId} — already activated, skipping.`);
      return await safeSend(bot, chatId, '✅ Assignment already posted to channel.');
    }

    // Activate the draft
    savedAssignment.status = 'Open';
    savedAssignment.updatedAt = new Date();
    await savedAssignment.save();
    
    // Post to channel
    const channelMessage = await postAssignmentToChannel(bot, savedAssignment, channelId, botUsername);
    
    // Store channel message ID for future reference
    if (channelMessage && channelMessage.message_id) {
      savedAssignment.channelMessageId = channelMessage.message_id;
      await savedAssignment.save();
    }
    
    // Clear session. state returns to IDLE rather than being deleted — the owner's next plain
    // message reads session.state.startsWith(...), which throws on an absent state.
    userSessions[chatId].state = ApplicationStates.IDLE;
    delete userSessions[chatId].assignmentData;
    delete userSessions[chatId].currentStep;
    delete userSessions[chatId].waitingForCustomRate;

    // Confirm immediately — WhatsApp notifications run in the background
    const confirmRows = [];
    const opsRow = opsButtonRow(savedAssignment._id, '🖥️ Track in console');
    if (opsRow) confirmRows.push(opsRow);
    confirmRows.push([{ text: '🔙 Back to Admin Panel', callback_data: 'admin_panel' }]);
    await safeSend(bot, chatId, `✅ *Assignment Posted Successfully!*\n\n📋 Assignment ID: ${savedAssignment._id}\n📢 Posted to channel\n📨 Notifying matching tutors via Telegram/WhatsApp...\n📊 Status: Open for applications`, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: confirmRows }
    });

    // Intake budget calibration (roadmap Phase 8): before outreach begins, tell the owner how many
    // tutors this assignment can afford at its rate, the typical market range, and what raising the
    // budget would unlock — so an unfillable rate is caught at creation, not diagnosed 4h later.
    // Purely informational: it NEVER blocks posting (the assignment is already Open above), and any
    // failure is swallowed. When the budget looks thin, also hand over a parent-forwardable
    // renegotiation blurb (owner-in-the-loop wa.me button, same seam as every parent message).
    try {
      const calib = await budgetCalibration(savedAssignment);
      const calibText = formatBudgetCalibration(calib, savedAssignment);
      if (calibText) {
        const rows = [];
        if (calib.suggested != null && savedAssignment.parentContact) {
          const blurb = await draftParentMessage('budget', { assignment: savedAssignment, calib });
          const waButton = buildWaMeButton(savedAssignment.parentContact, blurb, '📤 Suggest budget to parent');
          if (waButton) rows.push([waButton]);
        }
        await safeSend(bot, chatId, calibText, {
          parse_mode: 'Markdown', disable_web_page_preview: true,
          reply_markup: rows.length ? { inline_keyboard: rows } : undefined,
        });
      }
    } catch (calibErr) {
      console.warn('Budget calibration failed:', calibErr.message);
    }

    // Parent expectation blurb: hand the owner a paste-ready "we're searching, ~6h" message to
    // forward so the parent knows profiles are coming. Owner-in-the-loop — never messaged
    // directly (Repo facts). Only when we have a parent number; best-effort (never blocks posting).
    if (savedAssignment.parentContact) {
      try {
        const blurb = await draftParentMessage('expectation', { assignment: savedAssignment });
        const waButton = buildWaMeButton(savedAssignment.parentContact, blurb, '📤 Send to parent via WhatsApp');
        await safeSend(bot, chatId,
          `💬 *Let the parent know we're on it* — forward this ${waButton ? '(tap below)' : `(open WhatsApp with ${savedAssignment.parentContact} and paste)`}:\n\n${blurb}`,
          { parse_mode: 'Markdown', disable_web_page_preview: true,
            reply_markup: waButton ? { inline_keyboard: [[waButton]] } : undefined });
      } catch (blurbErr) {
        console.warn('Expectation blurb failed:', blurbErr.message);
      }
    }

    // Register the notification work with Vercel directly so the function stays alive
    // after the webhook response is sent, without blocking on it.
    waitUntil(
      notifyMatchedTutors(savedAssignment, botUsername).then(result => {
        console.log(`WhatsApp notifications done: ${result.sent} sent, ${result.failed} failed, AI used: ${result.aiUsed}`);
      }).catch(err => {
        console.error('Tutor notification error:', err);
      })
    );
    
  } catch (error) {
    console.error('Error confirming assignment:', error);
    await safeSend(bot, chatId, '❌ Failed to post assignment. Please try again.');
  }
}
// Post assignment to channel
async function postAssignmentToChannel(bot, assignment, channelId, botUsername) {
  try {
    const message = formatAssignmentForChannel(assignment);
    
    const result = await bot.sendMessage(channelId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '📝 Apply for this Assignment', url: `https://t.me/${botUsername}?start=apply_${assignment._id}` }
        ]]
      }
    });
    
    console.log(`✅ Assignment posted to channel. Message ID: ${result.message_id}`);
    return result;
  } catch (error) {
    console.error('Error posting to channel:', error);
    throw error;
  }
}

// Handle assignment application start - prompts for rate first with comprehensive error handling
async function handleApplicationStart(bot, chatId, userId, assignmentId, Assignment, Tutor, userSessions) {
  try {
    const session = userSessions[chatId];
    
    // Enhanced session validation
    if (!ErrorHandler.isSessionValid(session)) {
      await ErrorHandler.handleSessionTimeout(bot, chatId, userSessions);
      return;
    }

    // Update session activity
    ErrorHandler.updateSessionActivity(session);

    if (!session.tutorId) {
      console.warn(`🚫 tutorId missing in session for chatId ${chatId}`);
      await ErrorHandler.handleTutorNotFound(bot, chatId, userSessions);
      return;
    }
    
    // Get assignment with error handling
    let assignment;
    try {
      assignment = await Assignment.findById(assignmentId);
    } catch (dbError) {
      await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'assignment retrieval for application start');
      return;
    }
    
    if (!assignment) {
      await ErrorHandler.handleAssignmentNotFound(bot, chatId, userSessions, assignmentId);
      return;
    }
    
    if (assignment.status !== 'Open') {
      await safeSend(bot, chatId, '❌ This assignment is no longer accepting applications.');
      return;
    }
    
    // Initialize applicants array if it doesn't exist (safety check)
    if (!assignment.applicants) {
      assignment.applicants = [];
    }
    
    // Check if user already applied
    const existingApplication = assignment.applicants.find(app => 
      app.tutorId.toString() === session.tutorId.toString()
    );
    if (existingApplication) {
      await safeSend(bot, chatId, '⚠️ You have already applied for this assignment.');
      return;
    }
    
    // Get tutor details with error handling
    let tutor;
    try {
      tutor = await Tutor.findById(session.tutorId);
    } catch (dbError) {
      await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'tutor profile retrieval for application start');
      return;
    }
    
    if (!tutor) {
      await ErrorHandler.handleTutorNotFound(bot, chatId, userSessions);
      return;
    }
    
    // Set up session for rate collection
    session.pendingAssignmentId = assignmentId;
    session.state = ApplicationStates.AWAITING_RATE;
    
    // Prompt for tuition rate using dedicated function
    await sendRateInputPrompt(bot, chatId);
    
  } catch (error) {
    console.error('Unexpected error in handleApplicationStart:', error);
    await safeSend(bot, chatId, '❌ An unexpected error occurred while starting your application. Please try again or contact support.');
    
    // Reset session state on unexpected error
    if (userSessions[chatId]) {
      userSessions[chatId].state = ApplicationStates.IDLE;
      delete userSessions[chatId].pendingRate;
      delete userSessions[chatId].pendingAssignmentId;
    }
  }
}

// Handle assignment applications
// Handle assignment applications with comprehensive error handling
async function handleApplication(bot, chatId, userId, assignmentId, Assignment, Tutor, userSessions) {
  try {
    const session = userSessions[chatId];
    
    // Enhanced session validation
    if (!ErrorHandler.isSessionValid(session)) {
      await ErrorHandler.handleSessionTimeout(bot, chatId, userSessions);
      return;
    }

    // Update session activity
    ErrorHandler.updateSessionActivity(session);

    if (!session.tutorId) {
      console.warn(`🚫 tutorId missing in session for chatId ${chatId}`);
      await ErrorHandler.handleTutorNotFound(bot, chatId, userSessions);
      return;
    }
    
    // Get assignment with error handling
    let assignment;
    try {
      assignment = await Assignment.findById(assignmentId);
    } catch (dbError) {
      await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'assignment retrieval for application');
      return;
    }
    
    if (!assignment) {
      await ErrorHandler.handleAssignmentNotFound(bot, chatId, userSessions, assignmentId);
      return;
    }
    
    if (assignment.status !== 'Open') {
      await safeSend(bot, chatId, '❌ This assignment is no longer accepting applications.');
      return;
    }
    
    // Initialize applicants array if it doesn't exist (safety check)
    if (!assignment.applicants) {
      assignment.applicants = [];
    }
    
    // Check if user already applied
    const existingApplication = assignment.applicants.find(app => 
      app.tutorId.toString() === session.tutorId.toString()
    );
    if (existingApplication) {
      await safeSend(bot, chatId, '⚠️ You have already applied for this assignment.');
      return;
    }
    
    // Get tutor details with error handling
    let tutor;
    try {
      tutor = await Tutor.findById(session.tutorId);
    } catch (dbError) {
      await ErrorHandler.handleDatabaseError(dbError, bot, chatId, 'tutor profile retrieval for application');
      return;
    }
    
    if (!tutor) {
      await ErrorHandler.handleTutorNotFound(bot, chatId, userSessions);
      return;
    }

    // Check if rate is missing - if so, prompt for it first
    if (!session.pendingRate) {
      // Set up session for rate collection
      session.pendingAssignmentId = assignmentId;
      session.state = ApplicationStates.AWAITING_RATE;
      
      // Prompt for tuition rate using dedicated function
      await sendRateInputPrompt(bot, chatId);
      return;
    }
    
    // Prepare application data
    const applicationData = {
      tutorId: tutor._id,
      status: 'Pending',
      appliedAt: new Date(),
      contactDetails: tutor.contactNumber,
      notes: `Applied via bot by ${tutor.fullName}`,
      rate: session.pendingRate || null
    };
    
    // Use enhanced application submission with retry logic
    const success = await ErrorHandler.handleApplicationSubmissionWithRetry(
      bot, chatId, userSessions, Assignment, assignmentId, applicationData
    );
    
    if (!success) {
      return; // Error already handled by the retry function
    }

    // Mirror the application into outreach so it counts toward the interested target and gets
    // ranked into the shortlist. Best-effort: a failure here must not lose a recorded application.
    await recordApplicationInterest(Assignment, assignmentId, tutor, { rate: applicationData.rate })
      .then(async () => {
        // Applied after the shortlist went out — score them against it so a strong late
        // applicant still reaches the owner.
        const fresh = await Assignment.findById(assignmentId);
        if (fresh?.outreach?.status !== 'Fulfilled') return;
        const contact = (fresh.outreach.contacts || [])
          .find(c => c.tutorId?.toString() === tutor._id.toString());
        if (contact) await handleLateInterest(fresh, contact);
      })
      .catch(err => console.warn('Failed to mirror application into outreach:', err.message));

    // Clear session data after successful submission
    delete session.pendingRate;
    delete session.pendingAssignmentId;
    session.state = ApplicationStates.IDLE;
    
    // Show success message
    const assignmentMsg = formatAssignment(assignment);
    await safeSend(bot, chatId, 
      `✅ *Application Submitted Successfully!*\n\n${assignmentMsg}\n\n📝 *Application Status:* Pending\n⏰ *Applied At:* ${new Date().toLocaleString('en-SG')}`, 
      { parse_mode: 'Markdown' }
    );
    
    // Show main menu
    await showMainMenu(chatId, bot, userId, process.env.ADMIN_USERS?.split(',') || []);
    
  } catch (error) {
    console.error('Unexpected error in handleApplication:', error);
    await safeSend(bot, chatId, '❌ An unexpected error occurred while submitting your application. Please try again or contact support.');
    
    // Reset session state on unexpected error
    if (userSessions[chatId]) {
      userSessions[chatId].state = ApplicationStates.IDLE;
      delete userSessions[chatId].pendingRate;
      delete userSessions[chatId].pendingAssignmentId;
    }
  }
}

// Handle start parameters (for assignment applications)
async function handleStartParameter(bot, chatId, userId, startParam, Assignment, Tutor, userSessions, ADMIN_USERS) {
  try {
    // ?start=link — the tutor came to connect their Telegram. By the time we're here they've
    // already shared their contact, so handleContact has linked telegramId (and cleared any
    // stale flag); just confirm it so they know outreach will now reach them here for free.
    if (startParam === 'link') {
      await safeSend(bot, chatId,
        '✅ *Telegram linked!*\n\nYou\'ll now get matching tuition assignments right here — usually faster than WhatsApp. Just tap *Interested* or *Apply* when one arrives.',
        { parse_mode: 'Markdown' });
    }
    // Show main menu (also the fallback for unknown parameters).
    await showMainMenu(chatId, bot, userId, ADMIN_USERS);
  } catch (error) {
    console.error('Error handling start parameter:', error);
    await safeSend(bot, chatId, '❌ An error occurred. Please try again.');
    await showMainMenu(chatId, bot, userId, ADMIN_USERS);
  }
}

// View assignments with pagination
async function viewAssignments(bot, chatId, page = 0, Assignment) {
  try {
    const assignments = await Assignment.find({ status: 'Open' })
      .sort({ createdAt: -1 })
      .skip(page * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (!assignments || assignments.length === 0) {
      await safeSend(bot, chatId, '📋 No assignments available at the moment.', {
        reply_markup: {
          inline_keyboard: [[{ text: '🏠 Back to Main Menu', callback_data: 'main_menu' }]]
        }
      });
      return;
    }

    let message = `📋 *Available Assignments*\n\n`;
    const buttons = [];

    assignments.forEach((assignment, index) => {
      message += `*${index + 1}. ${escapeMd(assignment.title) || 'Assignment'}*\n`;
      message += `📚 Level: ${escapeMd(assignment.level)}\n`;
      message += `📖 Subject: ${escapeMd(assignment.subject)}\n`;
      message += `📍 Location: ${escapeMd(assignment.location)}\n`;
      message += `📅 Frequency: ${escapeMd(assignment.frequency)}\n`;
      message += `💰 Rate: ${escapeMd(assignment.rate)}\n`;


      buttons.push([{ text: `📝 Apply for Assignment ${index + 1}`, callback_data: `apply_assignment_${assignment._id}` }]);
    });

    // Add pagination buttons if needed
    const totalAssignments = await Assignment.countDocuments({ status: 'Open' });
    const totalPages = Math.ceil(totalAssignments / ITEMS_PER_PAGE);

    if (totalPages > 1) {
      const paginationButtons = [];
      if (page > 0) {
        paginationButtons.push({ text: '⬅️ Previous', callback_data: `assignments_page_${page - 1}` });
      }
      if (page < totalPages - 1) {
        paginationButtons.push({ text: 'Next ➡️', callback_data: `assignments_page_${page + 1}` });
      }
      if (paginationButtons.length > 0) {
        buttons.push(paginationButtons);
      }
    }

    buttons.push([{ text: '🏠 Back to Main Menu', callback_data: 'main_menu' }]);

    await safeSend(bot, chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });

  } catch (error) {
    console.error('Error viewing assignments:', error);
    await safeSend(bot, chatId, '❌ An error occurred while loading assignments. Please try again.');
  }
}

// View user's applications
// View user's applications (robust version)
async function viewMyApplications(bot, chatId, userSessions, Assignment) {
  try {
    // Safely get session
    const session = userSessions[chatId];

    if (!session || !session.tutorId) {
      return await safeSend(
        bot,
        chatId,
        '❌ Please start with /start and share your contact before viewing applications.',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🏠 Back to Main Menu', callback_data: 'main_menu' }]
            ]
          }
        }
      );
    }

    const tutorId = session.tutorId;

    // Find assignments where this tutor has applied
    const assignments = await Assignment.find({
      'applicants.tutorId': tutorId
    }).sort({ createdAt: -1 });

    if (!assignments.length) {
      return await safeSend(
        bot,
        chatId,
        "📋 You haven't applied for any assignments yet.",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📋 View Available Assignments', callback_data: 'view_assignments' }],
              [{ text: '🏠 Back to Main Menu', callback_data: 'main_menu' }]
            ]
          }
        }
      );
    }

    // Build the applications message
    let message = `📋 *My Applications*\n\n`;

    assignments.forEach((assignment, index) => {
      const myApplication = assignment.applicants.find(
        app => app.tutorId.toString() === tutorId.toString()
      );

      // If for some reason myApplication is missing, skip it safely
      if (!myApplication) return;

      message += `*${index + 1}. ${escapeMd(assignment.title) || 'Assignment'}*\n`;
      message += `📚 Level: ${escapeMd(assignment.level)}\n`;
      message += `📖 Subject: ${escapeMd(assignment.subject)}\n`;
      message += `📍 Location: ${escapeMd(assignment.location)}\n`;
      message += `💰 Rate: ${escapeMd(assignment.rate)}\n`;
      message += `📅 Applied: ${new Date(myApplication.appliedAt).toLocaleDateString('en-SG')}\n`;
      message += `🔄 Status: ${myApplication.status}\n\n`;
    });

    await safeSend(bot, chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: '🏠 Back to Main Menu', callback_data: 'main_menu' }]]
      }
    });

  } catch (error) {
    console.error('Error viewing applications:', error);
    await safeSend(bot, chatId, '❌ An error occurred while loading your applications. Please try again.');
  }
}

// Admin view all applications
async function adminViewAllApplications(bot, chatId, Assignment) {
  try {
    const assignments = await Assignment.find({
      'applicants': { $exists: true, $not: { $size: 0 } }
    }).sort({ createdAt: -1 });
    
    if (assignments.length === 0) {
      await safeSend(bot, chatId, '📋 No applications found.', {
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Back to Admin Panel', callback_data: 'admin_panel' }]]
        }
      });
      return;
    }
    
    let message = `📊 *All Applications*\n\n`;
    
    assignments.forEach((assignment, index) => {
      message += `*${index + 1}. ${escapeMd(assignment.title) || 'Assignment'}*\n`;
      message += `📚 ${escapeMd(assignment.level)} - ${escapeMd(assignment.subject)}\n`;
      message += `📍 ${escapeMd(assignment.location)}\n`;
      message += `👥 Applications: ${assignment.applicants.length}\n`;
      
      assignment.applicants.forEach((app, appIndex) => {
        message += `  ${appIndex + 1}. Status: ${app.status}\n`;
        message += `     Contact: ${escapeMd(app.contactDetails)}\n`;
        message += `     Applied: ${app.appliedAt.toLocaleDateString('en-SG')}\n`;
        if (app.notes) {
          message += `     Notes: ${escapeMd(app.notes)}\n`;
        }
      });
      
      message += '\n';
    });
    
    await safeSend(bot, chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Back to Admin Panel', callback_data: 'admin_panel' }]]
      }
    });
    
  } catch (error) {
    console.error('Error viewing all applications:', error);
    await safeSend(bot, chatId, '❌ An error occurred while loading applications. Please try again.');
  }
}

async function handleAgeEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    const age = parseInt(text);
    if (isNaN(age) || age < 16 || age > 80) {
      return await safeSend(bot, chatId, '❌ Please enter a valid age (16-80):');
    }
    
    tutor.age = age;
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Age updated to *${age}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating age:', error);
    await safeSend(bot, chatId, '❌ Error updating age. Please try again.');
  }
}

async function handleFullNameEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    if (text.trim().length < 2) {
      return await safeSend(bot, chatId, '❌ Please enter a valid full name:');
    }
    
    tutor.fullName = text.trim();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Full name updated to *${escapeMd(tutor.fullName)}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating full name:', error);
    await safeSend(bot, chatId, '❌ Error updating full name. Please try again.');
  }
}

async function handleContactNumberEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    // Basic phone number validation
    const phoneRegex = /^[+]?[\d\s()-]{8,15}$/;
    if (!phoneRegex.test(text.trim())) {
      return await safeSend(bot, chatId, '❌ Please enter a valid contact number:');
    }
    
    tutor.contactNumber = text.trim();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Contact number updated to *${escapeMd(tutor.contactNumber)}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating contact number:', error);
    await safeSend(bot, chatId, '❌ Error updating contact number. Please try again.');
  }
}

async function handleNRICEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    // Validate NRIC last 4 digits
    if (!/^\d{4}[A-Za-z]?$/.test(text.trim())) {
      return await safeSend(bot, chatId, '❌ Please enter the last 4 digits of your NRIC (e.g., 1234A):');
    }
    
    tutor.nricLast4 = text.trim().toUpperCase();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    // Four escaped asterisks as a literal mask. Unescaped, the six *s here were read as
    // Markdown emphasis and mangled the line.
    return await safeSend(bot, chatId, `✅ NRIC updated to \\*\\*\\*\\*${escapeMd(tutor.nricLast4)}`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating NRIC:', error);
    await safeSend(bot, chatId, '❌ Error updating NRIC. Please try again.');
  }
}

async function handleEmailEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text.trim())) {
      return await safeSend(bot, chatId, '❌ Please enter a valid email address:');
    }
    
    tutor.email = text.trim().toLowerCase();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Email updated to *${escapeMd(tutor.email)}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating email:', error);
    await safeSend(bot, chatId, '❌ Error updating email. Please try again.');
  }
}

// After a tutor edits a profile TEXT field, re-run LLM extraction (Phase 9) so their qualityGrade
// reflects the new text — the write-time hook for edits (the tick sweep covers registrations). Runs
// in the background via waitUntil so it never delays the edit confirmation. On failure we invalidate
// the stored modelVersion so the sweep re-tries, rather than leaving a grade derived from the old text.
function reextractProfile(tutor, TutorModel) {
  waitUntil(
    runExtractionForTutor(tutor)
      .then(features => {
        if (!features) return TutorModel.updateOne({ _id: tutor._id }, { $unset: { 'profileFeatures.modelVersion': 1 } });
      })
      .catch(err => console.warn('Profile re-extraction failed:', err.message))
  );
}

async function handleIntroductionEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    tutor.introduction = text.trim();
    await tutor.save();
    reextractProfile(tutor, Tutor);

    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, '✅ Introduction updated successfully!', {
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating introduction:', error);
    await safeSend(bot, chatId, '❌ Error updating introduction. Please try again.');
  }
}

async function handleTeachingExperienceEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    tutor.teachingExperience = text.trim();
    await tutor.save();
    reextractProfile(tutor, Tutor);

    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, '✅ Teaching experience updated successfully!', {
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating teaching experience:', error);
    await safeSend(bot, chatId, '❌ Error updating teaching experience. Please try again.');
  }
}

async function handleTrackRecordEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    tutor.trackRecord = text.trim();
    await tutor.save();
    reextractProfile(tutor, Tutor);

    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, '✅ Track record updated successfully!', {
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating track record:', error);
    await safeSend(bot, chatId, '❌ Error updating track record. Please try again.');
  }
}

async function handleYearsExperienceEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    const years = parseInt(text);
    if (isNaN(years) || years < 0 || years > 50) {
      return await safeSend(bot, chatId, '❌ Please enter a valid number of years (0-50):');
    }
    
    tutor.yearsOfExperience = years;
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Years of experience updated to *${years}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating years experience:', error);
    await safeSend(bot, chatId, '❌ Error updating years experience. Please try again.');
  }
}

async function handleCurrentSchoolEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    tutor.currentSchool = text.trim();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Current school updated to *${escapeMd(tutor.currentSchool)}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating current school:', error);
    await safeSend(bot, chatId, '❌ Error updating current school. Please try again.');
  }
}

async function handlePreviousSchoolsEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    tutor.previousSchools = text.trim();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, '✅ Previous schools updated successfully!', {
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating previous schools:', error);
    await safeSend(bot, chatId, '❌ Error updating previous schools. Please try again.');
  }
}

async function handleNationalityOtherEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    tutor.nationality = 'Other';
    tutor.nationalityOther = text.trim();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Nationality updated to *${escapeMd(tutor.nationalityOther)}*`, {
      parse_mode: 'Markdown',
      reply_markup: getPersonalInfoMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating nationality other:', error);
    await safeSend(bot, chatId, '❌ Error updating nationality. Please try again.');
  }
}

async function handleDOBDayEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    const day = parseInt(text);
    if (isNaN(day) || day < 1 || day > 31) {
      return await safeSend(bot, chatId, '❌ Please enter a valid day (1-31):');
    }
    
    // Schema field is `dob`, and it stores day/month/year as strings.
    tutor.dob.day = String(day);
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Birth day updated to *${day}*`, {
      parse_mode: 'Markdown',
      reply_markup: getDOBMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating DOB day:', error);
    await safeSend(bot, chatId, '❌ Error updating birth day. Please try again.');
  }
}

async function handleDOBMonthEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    const month = parseInt(text);
    if (isNaN(month) || month < 1 || month > 12) {
      return await safeSend(bot, chatId, '❌ Please enter a valid month (1-12):');
    }
    
    tutor.dob.month = String(month);
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Birth month updated to *${month}*`, {
      parse_mode: 'Markdown',
      reply_markup: getDOBMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating DOB month:', error);
    await safeSend(bot, chatId, '❌ Error updating birth month. Please try again.');
  }
}

async function handleDOBYearEdit(bot, chatId, text, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    const year = parseInt(text);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < (currentYear - 80) || year > (currentYear - 16)) {
      return await safeSend(bot, chatId, `❌ Please enter a valid birth year (${currentYear - 80}-${currentYear - 16}):`);
    }
    
    tutor.dob.year = String(year);
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ Birth year updated to *${year}*`, {
      parse_mode: 'Markdown',
      reply_markup: getDOBMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating DOB year:', error);
    await safeSend(bot, chatId, '❌ Error updating birth year. Please try again.');
  }
}

async function handleSpecificRateEdit(bot, chatId, text, level, userSessions, Tutor) {
  try {
    const session = userSessions[chatId];
    const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
    
    if (!tutor) {
      return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
    }
    
    // Validate rate format
    const rateMatch = text.match(/\d+/);
    if (!rateMatch) {
      return await safeSend(bot, chatId, '❌ Please enter a valid hourly rate (e.g., 40 or $40):');
    }
    
    const rate = parseInt(rateMatch[0]);
    if (rate < 10 || rate > 200) {
      return await safeSend(bot, chatId, '❌ Please enter a rate between $10-$200 per hour:');
    }
    
    // Initialize hourlyRate if it doesn't exist
    if (!tutor.hourlyRate) {
      tutor.hourlyRate = {
        primary: '',
        secondary: '',
        jc: '',
        ib: '',
        music: '',
        computing: ''
      };
    }
    
    // Update the rate for the specific level
    tutor.hourlyRate[level] = rate.toString();
    await tutor.save();
    
    session.state = ApplicationStates.IDLE;
    return await safeSend(bot, chatId, `✅ ${level.charAt(0).toUpperCase() + level.slice(1)} rate updated to *$${rate}/hour*`, {
      parse_mode: 'Markdown',
      reply_markup: getHourlyRatesMenu(tutor)
    });
  } catch (error) {
    console.error('Error updating specific rate:', error);
    await safeSend(bot, chatId, '❌ Error updating hourly rate. Please try again.');
  }
}

// Fixed version of handleCallbackQuery with all editable fields and menus handled
// Make sure userSessions[chatId] carries a tutorId, resolving it from the tapper's telegramId
// when the in-memory session was lost (Vercel is serverless — sessions don't survive a cold
// start). Lets a button tapped straight from an outreach DM reach the apply flow instead of
// dead-ending on "please /start". No-op when the session already has a tutorId. Returns the
// session, or null when the Telegram user isn't a linked tutor.
async function ensureTutorSession(chatId, userId, Tutor, userSessions) {
  const existing = userSessions[chatId];
  if (existing?.tutorId) return existing;

  const tutor = await Tutor.findOne({ telegramId: userId });
  if (!tutor) return null;

  userSessions[chatId] = {
    ...(existing || {}),
    tutorId: tutor._id,
    fullName: tutor.fullName,
    state: ApplicationStates.VERIFIED,
    lastActivity: Date.now()
  };
  return userSessions[chatId];
}

async function handleCallbackQuery(
  bot,
  callbackQuery,
  Assignment,
  Tutor,
  userSessions,
  ADMIN_USERS,
  CHANNEL_ID,
  BOT_USERNAME
) {
  // Use userId for responses to avoid sending messages to channels
  // when callback comes from channel messages
  const chatId = callbackQuery.from.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  // Telegram accepts exactly ONE answer per callback query; a second call fails with
  // QUERY_ID_INVALID. Branches below answer with a toast ("Not authorized.", "✅ Added as #2"),
  // so the ack can't be fired blindly up front — that used to swallow every toast AND throw,
  // unwinding the branch before its remaining work (the fresh outreach wave, the profile relay).
  // First call wins, later calls are no-ops, and it never throws into a branch.
  let answered = false;
  const ack = async (options) => {
    if (answered) return;
    answered = true;
    await bot.answerCallbackQuery(callbackQuery.id, options).catch(() => {});
  };

  try {
    console.log("📥 Callback data received:", data);

    // Main menu and admin handlers
    if (data === 'main_menu') {
      return await showMainMenu(chatId, bot, userId, ADMIN_USERS);
    }

    // Handle back to assignment details from rate input
    // The inert "🔒 Assignment Closed" label that replaces the Apply button on a closed channel
    // post. It rides on a PUBLIC post, so anyone can tap it — answer with a toast rather than a
    // DM, which would 403 for anyone who has never started the bot.
    if (data === 'assignment_closed') {
      return await ack({ text: 'This assignment is closed — no longer accepting applications.' });
    }

    // Offered by ErrorHandler.handleTutorNotFound. Registration lives on the website, so point
    // there — the same place handleContact sends an unrecognised number.
    if (data === 'restart_registration') {
      return await safeSend(bot, chatId,
        'Please register at https://www.lioncitytutors.com/register-tutor, then send /start and share your contact number.',
        { disable_web_page_preview: true });
    }

    if (data === 'back_to_assignment') {
      const session = userSessions[chatId];
      if (!session || !session.pendingAssignmentId) {
        await safeSend(bot, chatId, '❌ Session expired. Please start the application process again.');
        return await showMainMenu(chatId, bot, userId, ADMIN_USERS);
      }

      const assignment = await Assignment.findById(session.pendingAssignmentId);
      if (!assignment) {
        await safeSend(bot, chatId, '❌ Assignment not found. Returning to main menu.');
        session.state = ApplicationStates.IDLE;
        delete session.pendingAssignmentId;
        delete session.pendingRate;
        return await showMainMenu(chatId, bot, userId, ADMIN_USERS);
      }

      // Clear rate input state and return to assignment details
      session.state = ApplicationStates.IDLE;
      delete session.pendingRate;

      // Show assignment details with apply button
      const assignmentMsg = formatAssignment(assignment);
      return await safeSend(bot, chatId, 
        `🎯 *Assignment Details*\n\n${assignmentMsg}`, 
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📝 Apply for Assignment', callback_data: `apply_assignment_${assignment._id}` }],
              [{ text: '🔙 Back to Assignments', callback_data: 'view_assignments' }],
              [{ text: '🏠 Main Menu', callback_data: 'main_menu' }]
            ]
          }
        }
      );
    }

    // Handle application confirmation
    if (data.startsWith('confirm_apply_')) {
      const assignmentId = data.replace('confirm_apply_', '');
      return await handleApplication(bot, chatId, userId, assignmentId, Assignment, Tutor, userSessions);
    }

    // Telegram outreach quick-reply: tutor tapped "✅ Interested" on an assignment DM. We know
    // who tapped from their Telegram id (= telegramId), so no session is needed — record it
    // straight against the outreach contact, mirroring the WhatsApp Yes path.
    // Dormant tutor tapped "keep me listed" on their reactivation DM (Phase 10 step 3). Clear the
    // auto-pause and re-confirm activity so they re-enter the matching pool immediately — same clear
    // as sharing their contact (handleContact). Resolved by the sender's telegramId, so no id rides
    // in the callback data. updateOne, not save(), to avoid re-validating a legacy profile.
    if (data === 'reactivate') {
      await bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: callbackQuery.message?.message_id }
      ).catch(() => {});
      const tutor = await Tutor.findOne({ telegramId: userId });
      if (!tutor) {
        return await safeSend(bot, chatId, 'Please share your contact with the bot first (/start) so we can relist you.');
      }
      await Tutor.updateOne(
        { _id: tutor._id },
        { $set: { pausedAt: null, telegramStale: false, lastConfirmedActiveAt: new Date() } }
      );
      return await safeSend(bot, chatId, "✅ Great — you're active again and back in the matching pool. We'll be in touch with suitable assignments!");
    }

    if (data.startsWith('outreach_interested_')) {
      const assignmentId = data.replace('outreach_interested_', '');
      const tutor = await Tutor.findOne({ telegramId: userId });
      if (!tutor) {
        return await safeSend(bot, chatId, 'Please share your contact with the bot first (/start) so we can match your reply.');
      }
      const result = await recordTutorReplyByTutorId(tutor._id, 'yes', assignmentId);
      // Drop the buttons so the tutor can't double-tap, then confirm.
      await bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: callbackQuery.message?.message_id }
      ).catch(() => {});
      if (!result.matched) {
        return await safeSend(bot, chatId, "👍 Thanks! This assignment may already be filled, but we've noted you.");
      }
      // The interest is already recorded and already counts toward the target — the rate is
      // enrichment, so this ask can be ignored without costing the tutor their place.
      return await safeSend(bot, chatId,
        `✅ Great — we've noted your interest!\n\n${result.ratePrompt}`);
    }

    // Tutor tapped "❌ Not available" on an outreach DM. The No is recorded immediately; the
    // reason buttons that replace the keyboard are best-effort on top of it.
    if (data.startsWith('outreach_decline_')) {
      const assignmentId = data.replace('outreach_decline_', '');
      const tutor = await Tutor.findOne({ telegramId: userId });
      if (!tutor) {
        return await safeSend(bot, chatId, 'Please share your contact with the bot first (/start) so we can match your reply.');
      }
      const result = await recordTutorReplyByTutorId(tutor._id, 'no', assignmentId);
      if (!result.matched) {
        await bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: chatId, message_id: callbackQuery.message?.message_id }
        ).catch(() => {});
        return await safeSend(bot, chatId, '👍 Thanks for letting us know.');
      }
      // Swap the DM's keyboard for the reason buttons rather than sending a new message —
      // keeps the assignment context visible next to the question being asked.
      await bot.editMessageReplyMarkup(
        { inline_keyboard: declineReasonKeyboard(assignmentId) },
        { chat_id: chatId, message_id: callbackQuery.message?.message_id }
      ).catch(() => {});
      return;
    }

    // Tutor picked a decline reason. Every "No" was previously thrown-away signal; this is the
    // only place we learn WHY. Best-effort by design — the Declined status is already recorded.
    if (data.startsWith('outreach_reason_')) {
      const [, reason, assignmentId] = data.match(/^outreach_reason_([a-z]+)_(.+)$/) || [];
      if (!reason || !assignmentId) return;
      const tutor = await Tutor.findOne({ telegramId: userId });
      if (!tutor) return;

      const { ratePrompt } = await recordDeclineReason({ tutorId: tutor._id, assignmentId, reason });

      await bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: callbackQuery.message?.message_id }
      ).catch(() => {});

      // A rate decline is the one reason worth a follow-up question: "too low, but I'd do $70"
      // is sometimes a placement rather than a dead end, and always tells us how far off the
      // budget was.
      if (ratePrompt) {
        return await safeSend(bot, chatId,
          `Understood — thanks!\n\n${ratePrompt}`);
      }
      if (reason === 'inactive') {
        return await safeSend(bot, chatId,
          "Got it — we'll stop sending you assignments. Message the bot any time to start again.");
      }
      return await safeSend(bot, chatId, '👍 Thanks — that helps us match you better next time.');
    }

    // Handle direct assignment application - now prompts for rate first
    if (data.startsWith('apply_assignment_')) {
      const assignmentId = data.replace('apply_assignment_', '');
      // A tap from an outreach DM may arrive with no in-memory session (serverless cold start),
      // so resolve the tutor from their telegramId before the apply flow needs session.tutorId.
      await ensureTutorSession(chatId, userId, Tutor, userSessions);
      return await handleApplicationStart(bot, chatId, userId, assignmentId, Assignment, Tutor, userSessions);
    }

    if (data === 'admin_panel') {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await safeSend(bot, chatId, 'You are not authorized to access the admin panel.');
      }
      return await showAdminPanel(chatId, bot);
    }

    if (data.startsWith('confirm_post_assignment_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await safeSend(bot, chatId, 'You are not authorized to post assignments.');
      }
      const draftId = data.replace('confirm_post_assignment_', '');
      // Answer up front: posting does a channel send plus an LLM-drafted parent blurb, which is
      // long enough that the button would otherwise spin until the finally-block below.
      await ack();
      return await confirmPostAssignment(bot, chatId, userSessions, Assignment, CHANNEL_ID, BOT_USERNAME, draftId);
    }

    if (data.startsWith('cancel_draft_')) {
      const draftId = data.replace('cancel_draft_', '');
      await Assignment.findByIdAndDelete(draftId).catch(() => {});
      return await showAdminPanel(chatId, bot);
    }

    // One-tap relay: send an interested tutor's profile to the assignment's parent.
    if (data.startsWith('sendprof_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const [assignmentId, tutorId] = data.replace('sendprof_', '').split('_');
      const [assignment, tutor] = await Promise.all([
        Assignment.findById(assignmentId).lean(),
        Tutor.findById(tutorId).lean()
      ]);
      if (!assignment?.parentContact) {
        return await ack({ text: 'No parent contact on this assignment.' });
      }
      if (!tutor) {
        return await ack({ text: 'Tutor not found.' });
      }
      const intro = process.env.PARENT_INTRO_MESSAGE
        || 'Hi! Here is a tutor we found for your request:';
      try {
        // Split architecture: parent conversations live on the owner's own WhatsApp, not the
        // Cloud API number (which has no inbox and can't cold-message a parent). So instead of
        // sending, hand the owner a wa.me link to open the parent chat + the profile to paste.
        const profileText = formatTutorProfileForParent(tutor, assignment, intro);
        const waDigits = String(assignment.parentContact).replace(/\D/g, '');
        const waNumber = waDigits.length === 8 ? '65' + waDigits : waDigits;
        await ack({ text: '✅ Ready to forward' });
        await safeSend(bot, chatId,
          `📤 *Forward to parent* — [open WhatsApp chat](https://wa.me/${waNumber}) with ${assignment.parentContact}, then paste the profile below:`,
          { parse_mode: 'Markdown', disable_web_page_preview: true });
        await safeSend(bot, chatId, profileText);
        await safeSend(bot, chatId, '↩️ Once the parent replies:', {
          reply_markup: { inline_keyboard: [
            [{ text: '✅ Parent chose a tutor — mark filled', callback_data: `markfilled_${assignment._id}` }],
            [{ text: '🔄 Parent passed — find more tutors', callback_data: `findmore_${assignment._id}` }]
          ] }
        });
      } catch (err) {
        console.error('Failed to prepare parent relay:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // Owner tapped a widen-the-search button on a thin-pool alert. applyRecovery mutates the
    // criteria and resets outreach; the fresh wave goes out against the new ones.
    if (data.startsWith('recover_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const [, action, assignmentId] = data.match(/^recover_(.+)_([a-f\d]{24})$/i) || [];
      if (!action) {
        return await ack({ text: 'Bad request.' });
      }
      const result = await applyRecovery({ assignmentId, action });
      if (!result.ok) {
        return await ack({ text: `Couldn't apply: ${result.error}` });
      }
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId, message_id: callbackQuery.message?.message_id
      }).catch(() => {});
      await ack({ text: '✅ Searching again' });
      await safeSend(bot, chatId,
        `🔎 *${escapeMd(result.summary)}* — messaging a fresh wave for *${escapeMd(result.assignment.title)}* now.`,
        { parse_mode: 'Markdown' });
      escalateAssignment(result.assignment, BOT_USERNAME)
        .catch(err => console.error('Recovery wave failed:', err.message));
      return;
    }

    // Owner tapped "Add to shortlist" on a stronger-tutor alert: stamp the next rank so the
    // tutor becomes relayable through the normal send-to-parent path.
    if (data.startsWith('addshort_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const [, assignmentId, tutorId] = data.match(/^addshort_([a-f\d]+)_([a-f\d]+)$/i) || [];
      if (!assignmentId) {
        return await ack({ text: 'Bad request.' });
      }
      const assignment = await Assignment.findById(assignmentId);
      const contacts = assignment?.outreach?.contacts || [];
      const contact = contacts.find(c => c.tutorId?.toString() === tutorId);
      if (!contact || contact.status !== 'Interested' || contact.parentRejectedAt) {
        return await ack({ text: 'That tutor is no longer available.' });
      }
      if (contact.shortlistRank != null) {
        return await ack({ text: 'Already on the shortlist.' });
      }

      const rank = nextShortlistRank(contacts);
      await Assignment.updateOne(
        { _id: assignment._id },
        { $set: { 'outreach.contacts.$[c].shortlistRank': rank } },
        { arrayFilters: [{ 'c.tutorId': contact.tutorId }] }
      );
      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId, message_id: callbackQuery.message?.message_id
      }).catch(() => {});
      await ack({ text: `✅ Added as #${rank}` });

      const rows = [];
      if (assignment.parentContact) {
        rows.push([{ text: '📤 Send profile to parent', callback_data: `sendallprof_${assignment._id}` }]);
      }
      const opsRow = opsButtonRow(assignment._id);
      if (opsRow) rows.push(opsRow);
      return await safeSend(bot, chatId,
        `✅ *${escapeMd(contact.tutorName) || 'Tutor'}* added to the shortlist for *${escapeMd(assignment.title)}* as #${rank}.`,
        { parse_mode: 'Markdown', ...(rows.length && { reply_markup: { inline_keyboard: rows } }) });
    }

    // One-tap relay of the whole shortlist: forward every interested-but-unsent tutor's
    // profile to the parent in a single curated message. Re-tappable — only sends tutors
    // who said Yes since the last send (see Assignment.pendingParentTutorIds).
    if (data.startsWith('sendallprof_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const assignmentId = data.replace('sendallprof_', '');
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment?.parentContact) {
        return await ack({ text: 'No parent contact on this assignment.' });
      }

      const pendingIds = assignment.pendingParentTutorIds();
      if (pendingIds.length === 0) {
        return await ack({ text: 'No new interested tutors to send.' });
      }

      const tutors = await Tutor.find({ _id: { $in: pendingIds } }).lean();
      const intro = process.env.PARENT_INTRO_MESSAGE
        || 'Hi! Here is a tutor we found for your request:';
      try {
        // Split architecture: hand the shortlist to the owner to forward from their own
        // WhatsApp, rather than cold-messaging the parent from the (inboxless) Cloud API number.
        const profileText = formatTutorProfilesForParent(tutors, assignment, intro);
        const waDigits = String(assignment.parentContact).replace(/\D/g, '');
        const waNumber = waDigits.length === 8 ? '65' + waDigits : waDigits;

        // Mark exactly the tutors we just handed over as relayed, so a later tap forwards only
        // newcomers. Targeted update (not .save()): a full-document save re-validates legacy
        // subject/level enums and would throw, leaving these unmarked and re-sent on next tap.
        const sentSet = new Set(pendingIds);
        const relayedIds = assignment.outreach.contacts
          .filter(c => c.status === 'Interested' && c.tutorId && sentSet.has(c.tutorId.toString()))
          .map(c => c.tutorId);
        await Assignment.updateOne(
          { _id: assignment._id },
          { $set: { 'outreach.contacts.$[c].relayedToParentAt': new Date() } },
          { arrayFilters: [{ 'c.tutorId': { $in: relayedIds }, 'c.status': 'Interested' }] }
        );

        await ack({ text: `✅ ${tutors.length} ready to forward` });
        await safeSend(bot, chatId,
          `📤 *Forward ${tutors.length} profile(s) to parent* — [open WhatsApp chat](https://wa.me/${waNumber}) with ${assignment.parentContact}, then paste below:`,
          { parse_mode: 'Markdown', disable_web_page_preview: true });
        await safeSend(bot, chatId, profileText);
        await safeSend(bot, chatId, '↩️ Once the parent replies:', {
          reply_markup: { inline_keyboard: [
            [{ text: '✅ Parent chose a tutor — mark filled', callback_data: `markfilled_${assignment._id}` }],
            [{ text: '🔄 Parent passed — find more tutors', callback_data: `findmore_${assignment._id}` }]
          ] }
        });
      } catch (err) {
        console.error('Failed to prepare shortlist relay:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // "Parent passed — find more tutors": the parent wasn't keen on the shortlist we relayed.
    // Reject those tutors (they stop counting toward the interested target via
    // viableInterestedCount, and stay in contactedTutorIds so they're never re-messaged), reset
    // the outreach clock, and fire a fresh wave — resuming the wave engine until new tutors say Yes.
    if (data.startsWith('findmore_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const assignmentId = data.replace('findmore_', '');
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return await ack({ text: 'Assignment not found.' });
      }

      const now = new Date();
      // Only reject tutors actually shown to the parent (relayed) and not already rejected.
      const rejectedCount = (assignment.outreach?.contacts || [])
        .filter(c => c.status === 'Interested' && c.relayedToParentAt && !c.parentRejectedAt).length;

      try {
        // Targeted update (never .save(): a legacy subject/level outside the current enum would
        // fail validation). Reject the relayed shortlist AND reset the outreach clock so the 4h
        // timeout counts from now, not the original start — recordWaveContacts only sets startedAt
        // when absent, so we must reset it here. Reopen in case auto-close already fired.
        await Assignment.updateOne(
          { _id: assignment._id },
          {
            $set: {
              'outreach.contacts.$[c].parentRejectedAt': now,
              'outreach.status': 'Active',
              'outreach.startedAt': now,
              'outreach.lastWaveAt': now,
              status: 'Open'
            }
          },
          { arrayFilters: [{ 'c.status': 'Interested', 'c.relayedToParentAt': { $exists: true }, 'c.parentRejectedAt': { $exists: false } }] }
        );

        // Mirror the reset in memory so the immediate escalateAssignment sees Active state; the
        // rejected tutors are already in contactedTutorIds (by tutorId), so they're excluded from
        // the fresh pool regardless.
        assignment.outreach.status = 'Active';
        assignment.outreach.startedAt = now;
        assignment.outreach.lastWaveAt = now;
        assignment.status = 'Open';

        await ack({ text: '🔄 Finding more tutors…' });

        // Fire one fresh wave immediately (speed is the differentiator), same pattern as wave 1 on
        // creation. The scheduler's 30-min cadence continues afterward (the wave re-stamps lastWaveAt).
        waitUntil((async () => {
          try {
            const result = await escalateAssignment(assignment, BOT_USERNAME, { waveSize: 6 });
            if (result.exhausted) {
              await safeSend(bot, chatId,
                `📭 *No fresh matching tutors left* for *${escapeMd(assignment.title)}* — you've contacted everyone in the pool. You'll need to follow up manually.`,
                { parse_mode: 'Markdown' });
            } else {
              await safeSend(bot, chatId,
                `🔄 *Resuming outreach* for *${escapeMd(assignment.title)}* — messaging more tutors` +
                (rejectedCount ? ` (the ${rejectedCount} shown to the parent ${rejectedCount === 1 ? 'is' : 'are'} excluded).` : '.'),
                { parse_mode: 'Markdown' });
            }
          } catch (err) {
            console.error('find-more escalation failed:', err.message);
            await safeSend(bot, chatId, '❌ Something went wrong resuming outreach — try again.');
          }
        })());
      } catch (err) {
        console.error('Failed to resume outreach (find more):', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // Parent chose a tutor: show the interested tutors so the owner can pick the winner.
    if (data.startsWith('markfilled_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const assignmentId = data.replace('markfilled_', '');
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return await ack({ text: 'Assignment not found.' });
      }
      // Candidates = interested tutors the parent hasn't already been told we're dropping.
      const candidates = (assignment.outreach?.contacts || [])
        .filter(c => c.status === 'Interested' && !c.parentRejectedAt && c.tutorId);
      if (candidates.length === 0) {
        return await ack({ text: 'No interested tutors to choose from yet.' });
      }
      await ack();
      const pickButtons = candidates.map(c => ([{
        text: `✅ ${c.tutorName || 'Tutor'}`,
        callback_data: `setwinner_${assignmentId}_${c.tutorId}`
      }]));
      pickButtons.push([{ text: '🔙 Cancel', callback_data: `edit_assignment_${assignmentId}` }]);
      await safeSend(bot, chatId,
        `Which tutor did the parent choose for *${escapeMd(assignment.title)}*?\nThis marks the assignment *Filled* and stops outreach.`,
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: pickButtons } });
      return;
    }

    // Commit the parent's choice. The recording itself (Filled + winner + Placement + channel post)
    // lives in parentOutcome.js so this button and the ops console land identical state.
    if (data.startsWith('setwinner_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const [assignmentId, tutorId] = data.replace('setwinner_', '').split('_');
      try {
        const result = await recordParentPick({ assignmentId, tutorId });
        if (!result.ok) {
          return await ack({
            text: result.error === 'assignment_not_found' ? 'Assignment not found.' : 'That tutor is no longer a candidate.'
          });
        }

        await ack({ text: '✅ Marked filled' });
        await safeSend(bot, chatId,
          `✅ *${escapeMd(result.assignment.title)}* marked *Filled* — ${escapeMd(result.tutorName)} will take it. Outreach stopped and the assignment is closed.`,
          { parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Manage Assignments', callback_data: 'admin_manage_assignments' }]] } });
      } catch (err) {
        console.error('Failed to mark assignment filled:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // Parent passed on the whole shortlist — ask WHY (feeds shortlist presentation + pricing).
    if (data.startsWith('rejectall_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const assignmentId = data.replace('rejectall_', '');
      await ack();
      await safeSend(bot, chatId,
        `Why did the parent pass on the shortlist? (helps us find better matches — we'll then message fresh tutors)`,
        { reply_markup: { inline_keyboard: [
          [{ text: '💲 Rate too high', callback_data: `rejreason_${assignmentId}_rate` }],
          [{ text: '📄 Profiles not a fit', callback_data: `rejreason_${assignmentId}_profiles` }],
          [{ text: '🗓️ Timing / availability', callback_data: `rejreason_${assignmentId}_timing` }],
          [{ text: '❔ Other', callback_data: `rejreason_${assignmentId}_other` }]
        ] } });
      return;
    }

    // Record the reject reason on the shortlisted tutors and resume outreach for fresh ones —
    // same "find more" engine as findmore_, plus the captured reason. Rejected tutors stop
    // counting toward the target (viableInterestedCount) and stay in contactedTutorIds (never
    // re-messaged). callback_data is rejreason_<assignmentId>_<reason>; reason is the last segment.
    if (data.startsWith('rejreason_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const rest = data.replace('rejreason_', '');
      const cut = rest.lastIndexOf('_');
      const assignmentId = rest.slice(0, cut);
      const reason = rest.slice(cut + 1);
      try {
        // Recording + the outreach reset live in parentOutcome.js, shared with the ops console.
        const recorded = await recordParentReject({ assignmentId, reason });
        if (!recorded.ok) {
          return await ack({
            text: recorded.error === 'assignment_not_found' ? 'Assignment not found.' : 'Something went wrong — try again.'
          });
        }
        const { assignment, rejectedCount } = recorded;

        await ack({ text: '🔄 Finding more tutors…' });

        // Fire one fresh wave immediately (speed is the differentiator). The 30-min scheduler
        // cadence continues afterward (the wave re-stamps lastWaveAt).
        waitUntil((async () => {
          try {
            const result = await resumeOutreach(assignment, { botUsername: BOT_USERNAME });
            if (result.exhausted) {
              await safeSend(bot, chatId,
                `📭 *No fresh matching tutors left* for *${escapeMd(assignment.title)}* — you've contacted everyone in the pool. You'll need to follow up manually.`,
                { parse_mode: 'Markdown' });
            } else {
              await safeSend(bot, chatId,
                `🔄 *Resuming outreach* for *${escapeMd(assignment.title)}* — reason logged: _${reason}_. Messaging more tutors` +
                (rejectedCount ? ` (the ${rejectedCount} shown to the parent ${rejectedCount === 1 ? 'is' : 'are'} excluded).` : '.'),
                { parse_mode: 'Markdown' });
            }
          } catch (err) {
            console.error('reject-reason escalation failed:', err.message);
            await safeSend(bot, chatId, '❌ Something went wrong resuming outreach — try again.');
          }
        })());
      } catch (err) {
        console.error('Failed to record reject reason / resume outreach:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // Owner acknowledges the parent hasn't replied yet — no state change; the tick's 24h/48h
    // silence follow-up handles reminders off shortlistReleasedAt.
    if (data.startsWith('parentnoreply_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      return await ack({ text: "Noted — I'll remind you if it stays quiet." });
    }

    // ── Day-30 check-in recording (Phase 5) ────────────────────────────────────────────────────
    // The tick pings the owner about a placement; these buttons record the parent's answer through
    // the shared recorder (checkInOutcome.js), the same path the ops console uses. Recorders own
    // the Placement writes; the handler only reports back.

    // "Going well" → ask for a 1–5 rating (a direct quality signal + testimonial raw material).
    if (data.startsWith('ciwell_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const placementId = data.replace('ciwell_', '');
      await ack();
      await safeSend(bot, chatId, 'Glad to hear it! How would the parent rate the tuition so far?', {
        reply_markup: { inline_keyboard: checkInRatingRows(placementId) },
      });
      return;
    }

    // The rating tap → record going-well + rating. callback: cirate_<placementId>_<1..5>.
    if (data.startsWith('cirate_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const rest = data.replace('cirate_', '');
      const cut = rest.lastIndexOf('_');
      const placementId = rest.slice(0, cut);
      const rating = rest.slice(cut + 1);
      try {
        const result = await recordCheckInWell({ placementId, rating });
        if (!result.ok) {
          return await ack({ text: 'Could not record that — try again.' });
        }
        await ack({ text: `✅ Recorded ${rating}⭐` });
        await safeSend(bot, chatId, `✅ Logged — tuition going well, rated *${rating}/5*. Thanks!`, { parse_mode: 'Markdown' });
      } catch (err) {
        console.error('Failed to record check-in rating:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // "It ended" → record the ended outcome now, then capture the parent's stated reason as free
    // text (stored verbatim). The reason is best-effort enrichment: the ended outcome is already
    // saved, so a never-typed reason costs nothing. State lives on the owner's session, so a cold
    // start between tap and typing simply drops the reason capture (the owner can note it later).
    if (data.startsWith('ciended_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const placementId = data.replace('ciended_', '');
      try {
        const result = await recordCheckInEnded({ placementId });
        if (!result.ok) {
          return await ack({ text: 'Could not record that — try again.' });
        }
        const session = userSessions[chatId] || (userSessions[chatId] = { state: 'idle' });
        session.state = 'awaiting_end_reason';
        session.endReason = { placementId, checkInId: result.checkInId };
        await ack({ text: 'Marked as ended' });
        await safeSend(bot, chatId,
          '🔚 Logged as *ended*. What reason did the parent give? Type it here and I\'ll save it — or send /skip.',
          { parse_mode: 'Markdown' });
      } catch (err) {
        console.error('Failed to record check-in ended:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    // "No reply" → close the loop without asserting survival either way.
    if (data.startsWith('cinoreply_')) {
      if (!isAdmin(userId, ADMIN_USERS)) {
        return await ack({ text: 'Not authorized.' });
      }
      const placementId = data.replace('cinoreply_', '');
      try {
        await recordCheckInNoReply({ placementId });
        await ack({ text: 'Noted — no reply.' });
      } catch (err) {
        console.error('Failed to record check-in no-reply:', err.message);
        await ack({ text: 'Something went wrong — try again.' });
      }
      return;
    }

    if (data.trim() === 'admin_post_assignment') {
      return await startAssignmentCreation(bot, chatId, userSessions);
    }

    if (data.startsWith('select_level_') || data.startsWith('select_subject_') || data.startsWith('select_location_') || data.startsWith('toggle_tutor_pref_') || data === 'confirm_tutor_types' || data.startsWith('select_rate_') || data.startsWith('toggle_assignment_slot_') || data === 'confirm_assignment_slots' || data.startsWith('set_assignment_gender_')) {
      return await handleAssignmentCallbackQuery(bot, callbackQuery, userSessions, ack);
    }


    if (data === 'view_assignments') {
      return await viewAssignments(bot, chatId, 0, Assignment);
    }

    if (data.startsWith('assignments_page_')) {
      const page = parseInt(data.replace('assignments_page_', ''), 10);
      return await viewAssignments(bot, chatId, page, Assignment);
    }

    if (data === 'view_applications') {
      return await viewMyApplications(bot, chatId, userSessions, Assignment);
    }

    if (data === 'admin_view_all_applications') {
      return await adminViewAllApplications(bot, chatId, Assignment);
    }

    if (data === 'admin_manage_assignments') {
      return await adminManageAssignments(bot, chatId, Assignment);
    }

    // Profile editing handlers
    if (data === 'profile_edit') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }
    
      await safeSend(bot, chatId, "Here's your current profile:");

      const profileSummary = formatTutorProfileSummary(tutor);
      await safeSend(bot, chatId, profileSummary, { parse_mode: 'Markdown' });

      if (tutor.introduction) {
        await safeSend(bot, chatId, `*📝 Your Introduction:*\n\n${escapeMd(tutor.introduction)}`, { parse_mode: 'Markdown' });
      }

      if (tutor.teachingExperience) {
        await safeSend(bot, chatId, `*👨‍🏫 Your Teaching Experience:*\n\n${escapeMd(tutor.teachingExperience)}`, { parse_mode: 'Markdown' });
      }
      const keyboard = showProfileEditMenu();
      return await safeSend(bot, chatId, 'What would you like to edit?', {
        reply_markup: keyboard
      });
    }
    
    if (data === 'edit_personal_info') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }
    
      return await safeSend(bot, chatId, 'Edit Personal Information:', {
        reply_markup: getPersonalInfoMenu(tutor)
      });
    }
    if (data === 'edit_full_name') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_full_name',
        userId
      };
      return await safeSend(bot, chatId, '👤 Please enter your full name:');
    }
    
    if (data === 'edit_contact_number') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_contact_number',
        userId
      };
      return await safeSend(bot, chatId, '📱 Please enter your contact number:');
    }
    // Gender editing
    if (data === 'edit_gender_menu') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }
    
      return await safeSend(bot, chatId, 'Select your gender:', {
        reply_markup: getGenderMenu()
      });
    }
    
    if (data.startsWith('set_gender_')) {
      const gender = data.replace('set_gender_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }
    
      tutor.gender = gender.charAt(0).toUpperCase() + gender.slice(1);
      await tutor.save();
    
      return await safeSend(bot, chatId, `✅ Gender updated to *${tutor.gender}*`, {
        parse_mode: 'Markdown',
        reply_markup: getPersonalInfoMenu(tutor)
      });
    }
    
    // Race editing
    if (data === 'edit_race_menu') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }
    
      return await safeSend(bot, chatId, 'Select your race:', {
        reply_markup: getRaceMenu()
      });
    }
    
    if (data.startsWith('set_race_')) {
      const race = data.replace('set_race_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }
    
      tutor.race = race.charAt(0).toUpperCase() + race.slice(1);
      await tutor.save();
    
      return await safeSend(bot, chatId, `✅ Race updated to *${tutor.race}*`, {
        parse_mode: 'Markdown',
        reply_markup: getPersonalInfoMenu(tutor)
      });
    }

    // Education editing
    if (data === 'edit_education_menu') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Select your highest education level:', {
        reply_markup: getEducationMenu()
      });
    }

    if (data.startsWith('set_education_')) {
      const edu = data.replace('set_education_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      tutor.highestEducation = edu.charAt(0).toUpperCase() + edu.slice(1);
      await tutor.save();
      
      return await safeSend(bot, chatId, `✅ Education updated to *${tutor.highestEducation}*`, {
        parse_mode: 'Markdown',
        reply_markup: getPersonalInfoMenu(tutor)
      });
    }

    // Teaching levels editing
    if (data === 'edit_teaching_levels') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Select teaching levels:', {
        reply_markup: getTeachingLevelsMenu(tutor)
      });
    }

    // Locations editing
    if (data === 'edit_locations') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update your preferred teaching locations:', {
        reply_markup: getLocationsMenu(tutor)
      });
    }

    if (data.startsWith('toggle_location_')) {
      const key = data.replace('toggle_location_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      tutor.locations[key] = !tutor.locations[key];
      await tutor.save();
      
      return await safeSend(bot, chatId, '✅ Location updated.', {
        reply_markup: getLocationsMenu(tutor)
      });
    }

    // Availability editing
    if (data === 'edit_availability') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update your available time slots:', {
        reply_markup: getAvailabilityMenu(tutor)
      });
    }

    if (data.startsWith('toggle_availability_')) {
      const key = data.replace('toggle_availability_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      tutor.availableTimeSlots[key] = !tutor.availableTimeSlots[key];
      await tutor.save();
      
      return await safeSend(bot, chatId, '✅ Availability updated.', {
        reply_markup: getAvailabilityMenu(tutor)
      });
    }

    // Hourly rates editing
    if (data === 'edit_hourly_rates') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update your hourly rates:', {
        reply_markup: getHourlyRatesMenu(tutor)
      });
    }

    if (data.startsWith('edit_rate_')) {
      const key = data.replace('edit_rate_', '');
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: `awaiting_rate_${key}`,
        userId
      };
      return await safeSend(bot, chatId, `💰 Please enter your new hourly rate for ${key.charAt(0).toUpperCase() + key.slice(1)} level:`);
    }

    // Additional personal info editing
    if (data === 'edit_age') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_age',
        userId
      };
      return await safeSend(bot, chatId, '👤 Please enter your age:');
    }

    if (data === 'edit_nationality') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Select your nationality:', {
        reply_markup: getNationalityMenu()
      });
    }

    if (data.startsWith('set_nationality_')) {
      const nationality = data.replace('set_nationality_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      if (nationality === 'other') {
        userSessions[chatId] = {
          ...userSessions[chatId],
          state: 'awaiting_nationality_other',
          userId
        };
        return await safeSend(bot, chatId, '🌍 Please specify your nationality:');
      } else {
        tutor.nationality = nationality.charAt(0).toUpperCase() + nationality.slice(1);
        tutor.nationalityOther = null; // Clear other field if selecting predefined
        await tutor.save();

        return await safeSend(bot, chatId, `✅ Nationality updated to *${tutor.nationality}*`, {
          parse_mode: 'Markdown',
          reply_markup: getPersonalInfoMenu(tutor)
        });
      }
    }

    if (data === 'edit_nric') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_nric',
        userId
      };
      return await safeSend(bot, chatId, '🆔 Please enter the last 4 digits of your NRIC:');
    }

    if (data === 'edit_email') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_email',
        userId
      };
      return await safeSend(bot, chatId, '📧 Please enter your email address:');
    }

    if (data === 'edit_dob') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update your date of birth:', {
        reply_markup: getDOBMenu(tutor)
      });
    }

    if (data === 'edit_dob_day') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_dob_day',
        userId
      };
      return await safeSend(bot, chatId, '📅 Please enter the day (1-31):');
    }

    if (data === 'edit_dob_month') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_dob_month',
        userId
      };
      return await safeSend(bot, chatId, '📅 Please enter the month (1-12):');
    }

    if (data === 'edit_dob_year') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_dob_year',
        userId
      };
      return await safeSend(bot, chatId, '📅 Please enter the year (e.g., 1995):');
    }

    if (data === 'edit_introduction') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_introduction',
        userId
      };
      return await safeSend(bot, chatId, '📝 Please enter your introduction/bio:');
    }

    if (data === 'edit_teaching_experience') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_teaching_experience',
        userId
      };
      return await safeSend(bot, chatId, '👨‍🏫 Please describe your teaching experience:');
    }

    if (data === 'edit_track_record') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_track_record',
        userId
      };
      return await safeSend(bot, chatId, '🏆 Please describe your track record:');
    }

    if (data === 'edit_selling_points') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_selling_points',
        userId
      };
      return await safeSend(bot, chatId, '⭐ Please enter your key selling points:');
    }

    if (data === 'edit_years_experience') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_years_experience',
        userId
      };
      return await safeSend(bot, chatId, '📚 Please enter your years of tutoring experience:');
    }

    if (data === 'edit_tutor_type') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Select your tutor type:', {
        reply_markup: getTutorTypeMenu()
      });
    }

    if (data.startsWith('set_tutor_type_')) {
      const tutorType = data.replace('set_tutor_type_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      tutor.tutorType = tutorType.charAt(0).toUpperCase() + tutorType.slice(1);
      await tutor.save();

      return await safeSend(bot, chatId, `✅ Tutor type updated to *${tutor.tutorType}*`, {
        parse_mode: 'Markdown',
        reply_markup: getPersonalInfoMenu(tutor)
      });
    }

    if (data === 'edit_current_school') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_current_school',
        userId
      };
      return await safeSend(bot, chatId, '🏫 Please enter your current school:');
    }

    if (data === 'edit_previous_schools') {
      userSessions[chatId] = {
        ...userSessions[chatId],
        state: 'awaiting_previous_schools',
        userId
      };
      return await safeSend(bot, chatId, '🏫 Please enter your previous schools:');
    }

    if (data.startsWith('toggle_level_')) {
      const level = data.replace('toggle_level_', '');
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      // Initialize the level object if it doesn't exist
      if (!tutor.teachingLevels[level]) {
        tutor.teachingLevels[level] = {};
      }

      // Toggle the level - this would enable/disable the entire level
      const hasAnySubject = Object.values(tutor.teachingLevels[level]).some(val => val === true);
      
      // If any subject is enabled, disable all. If none enabled, enable common ones
      if (hasAnySubject) {
        Object.keys(tutor.teachingLevels[level]).forEach(subject => {
          tutor.teachingLevels[level][subject] = false;
        });
      } else {
        // Enable common subjects based on level
        const commonSubjects = {
          primary: ['english', 'math'],
          secondary: ['english', 'math'],
          jc: ['generalPaper', 'h2Math'],
          ib: ['ib']
        };
        
        commonSubjects[level]?.forEach(subject => {
          if (Object.prototype.hasOwnProperty.call(tutor.teachingLevels[level], subject)) {
            tutor.teachingLevels[level][subject] = true;
          }
        });
      }

      await tutor.save();
      
      return await safeSend(bot, chatId, `✅ ${level.charAt(0).toUpperCase() + level.slice(1)} level updated.`, {
        reply_markup: getTeachingLevelsMenu(tutor)
      });
    }

    // Subject editing handlers
    if (data === 'edit_preschool_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update Preschool subjects:', {
        reply_markup: getPreschoolSubjectsMenu(tutor)
      });
    }

    if (data === 'edit_primary_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update Primary level subjects:', {
        reply_markup: getPrimarySubjectsMenu(tutor)
      });
    }
    
    if (data === 'edit_secondary_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update Secondary level subjects:', {
        reply_markup: getSecondarySubjectsMenu(tutor)
      });
    }
    
    if (data === 'edit_jc_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update JC level subjects:', {
        reply_markup: getJCSubjectsMenu(tutor)
      });
    }
    
    if (data === 'edit_ib_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update IB subjects:', {
        reply_markup: getIBSubjectsMenu(tutor)
      });
    }
    if (data === 'edit_polytechnic_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update Polytechnic subjects:', {
        reply_markup: getPolytechnicSubjectsMenu(tutor)
      });
    }

    if (data === 'edit_university_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update University subjects:', {
        reply_markup: getUniversitySubjectsMenu(tutor)
      });
    }

    if (data === 'edit_music_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update Music subjects:', {
        reply_markup: getMusicSubjectsMenu(tutor)
      });
    }

    if (data === 'edit_professional_subjects') {
      const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
      if (!tutor) {
        return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
      }

      return await safeSend(bot, chatId, 'Update Professional Development subjects:', {
        reply_markup: getProfessionalSubjectsMenu(tutor)
      });
    }

    if (data.startsWith('edit_assignment_')) {
      const assignmentId = data.replace('edit_assignment_', '');
      return await editAssignment(bot, chatId, assignmentId, Assignment);
    }
    
    if (data.startsWith('toggle_status_')) {
      const assignmentId = data.replace('toggle_status_', '');
      return await toggleAssignmentStatus(bot, chatId, assignmentId, Assignment, CHANNEL_ID, BOT_USERNAME);
    }
    
    if (data.startsWith('delete_assignment_')) {
      const assignmentId = data.replace('delete_assignment_', '');
      // Add confirmation dialog
      return await safeSend(bot, chatId, '⚠️ Are you sure you want to delete this assignment? This action cannot be undone.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Yes, Delete', callback_data: `confirm_delete_${assignmentId}` }],
            [{ text: '❌ Cancel', callback_data: `edit_assignment_${assignmentId}` }]
          ]
        }
      });
    }
    
    if (data.startsWith('confirm_delete_')) {
      const assignmentId = data.replace('confirm_delete_', '');
      return await deleteAssignment(bot, chatId, assignmentId, Assignment);
    }
    
    if (data.startsWith('view_applications_')) {
      const assignmentId = data.replace('view_applications_', '');
      return await viewAssignmentApplications(bot, chatId, assignmentId, Assignment);
    }

    // Subject toggle handlers
    // Must list every category getTeachingLevelsMenu offers a submenu for — a missing one
    // sends its toggles to the "not implemented" fallback below.
    const toggleCategories = ['preschool', 'primary', 'secondary', 'jc', 'ib', 'polytechnic', 'university', 'music', 'professional'];
    for (const cat of toggleCategories) {
      if (data.startsWith(`toggle_${cat}_`)) {
        const key = data.replace(`toggle_${cat}_`, '');
        const tutor = await getTutorFromSession(chatId, userSessions, Tutor);
        if (!tutor) {
          return await safeSend(bot, chatId, '❌ We couldn\'t find your profile. Please type /start and share your contact number again.');
        }

        tutor.teachingLevels[cat][key] = !tutor.teachingLevels[cat][key];
        await tutor.save();

        const menuFn = {
          preschool: getPreschoolSubjectsMenu,
          primary: getPrimarySubjectsMenu,
          secondary: getSecondarySubjectsMenu,
          jc: getJCSubjectsMenu,
          ib: getIBSubjectsMenu,
          polytechnic: getPolytechnicSubjectsMenu,
          university: getUniversitySubjectsMenu,
          music: getMusicSubjectsMenu,
          professional: getProfessionalSubjectsMenu
        }[cat];

        return await safeSend(bot, chatId, `✅ ${cat.charAt(0).toUpperCase() + cat.slice(1)} subject updated.`, {
          reply_markup: menuFn(tutor)
        });
      }
    }

    // Default handler for unimplemented actions
    return await safeSend(bot, chatId, '❓ This action is not yet implemented.');
    
  } catch (error) {
    console.error('❌ Error in handleCallbackQuery:', error);
    return await safeSend(bot, chatId, 'An error occurred. Please try again.');
  } finally {
    // Clear the button's spinner for every branch that didn't answer with a toast of its own.
    await ack();
  }
}

async function handleMessage(bot, chatId, userId, text, message, Tutor, Assignment, userSessions, ADMIN_USERS, BOT_USERNAME) {
  // Initialize session using chatId for consistency
  if (!userSessions[chatId]) {
    userSessions[chatId] = { state: ApplicationStates.IDLE };
  }

  const session = userSessions[chatId];
  // Every branch below reads state as a string (including session.state.startsWith), and this
  // function isn't wrapped in a try/catch — a session left without one would throw straight out
  // to the webhook as a 500, which Telegram then retries. Normalise once, here.
  if (typeof session.state !== 'string') {
    session.state = ApplicationStates.IDLE;
  }
  const isUserAdmin = isAdmin(userId, ADMIN_USERS);

  // Handle non-text messages first
  if (!text || typeof text !== 'string') {
    // Handle contact sharing - delegate to your existing handleContact function
    if (message.contact) {
      return await handleContact(bot, chatId, userId, message.contact, Tutor, userSessions, ADMIN_USERS, Assignment);
    }
    
    // For other non-text messages, show main menu or prompt for contact if needed
    if (session.state === ApplicationStates.AWAITING_CONTACT) {
      return await safeSend(bot, chatId, '👋 Please share your contact number using the button below to continue.', {
        reply_markup: {
          keyboard: [[{
            text: '📞 Share Contact Number',
            request_contact: true
          }]],
          one_time_keyboard: true,
          resize_keyboard: true
        }
      });
    }
    
    // For users without proper setup, redirect to start
    if (!session.tutorId) {
      return await handleStart(bot, chatId, userId, Tutor, userSessions, null);
    }
    
    // Show main menu for established users
    await showMainMenu(chatId, bot, userId, ADMIN_USERS);
    return;
  }

  // Owner replying (via Telegram's reply) to a forwarded tutor WhatsApp message → relay it
  // straight back to that tutor. The tutor's number is embedded as "(wa:<digits>)" in the
  // forwarded text (see whatsapp-webhook.js), so no stored mapping is needed. Free-form text
  // works here because the tutor just messaged us — the 24h window is open.
  if (isUserAdmin && message.reply_to_message?.text && !text.startsWith('/')) {
    const waMatch = message.reply_to_message.text.match(/\(wa:(\d+)\)/);
    if (waMatch) {
      try {
        await sendWhatsApp(waMatch[1], text);
        // Name the recipient so a mis-swipe to the wrong forwarded message is caught here,
        // right after sending — not after the fact. Best-effort: getTutorNameByNumber never
        // throws (falls back to the bare number if the tutor isn't found or the lookup fails).
        const name = await getTutorNameByNumber(waMatch[1]);
        const who = name ? `${name} (${waMatch[1]})` : waMatch[1];
        await safeSend(bot, chatId, `✅ Sent to ${who}.`);
      } catch (err) {
        console.error('Failed to relay owner reply to tutor:', err.message);
        await safeSend(bot, chatId, `❌ Couldn't send — the tutor's 24h reply window may have closed.\n(${err.message})`);
      }
      return;
    }
  }

  // Handle /start command - delegate to your existing handleStart function
  if (text === '/start' || text.startsWith('/start ')) {
    const startParam = text.includes(' ') ? text.split(' ')[1] : null;
    return await handleStart(bot, chatId, userId, Tutor, userSessions, startParam);
  }

  // Owner is typing the parent's stated reason a day-30 placement ended (Phase 5), captured after
  // an "It ended" tap set session.endReason. Placed before the tutorId gate below because the owner
  // isn't necessarily a registered tutor. /skip abandons the capture; the ended outcome is already
  // saved either way, so this only attaches the verbatim reason.
  if (isUserAdmin && session.state === 'awaiting_end_reason' && session.endReason) {
    const { placementId, checkInId } = session.endReason;
    session.state = 'idle';
    session.endReason = undefined;
    if (text.trim() === '/skip') {
      return await safeSend(bot, chatId, '👍 No reason saved. The placement is still logged as ended.');
    }
    if (!checkInId) {
      return await safeSend(bot, chatId, '⚠️ Couldn\'t link that reason to the check-in, but the placement is logged as ended.');
    }
    const result = await recordCheckInEndReason({ placementId, checkInId, reason: text });
    if (!result.ok) {
      return await safeSend(bot, chatId, '⚠️ Couldn\'t save the reason, but the placement is logged as ended.');
    }
    return await safeSend(bot, chatId, '✅ Saved the reason. Thanks!');
  }

  // Check if user is in awaiting_contact state
  if (session.state === ApplicationStates.AWAITING_CONTACT) {
    return await safeSend(bot, chatId, '👋 Please share your contact number using the button below to continue.', {
      reply_markup: {
        keyboard: [[{
          text: '📞 Share Contact Number',
          request_contact: true
        }]],
        one_time_keyboard: true,
        resize_keyboard: true
      }
    });
  }

  // For users without proper setup, redirect to start
  if (!session.tutorId) {
    return await handleStart(bot, chatId, userId, Tutor, userSessions, null);
  }

  // Handle assignment creation flow
  if (session.state === ApplicationStates.CREATING_ASSIGNMENT) {
    return await handleAssignmentStep(bot, chatId, text, userSessions, Assignment);
  }

  if (session.state === ApplicationStates.EDITING_BIO) {
    return await handleProfileFieldEdit(bot, chatId, text, userSessions, Tutor, 'bio', '✅ Bio updated successfully!');
  }

  if (session.state === ApplicationStates.EDITING_EXPERIENCE) {
    return await handleProfileFieldEdit(bot, chatId, text, userSessions, Tutor, 'teachingExperience', '✅ Experience updated successfully!');
  }

  if (session.state === ApplicationStates.EDITING_QUALIFICATIONS) {
    return await handleProfileFieldEdit(bot, chatId, text, userSessions, Tutor, 'qualifications', '✅ Qualifications updated successfully!');
  }

  // Add handler for rate input state
  if (session.state === ApplicationStates.AWAITING_RATE) {
    return await handleRateInput(bot, chatId, text, userSessions, Assignment, Tutor);
  }

  if (session.state === 'awaiting_age') {
    return await handleAgeEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Full name editing
  if (session.state === 'awaiting_full_name') {
    return await handleFullNameEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Contact number editing
  if (session.state === 'awaiting_contact_number') {
    return await handleContactNumberEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // NRIC editing
  if (session.state === 'awaiting_nric') {
    return await handleNRICEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Email editing
  if (session.state === 'awaiting_email') {
    return await handleEmailEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // DOB editing
  if (session.state === 'awaiting_dob_day') {
    return await handleDOBDayEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  if (session.state === 'awaiting_dob_month') {
    return await handleDOBMonthEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  if (session.state === 'awaiting_dob_year') {
    return await handleDOBYearEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Introduction editing
  if (session.state === 'awaiting_introduction') {
    return await handleIntroductionEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Teaching experience editing
  if (session.state === 'awaiting_teaching_experience') {
    return await handleTeachingExperienceEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Track record editing
  if (session.state === 'awaiting_track_record') {
    return await handleTrackRecordEdit(bot, chatId, text, userSessions, Tutor);
  }

  // Years experience editing
  if (session.state === 'awaiting_years_experience') {
    return await handleYearsExperienceEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Current school editing
  if (session.state === 'awaiting_current_school') {
    return await handleCurrentSchoolEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Previous schools editing
  if (session.state === 'awaiting_previous_schools') {
    return await handlePreviousSchoolsEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Nationality other editing
  if (session.state === 'awaiting_nationality_other') {
    return await handleNationalityOtherEdit(bot, chatId, text, userSessions, Tutor);
  }
  
  // Hourly rate editing for specific levels
  if (session.state.startsWith('awaiting_rate_')) {
    const level = session.state.replace('awaiting_rate_', '');
    return await handleSpecificRateEdit(bot, chatId, text, level, userSessions, Tutor);
  }

  // A bare number answering the rate prompt we sent after their ✅ (or after a rate-decline).
  // Deliberately LAST of the text handlers: every in-session flow above is a question the bot
  // just asked in this conversation, so it owns the reply — a tutor typing "45" at the age
  // prompt means 45 years old, not $45/hr. The outreach ask has no session by design (its state
  // lives in Mongo so it survives cold starts), which is exactly why it must yield to the
  // explicit ones rather than race them. Unlike the WhatsApp webhook, where no sessions exist
  // and the rate parser therefore runs FIRST.
  if (session.tutorId) {
    const rateResult = await recordQuotedRate({ tutorId: session.tutorId, text });
    if (rateResult.matched) {
      return await safeSend(bot, chatId,
        `👍 Noted — $${rateResult.rate}/hr for *${escapeMd(rateResult.assignmentTitle)}*.` +
        (rateResult.declined
          ? "\n\nWe'll let you know if the parent can stretch to that."
          : "\n\nWe'll be in touch shortly!"),
        { parse_mode: 'Markdown' });
    }
  }

  // Default response - show main menu
  await safeSend(bot, chatId, 'I didn\'t understand that command. Here\'s the main menu:');
  return await showMainMenu(chatId, bot, userId, ADMIN_USERS);
}

// Admin manage assignments
async function adminManageAssignments(bot, chatId, Assignment) {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).limit(10);
    
    if (!assignments || assignments.length === 0) {
      await safeSend(bot, chatId, '📋 No assignments found.', {
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Back to Admin Panel', callback_data: 'admin_panel' }]]
        }
      });
      return;
    }
    
    let message = `📋 *Manage Assignments*\n\n`;
    const buttons = [];
    
    assignments.forEach((assignment, index) => {
      message += `*${index + 1}. ${escapeMd(assignment.title) || 'Assignment'}*\n`;
      message += `📚 ${escapeMd(assignment.level)} - ${escapeMd(assignment.subject)}\n`;
      message += `🔄 Status: ${assignment.status}\n`;
      message += `👥 Applications: ${assignment.applicants ? assignment.applicants.length : 0}\n\n`;
      
      buttons.push([{ text: `✏️ Edit Assignment ${index + 1}`, callback_data: `edit_assignment_${assignment._id}` }]);
    });
    
    buttons.push([{ text: '🔙 Back to Admin Panel', callback_data: 'admin_panel' }]);
    
    await safeSend(bot, chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
    
  } catch (error) {
    console.error('Error managing assignments:', error);
    await safeSend(bot, chatId, '❌ An error occurred while loading assignments. Please try again.');
  }
}

async function editAssignment(bot, chatId, assignmentId, Assignment) {
  try {
    const assignment = await Assignment.findById(assignmentId).populate('matchedTutorId', 'fullName');
    
    if (!assignment) {
      await safeSend(bot, chatId, '❌ Assignment not found.', {
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Back to Manage Assignments', callback_data: 'admin_manage_assignments' }]]
        }
      });
      return;
    }
    
    let message = `✏️ *Edit Assignment*\n\n`;
    message += `*Title:* ${escapeMd(assignment.title) || 'Assignment'}\n`;
    message += `*Level:* ${escapeMd(assignment.level)}\n`;
    message += `*Subject:* ${escapeMd(assignment.subject)}\n`;
    message += `*Current Status:* ${assignment.status}\n`;
    message += `*Applications:* ${assignment.applicants ? assignment.applicants.length : 0}\n`;
    if (assignment.outreach?.status) {
      message += `*Outreach:* ${assignment.outreach.status} · ${assignment.interestedCount()} interested\n`;
    }
    if (assignment.status === 'Filled' && assignment.matchedTutorId) {
      message += `*Matched tutor:* ${escapeMd(assignment.matchedTutorId.fullName) || 'selected'}\n`;
    }
    message += `\nWhat would you like to do?`;

    const isFilled = assignment.status === 'Filled';
    // Once outreach has stopped (target hit or pool exhausted), let the owner resume it if the
    // parent passed on the tutors we relayed — one tap excludes them and messages fresh tutors.
    const outreachStopped = ['Fulfilled', 'Exhausted'].includes(assignment.outreach?.status);
    const buttons = [
      [{ text: assignment.status === 'Open' ? '🔒 Close Assignment' : '🔓 Open Assignment',
         callback_data: `toggle_status_${assignmentId}` }]
    ];
    // Parent picked one of the interested tutors → capture the winner and mark the assignment Filled.
    if (!isFilled && assignment.interestedCount() > 0) {
      buttons.push([{ text: '✅ Parent chose a tutor — mark filled', callback_data: `markfilled_${assignmentId}` }]);
    }
    if (outreachStopped && !isFilled) {
      buttons.push([{ text: '🔄 Parent passed — find more tutors', callback_data: `findmore_${assignmentId}` }]);
    }
    buttons.push(
      [{ text: '🗑️ Delete Assignment', callback_data: `delete_assignment_${assignmentId}` }],
      [{ text: '👥 View Applications', callback_data: `view_applications_${assignmentId}` }],
      [{ text: '🔙 Back to Manage Assignments', callback_data: 'admin_manage_assignments' }]
    );
    
    await safeSend(bot, chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
    
  } catch (error) {
    console.error('Error editing assignment:', error);
    await safeSend(bot, chatId, '❌ An error occurred while loading assignment details. Please try again.');
  }
}

// Function to toggle assignment status
async function toggleAssignmentStatus(bot, chatId, assignmentId, Assignment, channelId, botUsername) {
  try {
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      await safeSend(bot, chatId, '❌ Assignment not found.');
      return;
    }
    
    const newStatus = assignment.status === 'Open' ? 'Closed' : 'Open';
    
    // Update database with the new status
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId, 
      { status: newStatus }, 
      { new: true }
    );
    
    // Update channel message if channelMessageId exists
    let channelUpdateSuccess = false;
    if (assignment.channelMessageId && channelId) {
      try {
        const updatedMessage = formatAssignmentForChannel(updatedAssignment);
        
        await bot.editMessageText(updatedMessage, {
          chat_id: channelId,
          message_id: assignment.channelMessageId,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: newStatus === 'Open' ? [[
              { text: '📝 Apply for this Assignment', url: `https://t.me/${botUsername}?start=apply_${assignment._id}` }
            ]] : [[
              { text: '🔒 Assignment Closed', callback_data: 'assignment_closed' }
            ]]
          }
        });
        
        channelUpdateSuccess = true;
        console.log(`✅ Updated channel message for assignment ${assignmentId}`);
      } catch (editError) {
        console.error('❌ Failed to update channel message:', editError);
        // Continue even if channel update fails (message might be >48hrs old or bot lacks permissions)
      }
    }
    
    const statusEmoji = newStatus === 'Open' ? '🔓' : '🔒';
    const channelUpdateMsg = channelUpdateSuccess ? '\n📢 Channel message updated' : 
                            (assignment.channelMessageId ? '\n⚠️ Channel message update failed (may be too old)' : '');
    
    await safeSend(bot, chatId, `${statusEmoji} Assignment status changed to *${newStatus}*${channelUpdateMsg}`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✏️ Edit Again', callback_data: `edit_assignment_${assignmentId}` }],
          [{ text: '🔙 Back to Manage Assignments', callback_data: 'admin_manage_assignments' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Error toggling assignment status:', error);
    await safeSend(bot, chatId, '❌ An error occurred while updating assignment status. Please try again.');
  }
}

// Function to delete assignment
async function deleteAssignment(bot, chatId, assignmentId, Assignment) {
  try {
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      await safeSend(bot, chatId, '❌ Assignment not found.');
      return;
    }
    
    await Assignment.findByIdAndDelete(assignmentId);
    
    await safeSend(bot, chatId, `🗑️ Assignment "*${escapeMd(assignment.title) || 'Assignment'}*" has been deleted.`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Back to Manage Assignments', callback_data: 'admin_manage_assignments' }]]
      }
    });
    
  } catch (error) {
    console.error('Error deleting assignment:', error);
    await safeSend(bot, chatId, '❌ An error occurred while deleting assignment. Please try again.');
  }
}

// Function to view applications for an assignment
async function viewAssignmentApplications(bot, chatId, assignmentId, Assignment) {
  try {
    // Applicants carry tutorId — there is no userId/proposedRate on the schema, and populating
    // a path that isn't there is a hard StrictPopulateError in Mongoose 8.
    const assignment = await Assignment.findById(assignmentId).populate('applicants.tutorId', 'fullName contactNumber');

    if (!assignment) {
      await safeSend(bot, chatId, '❌ Assignment not found.');
      return;
    }

    if (!assignment.applicants || assignment.applicants.length === 0) {
      await safeSend(bot, chatId, `📋 No applications found for "*${escapeMd(assignment.title) || 'Assignment'}*"`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Back to Edit Assignment', callback_data: `edit_assignment_${assignmentId}` }]]
        }
      });
      return;
    }

    let message = `👥 *Applications for: ${escapeMd(assignment.title) || 'Assignment'}*\n\n`;

    assignment.applicants.forEach((applicant, index) => {
      // populate leaves tutorId null when the tutor doc is gone; contactDetails was snapshotted
      // at apply time, so it still identifies them.
      const tutor = applicant.tutorId;
      const name = tutor?.fullName || 'Unknown tutor';
      const contact = tutor?.contactNumber || applicant.contactDetails;
      message += `*${index + 1}. ${escapeMd(name)}*\n`;
      if (contact) message += `📱 ${escapeMd(contact)}\n`;
      message += `📅 Applied: ${applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString('en-SG') : 'Unknown'}\n`;
      message += `💰 Rate: ${applicant.rate ? `$${escapeMd(applicant.rate)}/hr` : 'Not given'}\n`;
      message += `🔄 Status: ${applicant.status || 'Pending'}\n\n`;
    });
    
    await safeSend(bot, chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Back to Edit Assignment', callback_data: `edit_assignment_${assignmentId}` }]]
      }
    });
    
  } catch (error) {
    console.error('Error viewing assignment applications:', error);
    await safeSend(bot, chatId, '❌ An error occurred while loading applications. Please try again.');
  }
}

// Export all functions (ES modules)
export {
  // Constants
  ApplicationStates,
  
  // Utility functions
  handleCallbackQuery,
  handleMessage,
  parseNaturalDate,
  initializeTeachingLevels,
  initializeAvailability,
  initializeLocations,
  getTick,
  
  // Format functions
  formatTutorProfileSummary,
  formatAssignment,
  formatAssignmentForChannel,
  
  // Menu functions
  showProfileEditMenu,
  getPersonalInfoMenu,
  getTeachingLevelsMenu,
  getLocationsMenu,
  getAvailabilityMenu,
  getPreschoolSubjectsMenu,
  getPrimarySubjectsMenu,
  getSecondarySubjectsMenu,
  getJCSubjectsMenu,
  getIBSubjectsMenu,
  getMusicSubjectsMenu,
  getPolytechnicSubjectsMenu,
  getUniversitySubjectsMenu,
  getProfessionalSubjectsMenu,
  getGenderMenu,
  getRaceMenu,
  getEducationMenu,
  getNationalityMenu,
  getDOBMenu,
  getHourlyRatesMenu,
  getTutorTypeMenu,
  editAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  viewAssignmentApplications,
  
  // Core handler functions
  safeSend,
  isAdmin,
  handleStart,
  handleContact,
  showMainMenu,
  showAdminPanel,
  startAssignmentCreation,
  handleAssignmentStep,
  handleAssignmentCallbackQuery,
  postAssignmentToChannel,
  handleApplication,
  handleStartParameter,
  viewAssignments,
  viewMyApplications,
  adminViewAllApplications,
  adminManageAssignments,
  confirmPostAssignment,
  handleRateInput,
  
  // Constants
  ITEMS_PER_PAGE
};