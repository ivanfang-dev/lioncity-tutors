import mongoose from 'mongoose';
import {
  EDUCATION_LEVELS,
  SUBJECTS,
  isValidLevelSubjectCombination,
  getSubjectsForLevel
} from '../client-exports.js';

// Define Assignment Schema
const assignmentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Academic Information
  level: {
    type: String,
    required: true,
    enum: EDUCATION_LEVELS
  },
  subject: {
    type: String,
    required: true,
    enum: SUBJECTS
  },
  
  // Location and Schedule
  location: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: false
  },
  
  // Rate Information
  rate: {
    type: String,
    required: true,
    trim: true
  },
  
  // Requirements
  requirements: {
    type: String,
    trim: true
  },

  // Parent's WhatsApp contact — captured at creation so interested tutors' profiles can
  // be relayed to the parent. Optional: blank means the relay feature is unavailable for
  // this assignment (the owner can still handle it manually).
  parentContact: {
    type: String,
    trim: true
  },

  // Preferred Tutor Types
  preferredTutorTypes: [{
    type: String,
    enum: ['Part-time', 'Full-time', 'MOE/Ex-MOE']
  }],

  // Preferred lesson timing — mirrors the tutor's availableTimeSlots so the two can be
  // matched directly. All false / absent = no timing requirement.
  preferredTimeSlots: {
    weekdayMorning: { type: Boolean, default: false },
    weekdayAfternoon: { type: Boolean, default: false },
    weekdayEvening: { type: Boolean, default: false },
    weekendMorning: { type: Boolean, default: false },
    weekendAfternoon: { type: Boolean, default: false },
    weekendEvening: { type: Boolean, default: false }
  },

  // Preferred tutor gender. 'No preference' = no gender filter.
  preferredGender: {
    type: String,
    enum: ['Male', 'Female', 'No preference'],
    default: 'No preference'
  },

  // Status
  status: {
    type: String,
    enum: ['Draft', 'Open', 'In Progress', 'Filled', 'Closed'],
    default: 'Open'
  },
  
  // Applications
  applicants: [{
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    contactDetails: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    rate: {
      type: String,
      required: false,
      trim: true
    }
  }],

  // --- Tutor outreach / escalation state ---
  // Tracks the wave-based WhatsApp contacting process, separate from `applicants`
  // (formal Telegram applications). Driven by the escalation scheduler so it survives
  // restarts — never kept in process memory.
  outreach: {
    // Pending   → Open assignment, first wave not sent yet (scheduler will pick it up)
    // Active    → waves going out, waiting on replies
    // Fulfilled → reached the interested-tutor target; stop sending new waves
    // Exhausted → ran out of pool / hit the time cap with too few replies (owner alerted)
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Fulfilled', 'Exhausted'],
      default: 'Pending'
    },
    waveCount: { type: Number, default: 0 },
    startedAt: { type: Date },
    lastWaveAt: { type: Date },
    contacts: [{
      tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
      phone: { type: String },
      tutorName: { type: String },
      wave: { type: Number },
      sentAt: { type: Date, default: Date.now },
      // Sent       → message delivered, no reply yet
      // Interested → tutor replied Yes
      // Declined   → tutor replied No
      status: {
        type: String,
        enum: ['Sent', 'Interested', 'Declined'],
        default: 'Sent'
      },
      respondedAt: { type: Date }
    }]
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  channelMessageId: {
    type: Number
  }
});

// Add custom validation for level-subject combination
assignmentSchema.pre('save', function(next) {
  // Update timestamp
  this.updatedAt = new Date();
  
  // Validate level-subject combination
  if (!isValidLevelSubjectCombination(this.level, this.subject)) {
    const error = new Error(`Subject "${this.subject}" is not available for education level "${this.level}"`);
    error.name = 'ValidationError';
    return next(error);
  }
  
  next();
});

// Add validation for updates too
assignmentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.level && update.$set.subject) {
    if (!isValidLevelSubjectCombination(update.$set.level, update.$set.subject)) {
      const error = new Error(`Subject "${update.$set.subject}" is not available for education level "${update.$set.level}"`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Add indexes for better performance
assignmentSchema.index({ level: 1, subject: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ createdAt: -1 });
// Lets the escalation scheduler cheaply find assignments due for their next wave.
assignmentSchema.index({ status: 1, 'outreach.status': 1, 'outreach.lastWaveAt': 1 });

// --- Outreach helpers (used by the escalation scheduler) ---

// How many tutors have replied "Yes" so far — the count we stop new waves at.
assignmentSchema.methods.interestedCount = function() {
  return (this.outreach?.contacts || []).filter(c => c.status === 'Interested').length;
};

// Tutor ids already messaged, so the next wave only pulls fresh tutors.
assignmentSchema.methods.contactedTutorIds = function() {
  return (this.outreach?.contacts || [])
    .map(c => c.tutorId?.toString())
    .filter(Boolean);
};

// Static methods
assignmentSchema.statics.getSubjectsForLevel = function(level) {
  return getSubjectsForLevel(level);
};

assignmentSchema.statics.isValidCombination = function(level, subject) {
  return isValidLevelSubjectCombination(level, subject);
};

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

export default Assignment;