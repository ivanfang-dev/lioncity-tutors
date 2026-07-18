/**
 * A small hairline pill used to tag topics and sub-topics within a guide.
 */
export default function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}
