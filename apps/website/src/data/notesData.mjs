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
      english: [
        {
          title: "PSLE English Study Guide",
          description: "Syllabus 0001 — the exam blueprint across all four papers, continuous writing band descriptors with seven narrative techniques, the synthesis and transformation checking gates, the oral blueprint, and a phrase and idiom bank",
          fileKey: "notes/primary/psle/english/psle-english-study-guide.pdf",
        },
      ],
      math: [
        {
          title: "PSLE Mathematics Revision Notes",
          description: "Syllabus 0008 — what changed for the 2026 exam, the format table, seven heuristics worked through, common errors and a final checklist",
          fileKey: "notes/primary/psle/math/psle-mathematics-revision-notes.pdf",
        },
      ],
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
      biology: [
        {
          title: "O-Level Biology Study Guide",
          description: "Syllabus 6093 — the three compulsory papers with their weightings and section splits, the syllabus swept topic by topic from cell structure to genetics and ecology, and the Paper 3 practical skill areas",
          fileKey: "notes/secondary/o-level/biology/o-level-biology-study-guide.pdf",
        },
      ],
      physics: [
        {
          title: "O-Level Physics Study Notes",
          description: "All 11 topics in 11 pages — written to Cambridge 5054, which matches Singapore's 6091 topic for topic — with answer templates, instrument precision and graphing rules",
          fileKey: "notes/secondary/o-level/physics/o-level-physics-study-notes.pdf",
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
      english: [
        {
          title: "O-Level English Language Study Guide",
          description: "Syllabus 1184 — all four papers with their weightings, the six situational text-type formats, the PAC and task-numbering methods, and comprehension, listening and oral technique",
          fileKey: "notes/secondary/o-level/english/o-level-english-language-study-guide.pdf",
        },
      ],
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
      // Both syllabuses, current first. 9477 changed three papers, not one, so
      // the legacy set's assessment table is wrong for a school candidate —
      // hence the steer to 9477 in the legacy card's own description.
      biology: [
        {
          title: "H2 Biology Study Guide (9477, current syllabus)",
          description: "For every school candidate from 2026 — the four core ideas and two extension topics, with the paper structure that replaced 9744: Paper 2 at 90 marks, Paper 3 split 55 and 20, and a 50-mark practical",
          fileKey: "notes/jc/biology/jc-h2-biology-9477-study-guide.pdf",
        },
        {
          title: "H2 Biology Study Guide (9744, legacy syllabus)",
          description: "Final examination 2026, private and repeat candidates only. Its assessment table is the legacy one — Paper 2 at 100 marks, Paper 3 split 50 and 25, a 55-mark practical — so take the 9477 set above unless you know you sit 9744",
          fileKey: "notes/jc/biology/jc-h2-biology-9744-legacy-study-guide.pdf",
        },
      ],
      // Both H2 Physics syllabuses are hosted: 9478 is what school candidates
      // sit from 2026, 9749 has its final examination the same year and is
      // open to private and repeat candidates only. Each title says which.
      physics: [
        {
          title: "H2 Physics Study Notes (9478, current syllabus)",
          description: "For every school candidate from 2026 — all six sections in 49 pages, with derivations, answer blueprints and a formula sheet, including capacitance and wavefunctions, the two topics 9749 never had",
          fileKey: "notes/jc/physics/jc-h2-physics-9478-master-study-notes.pdf",
        },
        {
          title: "H2 Physics Study Notes (9749, legacy syllabus)",
          description: "Final examination 2026, private and repeat candidates only — the same six sections in 46 pages, against the retired paper structure. If you are unsure which you sit, take the 9478 set above",
          fileKey: "notes/jc/physics/jc-h2-physics-9749-legacy-master-study-notes.pdf",
        },
      ],
      maths: [
        {
          title: "H2 Mathematics Revision Notes",
          description: "Syllabus 9758 — the calculator and formula-list rules, a Pure and Statistics reference across all seventeen topics, the exclusions the syllabus names, and worked examples",
          fileKey: "notes/jc/math/h2-mathematics-revision-notes.pdf",
        },
      ],
      chemistry: [
        {
          title: "H2 Chemistry Study Notes",
          description: "All 13 topics in 15 pages — written to syllabus 9729, whose content the revised 9476 keeps unchanged — plus Paper 4 practical technique and a key-equations sheet",
          fileKey: "notes/jc/chemistry/jc-h2-chemistry-9729-study-notes.pdf",
        },
        {
          title: "H1 Chemistry Study Notes",
          description: "Syllabus 8873 — the eight core topics, both Materials extension topics, and a scope list of what H1 leaves to H2",
          fileKey: "notes/jc/chemistry/jc-h1-chemistry-8873-study-notes.pdf",
        },
      ],
    }
  };
