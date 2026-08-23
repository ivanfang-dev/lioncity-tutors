import mongoose from 'mongoose';

// A decision-time snapshot of what the ranking system knew and chose (roadmap Phase 6). One doc is
// written each time we pick tutors to contact — wave 1, an escalation wave, or the shortlist release
// — recording the candidate set, their scores, the component breakdown behind each score, and which
// of them we actually contacted. This collection is the future training set: outcomes (did they
// reply? did the parent pick them? did the placement survive?) are NOT stored here — they join at
// analysis time by (assignmentId, tutorId) against outreach.contacts and placements.
//
// Write-only and best-effort: an insert failure must never block or delay outreach (see
// recordRecommendation). Nothing reads this at runtime; it exists to be queried offline.
const recommendationSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  generatedAt: { type: Date, default: Date.now },
  // Bumped whenever the weights or ranking logic change, so an analysis can segment by ranker
  // version (see POLICY_VERSION in tutorMatcher.js).
  policyVersion: { type: String },
  trigger: { type: String, enum: ['wave1', 'escalation', 'shortlist'] },
  candidates: [{
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
    rank: { type: Number },        // 1-based position in this decision's ranking
    score: { type: Number },       // the score this decision ranked on
    contacted: { type: Boolean },  // did this candidate actually get messaged in this wave/release?
    // The scoring components behind `score`, captured so an analysis can see WHY a tutor ranked
    // where they did. qualityGrade is null until Phase 9 (write-time LLM profile extraction).
    featureSnapshot: {
      experienceRank: { type: Number },
      commitmentScore: { type: Number },
      budgetComfort: { type: Number },
      coverageFactor: { type: Number },
      responsivenessFactor: { type: Number },
      qualityGrade: { type: Number, default: null },
      educationTier: { type: Number },
      prestigeSignal: { type: Number },
      trackRecordFactor: { type: Number },
    },
  }],
});

// The common lookup: the latest decisions for an assignment.
recommendationSchema.index({ assignmentId: 1, generatedAt: -1 });

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
