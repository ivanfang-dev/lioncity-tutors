import mongoose from 'mongoose';

// A confirmed match: the parent picked a tutor and money (will) change hands. This is the
// ground-truth record the day-30 check-in (Phase 5) and every future ranking improvement
// train against — created the moment the owner records a parent's pick (Phase 2), separate
// from the Assignment so a re-opened/duplicated assignment can't clobber the placement history.
//
// Kept deliberately thin at creation; check-ins are appended later (Phase 5). Written with
// atomic upserts keyed on (assignmentId, tutorId) so a double-tapped "Picked" button can't
// create two rows for the same match.
const placementSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  // The parent's WhatsApp number as captured on the assignment — kept here so the check-in
  // flow (Phase 5) can reach the parent (owner-in-the-loop) without re-reading the assignment.
  parentContact: { type: String, trim: true },
  filledAt: { type: Date, default: Date.now },
  // The rate the placement went out at — best-effort at pick time (the tutor's asking rate
  // for the level, else the assignment's posted rate). Free text, mirroring how rates are
  // stored elsewhere until Phase 7 makes them numeric.
  agreedRate: { type: String, trim: true },
  // Appended by the day-30 check-in loop (Phase 5); empty until then.
  checkIns: [{
    at: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'ended', 'no_reply'] },
    rating: { type: Number },       // 1–5, when the parent gives one
    endReason: { type: String }     // verbatim parent reason when it ended
  }],
  // The day-30 check-in ping lifecycle (Phase 5), separate from `checkIns` (which only ever holds
  // RECORDED outcomes). The tick uses these two timestamps + an empty checkIns array to drive a
  // three-step cadence without re-pinging a placement it already asked about:
  //   1. filledAt <= now-28d and checkInRequestedAt unset → first owner ping, set checkInRequestedAt.
  //   2. checkInRequestedAt <= now-3d, still no checkIns → one re-ping, set checkInRepingedAt.
  //   3. checkInRepingedAt <= now-3d, still no checkIns → append a 'no_reply' checkIn and stop.
  checkInRequestedAt: { type: Date }, // when the owner was first pinged for the day-30 outcome
  checkInRepingedAt: { type: Date },  // when the single 3-day re-ping was sent
  // Set true/false by the 30-day check-in; null = not yet checked.
  survived30d: { type: Boolean },
  status: { type: String, enum: ['active', 'ended', 'unknown'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// One placement per (assignment, tutor) — makes the recording upsert idempotent.
placementSchema.index({ assignmentId: 1, tutorId: 1 }, { unique: true });

const Placement = mongoose.models.Placement || mongoose.model('Placement', placementSchema);

export default Placement;
