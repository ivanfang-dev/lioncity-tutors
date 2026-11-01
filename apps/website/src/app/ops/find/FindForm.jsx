'use client';

import { useState } from 'react';
import { EDUCATION_LEVELS, LEVEL_SUBJECT_MAPPINGS } from '@lioncity/shared';
import { SINGAPORE_LOCATIONS } from '@lioncity/shared/utils/locations.js';

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

  return (
    <form method="get" action="/ops/find" className="grid gap-3 rounded-lg border border-[var(--color-border)] bg-white p-4 sm:grid-cols-2">
      <label className={labelClass}>
        Level
        <select name="level" required value={level} onChange={e => setLevel(e.target.value)} className={fieldClass}>
          <option value="" disabled>Choose level</option>
          {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>

      <label className={labelClass}>
        Subject
        {/* Keyed on level so the selection resets when the subject list changes. */}
        <select key={level} name="subject" required defaultValue={subjects.includes(initial.subject) ? initial.subject : ''} disabled={!level} className={fieldClass}>
          <option value="" disabled>{level ? 'Choose subject' : 'Pick a level first'}</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

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

      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#03649f]"
        >
          Find tutors
        </button>
      </div>
    </form>
  );
}
