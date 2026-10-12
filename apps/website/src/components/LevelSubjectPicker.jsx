"use client";

import { useEffect, useId, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Input } from "./ui/input";
import {
  LEVELS, STREAMS, ARRANGEMENTS, levelFor, yearsFor, subjectsFor, subjectGroups, selectLevel, selectYear,
  needsArrangement,
} from "@/lib/levelSubjects.mjs";

const cn = (...classes) => classes.filter(Boolean).join(" ");

// Pick-one pills. Toggle buttons rather than radios, so an optional choice (stream) can be tapped off again.
// Without `selected` it's a plain action button (no pressed state).
const Chip = ({ id, selected, onClick, children }) => (
  <button
    id={id}
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
      selected
        ? "border-primary bg-primary text-white"
        : "border-gray-300 bg-white text-text-secondary hover:border-primary hover:text-primary"
    )}
  >
    {children}
  </button>
);

// Pick-many tiles: a checkbox square says "choose several" before anything is tapped,
// where the pick-one rows above are pills. `action` makes it a plain button (More subjects).
const Tile = ({ id, checked, action, onClick, children }) => (
  <button
    id={id}
    type="button"
    role={action ? undefined : "checkbox"}
    aria-checked={action ? undefined : checked}
    onClick={onClick}
    className={cn(
      "flex min-h-12 w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
      action
        ? "border-dashed border-gray-300 bg-white text-primary hover:border-primary"
        : checked
          ? "border-primary bg-primary/5 text-text-default"
          : "border-gray-300 bg-white text-text-secondary hover:border-primary hover:text-primary"
    )}
  >
    {action ? (
      <Plus size={16} aria-hidden="true" className="shrink-0" />
    ) : (
      <span
        aria-hidden="true"
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked ? "border-primary bg-primary text-white" : "border-gray-400 bg-white"
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
    )}
    <span className="min-w-0">{children}</span>
  </button>
);

const ChipRow = ({ label, hint, children }) => {
  const id = useId();
  return (
    <div className="animate-fadeIn">
      <p id={id} className="text-sm font-medium text-text-secondary">
        {label}
        {hint && <span className="font-normal text-text-tertiary"> {hint}</span>}
      </p>
      <div role="group" aria-labelledby={id} className="mt-1.5 flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

// One child's level, year, optional stream and subjects, revealed a row at a time.
export default function LevelSubjectPicker({ student, onChange, error, heading, onRemove }) {
  const [otherOpen, setOtherOpen] = useState(false);
  // Restored drafts arrive after mount, so saved Other text opens the field too.
  const showOther = otherOpen || student.other !== "";
  const otherSubjectsId = useId();
  useEffect(() => { if (otherOpen) document.getElementById(otherSubjectsId)?.focus(); }, [otherOpen, otherSubjectsId]);
  const otherId = useId();
  const level = levelFor(student.level);
  const years = yearsFor(student.level);
  const yearChosen = years.length === 0 || years.some((y) => y.id === student.year);
  const subjects = subjectsFor(student.level, student.year);
  const [moreClicked, setMoreClicked] = useState(false);
  // A restored draft that picked a folded subject shows the full list.
  const showMore = moreClicked || subjects.some((s) => s.more && student.subjects.includes(s.name));
  const hasMore = subjects.some((s) => s.more);
  const groups = subjectGroups(student.level, student.year, showMore);
  const firstMore = groups.flatMap((g) => g.subjects).find((s) => s.more);
  const firstMoreId = useId();
  const subjectsLabelId = useId();
  // The "More subjects" tile vanishes on tap, so focus moves to the first tile it revealed.
  useEffect(() => { if (moreClicked) document.getElementById(firstMoreId)?.focus(); }, [moreClicked, firstMoreId]);

  const toggleSubject = (name) => onChange({
    ...student,
    subjects: student.subjects.includes(name)
      ? student.subjects.filter((s) => s !== name)
      : [...student.subjects, name],
  });

  const toggleOther = () => {
    if (showOther) onChange({ ...student, other: "" });
    setOtherOpen(!showOther);
  };

  return (
    <div className={cn("space-y-4", heading && "rounded-xl border border-border p-4")}>
      {heading && (
        <div className="-mb-1 flex items-center justify-between">
          <p className="font-semibold text-text-default">{heading}</p>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${heading}`}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-error/10 hover:text-error"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      <ChipRow label="Level">
        {LEVELS.map((l) => (
          <Chip key={l.id} selected={student.level === l.id} onClick={() => onChange(selectLevel(student, l.id))}>
            {l.label}
          </Chip>
        ))}
      </ChipRow>

      {years.length > 0 && (
        <ChipRow key={`${student.level}-year`} label="Year">
          {years.map((y) => (
            <Chip key={y.id} selected={student.year === y.id} onClick={() => onChange(selectYear(student, y.id))}>
              {y.label}
            </Chip>
          ))}
        </ChipRow>
      )}

      {level?.hasStream && yearChosen && (
        <ChipRow label="Stream" hint="(optional)">
          {STREAMS.map((s) => (
            <Chip
              key={s.id}
              selected={student.stream === s.id}
              onClick={() => onChange({ ...student, stream: student.stream === s.id ? "" : s.id })}
            >
              {s.label}
            </Chip>
          ))}
        </ChipRow>
      )}

      {level && yearChosen && (level.textOnly ? (
        <div className="animate-fadeIn">
          <label htmlFor={otherId} className="text-sm font-medium text-text-secondary">{level.textOnly}</label>
          <Input
            id={otherId}
            type="text"
            value={student.other}
            onChange={(e) => onChange({ ...student, other: e.target.value })}
            placeholder={level.id === "other" ? "e.g., University calculus, IELTS, piano" : "e.g., Higher Nitec Electrical, Engineering Maths"}
            className="mt-1.5 h-12 text-base"
          />
        </div>
      ) : (
        <div key={`${student.level}-subjects`} className="animate-fadeIn">
          <p id={subjectsLabelId} className="text-sm font-medium text-text-secondary">
            Subjects <span className="font-normal text-text-tertiary">(pick all that apply)</span>
          </p>
          <div role="group" aria-labelledby={subjectsLabelId} className="mt-1.5 space-y-3">
            {groups.map((g) => (
              <div key={g.label || "all"} role={g.label ? "group" : undefined} aria-label={g.label || undefined}>
                {g.label && <p aria-hidden="true" className="mb-1.5 text-sm text-text-tertiary">{g.label}</p>}
                <div className="grid grid-cols-2 gap-2">
                  {g.subjects.map((s) => (
                    <Tile
                      key={s.name}
                      id={s === firstMore ? firstMoreId : undefined}
                      checked={student.subjects.includes(s.name)}
                      onClick={() => toggleSubject(s.name)}
                    >
                      {s.label}
                    </Tile>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              {hasMore && !showMore && (
                <Tile action onClick={() => setMoreClicked(true)}>More subjects</Tile>
              )}
              <Tile checked={showOther} onClick={toggleOther}>Other</Tile>
              {showOther && (
                <Input
                  type="text"
                  id={otherSubjectsId}
                  aria-label="Other subjects"
                  value={student.other}
                  onChange={(e) => onChange({ ...student, other: e.target.value })}
                  placeholder="e.g., Hindi, Computing"
                  className="col-span-2 h-12 text-base"
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {level && !level.textOnly && needsArrangement(student) && (
        <ChipRow label="Same tutor for all subjects?" hint="(optional)">
          {ARRANGEMENTS.map((a) => (
            <Chip
              key={a.id}
              selected={student.arrangement === a.id}
              onClick={() => onChange({ ...student, arrangement: student.arrangement === a.id ? "" : a.id })}
            >
              {a.label}
            </Chip>
          ))}
        </ChipRow>
      )}

      {error && <p className="text-sm text-error-text">{error}</p>}
    </div>
  );
}
