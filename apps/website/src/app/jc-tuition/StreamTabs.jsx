"use client";

import { useState } from "react";

const STREAMS = [
  { id: 'science', label: 'Science Stream' },
  { id: 'arts', label: 'Arts Stream' },
];

// Science/Arts toggle for the JC subject cards. Both panels are server-rendered and
// the inactive one is hidden, so every subject is in the page HTML.
export default function StreamTabs({ science, arts }) {
  const [activeStream, setActiveStream] = useState('science');
  const panels = { science, arts };

  return (
    <>
      <div className="flex justify-center mb-8">
        <div role="tablist" className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          {STREAMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`stream-tab-${id}`}
              aria-selected={activeStream === id}
              aria-controls={`stream-panel-${id}`}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeStream === id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveStream(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {STREAMS.map(({ id }) => (
        <div
          key={id}
          role="tabpanel"
          id={`stream-panel-${id}`}
          aria-labelledby={`stream-tab-${id}`}
          hidden={activeStream !== id}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {panels[id]}
        </div>
      ))}
    </>
  );
}
