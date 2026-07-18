import { describe, test, expect } from '@jest/globals';
import { parentSilenceAction } from './escalation-tick.js';

const H = 60 * 60 * 1000;
const base = new Date('2026-07-16T00:00:00Z');
const ago = (hours) => new Date(base.getTime() - hours * H);

// Minimal assignment shape parentSilenceAction reads.
function asg({ releasedAgoH = null, nudged = false, flagged = false, status = 'Open', contacts = [] } = {}) {
  return {
    status,
    outreach: {
      shortlistReleasedAt: releasedAgoH == null ? undefined : ago(releasedAgoH),
      parentNudgedAt: nudged ? ago(releasedAgoH - 1) : undefined,
      parentSilenceEscalatedAt: flagged ? ago(releasedAgoH - 1) : undefined,
      contacts,
    },
  };
}

describe('parentSilenceAction', () => {
  test('no shortlist released yet → no action', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: null }), base)).toBeNull();
  });

  test('under 24h → no action', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: 10 }), base)).toBeNull();
  });

  test('24–48h and not yet nudged → nudge', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: 25 }), base)).toBe('nudge');
  });

  test('24–48h but already nudged → no action (no double-nudge)', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: 30, nudged: true }), base)).toBeNull();
  });

  test('past 48h → flag, even if already nudged', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: 49, nudged: true }), base)).toBe('flag');
  });

  test('already flagged → no action (done nagging)', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: 60, flagged: true }), base)).toBeNull();
  });

  test('assignment already Filled (parent picked) → no action', () => {
    expect(parentSilenceAction(asg({ releasedAgoH: 30, status: 'Filled' }), base)).toBeNull();
  });

  test('a shortlisted contact already picked → no action', () => {
    const contacts = [{ shortlistRank: 1, parentPickedAt: ago(20) }];
    expect(parentSilenceAction(asg({ releasedAgoH: 30, contacts }), base)).toBeNull();
  });

  test('a shortlisted contact already rejected → no action', () => {
    const contacts = [{ shortlistRank: 1, parentRejectedAt: ago(20) }];
    expect(parentSilenceAction(asg({ releasedAgoH: 30, contacts }), base)).toBeNull();
  });

  test('a STALE reject from a prior shortlist cycle does not suppress the new shortlist nudge', () => {
    // Released 25h ago; a leftover rejected contact from the previous release (rejected 40h ago,
    // i.e. before this release) must not count as "decided".
    const contacts = [
      { shortlistRank: 1, parentRejectedAt: ago(40) }, // stale, pre-release
      { shortlistRank: 1, tutorName: 'New pick candidate' }, // current shortlist, undecided
    ];
    expect(parentSilenceAction(asg({ releasedAgoH: 25, contacts }), base)).toBe('nudge');
  });
});
