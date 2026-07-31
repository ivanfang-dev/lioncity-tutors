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
    secondary: {
      o_level: {
        english: [],
        A_math: []
      },
      // ... add other secondary subjects
    },
    jc: {
      // Underscores become spaces in the subject heading, so this key renders
      // as "General Paper" rather than "Generalpaper".
      general_paper: [
        { title: "RI 2024 GP Infopack Media Issues", downloadUrl: "/notes/JC/GP/J1/RI 2024 GP Infopack Media Issues.pdf" },
        { title: "RI 2024 GP Infopack Science and Tech", downloadUrl: "/notes/JC/GP/J1/RI 2024 GP Infopack Science and Tech.pdf" },
        { title: "RI 2024 GP Infopack Social Issues", downloadUrl: "/notes/JC/GP/J1/RI 2024 GP Infopack Social Issues.pdf" },
        // The J2 files really are named ".pdf.pdf" on disk — do not "fix" the
        // URL without renaming the file in public/notes/JC/GP/J2/.
        { title: "RI 2024 GP Infopack Arts and Culture", downloadUrl: "/notes/JC/GP/J2/RI 2024 GP Infopack Arts and Culture.pdf.pdf" },
        { title: "RI 2024 GP Infopack Politics I", downloadUrl: "/notes/JC/GP/J2/RI 2024 GP Infopack Politics I.pdf.pdf" },
      ],
      maths: []
      // ... add other JC subjects
    }
  };
