/** Level mix and top-subject tables for a corridor's assignment demand. */
export default function DemandSnapshot({ region }) {
  const { levelMix, topSubjects, name } = region;
  const levelRows = [
    { label: 'Primary', n: levelMix.primary },
    { label: 'Secondary', n: levelMix.secondary },
    { label: 'JC', n: levelMix.jc },
  ].filter((row) => row.n > 0);

  return (
    <div className="mt-5 grid gap-6 sm:grid-cols-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[14rem] border-collapse text-left text-sm">
          <caption className="sr-only">Level mix of assignments in {name}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-semibold text-text-default">Level</th>
              <th scope="col" className="py-2 font-semibold text-text-default">Assignments</th>
            </tr>
          </thead>
          <tbody>
            {levelRows.map((row) => (
              <tr key={row.label} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-3 pr-4 font-medium text-text-default">{row.label}</th>
                <td className="py-3 text-text-default/85">{row.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[14rem] border-collapse text-left text-sm">
          <caption className="sr-only">Top subjects requested in {name}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-semibold text-text-default">Subject</th>
              <th scope="col" className="py-2 font-semibold text-text-default">Assignments</th>
            </tr>
          </thead>
          <tbody>
            {topSubjects.map((s) => (
              <tr key={s.name} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-3 pr-4 font-medium text-text-default">{s.name}</th>
                <td className="py-3 text-text-default/85">{s.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
