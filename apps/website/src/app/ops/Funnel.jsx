// The outreach funnel as text: contacted 14 → replied 6 → interested 4 → shown 3. Deliberately
// not a chart (roadmap: no charts in v1) — four numbers read faster than any graphic at this size,
// and the drop between them is the whole story.
export default function Funnel({ funnel }) {
  const steps = [
    { label: 'contacted', value: funnel.contacted },
    { label: 'replied', value: funnel.replied },
    { label: 'interested', value: funnel.interested },
    { label: 'shown', value: funnel.shown },
  ];

  return (
    <dl className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[var(--color-text-tertiary)]">
      {steps.map((step, i) => (
        <span key={step.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true" className="text-[var(--color-gray-300)]">→</span>}
          <dt className="sr-only">{step.label}</dt>
          <span>
            <dd className="inline font-medium tabular-nums text-[var(--color-text-default)]">{step.value}</dd>{' '}
            {step.label}
          </span>
        </span>
      ))}
    </dl>
  );
}
