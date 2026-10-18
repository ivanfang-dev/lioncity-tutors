"use client";

// Level filter shared by the free papers and free notes libraries. A segmented
// control, not tabs: the shelves below are filtered, not tab panels.
// Segments size to their labels, so "Secondary" never clips on a phone.
export default function LevelFilter({ levels, value, onChange, label }) {
  return (
    <div className="flex justify-center">
      <div
        role="group"
        aria-label={label}
        className="flex w-full max-w-2xl gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm"
      >
        {levels.map(([level, text]) => {
          const active = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-pressed={active}
              className={`min-h-11 flex-auto whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 sm:px-4 ${
                active ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
