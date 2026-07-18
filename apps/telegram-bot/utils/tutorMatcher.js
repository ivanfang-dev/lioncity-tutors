import Tutor from '../../../packages/shared/models/Tutor.js';
import { LEVEL_SUBJECT_MAPPINGS } from '../../../packages/shared/index.js';
import { TIME_SLOT_KEYS } from '../../../packages/shared/utils/timeSlots.js';
// Level → tutor-schema key. Lives in packages/shared because the ops console reads the same
// per-level tutor fields; re-exported below so existing importers of tutorMatcher are unaffected.
import { getLevelCategory, getLevelCategoryLoose } from '../../../packages/shared/utils/levelCategory.js';
import { LOCATION_TO_REGION } from './locations.js';

// Maps subject display name to tutor schema camelCase field name
function subjectToFieldName(subject) {
  const overrides = {
    'C++ Programming': 'cppProgramming',
    'C# Programming': 'cSharpProgramming',
  };
  if (overrides[subject]) return overrides[subject];

  const cleaned = subject
    .replace(/[()]/g, '')
    .replace(/\//g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.map((w, i) =>
    i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join('');
}

// Maps assignment tutor type preference to possible DB values (mixed formats from website + telegram)
const TUTOR_TYPE_MAP = {
  'Part-time': ['Part-time Tutor', 'Parttime', 'Undergraduate'],
  'Full-time': ['Full-time Tutor', 'Fulltime'],
  'MOE/Ex-MOE': ['MOE Teacher', 'Ex-MOE Teacher', 'Moe', 'Exmoe', 'Nie'],
};

// Subject values that don't map to a single tutor field — require title parsing
const SPECIAL_SUBJECTS = new Set([
  'Multiple Subjects', 'All Subjects', 'Exam Preparation', 'Homework Support', 'Other'
]);

// Alias (lowercase) → canonical subject name or array of names
// Sorted longest-first at use time so "H2 Maths" matches before "Maths", "A Maths" before "Maths"
const TITLE_ALIASES = {
  // JC H-level subjects
  'h1 mathematics': 'H1 Mathematics', 'h2 mathematics': 'H2 Mathematics', 'h3 mathematics': 'H3 Mathematics',
  'h1 maths': 'H1 Mathematics', 'h2 maths': 'H2 Mathematics', 'h3 maths': 'H3 Mathematics',
  'h1 physics': 'H1 Physics', 'h2 physics': 'H2 Physics', 'h3 physics': 'H3 Physics',
  'h1 chemistry': 'H1 Chemistry', 'h2 chemistry': 'H2 Chemistry', 'h3 chemistry': 'H3 Chemistry',
  'h1 biology': 'H1 Biology', 'h2 biology': 'H2 Biology', 'h3 biology': 'H3 Biology',
  'h1 economics': 'H1 Economics', 'h2 economics': 'H2 Economics', 'h3 economics': 'H3 Economics',
  'h1 history': 'H1 History', 'h2 history': 'H2 History', 'h3 history': 'H3 History',
  'h1 geography': 'H1 Geography', 'h2 geography': 'H2 Geography', 'h3 geography': 'H3 Geography',
  'h2 computing': 'H2 Computing',
  'h2 literature': 'H2 Literature in English', 'h3 literature': 'H3 Literature in English',
  'general paper': 'General Paper',
  // Secondary-specific
  'additional mathematics': 'Additional Mathematics', 'additional maths': 'Additional Mathematics',
  'add maths': 'Additional Mathematics', 'a maths': 'Additional Mathematics',
  'elementary mathematics': 'Elementary Mathematics', 'elementary maths': 'Elementary Mathematics',
  'elem maths': 'Elementary Mathematics', 'e maths': 'Elementary Mathematics',
  // Combined Science → both variants (title won't say which combination)
  'combined science': ['Combined Science (Physics/Chemistry)', 'Combined Science (Chemistry/Biology)'],
  'combined': ['Combined Science (Physics/Chemistry)', 'Combined Science (Chemistry/Biology)'],
  'principles of accounts': 'Principles of Accounts',
  'literature in english': 'Literature in English',
  'design and technology': 'Design and Technology',
  // Common abbreviations
  'english language': 'English Language',
  'english': 'English Language',
  'mathematics': 'Mathematics', 'maths': 'Mathematics', 'math': 'Mathematics',
  'physics': 'Physics', 'phy': 'Physics',
  'chemistry': 'Chemistry', 'chem': 'Chemistry',
  'biology': 'Biology', 'bio': 'Biology',
  'science': 'Science', 'sci': 'Science',
  'economics': 'Economics', 'econs': 'Economics',
  'geography': 'Geography', 'geo': 'Geography',
  'history': 'History',
  'literature': 'Literature in English', 'lit': 'Literature in English',
  'accounts': 'Principles of Accounts', 'poa': 'Principles of Accounts',
  'computing': 'Computing',
  'chinese': 'Chinese',
  'malay': 'Malay',
  'tamil': 'Tamil',
  'art': 'Art',
  'music': 'Music',
  'gp': 'General Paper',
};

// Sort aliases longest-first once at module load
const SORTED_ALIASES = Object.keys(TITLE_ALIASES).sort((a, b) => b.length - a.length);

// Parse subject DB field names from a free-text assignment title
function parseSubjectsFromTitle(title) {
  const normalized = title
    .replace(/\([^)]*\)/g, '') // strip (NA), (Express), (IP), (Foundation) etc.
    .toLowerCase();

  const matched = new Set();
  let remaining = normalized;

  for (const alias of SORTED_ALIASES) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i');
    if (regex.test(remaining)) {
      const value = TITLE_ALIASES[alias];
      const canonicals = Array.isArray(value) ? value : [value];
      for (const canonical of canonicals) {
        const field = subjectToFieldName(canonical);
        if (field) matched.add(field);
      }
      // Remove the matched text so shorter aliases don't double-match
      remaining = remaining.replace(regex, ' ');
    }
  }

  return [...matched];
}

// --- Candidate quality ranking (pre-AI) ------------------------------------
// A cheap deterministic score that narrows the matched pool to the strongest
// `poolSize` tutors BEFORE the (paid, slower) AI re-ranker looks at them.
//
// Weights — tuned to how the agency actually reaches out. Tune freely:
//   • Budget is enforced first as a hard filter (over-budget tutors are dropped —
//     no point messaging someone the assignment can't afford), so its real weight
//     lives in the filter, not this number.
//   • Experience and commitment sit close together on purpose: a tutor who put real
//     effort into their profile can outrank a more senior one who left theirs blank.
// Responsiveness is applied SEPARATELY as a multiplier (see responsivenessFactor), not as
// a weight here — so a proven ghost is dragged down regardless of how good they look on
// paper, which is the point of "deprioritise non-responders".
const WEIGHTS = { experience: 0.45, commitment: 0.30, budget: 0.25 };

// A tutor asking up to this fraction over the assignment ceiling is still worth
// messaging (rates are negotiable at the margin); beyond it, drop them.
const BUDGET_GRACE = 0.20;

// yearsOfExperience is a fixed dropdown on the register-tutor form (website
// register-tutor/page.jsx) — these are the only five possible values.
const EXPERIENCE_RANK = {
  '0-1 year': 1,
  '1-3 years': 2,
  '3-5 years': 3,
  '5-10 years': 4,
  '10+ years': 5,
};

// Pull every number out of a free-text money string. "$30-45/hr" → [30, 45].
function extractNumbers(text) {
  return (String(text ?? '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

// Parse the assignment's free-text rate into spending ceilings per tutor-type band.
// Real examples the owner types:
//   "$30-45/hr (PT), $40-50/hr (FT)" → { partTime: 45, fullTime: 50 }
//   "$40-50/hr"                       → { default: 50 }
// FT/MOE bands are typically higher than PT — we honour whichever band the text tags.
function parseBudget(rateText) {
  const bands = {};
  let overallMax = null;
  for (const segment of String(rateText ?? '').split(',')) {
    const nums = extractNumbers(segment);
    if (nums.length === 0) continue;
    const ceiling = Math.max(...nums);
    overallMax = overallMax === null ? ceiling : Math.max(overallMax, ceiling);
    if (/\b(pt|part|undergrad)\w*/i.test(segment)) bands.partTime = ceiling;
    else if (/\b(ft|full)\w*/i.test(segment)) bands.fullTime = ceiling;
    else if (/\b(moe|nie)\w*/i.test(segment)) bands.moe = ceiling;
    else bands.default = ceiling;
  }
  return { bands, overallMax };
}

// The budget bands for an assignment, PREFERRING the precomputed numeric fields (roadmap Phase 7)
// and falling back to parsing the free-text rate for legacy assignments (never re-saved, so they
// have no budgetNumeric). Shape matches parseBudget's return so every downstream caller is unchanged.
function resolveBudget(assignment) {
  const bn = assignment.budgetNumeric;
  if (bn && (bn.partTime != null || bn.fullTime != null || bn.moe != null || bn.default != null)) {
    const bands = {};
    if (bn.partTime != null) bands.partTime = bn.partTime;
    if (bn.fullTime != null) bands.fullTime = bn.fullTime;
    if (bn.moe != null) bands.moe = bn.moe;
    if (bn.default != null) bands.default = bn.default;
    const values = Object.values(bands);
    return { bands, overallMax: values.length ? Math.max(...values) : null };
  }
  return parseBudget(assignment.rate);
}

// The spending ceiling that applies to THIS tutor, based on their type. Full-time /
// MOE tutors fall back to the highest band available (they cost more); part-timers
// fall back to the default/overall band.
function ceilingForTutor(tutor, budget) {
  const { bands, overallMax } = budget;
  const type = (tutor.tutorType || '').toLowerCase();
  if (/part|undergrad/.test(type) && bands.partTime != null) return bands.partTime;
  if (/full/.test(type) && bands.fullTime != null) return bands.fullTime;
  if (/moe|nie/.test(type) && bands.moe != null) return bands.moe;
  return bands.default ?? overallMax ?? null;
}

// The tutor's own asking rate for this level (lower bound of any range = the least they'd accept).
// Prefers the precomputed numeric mirror (roadmap Phase 7), falling back to parsing the free-text
// hourlyRate for legacy tutors without rateNumeric. null when they never filled it in for this level.
function tutorFloorRate(tutor, levelCategory) {
  const numeric = tutor.rateNumeric?.[levelCategory];
  if (numeric && numeric.min != null) return numeric.min;
  const nums = extractNumbers(tutor.hourlyRate?.[levelCategory]);
  return nums.length ? Math.min(...nums) : null;
}

// How well a tutor fits the budget → { affordable, comfort } where comfort is 0..1
// (1 = comfortably cheap, very likely to say yes; 0.5 = right at the ceiling).
// Unknowns get the benefit of the doubt so we never silently drop a good tutor.
//
// quotedRate, when the tutor named one FOR THIS ASSIGNMENT (Phase 4), replaces the profile
// floor entirely: it's the rate they'll actually take here, so it beats the stale profile
// guess — the whole reason we ask. Falls back to the profile floor when absent (every
// candidate-query call, and any interested tutor who ignored the rate prompt).
function budgetFit(tutor, budget, levelCategory, quotedRate = null) {
  const ceiling = ceilingForTutor(tutor, budget);
  const floor = quotedRate != null ? quotedRate : tutorFloorRate(tutor, levelCategory);
  if (ceiling == null || floor == null) return { affordable: true, comfort: 0.5 };
  if (floor > ceiling * (1 + BUDGET_GRACE)) return { affordable: false, comfort: 0 };
  if (floor > ceiling) return { affordable: true, comfort: 0.3 }; // in the grace zone
  return { affordable: true, comfort: 0.5 + 0.5 * (1 - floor / ceiling) };
}

// 0..1 measure of effort the tutor put into their profile. Rewards depth, not mere
// presence — a senior who wrote only "a few lines" scores low here by design.
function commitmentScore(tutor) {
  const TARGET = 200; // chars that represent a genuinely filled-out field
  const fields = [tutor.introduction, tutor.teachingExperience, tutor.trackRecord];
  const perField = fields.map(f => Math.min((f?.trim().length || 0) / TARGET, 1));
  return perField.reduce((sum, v) => sum + v, 0) / perField.length;
}

// True when the tutor can cover at least one slot the assignment asked for. Tutors who
// never filled in their availability get the benefit of the doubt (we'd rather message
// them than silently drop them over missing data) — same stance as the budget filter.
function timeSlotsMatch(assignment, tutor) {
  const wanted = assignment.preferredTimeSlots;
  if (!wanted) return true;
  const wantedSlots = TIME_SLOT_KEYS.filter(s => wanted[s]);
  if (wantedSlots.length === 0) return true; // no timing requirement specified

  const avail = tutor.availableTimeSlots;
  if (!avail || !TIME_SLOT_KEYS.some(s => avail[s])) return true; // tutor gave no availability
  return wantedSlots.some(s => avail[s]);
}

// Multiplier (RESPONSIVENESS_FLOOR..1) applied to a tutor's quality score, based on reply
// history. A "No" counts as a reply (they're reachable), so only true ghosting is hit.
// Laplace-smoothed so a new/never-contacted tutor sits at the neutral 0.5 rate → factor
// 1.0 (no penalty, fair first shot); the penalty only bites as a tutor is repeatedly
// messaged without ever replying — i.e. it captures "frequently doesn't respond", and
// grows with the number of misses (confidence), not a single one-off.
const RESPONSIVENESS_FLOOR = 0.4; // a chronic ghost keeps at most 40% of their score
function responsivenessFactor(tutor) {
  const contacted = tutor.responseStats?.contacted || 0;
  const responded = tutor.responseStats?.responded || 0;
  const rate = (responded + 2) / (contacted + 4); // smoothed; new tutor = 0.5
  return Math.max(RESPONSIVENESS_FLOOR, Math.min(1, 0.4 + rate * 1.2));
}

// The ranking policy version — bumped whenever WEIGHTS or the scoring logic below change, so the
// Recommendation decision log (Phase 6) can segment analyses by ranker version. Start at v1.
// Bumped for Phase 10 step 4: a newcomer boost enters the score and exposure-capped tutors are held
// out of new waves — a ranking-policy change the decision log should segment on. (v2 was Phase 9's
// qualityGrade swap + re-rank retirement.)
const POLICY_VERSION = '2026.07-v3';

// Newcomer boost (Phase 10 step 4): a small multiplier for tutors with zero lifetime placements and
// a decent profile, so unproven-but-promising supply gets wave exposure before it churns out.
const NEWCOMER_BOOST = 1.08;
const NEWCOMER_QUALITY_MIN = 0.6; // "decent profile": qualitySignal ≥ this (grade ≥ 3, or equiv commitment)

// Blended 0..1 quality score for ordering the affordable pool, then scaled down for tutors who
// chronically ignore outreach — PLUS the component breakdown behind it. Internal: returns
// { score, components } so the Recommendation log (Phase 6) can record WHY a tutor ranked where they
// did without re-deriving it. `coverageFactor` is applied by the caller (it needs requestedFields),
// so it is not part of `components` here — runMatch/buildFeatureSnapshot fold it in.
// The profile-quality term in every quality blend (Phase 9 Step B): a tutor's extracted
// qualityGrade/5 (holistic, evidence-based) when present, else commitmentScore (length-based and
// gameable) as the fallback for tutors not yet extracted. One helper so scoreTutorComponents and
// shortlistScore stay in lockstep — the roadmap's "replace commitmentScore with qualityGrade".
function qualitySignal(tutor) {
  const grade = tutor.profileFeatures?.qualityGrade;
  return grade != null ? grade / 5 : commitmentScore(tutor);
}

function scoreTutorComponents(tutor, fit, { useQualityGrade = true } = {}) {
  const experienceRank = EXPERIENCE_RANK[tutor.yearsOfExperience] || 0; // 0..5
  const commitment = commitmentScore(tutor);
  // Phase 9 Step B: qualitySignal now drives the quality term in production (useQualityGrade defaults
  // true). The flag remains so the comparison script can still reproduce the pre-swap commitment-only
  // ranking (useQualityGrade:false) for retrospective audits.
  const qualityTerm = useQualityGrade ? qualitySignal(tutor) : commitment;
  const responsiveness = responsivenessFactor(tutor);
  const quality =
    WEIGHTS.experience * (experienceRank / 5) +
    WEIGHTS.commitment * qualityTerm +
    WEIGHTS.budget * fit.comfort;
  // Phase 10 step 4: give unproven-but-decent newcomers (0 lifetime placements, decent profile) a
  // small lift so they surface in waves before churning. stats.placed is the materialized count
  // (Phase 7); absent → treated as 0 (a never-placed tutor).
  const isNewcomer = (tutor.stats?.placed || 0) === 0 && qualitySignal(tutor) >= NEWCOMER_QUALITY_MIN;
  const boost = isNewcomer ? NEWCOMER_BOOST : 1;
  return {
    score: quality * responsiveness * boost,
    components: {
      experienceRank,
      commitmentScore: commitment,
      budgetComfort: fit.comfort,
      responsivenessFactor: responsiveness,
    },
  };
}

// Public scorer — unchanged signature and return (a number). Every existing caller keeps working;
// only the internal breakdown is new.
function scoreTutor(tutor, fit) {
  return scoreTutorComponents(tutor, fit).score;
}

// The full feature snapshot for one tutor against an assignment, as the Recommendation log stores it
// (Phase 6). Self-contained (resolves the budget + subjects itself), so the shortlist write point —
// which scores with shortlistScore, not the matching path — can build an identical-shaped snapshot.
// `qualityGrade` is null until Phase 9 populates it from write-time LLM extraction.
function buildFeatureSnapshot(tutor, assignment, quotedRate = null) {
  const levelCategory = getLevelCategory(assignment.level);
  const budget = resolveBudget(assignment);
  const fit = budgetFit(tutor, budget, levelCategory, quotedRate);
  const { requestedFields } = resolveSubjects(assignment, levelCategory) || { requestedFields: [] };
  const { components } = scoreTutorComponents(tutor, fit);
  return {
    ...components,
    coverageFactor: coverageFactor(tutor, requestedFields, levelCategory),
    qualityGrade: tutor.profileFeatures?.qualityGrade ?? null, // Phase 9: real grade, was hardcoded null
  };
}

// For a one-tutor-for-many-subjects request, prefer tutors who actually cover more of the
// requested subjects. Returns a 0.5..1 multiplier: full coverage = 1.0, partial scaled
// down (but never below 0.5, so a strong partial-coverage tutor still stays in contention).
// A no-op (returns 1) for single-subject requests and the "any subject" fallback.
function coverageFactor(tutor, requestedFields, levelCategory) {
  if (!requestedFields || requestedFields.length <= 1) return 1;
  const teaches = tutor.teachingLevels?.[levelCategory] || {};
  const covered = requestedFields.filter(f => teaches[f] === true).length;
  return 0.5 + 0.5 * (covered / requestedFields.length);
}

// Resolve an assignment's requested subjects into a Mongo subject filter plus the list of
// requested tutor field names (which drives coverage-aware ranking). Returns null when the
// subject can't be mapped at all — the caller should treat that as "no matches". Shared by
// the candidate query (findMatchingTutors) and the shortlist re-rank (shortlistScore) so
// the two never diverge on what the assignment actually asked for.
//
// requestedFields: 2+ entries for a one-tutor-for-many request (drives coverage); one entry
// for a single subject (coverage is then a no-op); empty for the "any subject" fallback.
function resolveSubjects(assignment, levelCategory) {
  if (SPECIAL_SUBJECTS.has(assignment.subject)) {
    // Try to parse subjects from the assignment title
    const fields = parseSubjectsFromTitle(assignment.title || '');
    if (fields.length > 0) {
      console.log(`Parsed subjects from title "${assignment.title}":`, fields);
      return {
        subjectQuery: { $or: fields.map(f => ({ [`teachingLevels.${levelCategory}.${f}`]: true })) },
        requestedFields: fields,
      };
    }
    // Fallback: match any tutor who teaches any subject at this level
    console.log(`No subjects parsed from title "${assignment.title}", matching any ${levelCategory} tutor`);
    const allFields = (LEVEL_SUBJECT_MAPPINGS[assignment.level] || [])
      .map(s => subjectToFieldName(s)).filter(Boolean);
    return {
      subjectQuery: allFields.length > 0
        ? { $or: allFields.map(f => ({ [`teachingLevels.${levelCategory}.${f}`]: true })) }
        : {},
      requestedFields: [],
    };
  }
  const subjectField = subjectToFieldName(assignment.subject);
  if (!subjectField) {
    console.log('Could not map subject:', assignment.subject);
    return null;
  }
  return {
    subjectQuery: { [`teachingLevels.${levelCategory}.${subjectField}`]: true },
    requestedFields: [subjectField],
  };
}

// Quality score for RE-RANKING the interested pool into a parent-facing shortlist. Same
// blend as scoreTutor (experience, commitment, budget comfort, coverage) but deliberately
// WITHOUT responsivenessFactor: these tutors have already replied, so penalising slower
// repliers here would be a pure quality loss (roadmap Phase 1). Pure + synchronous so the
// escalation-tick release path can call it per interested contact.
function shortlistScore(tutor, assignment, quotedRate = null) {
  const levelCategory = getLevelCategory(assignment.level);
  const budget = resolveBudget(assignment);
  const fit = budgetFit(tutor, budget, levelCategory, quotedRate);
  const { requestedFields } = resolveSubjects(assignment, levelCategory) || { requestedFields: [] };
  const experience = (EXPERIENCE_RANK[tutor.yearsOfExperience] || 0) / 5;
  const quality =
    WEIGHTS.experience * experience +
    WEIGHTS.commitment * qualitySignal(tutor) + // Phase 9: same quality swap as scoreTutorComponents
    WEIGHTS.budget * fit.comfort;
  return quality * coverageFactor(tutor, requestedFields, levelCategory);
}

// One-line, human-readable "why this tutor" for the owner's shortlist alert: experience,
// type, and the tutor's rate against the budget that applies to them. Pure and synchronous,
// mirrors the dimensions shortlistScore actually weighs.
//
// When the tutor quoted a rate for this assignment (Phase 4), it's shown as "quoted $X/h" and
// used for the over-budget flag — it's the number that matters, and seeing it (vs the posted
// budget) before relaying is the point. Falls back to the profile "asks $X/h" when absent.
function shortlistReason(tutor, assignment, quotedRate = null) {
  const levelCategory = getLevelCategory(assignment.level);
  const budget = resolveBudget(assignment);
  const ceiling = ceilingForTutor(tutor, budget);
  const floor = quotedRate != null ? quotedRate : tutorFloorRate(tutor, levelCategory);
  const rateVerb = quotedRate != null ? 'quoted' : 'asks';

  const parts = [];
  if (tutor.yearsOfExperience) parts.push(`${tutor.yearsOfExperience} exp`);
  if (tutor.tutorType) parts.push(tutor.tutorType);

  if (floor == null) {
    parts.push(ceiling != null ? `rate not listed (budget $${ceiling}/h)` : 'rate not listed');
  } else if (ceiling == null) {
    parts.push(`${rateVerb} $${floor}/h`);
  } else {
    parts.push(`${rateVerb} $${floor}/h vs $${ceiling}/h budget${floor > ceiling ? ' ⚠️ over' : ''}`);
  }
  return parts.join(' · ');
}

// The DB-side hard filters, as a CUMULATIVE chain: each stage's query is every filter up to and
// including it, so counting them in order yields a funnel ("region left 120, subject left 31,
// tutor type left 4"). findMatchingTutors builds its real query from the last stage, so the
// attrition report can never drift from the filters outreach actually applies.
//
// Because the chain is cumulative, "removed" is conditional on the preceding stages — the order
// below is the reading order of the funnel, not a claim about each filter in isolation. Pure, so
// it's testable without a DB.
//
// Returns { unmappable, stages, requestedFields, levelCategory }: `unmappable` names the field
// that couldn't be mapped ('level' | 'location' | 'subject') and means zero matches by definition;
// `stages` is [] in that case.
function buildFilterStages(assignment) {
  const levelCategory = getLevelCategory(assignment.level);
  const region = LOCATION_TO_REGION[assignment.location];
  const empty = { stages: [], requestedFields: [], levelCategory, region };

  if (!levelCategory) return { ...empty, unmappable: 'level' };
  if (!region) return { ...empty, unmappable: 'location' };

  const resolved = resolveSubjects(assignment, levelCategory);
  if (!resolved) return { ...empty, unmappable: 'subject' };
  const { subjectQuery, requestedFields } = resolved;

  const stages = [];
  let query = {};
  const add = (filter, clause) => {
    query = { ...query, ...clause };
    stages.push({ filter, query });
  };

  // $nin with null also excludes docs missing the field entirely, so no $exists needed.
  // (Was `{ $ne: null, $ne: '' }` — duplicate keys, so JS silently dropped the null check.)
  add('contactable', { contactNumber: { $nin: [null, ''] } });
  // Tutors who told us they've stopped tutoring (decline reason 'inactive' → Tutor.pausedAt).
  // Mongo equality on null matches BOTH an explicit null and a missing field, so every tutor
  // predating this field stays matchable — no backfill needed. Cleared when they re-link
  // (handleContact), which is their way back in. First in the chain with 'contactable' because
  // both are cheap "can we even talk to them" gates.
  add('active', { pausedAt: null });
  // Region: normally the assignment's single region, but the ops console's "widen to adjacent
  // regions" recovery stamps extra regions onto `matchRegions`, which we OR in here (deduped).
  const regions = [region, ...(assignment.matchRegions || [])].filter((r, i, a) => r && a.indexOf(r) === i);
  add('region', regions.length > 1
    ? { $or: regions.map(r => ({ [`locations.${r}`]: true })) }
    : { [`locations.${region}`]: true });
  add('subject', subjectQuery);

  if (assignment.preferredTutorTypes?.length > 0) {
    const allowedTypes = assignment.preferredTutorTypes.flatMap(t => TUTOR_TYPE_MAP[t] || []);
    add('tutorType', { tutorType: { $in: allowedTypes } });
  }

  // Gender is a hard requirement when the parent specified one — parents rarely flex.
  if (assignment.preferredGender && assignment.preferredGender !== 'No preference') {
    add('gender', { gender: assignment.preferredGender });
  }

  return { unmappable: null, stages, requestedFields, levelCategory, region };
}

// The in-JS hard filters (budget, then timing), applied to already-fetched candidates. Returns the
// survivors with their budget fit (computed once, reused for scoring) plus the per-filter counts.
// Pure — the stats mode and the live query share it, so neither can drift.
function applyJsFilters(candidates, assignment, levelCategory) {
  const budget = resolveBudget(assignment);
  const withFit = candidates.map((tutor) => ({ tutor, fit: budgetFit(tutor, budget, levelCategory) }));

  const affordable = withFit.filter(({ fit }) => fit.affordable);
  const available = affordable.filter(({ tutor }) => timeSlotsMatch(assignment, tutor));

  return {
    kept: available,
    stages: [
      { filter: 'budget', before: withFit.length, after: affordable.length, removed: withFit.length - affordable.length },
      { filter: 'timeSlots', before: affordable.length, after: available.length, removed: affordable.length - available.length },
    ],
  };
}

// The filter that cost the most candidates — the headline of the "pool smaller than wave"
// diagnosis ("31 tutors teach this, but only 4 are in the region"). null when nothing was
// removed. Ties go to the earlier (broader) stage, which is the more useful thing to widen.
function dominantFilter(stages) {
  let dominant = null;
  for (const stage of stages) {
    if (stage.removed > 0 && (!dominant || stage.removed > dominant.removed)) dominant = stage;
  }
  return dominant ? dominant.filter : null;
}

// We deliberately avoid a DB `.limit()` on a recency sort for ranking: that was discarding our
// most experienced tutors (who often registered earliest) before the AI ever saw them.
// yearsOfExperience/hourlyRate are stored as strings, so ranking has to happen in application
// code anyway. The createdAt sort only bounds which 300 we pull in the rare case a single
// subject+level+region+type query matches more than that.
const MAX_CANDIDATE_FETCH = 300;

const CANDIDATE_FIELDS =
  'fullName contactNumber telegramId telegramStale tutorType yearsOfExperience highestEducation ' +
  'introduction teachingExperience trackRecord hourlyRate availableTimeSlots responseStats teachingLevels createdAt ' +
  'profileFeatures ' + // Phase 9: qualityGrade feeds the quality signal in scoring (Step B)
  'stats';             // Phase 10: stats.placed drives the newcomer boost

// Find the best `poolSize` tutors matching the assignment's level+subject, location, and tutor
// type — quality-ranked, ready to hand to the AI re-ranker.
//
// `withStats` turns on the attrition funnel (see findMatchingTutorsWithStats) at the cost of one
// countDocuments per DB-side filter, so it stays OFF for outreach and is opted into by the ops
// console's diagnosis. `model` is injectable for tests.
async function runMatch(assignment, poolSize, { withStats = false, model = Tutor, useQualityGrade = true, excludeTutorIds = null } = {}) {
  const { unmappable, stages, requestedFields, levelCategory } = buildFilterStages(assignment);

  if (unmappable) {
    console.log('Could not map assignment for tutor matching:', {
      level: assignment.level, location: assignment.location, subject: assignment.subject, unmappable,
    });
    return { tutors: [], scored: [], stats: withStats ? { unmappable, stages: [], matched: 0, dominantFilter: null } : null };
  }

  const query = stages[stages.length - 1].query;

  // Exposure caps (Phase 10 step 4): hold tutors already sitting on ≥2 unresolved offers out of new
  // waves. Applied to the FETCH only, not the attrition funnel — the funnel describes the matching
  // pool, while this is a wave-time throttle. Empty/absent set → no change to the query.
  const excludeIds = excludeTutorIds ? [...excludeTutorIds] : [];
  const fetchQuery = excludeIds.length ? { ...query, _id: { $nin: excludeIds } } : query;

  // Count the DB-side funnel BEFORE fetching, so the numbers describe the whole matching set
  // rather than the (bounded) fetch. Sequential, not parallel: this path is off the hot path and
  // a handful of counts on a small collection is cheaper than N concurrent connections.
  let dbStages = [];
  if (withStats) {
    let before = await model.countDocuments({});
    for (const stage of stages) {
      const after = await model.countDocuments(stage.query);
      dbStages.push({ filter: stage.filter, before, after, removed: before - after });
      before = after;
    }
  }

  const candidates = await model.find(fetchQuery)
    .select(CANDIDATE_FIELDS)
    .sort({ createdAt: -1 })
    .limit(MAX_CANDIDATE_FETCH)
    .lean();

  // Drop tutors the assignment clearly can't afford or who can't cover the timing, then
  // quality-rank the rest and hand the strongest `poolSize` to the AI re-ranker.
  const { kept, stages: jsStages } = applyJsFilters(candidates, assignment, levelCategory);

  const ranked = kept
    .map(({ tutor, fit }) => {
      const { score, components } = scoreTutorComponents(tutor, fit, { useQualityGrade });
      const cov = coverageFactor(tutor, requestedFields, levelCategory);
      return { tutor, score: score * cov, components: { ...components, coverageFactor: cov, qualityGrade: tutor.profileFeatures?.qualityGrade ?? null } };
    })
    .sort((a, b) => b.score - a.score);

  // The scored pool (top `poolSize`), carrying rank + score + feature breakdown for the
  // Recommendation decision log (Phase 6). `tutors` is the same list flattened, for callers that
  // only need the docs (the AI re-ranker, escalation's fresh-filter).
  const scored = ranked.slice(0, poolSize).map((r, i) => ({
    tutor: r.tutor, rank: i + 1, score: r.score, components: r.components,
  }));
  const tutors = scored.map(s => s.tutor);
  if (!withStats) return { tutors, scored, stats: null };

  // The JS filters ran on the fetched (≤ MAX_CANDIDATE_FETCH) set, so splice them onto the DB
  // funnel from that set's size — that keeps `before`/`after` continuous across the boundary
  // instead of implying the budget filter saw the full collection.
  const allStages = [...dbStages, ...jsStages];
  return {
    tutors,
    scored,
    stats: {
      unmappable: null,
      stages: allStages,
      matched: ranked.length,
      // Whether the fetch cap truncated the set before the JS filters ran — if so the budget/
      // timeSlots counts are of the 300 fetched, not of everything the query matched.
      fetchTruncated: candidates.length >= MAX_CANDIDATE_FETCH,
      dominantFilter: dominantFilter(allStages),
    },
  };
}

async function findMatchingTutors(assignment, poolSize = 40) {
  const { tutors } = await runMatch(assignment, poolSize);
  return tutors;
}

// Same deterministic match, but returning the SCORED pool: [{ tutor, rank, score, components }],
// best-first. Powers the Recommendation decision log (Phase 6) at the wave-1 and escalation write
// points — they need the ranks/scores/features, not just the tutor docs. `components` already folds
// in coverageFactor and a null qualityGrade, matching Recommendation.featureSnapshot.
async function findMatchingTutorsScored(assignment, poolSize = 40, options = {}) {
  const { scored } = await runMatch(assignment, poolSize, options);
  return scored;
}

// The stats mode: the same match, plus a per-filter attrition funnel explaining how a large tutor
// collection narrowed to a small pool. Powers the ops console's "pool smaller than wave" row
// (roadmap Phase 3) and, later, intake budget calibration (Phase 8).
//
// Returns { tutors, stats } where stats is
//   { unmappable, stages: [{ filter, before, after, removed }], matched, fetchTruncated, dominantFilter }.
async function findMatchingTutorsWithStats(assignment, poolSize = 40, options = {}) {
  return runMatch(assignment, poolSize, { ...options, withStats: true });
}

// --- Intake budget calibration (roadmap Phase 8) ---------------------------
// Before outreach starts, tell the owner whether an assignment is postable at its rate: how many
// tutors it can afford now, the typical rate for this level/region, and what raising the budget
// would unlock. Informational ONLY — it never blocks posting (see roadmap "No blocking behavior").

// Round UP to the nearest $5 — the granularity parents and tutors actually think in, so a suggested
// rate reads as a real number ($45) rather than an interpolated one ($43.75).
function roundUpTo5(n) {
  return Math.ceil(n / 5) * 5;
}

// Linear-interpolated percentile of an ascending-sorted numeric array (p in 0..1). null when empty.
// Same method as a spreadsheet PERCENTILE — no dependency, and the arrays here are tiny.
function percentile(sortedAsc, p) {
  if (!sortedAsc.length) return null;
  const idx = (sortedAsc.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedAsc[lo];
  return sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * (idx - lo);
}

// How many tutors in `pool` would accept a FLAT ceiling of `ceiling` for this level — the what-if
// behind "At $25/h: 4 tutors. At $40/h: 31." Uses the SAME budgetFit as live matching (so the
// what-if can't drift from reality), with one default band applied to everyone: a hypothetical
// budget is a single number, not the per-tutor-type bands a real assignment carries. null ceiling
// (unparseable rate) → null.
function poolAtCeiling(pool, ceiling, levelCategory) {
  if (ceiling == null) return null;
  const budget = { bands: { default: ceiling }, overallMax: ceiling };
  return pool.filter(t => budgetFit(t, budget, levelCategory).affordable).length;
}

// Pure core of the calibration. `pool` is the tutors matching the assignment on everything EXCEPT
// budget (DB hard filters + timing already applied); `stats` is the attrition funnel from the live
// match. Returns the view-model the owner confirmation and website hint render — no I/O, so it's
// unit-testable directly.
//
// Two distinct failure modes the numbers separate, because they need opposite responses:
//   • budget too low  → `pool` is large but few are affordable now; raising the rate helps.
//   • supply too thin → `pool` itself is tiny; raising the rate won't help, the region/subject is
//     the bottleneck (`dominantFilter`). `poolTotal` vs `poolAtCurrent` is exactly this distinction.
function summarizeBudget(pool, assignment, levelCategory, stats) {
  const floors = pool
    .map(t => tutorFloorRate(t, levelCategory))
    .filter(f => f != null)
    .sort((a, b) => a - b);

  const typical = floors.length
    ? {
        p25: Math.round(percentile(floors, 0.25)),
        p50: Math.round(percentile(floors, 0.50)),
        p75: Math.round(percentile(floors, 0.75)),
      }
    : null;

  const budget = resolveBudget(assignment);
  const currentCeiling = budget.overallMax; // representative single number for the "At $X" line
  const poolAtCurrent = poolAtCeiling(pool, currentCeiling, levelCategory);

  // Suggest a higher rate only when raising would genuinely help: the p75 floor rounded up to $5,
  // and only if it exceeds the current ceiling AND reaches strictly more tutors. At p75, roughly
  // three-quarters of available tutors are within reach. When supply (not price) is the limit this
  // stays null — nudging the budget up would be misleading.
  let suggested = null;
  let poolAtSuggested = null;
  if (typical && currentCeiling != null) {
    const candidate = roundUpTo5(typical.p75);
    if (candidate > currentCeiling) {
      const reachable = poolAtCeiling(pool, candidate, levelCategory);
      if (reachable > poolAtCurrent) {
        suggested = candidate;
        poolAtSuggested = reachable;
      }
    }
  }

  return {
    poolTotal: pool.length,        // match everything but budget — the ceiling of what any rate buys
    floorSampleSize: floors.length, // how many tutors named a rate for this level (confidence)
    currentCeiling,
    poolAtCurrent,
    typical,
    suggested,
    poolAtSuggested,
    dominantFilter: stats?.dominantFilter ?? null,
    fetchTruncated: stats?.fetchTruncated ?? false,
  };
}

// Async entry point: run the calibration for an assignment against the live tutor collection.
// Reuses runMatch's tested stats path for the funnel/dominant filter, plus one extra fetch of the
// pre-budget pool WITH rateNumeric (which CANDIDATE_FIELDS omits) for the floor percentiles. Off
// the hot path — it runs once, at creation — so the second fetch is fine. `model` injectable for tests.
//
// Returns { ok: false, unmappable } when the assignment can't be mapped (nothing to calibrate), else
// { ok: true, levelCategory, region, ...summarizeBudget() }.
async function budgetCalibration(assignment, options = {}) {
  const model = options.model || Tutor;
  const { unmappable, stages, levelCategory, region } = buildFilterStages(assignment);
  if (unmappable) return { ok: false, unmappable };

  const { stats } = await runMatch(assignment, 1, { withStats: true, model });

  const query = stages[stages.length - 1].query;
  const candidates = await model.find(query)
    .select('tutorType rateNumeric hourlyRate availableTimeSlots')
    .sort({ createdAt: -1 })
    .limit(MAX_CANDIDATE_FETCH)
    .lean();
  const pool = candidates.filter(t => timeSlotsMatch(assignment, t));

  return { ok: true, unmappable: null, levelCategory, region, ...summarizeBudget(pool, assignment, levelCategory, stats) };
}

// The typical asking rate for a level (optionally narrowed by region and tutor type), as p25/p50/p75
// of tutor floors — the read-only "hint" beside the website form's budget field (roadmap Phase 8).
// Lighter than budgetCalibration: no subject/assignment, just "what do tutors charge for this level".
// Uses the SAME floor + percentile logic as the owner-side calibration, so both sides agree.
//
// `level` is free-text from the form, so it goes through getLevelCategoryLoose — the shorthand-
// tolerant matcher — resolving "Secondary 3 A-Math" AND "Sec 3"/"S3"/"P4"/"JC1" to a category.
// Anything unrecognizable returns ok:false and the form shows no hint (never a wrong one). The
// strict getLevelCategory stays the matcher's entry point; only this free-text path is lenient.
// `location`/`type` are optional filters.
async function rateGuide({ level, location, type } = {}, options = {}) {
  const model = options.model || Tutor;
  const levelCategory = getLevelCategoryLoose(level);
  if (!levelCategory) return { ok: false, reason: 'level' };

  // Only tutors who stated a rate for this level speak to its market rate. hourlyRate.<cat> is the
  // source text (always present when a rate was entered); rateNumeric is derived from it, and
  // tutorFloorRate prefers the numeric mirror then falls back to parsing the text.
  const query = { pausedAt: null, [`hourlyRate.${levelCategory}`]: { $nin: [null, ''] } };
  if (location) {
    const region = LOCATION_TO_REGION[location];
    if (region) query[`locations.${region}`] = true;
  }
  if (type) {
    const allowed = TUTOR_TYPE_MAP[type];
    if (allowed) query.tutorType = { $in: allowed };
  }

  const candidates = await model.find(query)
    .select(`tutorType rateNumeric hourlyRate`)
    .limit(MAX_CANDIDATE_FETCH)
    .lean();

  const floors = candidates
    .map(t => tutorFloorRate(t, levelCategory))
    .filter(f => f != null)
    .sort((a, b) => a - b);

  if (!floors.length) return { ok: true, levelCategory, typical: null, sampleSize: 0 };
  return {
    ok: true,
    levelCategory,
    typical: {
      p25: Math.round(percentile(floors, 0.25)),
      p50: Math.round(percentile(floors, 0.50)),
      p75: Math.round(percentile(floors, 0.75)),
    },
    sampleSize: floors.length,
  };
}

export {
  findMatchingTutors,
  findMatchingTutorsScored,
  findMatchingTutorsWithStats,
  budgetCalibration,
  rateGuide,
  summarizeBudget,
  percentile,
  buildFilterStages,
  applyJsFilters,
  dominantFilter,
  shortlistScore,
  shortlistReason,
  buildFeatureSnapshot,
  POLICY_VERSION,
  getLevelCategory,
  subjectToFieldName,
  LOCATION_TO_REGION,
  // Exported for unit tests of the Phase 7 numeric-preferred budget path.
  resolveBudget,
  tutorFloorRate,
  budgetFit,
};
