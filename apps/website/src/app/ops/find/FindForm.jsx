'use client';

import { useState } from 'react';
import { EDUCATION_LEVELS, LEVEL_SUBJECT_MAPPINGS } from '@lioncity/shared';
import { SINGAPORE_LOCATIONS } from '@lioncity/shared/utils/locations.js';
import { TUTOR_TYPES } from '@/lib/ops/tutorTypes.mjs';

// Value = the tutor's dropdown band; label = the parent's "at least N years".
const EXPERIENCE_OPTIONS = [
  ['1-3 years', '1+ years'],
  ['3-5 years', '3+ years'],
  ['5-10 years', '5+ years'],
  ['10+ years', '10+ years'],
];

const fieldClass =
  'mt-1 block w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-default)] focus:border-[var(--color-primary)] focus:outline-none';
const labelClass = 'block text-xs font-medium text-[var(--color-text-secondary)]';

// GET form: the criteria live in the URL, so a search can be bookmarked or linked to pre-filled.
export default function FindForm({ initial }) {
  const [level, setLevel] = useState(initial.level || '');
  const subjects = LEVEL_SUBJECT_MAPPINGS[level] || [];
  const [picked, setPicked] = useState(() => (initial.subject || []).filter(s => subjects.includes(s)));
  const toggle = s => setPicked(p => (p.includes(s) ? p.filter(x => x !== s) : [...p, s]));

  return (
    <form method="get" action="/ops/find" className="grid gap-3 rounded-lg border border-[var(--color-border)] bg-white p-4 sm:grid-cols-2">
      {/* Keeps the assignment's contact tags when the criteria are tweaked. */}
      {initial.assignmentId && <input type="hidden" name="assignmentId" value={initial.assignmentId} />}
      <label className={labelClass}>
        Level
        <select name="level" required value={level} onChange={e => { setLevel(e.target.value); setPicked([]); }} className={fieldClass}>
          <option value="" disabled>Choose level</option>
          {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>

      {/* Several subjects: tutors teaching any of them, full matches ranked first. */}
      <fieldset className="sm:col-span-2">
        <legend className={labelClass}>Subjects</legend>
        {level ? (
          <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
            {subjects.map(s => (
              <label key={s} className="flex items-center gap-2 text-sm text-[var(--color-text-default)]">
                <input
                  type="checkbox"
                  name="subject"
                  value={s}
                  checked={picked.includes(s)}
                  onChange={() => toggle(s)}
                  className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                />
                {s}
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">Pick a level first</p>
        )}
      </fieldset>

      <label className={labelClass}>
        Location
        <select name="location" required defaultValue={initial.location || ''} className={fieldClass}>
          <option value="" disabled>Choose location</option>
          {SINGAPORE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>

      <label className={labelClass}>
        Parent’s max rate
        <input
          name="rate"
          defaultValue={initial.rate || ''}
          placeholder="e.g. 45, or $40 (PT), $55 (FT)"
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Minimum experience
        <select name="minExperience" defaultValue={initial.minExperience || ''} className={fieldClass}>
          <option value="">Any</option>
          {EXPERIENCE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>

      <label className={labelClass}>
        Tutor gender
        <select name="gender" defaultValue={initial.gender || ''} className={fieldClass}>
          <option value="">Any</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
      </label>

      <fieldset className="sm:col-span-2">
        <legend className={labelClass}>Tutor type <span className="font-normal text-[var(--color-text-tertiary)]">· any if none ticked</span></legend>
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
          {TUTOR_TYPES.map(t => (
            <label key={t} className="flex items-center gap-2 text-sm text-[var(--color-text-default)]">
              <input
                type="checkbox"
                name="type"
                value={t}
                defaultChecked={initial.tutorTypes?.includes(t)}
                className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-[var(--color-text-default)] sm:col-span-2">
        <input
          type="checkbox"
          name="nearby"
          value="1"
          defaultChecked={initial.nearby === '1'}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
        Include nearby regions
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={!picked.length}
          className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#03649f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find tutors
        </button>
      </div>
    </form>
  );
}
