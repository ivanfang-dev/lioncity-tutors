// data/notesData.js
//
// Only real, downloadable notes belong in these arrays. A subject with an
// empty array renders as "Coming soon" on /free-notes; a placeholder row
// pointing at a PDF that does not exist renders as a broken download.
export const notesData = {
    primary: {
      p5: {
        english: [],
        math: []
      },
      // ... add other primary levels
    },
    // Flat subject keys, like `jc` below. A nested level here renders as one
    // empty "Coming soon" card, because LevelSection draws a card per key.
    secondary: {
      a_math: [
        {
          title: "O-Level Additional Mathematics Revision Notes",
          description: "Syllabus 4049 \u2014 formula reference, worked examples and the marks most often dropped",
          fileKey: "notes/secondary/o-level/a-math/o-level-a-math-4049-revision-notes.pdf",
        },
      ],
      english: [],
      // ... add other secondary subjects
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
      maths: []
      // ... add other JC subjects
    }
  };
