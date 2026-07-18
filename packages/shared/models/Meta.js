import mongoose from 'mongoose';

// A tiny key/value collection for singleton system state that has nowhere better to live — used by
// the escalation tick's once-per-day guards (there's no cron on Vercel Hobby, so periodic work is
// gated by "when did this last run?" timestamps stored here). One doc per named job.
//
// Deliberately generic and schemaless in `value` so new periodic jobs can reuse it without a
// migration. First user: the daily tutor.stats materialization (roadmap Phase 7), key 'tutorStats'.
const metaSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  lastRunAt: { type: Date },
  value: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now },
});

const Meta = mongoose.models.Meta || mongoose.model('Meta', metaSchema);

export default Meta;
