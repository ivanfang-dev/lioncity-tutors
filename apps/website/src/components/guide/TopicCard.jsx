import GuideCard from './GuideCard';
import Chip from './Chip';

/**
 * A topic mastery card: a titled area with an exam-weight note, a row of
 * topic chips, and a labelled list of study actions. The workhorse of a
 * subject guide's syllabus sections.
 *
 * @param {string} title - topic name (e.g. "Cell Structure & Function")
 * @param {string} [weight] - exam-weight note (e.g. "20–25% of papers")
 * @param {string[]} chips - sub-topic tags
 * @param {string} [strategyLabel] - label above the action list
 * @param {string[]} points - study actions
 */
export default function TopicCard({
  title,
  weight,
  chips = [],
  strategyLabel = 'Study strategy',
  points = [],
}) {
  return (
    <GuideCard>
      <h4 className="font-semibold text-gray-900 mb-3">
        {title}
        {weight ? (
          <span className="font-normal text-sm text-gray-500 tabular-nums"> ({weight})</span>
        ) : null}
      </h4>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-900 mb-1.5">{strategyLabel}</p>
      <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </GuideCard>
  );
}
