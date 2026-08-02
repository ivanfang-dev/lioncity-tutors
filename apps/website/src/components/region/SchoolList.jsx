/**
 * Primary and secondary school lists for a corridor's catchment.
 *
 * Renders nothing when both lists are empty, since an unverified school name
 * is worse than a shorter list — the page.jsx that calls this should also
 * omit the whole section heading when both arrays are empty.
 */
export default function SchoolList({ schools }) {
  const { primary = [], secondary = [] } = schools || {};
  if (primary.length === 0 && secondary.length === 0) return null;

  return (
    <div className="mt-5 grid gap-6 sm:grid-cols-2">
      {primary.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-text-default">Primary schools</h3>
          <ul className="mt-2 space-y-1 text-sm text-text-default/85">
            {primary.map((school) => (
              <li key={school}>{school}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {secondary.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-text-default">Secondary schools</h3>
          <ul className="mt-2 space-y-1 text-sm text-text-default/85">
            {secondary.map((school) => (
              <li key={school}>{school}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
