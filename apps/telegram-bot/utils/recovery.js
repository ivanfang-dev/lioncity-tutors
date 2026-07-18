import { Assignment } from '../../../packages/shared/server-exports.js';
import { resolveBudget } from './tutorMatcher.js';
import { LOCATION_TO_REGION, adjacentRegions } from './locations.js';

// Console v2 recovery actions (roadmap deferred item). One-tap fixes for an assignment whose
// outreach stalled — widen to adjacent regions, raise the budget ceiling, or drop the tutor-type
// restriction — each of which also RESETS outreach so a fresh wave goes out against the new
// criteria. Pure DB mutation here (atomic $set, never .save() — legacy assignments would fail
// re-validation); the caller fires the retry wave (resumeOutreach) in the background.

export const RECOVERY_ACTIONS = ['widen_region', 'raise_ceiling', 'relax_type'];
const DEFAULT_CEILING_BUMP = 10; // $/hr, when the caller doesn't specify an amount
const BUDGET_BANDS = ['partTime', 'fullTime', 'moe', 'default'];

// Compute the field changes for one recovery action, or an error if it can't apply (nothing to
// widen/raise/relax). Pure given the assignment — exported for unit testing without a DB.
export function planRecovery(assignment, action, amount) {
  if (action === 'widen_region') {
    const base = LOCATION_TO_REGION[assignment.location];
    const adj = adjacentRegions(base);
    if (!base || adj.length === 0) return { error: 'no_adjacent_regions' };
    const merged = [...new Set([...(assignment.matchRegions || []), ...adj])];
    return { set: { matchRegions: merged }, summary: `Widened to adjacent regions: ${adj.join(', ')}` };
  }

  if (action === 'raise_ceiling') {
    const bump = Number(amount) > 0 ? Number(amount) : DEFAULT_CEILING_BUMP;
    const { bands } = resolveBudget(assignment); // prefers budgetNumeric, falls back to parsing rate
    const raised = {};
    for (const key of BUDGET_BANDS) {
      if (bands[key] != null) raised[key] = bands[key] + bump;
    }
    if (Object.keys(raised).length === 0) return { error: 'no_budget_to_raise' };
    return { set: { budgetNumeric: raised }, summary: `Raised budget ceiling by $${bump}/hr` };
  }

  if (action === 'relax_type') {
    if (!(assignment.preferredTutorTypes?.length)) return { error: 'no_type_to_relax' };
    return { set: { preferredTutorTypes: [] }, summary: 'Removed the tutor-type restriction' };
  }

  return { error: 'invalid_action' };
}

// Apply a recovery action: mutate the assignment and reset outreach so a retry wave counts fresh and
// the tick keeps escalating (mirrors recordParentReject's reset). Returns the reloaded assignment so
// the caller can immediately fire a wave against the NEW criteria. `model` injectable for tests.
export async function applyRecovery({ assignmentId, action, amount } = {}, { model = Assignment } = {}) {
  if (!RECOVERY_ACTIONS.includes(action)) return { ok: false, error: 'invalid_action' };

  const assignment = await model.findById(assignmentId);
  if (!assignment) return { ok: false, error: 'assignment_not_found' };

  const plan = planRecovery(assignment, action, amount);
  if (plan.error) return { ok: false, error: plan.error };

  const now = new Date();
  const set = {
    ...plan.set,
    'outreach.status': 'Active',
    'outreach.startedAt': now,   // reset the 4h clock so the retry gets a full window
    'outreach.lastWaveAt': now,
    status: 'Open',              // reopen in case auto-close already flipped it
  };
  await model.updateOne({ _id: assignment._id }, { $set: set });

  const updated = await model.findById(assignmentId);
  return { ok: true, assignment: updated, summary: plan.summary };
}
