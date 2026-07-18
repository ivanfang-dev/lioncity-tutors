'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky desktop table of contents with scroll-spy.
 * Highlights the section currently in view. Items: [{ id, label }].
 */
export default function TableOfContents({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      // Trip when a heading passes ~100px below the top; ignore the lower 65%.
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Table of contents" className="border-l border-gray-200 pl-5">
      <p className="mb-3 text-sm font-semibold text-gray-900">In this guide</p>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                className={`block leading-snug transition-colors ${
                  active
                    ? 'text-primary font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
