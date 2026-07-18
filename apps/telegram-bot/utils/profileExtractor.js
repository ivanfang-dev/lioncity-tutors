import { GoogleGenAI, Type } from '@google/genai';
import { Tutor, Meta } from '../../../packages/shared/server-exports.js';

// Write-time LLM profile extraction (roadmap Phase 9). ONE Gemini call turns a tutor's free-text
// profile (introduction / teachingExperience / trackRecord) into a structured, deterministic record
// stored on the tutor — so ranking reads a stored grade instead of re-reading 40 profiles through
// Gemini on every assignment. Runs at registration/edit time and via the backfill; never at query
// time. On ANY failure (no key, unparseable, wrong shape) it stores NOTHING and logs, so a bad
// response can't pollute ranking — scoring simply falls back to the old commitmentScore.

// Stored on each extraction. Bump when the prompt, output shape, or model changes: the backfill and
// any re-extraction sweep treat a differing modelVersion as "stale, re-extract". Encodes the model
// so swapping it is a version change by construction.
export const PROFILE_MODEL_VERSION = '2026.07-pf-v1-gemini-2.5-flash';

const GEMINI_MODEL = 'gemini-2.5-flash';
const SENIORITY = new Set(['undergrad', 'early', 'experienced', 'veteran']);
// Free-text is trimmed into the prompt — enough to capture the signal, bounded to keep the call cheap.
const INTRO_LIMIT = 1200;
const EXPERIENCE_LIMIT = 1200;
const TRACK_LIMIT = 1000;

// Constrained decoding. `responseMimeType: 'application/json'` alone is only an instruction — the
// model can and does emit syntactically invalid JSON under it (observed in the wild: a dropped `}`
// between subjectsClaimed elements, which parseJson can't recover, so the tutor got no features).
// A responseSchema constrains generation at the grammar level, so the bytes are valid JSON by
// construction. validateExtraction still runs after: this guarantees SYNTAX, not sane VALUES.
export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    qualityGrade: { type: Type.INTEGER },
    qualityReason: { type: Type.STRING },
    subjectsClaimed: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          level: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
        required: ['subject', 'level', 'evidence'],
      },
    },
    seniority: { type: Type.STRING, enum: [...SENIORITY] },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['qualityGrade', 'qualityReason', 'subjectsClaimed', 'seniority', 'redFlags'],
};

let _client = null;
function client() {
  if (!_client) _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return _client;
}

// Whether there's enough profile text to be worth a Gemini call. An empty profile extracts to
// nothing meaningful and would just burn a call and a rate-limit slot; scoring falls back to
// commitmentScore (~0 for them anyway). The backfill/sweep uses this to skip blank profiles.
export function hasExtractableText(tutor) {
  const text = [tutor?.introduction, tutor?.teachingExperience, tutor?.trackRecord]
    .map(s => (s || '').trim())
    .join('');
  return text.length >= 20;
}

// Tolerant JSON extraction from the model's text: handles a bare object, ```json fences, or an object
// embedded in stray prose. Returns the parsed value or null — never throws.
export function parseJson(text) {
  if (!text) return null;
  let t = String(text).trim();
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) t = fenced[1].trim();
  try {
    return JSON.parse(t);
  } catch {
    const block = t.match(/\{[\s\S]*\}/);
    if (!block) return null;
    try { return JSON.parse(block[0]); } catch { return null; }
  }
}

// STRICT shape validation of the model's JSON. Returns a normalized profileFeatures payload (without
// extractedAt/modelVersion — the caller stamps those) or null if anything essential is off. The two
// load-bearing fields (qualityGrade in range, seniority in enum) are required; the rest are coerced
// and bounded so a sloppy-but-usable response still yields clean data. Pure — unit-tested directly.
export function validateExtraction(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const grade = raw.qualityGrade;
  if (typeof grade !== 'number' || !Number.isFinite(grade) || grade < 1 || grade > 5) return null;
  if (typeof raw.seniority !== 'string' || !SENIORITY.has(raw.seniority)) return null;

  const qualityReason = typeof raw.qualityReason === 'string' ? raw.qualityReason.trim().slice(0, 300) : '';

  const subjectsClaimed = Array.isArray(raw.subjectsClaimed)
    ? raw.subjectsClaimed
        .filter(s => s && typeof s === 'object')
        .map(s => ({
          subject: String(s.subject ?? '').trim().slice(0, 80),
          level: String(s.level ?? '').trim().slice(0, 80),
          evidence: String(s.evidence ?? '').trim().slice(0, 300),
        }))
        .filter(s => s.subject) // a claim with no subject is noise
        .slice(0, 20)
    : [];

  const redFlags = Array.isArray(raw.redFlags)
    ? raw.redFlags
        .filter(f => typeof f === 'string' && f.trim())
        .map(f => f.trim().slice(0, 200))
        .slice(0, 10)
    : [];

  return {
    qualityGrade: Math.round(grade), // integer 1..5
    qualityReason,
    subjectsClaimed,
    seniority: raw.seniority,
    redFlags,
  };
}

function buildPrompt(tutor) {
  const intro = (tutor.introduction || 'None').slice(0, INTRO_LIMIT);
  const experience = (tutor.teachingExperience || 'None').slice(0, EXPERIENCE_LIMIT);
  const track = (tutor.trackRecord || 'None').slice(0, TRACK_LIMIT);
  return `You are vetting a private tutor's profile for a Singapore tuition agency. Read the tutor's own free-text profile and return a STRICT JSON object grading its quality and extracting what it actually evidences. Judge SUBSTANCE and concrete evidence — specific results, schools, exam grades, years taught — NOT length, English fluency, or confident tone. A short profile stating a concrete result outranks a long vague one.

Structured fields (context only — may be sparse or merely self-reported; do NOT simply echo them):
- Name: ${tutor.fullName || 'Unknown'}
- Tutor type: ${tutor.tutorType || 'Unknown'}
- Self-reported years: ${tutor.yearsOfExperience || 'Unknown'}
- Highest education: ${tutor.highestEducation || 'Unknown'}

Free-text profile:
- Introduction: "${intro}"
- Teaching experience: "${experience}"
- Track record: "${track}"

Return ONLY a JSON object with EXACTLY these keys:
{
  "qualityGrade": <integer 1-5; 5 = specific, credible, well-evidenced; 1 = empty, generic, or vague>,
  "qualityReason": "<one short sentence, at most 140 characters, justifying the grade>",
  "subjectsClaimed": [ { "subject": "<e.g. Mathematics>", "level": "<e.g. Secondary, JC, Primary>", "evidence": "<short quote or paraphrase of the supporting claim>" } ],
  "seniority": "<one of: undergrad | early | experienced | veteran>",
  "redFlags": [ "<short phrase for anything an operator should double-check: vague claims, inconsistencies, no evidence>" ]
}
Rules: include subjectsClaimed ONLY for subjects the text actually supports (empty array if none is clear). Judge seniority from the evidence, not just the self-reported years. redFlags is an empty array when there are none. Output no prose outside the JSON object.`;
}

// The core call: prompt → Gemini → parse → strict-validate → stamp version/timestamp. Returns the
// full profileFeatures object ready to store, or null on any failure (caller then stores nothing).
export async function extractProfileFeatures(tutor) {
  if (!process.env.GEMINI_API_KEY) {
    console.log('profileExtractor: GEMINI_API_KEY not set, skipping extraction');
    return null;
  }
  if (!hasExtractableText(tutor)) return null;

  try {
    const res = await client().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(tutor),
      config: { responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA, temperature: 0 },
    });
    const text = (res.text || '').trim();
    const json = parseJson(text);
    if (!json) {
      // Should be unreachable now that decoding is schema-constrained — log enough to tell a real
      // malformed body apart from a truncated one (MAX_TOKENS) if it ever fires again.
      console.warn('profileExtractor: unparseable response', {
        tutorId: tutor._id,
        finishReason: res.candidates?.[0]?.finishReason,
        length: text.length,
        sample: text.slice(0, 120),
      });
      return null;
    }
    const validated = validateExtraction(json);
    if (!validated) {
      console.warn('profileExtractor: response failed shape validation', { tutorId: tutor._id });
      return null;
    }
    return { ...validated, modelVersion: PROFILE_MODEL_VERSION, extractedAt: new Date() };
  } catch (err) {
    const is429 = err.message?.includes('429') || err.status === 429;
    console.error(`profileExtractor: Gemini call ${is429 ? 'rate-limited (429)' : 'failed'}`, {
      tutorId: tutor?._id, error: err.message,
    });
    return null;
  }
}

// Extract + persist for one tutor with a targeted updateOne ($set profileFeatures) — NEVER .save(),
// so legacy out-of-enum profile fields aren't re-validated (roadmap Repo facts). Best-effort: returns
// the stored features, or null when nothing was extracted/written. `model` injectable for tests.
export async function runExtractionForTutor(tutor, { model = Tutor } = {}) {
  const features = await extractProfileFeatures(tutor);
  if (!features) return null;
  await model.updateOne({ _id: tutor._id }, { $set: { profileFeatures: features } });
  return features;
}

// --- Tick-driven extraction sweep (roadmap Phase 9 registration wiring) -----
// New tutors register in the separate backend, which has no Gemini — so there's no write-time hook
// there. Instead the escalation tick (the repo's substitute for cron on Vercel Hobby) sweeps a small
// batch of not-yet-extracted tutors each run, newest first, so a fresh registration is graded within
// a tick or two. Bot-side profile EDITS re-extract in-process; the initial bulk backlog is cleared by
// the --apply backfill script. This just keeps up with the trickle of new/stale profiles.
const SWEEP_META_KEY = 'profileExtraction';
const SWEEP_INTERVAL_MS = Number(process.env.PROFILE_SWEEP_INTERVAL_MS) || 10 * 60 * 1000; // ≥ this between runs
const SWEEP_BATCH = Number(process.env.PROFILE_SWEEP_BATCH) || 3; // Gemini calls per run — bounds tick cost

// Run at most one bounded batch per SWEEP_INTERVAL_MS. The Meta-doc guard is claimed atomically (a
// due-or-absent filter + upsert), exactly like the Phase 7 stats materialization, so overlapping
// ticks can't both run it. Best-effort: logs and swallows so it can never break the tick. `model`
// injectable for tests.
export async function runProfileExtractionSweep(now = new Date(), { model = Tutor, meta = Meta } = {}) {
  if (!process.env.GEMINI_API_KEY) return { ran: false };

  const cutoff = new Date(now.getTime() - SWEEP_INTERVAL_MS);
  try {
    const res = await meta.updateOne(
      { key: SWEEP_META_KEY, $or: [{ lastRunAt: { $lte: cutoff } }, { lastRunAt: { $exists: false } }, { lastRunAt: null }] },
      { $set: { lastRunAt: now, updatedAt: now }, $setOnInsert: { key: SWEEP_META_KEY } },
      { upsert: true }
    );
    if ((res.modifiedCount ?? 0) === 0 && (res.upsertedCount ?? 0) === 0) return { ran: false }; // not due
  } catch (err) {
    if (err.code !== 11000) console.error('profile-extraction guard failed:', err.message);
    return { ran: false };
  }

  try {
    // $ne matches missing too, so this catches never-extracted tutors AND stale modelVersions.
    // Over-fetch, then drop blank profiles, so a run of empty profiles doesn't starve the batch.
    const pending = await model.find({ 'profileFeatures.modelVersion': { $ne: PROFILE_MODEL_VERSION } })
      .select('fullName introduction teachingExperience trackRecord tutorType yearsOfExperience highestEducation')
      .sort({ createdAt: -1 })
      .limit(SWEEP_BATCH * 4)
      .lean();
    const batch = pending.filter(hasExtractableText).slice(0, SWEEP_BATCH);

    let extracted = 0;
    for (const t of batch) {
      if (await runExtractionForTutor(t, { model })) extracted++;
    }
    if (batch.length) console.log(`Profile extraction sweep: ${extracted}/${batch.length} tutor(s) extracted.`);
    return { ran: true, extracted, attempted: batch.length };
  } catch (err) {
    console.error('profile-extraction sweep failed:', err.message);
    return { ran: true, error: err.message };
  }
}
