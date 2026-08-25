/**
 * Download counts for /free-test-papers.
 *
 * Rows written before paperKey existed name only a subject, and the label they
 * used drifted with the data file's keys across three eras of the site. The
 * table below folds those labels onto the subject names the library uses today.
 * Case matters: "English" is the Secondary 4 shelf, "english" the Primary 6 one.
 */
export const LEGACY_SUBJECT_ALIASES = {
  "Secondary 4 English": "Secondary 4 English",
  "O Level English": "Secondary 4 English",
  English: "Secondary 4 English",
  "P6 Math": "Primary 6 Math",
  "Primary 6 Math": "Primary 6 Math",
  math: "Primary 6 Math",
  "P6 Science": "Primary 6 Science",
  science: "Primary 6 Science",
  "Secondary 4 Biology": "Secondary 4 Biology",
  "O Level Biology": "Secondary 4 Biology",
  "P6 English": "Primary 6 English",
  "Primary 6 English": "Primary 6 English",
  english: "Primary 6 English",
  "Secondary 4 Math": "Secondary 4 Math",
  A_math: "Secondary 4 Math",
  "General Paper": "General Paper",
  "Secondary 4 Physics": "Secondary 4 Physics",
  Physics: "Secondary 4 Physics",
  "JC2 H2 Biology": "JC2 H2 Biology",
  "H2 Biology": "JC2 H2 Biology",
  "Secondary 4 E Math": "Secondary 4 E Math",
  "O Level E Math": "Secondary 4 E Math",
  E_math: "Secondary 4 E Math",
  "JC2 H2 Maths": "JC2 H2 Maths",
  "Secondary 4 Chemistry": "Secondary 4 Chemistry",
  "O Level Chemistry": "Secondary 4 Chemistry",
  Chemistry: "Secondary 4 Chemistry",
  "Secondary 4 History": "Secondary 4 History",
  "JC2 H2 Economics": "JC2 H2 Economics",
  "JC2 H2 Chemistry": "JC2 H2 Chemistry",
  "P5 English": "Primary 5 English",
  "JC2 H2 Physics": "JC2 H2 Physics",
  "Primary 6 Chinese": "Primary 6 Chinese",
  // "prelim" is an exam type an old build wrote into the subject field. It
  // names no shelf, so its rows only reach the site-wide total.
};

/** Shapes the aggregation's facets into plain lookup objects. */
export function foldCounts({ subjects = [], papers = [], totals = [], families = [] }) {
  const perSubject = {};
  for (const { _id, n } of subjects) {
    const subject = LEGACY_SUBJECT_ALIASES[_id];
    if (subject) perSubject[subject] = (perSubject[subject] ?? 0) + n;
  }

  const perPaper = {};
  for (const { _id, n } of papers) perPaper[_id] = n;

  return { perSubject, perPaper, total: totals[0]?.n ?? 0, families: families[0]?.n ?? 0 };
}

const EMPTY = { perSubject: {}, perPaper: {}, total: 0, families: 0 };

/**
 * Reads the counts in one round trip. Returns zeroes rather than throwing, so a
 * database hiccup renders the page without numbers instead of not at all.
 */
export async function getPaperDownloadCounts() {
  try {
    // Imported here so the pure exports above stay usable without a database.
    const { default: mongoose } = await import("mongoose");
    const { dbConnect } = await import("./mongoose.js");
    await dbConnect();
    const [result] = await mongoose.connection.db
      .collection("testpaperleads")
      .aggregate([
        {
          $facet: {
            subjects: [
              { $unwind: "$downloads" },
              { $group: { _id: "$downloads.subject", n: { $sum: 1 } } },
            ],
            papers: [
              { $unwind: "$downloads" },
              { $match: { "downloads.paperKey": { $type: "string" } } },
              { $group: { _id: "$downloads.paperKey", n: { $sum: 1 } } },
            ],
            totals: [{ $unwind: "$downloads" }, { $count: "n" }],
            families: [{ $count: "n" }],
          },
        },
      ])
      .toArray();
    return foldCounts(result ?? {});
  } catch (err) {
    console.error("Failed to read paper download counts:", err);
    return EMPTY;
  }
}
