import { Chip } from '@/components/guide';

/** MRT/LRT lines serving a corridor, plus the corridor-specific travel note. */
export default function TransportNote({ transport }) {
  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        {transport.lines.map((line) => (
          <Chip key={line}>{line}</Chip>
        ))}
      </div>
      <p className="mt-4 text-text-default/85 leading-relaxed text-pretty">{transport.note}</p>
    </div>
  );
}
