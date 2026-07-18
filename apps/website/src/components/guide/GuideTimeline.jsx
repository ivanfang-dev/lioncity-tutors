/**
 * A vertical, numbered timeline for phased study plans. The badge number is
 * derived from order, so items only carry a title and their points.
 *
 * @param {{ title: string, points: string[] }[]} items - ordered phases
 */
export default function GuideTimeline({ items = [] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3 bottom-3 w-px bg-gray-200" aria-hidden="true" />
      <ol className="space-y-8">
        {items.map((item, index) => (
          <li key={item.title} className="relative pl-14">
            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold tabular-nums shadow-sm">
              {index + 1}
            </div>
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
