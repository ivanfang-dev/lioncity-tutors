import { getExam } from '@/data/examCalendar2026.mjs';

const LONG_DATE = new Intl.DateTimeFormat('en-SG', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});

/** Formats an ISO date as e.g. "Mon, 5 Oct 2026". */
function formatDate(iso) {
  return LONG_DATE.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Official 2026 examination timetable, read from the SEAB data module.
 *
 * @param {string} examSlug - 'psle' | 'o-level' | 'n-level' | 'a-level'
 * @param {string[]} [subjectSlugs] - restrict to these subjects, in this order
 * @param {string} [caption]
 */
export default function ExamTimetable({ examSlug, subjectSlugs, caption }) {
  const exam = getExam(examSlug);
  if (!exam) return null;

  const subjects = subjectSlugs
    ? subjectSlugs.map((s) => exam.subjects.find((x) => x.slug === s)).filter(Boolean)
    : exam.subjects;

  if (subjects.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="mb-3 text-left text-sm text-gray-600">{caption}</caption>
        ) : null}
        <thead>
          <tr className="border-b-2 border-gray-200 text-gray-900">
            <th scope="col" className="py-2 pr-4 font-semibold">Subject</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Paper</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Date</th>
            <th scope="col" className="py-2 font-semibold">Time</th>
          </tr>
        </thead>
        <tbody>
          {subjects.flatMap((subject) =>
            subject.papers.map((paper, i) => (
              <tr key={`${subject.slug}-${paper.label}`} className="border-b border-gray-100">
                {i === 0 ? (
                  <th
                    scope="rowgroup"
                    rowSpan={subject.papers.length}
                    className="py-2 pr-4 align-top font-medium text-gray-900"
                  >
                    {subject.name}
                    {subject.code ? (
                      <span className="block text-xs font-normal text-gray-500">
                        Syllabus {subject.code}
                      </span>
                    ) : null}
                  </th>
                ) : null}
                <td className="py-2 pr-4 text-gray-700">{paper.label}</td>
                <td className="py-2 pr-4 tabular-nums text-gray-700">{formatDate(paper.date)}</td>
                <td className="py-2 tabular-nums text-gray-700">{paper.time ?? paper.note ?? '—'}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
