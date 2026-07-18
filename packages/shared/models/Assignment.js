import mongoose from 'mongoose';
import {
  EDUCATION_LEVELS,
  SUBJECTS,
  isValidLevelSubjectCombination,
  getSubjectsForLevel
} from '../client-exports.js';
import { deriveBudgetNumeric } from '../utils/numericRates.js';

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

  // Numeric mirror of `rate` (roadmap Phase 7): the spending CEILING per tutor-type band, derived
  // from the free-text rate at creation (deriveBudgetNumeric) so matching reads numbers instead of
  // regex-parsing text every query. Matching prefers this when present, falls back to parsing `rate`
  // for legacy assignments (which are never re-saved). Any band may be absent.
  budgetNumeric: {
    partTime: { type: Number },
    fullTime: { type: Number },
    moe: { type: Number },
    default: { type: Number },
  },

  // Postal district (roadmap Phase 7): data collection for later travel-time scoring, NOT a matching
  // filter yet (matching stays region-based). Captured on new intake; legacy assignments stay blank.
  postalDistrict: {
    type: String,
    trim: true,
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

  // Extra tutor-regions to match beyond the one implied by `location` — set by the ops console's
  // "widen to adjacent regions and retry" recovery (roadmap deferred item). Absent/empty = match the
  // single base region as before. The matcher ORs these into the region filter (buildFilterStages).
  matchRegions: [{ type: String }],

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
    // Holding   → hit the interested-tutor target; no new waves, but still collecting late
    //             yeses until `holdUntil`, when the tick re-ranks and picks the best 3
    // Fulfilled → shortlist chosen (top 3 ranked); stop sending, relay to parent
    // Exhausted → ran out of pool / hit the time cap with too few replies (owner alerted)
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Holding', 'Fulfilled', 'Exhausted'],
      default: 'Pending'
    },
    waveCount: { type: Number, default: 0 },
    startedAt: { type: Date },
    lastWaveAt: { type: Date },
    // While status is 'Holding', the moment the escalation tick may release the shortlist
    // (re-rank the interested pool and pick the best 3). Set when the target is first
    // reached; set to now for an early release once the pool is comfortably over target.
    holdUntil: { type: Date },
    // When the ranked shortlist alert (drafted parent message + outcome buttons) was handed
    // to the owner. Starts the parent-silence clock: no pick/reject within 24h → owner nudge,
    // 48h → flagged for the exception queue (Phase 2 silence follow-up).
    shortlistReleasedAt: { type: Date },
    // Gate the 24h silence nudge to once (the tick would otherwise re-ping every run).
    parentNudgedAt: { type: Date },
    // Set at 48h of parent silence — flagged for the ops exception queue (Phase 3); stops
    // further nagging. Presence = "needs manual follow-up".
    parentSilenceEscalatedAt: { type: Date },
    contacts: [{
      tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
      phone: { type: String },
      tutorName: { type: String },
      wave: { type: Number },
      // Which channel we reached this tutor on. Telegram DMs are free, so outreach prefers
      // them when the tutor has a linked telegramId and falls back to a WhatsApp template
      // otherwise (or when the DM fails). Defaults to 'whatsapp' so pre-existing rows — all
      // sent before Telegram routing existed — read correctly and reply-matching stays right.
      channel: { type: String, enum: ['whatsapp', 'telegram'], default: 'whatsapp' },
      sentAt: { type: Date, default: Date.now },
      // Sent       → message delivered, no reply yet
      // Interested → tutor replied Yes
      // Declined   → tutor replied No
      status: {
        type: String,
        enum: ['Sent', 'Interested', 'Declined'],
        default: 'Sent'
      },
      respondedAt: { type: Date },
      // Set when this interested tutor's profile has been relayed to the parent, so a
      // repeat "Send all" tap only forwards tutors who said Yes since the last send.
      relayedToParentAt: { type: Date },
      // The tutor's 1-based position in the released shortlist (1 = best fit). Stamped on
      // the top-N interested contacts when the hold window releases (escalation-tick),
      // scored by quality WITHOUT the responsiveness penalty (they already replied). Absent
      // means "not shortlisted" — either a backup for when the parent rejects, or a legacy
      // assignment that filled before the shortlist re-rank existed.
      shortlistRank: { type: Number },
      // Set when the parent PICKED this tutor — the winning contact of the shortlist. Paired
      // with the assignment's matchedTutorId/filledAt and a Placement doc (Phase 2).
      parentPickedAt: { type: Date },
      // Set when the parent has passed on this tutor ("find more tutors"). Such a contact
      // no longer counts toward the interested target (see viableInterestedCount), so a
      // resumed outreach keeps sending until fresh tutors say Yes. Still in contactedTutorIds,
      // so this tutor is never re-messaged.
      parentRejectedAt: { type: Date },
      // Why the parent passed on the shortlist, captured on a "Rejected all → reason" tap.
      // Feeds shortlist-presentation and pricing analysis (Phase 8). Set alongside parentRejectedAt.
      parentRejectReason: { type: String, enum: ['rate', 'profiles', 'timing', 'other'] },
      // How many reminder pings this contact has received. Only non-responders (status
      // 'Sent') are ever reminded, and only when no fresh tutors are left to try; capped
      // by OUTREACH_MAX_REMINDERS so a quiet tutor isn't nagged indefinitely.
      reminderCount: { type: Number, default: 0 },
      // How long the tutor took to reply (respondedAt − sentAt, whole minutes). Absent on
      // legacy contacts and on anyone who never replied. Feeds Phase 7's medianResponseMins.
      responseLatencyMins: { type: Number },
      // Why the tutor said no, captured on a reason button/list tap right after the ❌.
      // Best-effort — the Declined status is already recorded whether or not they answer.
      // 'inactive' additionally sets tutor.pausedAt, excluding them from future matching.
      declineReason: { type: String, enum: ['rate', 'distance', 'schedule', 'inactive', 'other'] },
      // The rate this tutor named FOR THIS ASSIGNMENT, at reply time. Not a "counter-offer":
      // every yes is asked for one, because profile rates go stale and posted rates are often
      // ranges ("$40-60/hr") that a bare Yes doesn't resolve. Also captured on a rate-decline
      // (contact stays Declined but we learn how far off the budget was — Phase 8). Absent =
      // the tutor never answered the prompt; the shortlist falls back to their profile rate,
      // flagged unconfirmed. Interest is the signal, this is enrichment — never a gate.
      quotedRate: { type: Number },
      // Set when we asked this contact for their rate; cleared once quotedRate lands. This is
      // the PERSISTED state that matches an inbound bare number ("45") back to the assignment
      // it answers. It deliberately does not live in the in-memory userSessions map: Vercel
      // cold-starts between the prompt and the reply would drop it, and WhatsApp has no
      // session concept at all. See docs/superpowers/specs/2026-07-16-tutor-rate-capture-design.md.
      rateRequestedAt: { type: Date }
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
  },
  // Set when the parent picks a tutor: the assignment is marked 'Filled', outreach stops, and
  // we record who won (and when) so the owner can see the outcome later.
  matchedTutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
  filledAt: { type: Date }
});

// Add custom validation for level-subject combination
assignmentSchema.pre('save', function(next) {
  // Update timestamp
  this.updatedAt = new Date();

  // Derive budgetNumeric from the free-text rate (roadmap Phase 7) so matching reads numbers instead
  // of re-parsing text. On the creation flow (Telegram draft → post, both .save()) this populates it
  // at creation; recomputed whenever `rate` changes. Legacy assignments are only ever touched via
  // updateOne (which skips this hook), so they never re-validate and simply stay without it.
  if (this.isNew || this.isModified('rate')) {
    this.budgetNumeric = deriveBudgetNumeric(this.rate);
  }

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

// How many tutors have replied "Yes" so far (regardless of parent rejection).
assignmentSchema.methods.interestedCount = function() {
  return (this.outreach?.contacts || []).filter(c => c.status === 'Interested').length;
};

// Interested tutors the parent hasn't rejected — the count that gates new waves. Once a
// "find more" resume marks an earlier shortlist as rejected, those tutors stop counting so
// outreach keeps going until fresh tutors say Yes. Equals interestedCount() until the first
// rejection, so the normal path is unchanged.
assignmentSchema.methods.viableInterestedCount = function() {
  return (this.outreach?.contacts || [])
    .filter(c => c.status === 'Interested' && !c.parentRejectedAt).length;
};

// Tutor ids already messaged, so the next wave only pulls fresh tutors.
assignmentSchema.methods.contactedTutorIds = function() {
  return (this.outreach?.contacts || [])
    .map(c => c.tutorId?.toString())
    .filter(Boolean);
};

// Tutor ids that said "Yes" but haven't been relayed to the parent yet — the set a
// "Send all" tap should forward, ordered best-first. Lets the owner send a first tutor
// immediately and tap again later for newcomers without re-sending anyone.
//
// Once the hold window has released a ranked shortlist, relay ONLY the top 3 (contacts
// with shortlistRank set), best-first — the non-shortlisted interested tutors stay
// recorded as backups for a parent rejection and must not leak into the parent's message.
// Before any shortlist exists (legacy assignments filling mid-flight, or a resume that
// hasn't re-ranked yet) fall back to every interested-but-unsent contact, as before.
assignmentSchema.methods.pendingParentTutorIds = function() {
  const contacts = this.outreach?.contacts || [];
  const hasShortlist = contacts.some(c => c.shortlistRank != null);
  const pending = contacts.filter(c => c.status === 'Interested' && !c.relayedToParentAt);
  const pool = hasShortlist ? pending.filter(c => c.shortlistRank != null) : pending;
  return pool
    .sort((a, b) => (a.shortlistRank ?? Infinity) - (b.shortlistRank ?? Infinity))
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