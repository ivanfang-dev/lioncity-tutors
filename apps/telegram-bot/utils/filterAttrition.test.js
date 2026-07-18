import { describe, test, expect } from '@jest/globals';
import {
  buildFilterStages,
  applyJsFilters,
  dominantFilter,
  findMatchingTutorsWithStats,
} from './tutorMatcher.js';

// Bishan is Central in LOCATION_TO_REGION; Secondary 3 → levelCategory 'secondary'.
const assignment = {
  level: 'Secondary 3',
  subject: 'Mathematics',
  title: 'Sec 3 Maths',
  location: 'Bishan',
  rate: '$50/hr',
};

function tutor(overrides = {}) {
  return {
    _id: 'x',
    fullName: 'T',
    yearsOfExperience: '3-5 years',
    hourlyRate: { secondary: '$40/hr' },
    tutorType: 'Part-time Tutor',
    teachingLevels: { secondary: { mathematics: true } },
    responseStats: { contacted: 10, responded: 8 },
    ...overrides,
  };
}

describe('buildFilterStages', () => {
  test('chains the always-on filters in funnel order', () => {
    const { unmappable, stages } = buildFilterStages(assignment);
    expect(unmappable).toBeNull();
    expect(stages.map(s => s.filter)).toEqual(['contactable', 'active', 'region', 'subject']);
  });

  test('each stage query is cumulative — the last one is the full query', () => {
    const { stages } = buildFilterStages(assignment);
    expect(stages[0].query).toEqual({ contactNumber: { $nin: [null, ''] } });
    expect(stages[1].query).toEqual({
      contactNumber: { $nin: [null, ''] },
      pausedAt: null,
    });
    expect(stages[2].query).toEqual({
      contactNumber: { $nin: [null, ''] },
      pausedAt: null,
      'locations.central': true,
    });
    expect(stages[3].query).toEqual({
      contactNumber: { $nin: [null, ''] },
      pausedAt: null,
      'locations.central': true,
      'teachingLevels.secondary.mathematics': true,
    });
  });

  test('adds tutorType only when the assignment asks for one', () => {
    const { stages } = buildFilterStages({ ...assignment, preferredTutorTypes: ['Full-time'] });
    expect(stages.map(s => s.filter)).toContain('tutorType');
    expect(stages.at(-1).query.tutorType).toEqual({ $in: ['Full-time Tutor', 'Fulltime'] });
  });

  test('adds gender only when the parent specified one', () => {
    expect(buildFilterStages({ ...assignment, preferredGender: 'No preference' }).stages.map(s => s.filter))
      .not.toContain('gender');
    const { stages } = buildFilterStages({ ...assignment, preferredGender: 'Female' });
    expect(stages.map(s => s.filter)).toContain('gender');
    expect(stages.at(-1).query.gender).toBe('Female');
  });

  test('names the field that could not be mapped, with no stages', () => {
    expect(buildFilterStages({ ...assignment, level: 'Hogwarts Year 4' }))
      .toMatchObject({ unmappable: 'level', stages: [] });
    expect(buildFilterStages({ ...assignment, location: 'Atlantis' }))
      .toMatchObject({ unmappable: 'location', stages: [] });
    expect(buildFilterStages({ ...assignment, subject: '???' }))
      .toMatchObject({ unmappable: 'subject', stages: [] });
  });
});

describe('applyJsFilters', () => {
  test('counts what the budget filter removed', () => {
    const candidates = [
      tutor({ hourlyRate: { secondary: '$40/hr' } }),  // affordable
      tutor({ hourlyRate: { secondary: '$200/hr' } }), // way over the $50 ceiling + 20% grace
    ];
    const { kept, stages } = applyJsFilters(candidates, assignment, 'secondary');
    expect(kept).toHaveLength(1);
    expect(stages[0]).toEqual({ filter: 'budget', before: 2, after: 1, removed: 1 });
  });

  test('counts what the timing filter removed, downstream of budget', () => {
    const wantsWeekend = { ...assignment, preferredTimeSlots: { weekendMorning: true } };
    const candidates = [
      tutor({ availableTimeSlots: { weekendMorning: true } }),
      tutor({ availableTimeSlots: { weekdayMorning: true } }), // no overlap
      tutor({ hourlyRate: { secondary: '$200/hr' } }),         // dropped by budget first
    ];
    const { kept, stages } = applyJsFilters(candidates, wantsWeekend, 'secondary');
    expect(kept).toHaveLength(1);
    expect(stages).toEqual([
      { filter: 'budget', before: 3, after: 2, removed: 1 },
      { filter: 'timeSlots', before: 2, after: 1, removed: 1 },
    ]);
  });

  test('keeps the budget fit it computed, so scoring never re-parses the rate', () => {
    const { kept } = applyJsFilters([tutor()], assignment, 'secondary');
    expect(kept[0].fit).toMatchObject({ affordable: true });
    expect(kept[0].fit.comfort).toBeGreaterThan(0);
  });

  test('removes nothing when every candidate fits', () => {
    const { stages } = applyJsFilters([tutor(), tutor()], assignment, 'secondary');
    expect(stages.every(s => s.removed === 0)).toBe(true);
  });
});

describe('dominantFilter', () => {
  test('names the filter that cost the most candidates', () => {
    expect(dominantFilter([
      { filter: 'region', removed: 5 },
      { filter: 'subject', removed: 40 },
      { filter: 'budget', removed: 2 },
    ])).toBe('subject');
  });

  test('is null when nothing was removed', () => {
    expect(dominantFilter([{ filter: 'region', removed: 0 }, { filter: 'budget', removed: 0 }])).toBeNull();
  });

  test('ties go to the earlier, broader filter — the more useful one to widen', () => {
    expect(dominantFilter([
      { filter: 'region', removed: 10 },
      { filter: 'budget', removed: 10 },
    ])).toBe('region');
  });
});

// A stand-in for the Tutor model: countDocuments answers from a per-filter table keyed by the
// stage's distinguishing clause, and find() replays the chainable select/sort/limit/lean calls.
function fakeModel({ counts, docs }) {
  const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => docs };
  return {
    countDocuments: async (query) => {
      if (Object.keys(query).length === 0) return counts.total;
      if (query.gender) return counts.gender;
      if (query.tutorType) return counts.tutorType;
      if (query['teachingLevels.secondary.mathematics']) return counts.subject;
      if (query['locations.central']) return counts.region;
      // Checked last of the clauses: every later stage's query also carries pausedAt (the chain
      // is cumulative), so this must only catch the 'active' stage itself — {contactNumber, pausedAt}.
      if (query.pausedAt !== undefined) return counts.active;
      return counts.contactable;
    },
    find: () => chain,
  };
}

describe('findMatchingTutorsWithStats', () => {
  test('reports the full funnel from total tutors down to the matched pool', async () => {
    const { tutors, stats } = await findMatchingTutorsWithStats(assignment, 40, {
      model: fakeModel({
        counts: { total: 500, contactable: 480, active: 470, region: 120, subject: 31 },
        docs: [tutor(), tutor({ hourlyRate: { secondary: '$200/hr' } })],
      }),
    });

    expect(stats.unmappable).toBeNull();
    expect(stats.stages).toEqual([
      { filter: 'contactable', before: 500, after: 480, removed: 20 },
      { filter: 'active', before: 480, after: 470, removed: 10 },
      { filter: 'region', before: 470, after: 120, removed: 350 },
      { filter: 'subject', before: 120, after: 31, removed: 89 },
      { filter: 'budget', before: 2, after: 1, removed: 1 },
      { filter: 'timeSlots', before: 1, after: 1, removed: 0 },
    ]);
    expect(stats.dominantFilter).toBe('region');
    expect(stats.matched).toBe(1);
    expect(tutors).toHaveLength(1);
  });

  test('includes the optional filters in the funnel when the assignment uses them', async () => {
    const { stats } = await findMatchingTutorsWithStats(
      { ...assignment, preferredTutorTypes: ['Full-time'], preferredGender: 'Female' },
      40,
      {
        model: fakeModel({
          counts: { total: 500, contactable: 480, active: 470, region: 120, subject: 31, tutorType: 9, gender: 3 },
          docs: [tutor()],
        }),
      }
    );
    expect(stats.stages.map(s => s.filter)).toEqual([
      'contactable', 'active', 'region', 'subject', 'tutorType', 'gender', 'budget', 'timeSlots',
    ]);
    expect(stats.stages.find(s => s.filter === 'tutorType')).toMatchObject({ before: 31, after: 9, removed: 22 });
    expect(stats.stages.find(s => s.filter === 'gender')).toMatchObject({ before: 9, after: 3, removed: 6 });
  });

  test('an unmappable assignment reports zero matches and no funnel, without querying', async () => {
    let queried = false;
    const model = {
      countDocuments: async () => { queried = true; return 0; },
      find: () => { queried = true; return { select: () => ({ sort: () => ({ limit: () => ({ lean: async () => [] }) }) }) }; },
    };
    const { tutors, stats } = await findMatchingTutorsWithStats({ ...assignment, location: 'Atlantis' }, 40, { model });
    expect(tutors).toEqual([]);
    expect(stats).toEqual({ unmappable: 'location', stages: [], matched: 0, dominantFilter: null });
    expect(queried).toBe(false);
  });

  test('flags when the fetch cap truncated the set the JS filters saw', async () => {
    const docs = Array.from({ length: 300 }, () => tutor());
    const { stats } = await findMatchingTutorsWithStats(assignment, 40, {
      model: fakeModel({ counts: { total: 500, contactable: 500, region: 500, subject: 400 }, docs }),
    });
    expect(stats.fetchTruncated).toBe(true);
  });

  test('does not flag truncation on a normal, small pool', async () => {
    const { stats } = await findMatchingTutorsWithStats(assignment, 40, {
      model: fakeModel({ counts: { total: 500, contactable: 480, region: 120, subject: 31 }, docs: [tutor()] }),
    });
    expect(stats.fetchTruncated).toBe(false);
  });
});

// Phase 4: tutors who told us they've stopped tutoring (decline reason 'inactive' → pausedAt)
// must never be matched or messaged again until they re-engage.
describe('pausedAt hard filter', () => {
  const stageFilters = (a = assignment) => buildFilterStages(a).stages.map(s => s.filter);
  const finalQuery = (a = assignment) => {
    const { stages } = buildFilterStages(a);
    return stages[stages.length - 1].query;
  };

  test('the chain includes an active stage', () => {
    expect(stageFilters()).toContain('active');
  });

  test('the final query excludes paused tutors', () => {
    expect(finalQuery().pausedAt).toBeNull();
  });

  test('matches absent-or-null, so tutors predating the field are unaffected', () => {
    // Mongo equality on null matches docs where the field is null OR missing entirely — the
    // whole point of querying `pausedAt: null` rather than `$exists: false`.
    expect(Object.prototype.hasOwnProperty.call(finalQuery(), 'pausedAt')).toBe(true);
    expect(finalQuery().pausedAt).not.toEqual({ $exists: false });
  });

  test('is applied before the expensive stages, so the funnel reads honestly', () => {
    const filters = stageFilters();
    expect(filters.indexOf('active')).toBeGreaterThanOrEqual(0);
    expect(filters.indexOf('active')).toBeLessThan(filters.indexOf('subject'));
  });
});
