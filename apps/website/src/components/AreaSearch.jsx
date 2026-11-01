'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, MapPin, X } from 'lucide-react';
import { AREA_SHORT_FORMS } from '@/data/areaSearch';
import { ICON_STROKE } from '@/components/guide';

const MAX_RESULTS = 5;

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

// Lower is better: exact or short form, then the name's start, then any word's start.
function rank(place, q) {
  const name = norm(place.name);
  if (name === q || AREA_SHORT_FORMS[q] === place.name) return 0;
  if (name.startsWith(q)) return 1;
  if (place.name.split(/[\s-]+/).some((word) => norm(word).startsWith(q))) return 2;
  return -1;
}

function search(places, query) {
  const q = norm(query);
  if (!q) return [];
  return places
    .map((place) => ({ place, score: rank(place, q) }))
    .filter((m) => m.score >= 0)
    .sort((a, b) => a.score - b.score || !!a.place.within - !!b.place.within || a.place.name.localeCompare(b.place.name))
    .slice(0, MAX_RESULTS)
    .map((m) => m.place);
}

/**
 * The keyboard and typing path to the map's area pick: a combobox over the planning areas and estates.
 *
 * @param {{ name: string, within?: string }[]} places - everything a parent can find
 * @param {(place: object) => void} onPick - drops the pin, exactly like a click on the map
 * @param {(text: string) => void} onCarry - takes text that matched nothing into the request
 * @param {() => void} onClose - leaves search and returns the map to the replay
 */
export default function AreaSearch({ places, coarse, focus, onPick, onCarry, onClose, className = '' }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const id = useId();

  // Touch keeps the keyboard down until the field is tapped, so the map stays in view.
  useEffect(() => {
    if (focus) inputRef.current?.focus();
  }, [focus]);

  const text = query.trim();
  const matches = search(places, query);
  const open = text.length > 0;
  const count = matches.length || 1;
  const optionId = (i) => `${id}-option-${i}`;

  const choose = (i) => (matches[i] ? onPick(matches[i]) : onCarry(text));

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!open) return;
      event.preventDefault();
      setActive((a) => (a + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (query) setQuery('');
      else onClose();
    }
  };

  const optionClass = (i) =>
    `flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2 text-base pointer-fine:text-sm transition-colors duration-150 ${
      i === active ? 'bg-primary/10 text-primary-deep' : 'text-gray-800'
    }`;

  return (
    <div className={`${className} w-[min(20rem,100%)]`}>
      <div className="flex min-h-11 items-center gap-2 rounded-full border border-primary/40 bg-white pl-3.5 pr-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={ICON_STROKE} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search for your area"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open ? optionId(active) : undefined}
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={coarse ? 'Type your area, or tap the map' : 'Type your area, or click the map'}
          // 16px on touch, or iOS zooms the page on focus.
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-gray-900 outline-none placeholder:text-gray-500 pointer-fine:text-sm"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close area search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800"
        >
          <X className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </button>
      </div>

      <ul
        id={`${id}-list`}
        role="listbox"
        aria-label="Areas"
        hidden={!open}
        className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
      >
        {matches.map((place, i) => (
          <li
            key={place.name}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            // Keeps focus in the field, so the list never closes under the pointer.
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(i)}
            className={optionClass(i)}
          >
            <span className="font-medium">{place.name}</span>
            {place.within && <span className="shrink-0 text-xs text-gray-500">in {place.within}</span>}
          </li>
        ))}
        {open && !matches.length && (
          <li
            id={optionId(0)}
            role="option"
            aria-selected
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(0)}
            className={`${optionClass(0)} py-3`}
          >
            <span className="min-w-0">
              <span className="block font-medium">Use “{text}” in your request</span>
              <span className="mt-0.5 block text-xs text-gray-500">Not listed, but we cover all of Singapore.</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden="true" />
          </li>
        )}
      </ul>
    </div>
  );
}
