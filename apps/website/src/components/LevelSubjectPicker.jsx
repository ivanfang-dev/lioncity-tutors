"use client";

import { useEffect, useId, useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "./ui/input";
import {
  LEVELS, STREAMS, levelFor, yearsFor, subjectsFor, selectLevel, selectYear,
} from "@/lib/levelSubjects.mjs";

const cn = (...classes) => classes.filter(Boolean).join(" ");

// Toggle buttons rather than radios, so an optional choice (stream) can be tapped off again.
const Chip = ({ selected, onClick, children, check }) => (
  <button
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
    {check && selected && <Check size={14} aria-hidden="true" />}
    {children}
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
        <ChipRow key={`${student.level}-subjects`} label="Subjects" hint="(pick all that apply)">
          {subjects.map((s) => (
            <Chip key={s.name} check selected={student.subjects.includes(s.name)} onClick={() => toggleSubject(s.name)}>
              {s.label}
            </Chip>
          ))}
          <Chip check selected={showOther} onClick={toggleOther}>Other</Chip>
          {showOther && (
            <Input
              type="text"
              id={otherSubjectsId}
              aria-label="Other subjects"
              value={student.other}
              onChange={(e) => onChange({ ...student, other: e.target.value })}
              placeholder="e.g., Hindi, Computing"
              className="h-12 w-full text-base"
            />
          )}
        </ChipRow>
      ))}

      {error && <p className="text-sm text-error-text">{error}</p>}
    </div>
  );
}
