// data/notesData.js
//
// Only real, downloadable notes belong in these arrays. A subject with an
// empty array renders as "Coming soon" on /free-notes; a placeholder row
// pointing at a PDF that does not exist renders as a broken download.
//
// Every level takes flat subject keys. A nested level renders as one empty
// "Coming soon" card, because LevelSection draws a card per key.
export const notesData = {
    primary: {
      science: [
        {
          title: "PSLE Science: Matter and Materials Study Notes",
          description: "The chemistry-related topics — matter, the three states, the standard answering models and the H.A.N.D.S.O.M.E. method",
          fileKey: "notes/primary/psle/science/psle-science-matter-and-materials-study-notes.pdf",
        },
      ],
      english: [],
      math: [],
    },
    secondary: {
      a_math: [
        {
          title: "O-Level Additional Mathematics Revision Notes",
          description: "Syllabus 4049 — formula reference, worked examples and the marks most often dropped",
          fileKey: "notes/secondary/o-level/a-math/o-level-a-math-4049-revision-notes.pdf",
        },
      ],
      e_math: [
        {
          title: "O-Level Elementary Mathematics Revision Notes",
          description: "Syllabus 4052 — formula reference, worked examples and the marks most often dropped",
          fileKey: "notes/secondary/o-level/e-math/o-level-e-math-4052-revision-notes.pdf",
        },
      ],
      chemistry: [
        {
          title: "O-Level Chemistry Study Notes",
          description: "All 11 topics in 23 pages — written to Cambridge 5070, which matches Singapore's 6092 topic for topic — with explain-question templates and qualitative analysis tables",
          fileKey: "notes/secondary/o-level/chemistry/o-level-chemistry-study-notes.pdf",
        },
      ],
      // IGCSE and N(T) sit in `secondary` because they are secondary-school
      // exams, even though the level tab reads O-Level. The subject label
      // carries the exam name, so no card claims to be an O-Level set.
      igcse_chemistry: [
        {
          title: "IGCSE Chemistry Study Guide",
          description: "The same eleven topics in 17 pages, closing on a quick-reference sheet of industrial conditions, solubility rules and the keyword pairs examiners look for",
          fileKey: "notes/secondary/igcse/chemistry/igcse-chemistry-study-guide.pdf",
        },
      ],
      nt_science: [
        {
          title: "N(T)-Level Science: Food Matters Study Notes",
          description: "Syllabus 5148, Module 2 — the four food tests, digestion and enzymes, preservation chemistry, and a section on what is out of scope",
          fileKey: "notes/secondary/n-t-level/science/n-t-level-science-food-matters-study-notes.pdf",
        },
      ],
      english: [],
    },
    jc: {
      // Underscores become spaces in the subject heading, so this key renders
      // as "General Paper" rather than "Generalpaper".
      general_paper: [
        { title: "RI 2024 GP Infopack Media Issues", fileKey: "notes/jc/gp/j1/ri-2024-gp-infopack-media-issues.pdf" },
        { title: "RI 2024 GP Infopack Science and Tech", fileKey: "notes/jc/gp/j1/ri-2024-gp-infopack-science-and-tech.pdf" },
        { title: "RI 2024 GP Infopack Social Issues", fileKey: "notes/jc/gp/j1/ri-2024-gp-infopack-social-issues.pdf" },
        { title: "RI 2024 GP Infopack Arts and Culture", fileKey: "notes/jc/gp/j2/ri-2024-gp-infopack-arts-and-culture.pdf" },
        { title: "RI 2024 GP Infopack Politics I", fileKey: "notes/jc/gp/j2/ri-2024-gp-infopack-politics-i.pdf" },
      ],
      chemistry: [],
      maths: []
      // ... add other JC subjects
    }
  };
