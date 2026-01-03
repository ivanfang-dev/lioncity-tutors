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
  
  // Status
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Filled', 'Closed'],
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

// Static methods
assignmentSchema.statics.getSubjectsForLevel = function(level) {
  return getSubjectsForLevel(level);
};

assignmentSchema.statics.isValidCombination = function(level, subject) {
  return isValidLevelSubjectCombination(level, subject);
};

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

export default Assignment;