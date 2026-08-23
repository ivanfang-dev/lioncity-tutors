/**
 * Third-party note collections we point at but do not host. Each entry
 * describes what is actually in the collection so the reader knows before
 * clicking, and covers subjects our own library does not reach yet.
 */
export const EXTERNAL_NOTES = [
  {
    id: 'holy-grail',
    subject: 'Holy Grail',
    tag: 'O-Level · A-Level · IB · all subjects',
    url: 'https://grail.moe/library',
    host: 'grail.moe',
    fileCount: 'Thousands of documents',
    summary:
      'The largest free student-run library in Singapore, and the first place to look for a subject nobody else covers. Notes and practice papers for O-Level, A-Level and IB, contributed and moderated by students. Free, no account needed to download. Coverage is uneven by subject — the sciences and maths are deep, smaller humanities subjects can be thin — so search rather than browse.',
  },
  {
    id: 'overmugged',
    subject: 'OVERMUGGED',
    tag: 'O-Level · A-Level · notes by subject',
    url: 'https://www.overmugged.com/free-notes',
    host: 'overmugged.com',
    fileCount: '20+ subjects',
    summary:
      'Condensed revision notes organised strictly by subject, which makes it faster than Holy Grail when you know exactly what you need. O-Level covers Chemistry, Physics, Biology, Combined Science, E-Math, A-Math, English, History, Social Studies, Principles of Accounts and lower secondary. A-Level covers H2 Chemistry, Physics, Biology, Economics, Maths and History.',
  },
  {
    id: 'o-level-higher-chinese',
    subject: 'O-Level Higher Chinese 高级华文',
    tag: 'O-Level · Higher Chinese',
    url: 'https://drive.google.com/drive/folders/1Wqe-uJLqCNwiT9Gh6Uf-3qfwZSnL2RCG',
    host: 'Shared Google Drive folder',
    fileCount: '5 files',
    summary:
      'Covers the two papers most students lose marks on: an email-format sheet paired with literary techniques for Paper 1, and a 口试 set for the oral. The 政府政策 file is the useful one for essays — it collects Singapore policy examples you can cite instead of writing in generalities.',
  },
  {
    id: 'o-level-chinese',
    subject: 'O-Level Chinese 华文',
    tag: 'O-Level · Chinese',
    url: 'https://drive.google.com/drive/folders/1Nl1NnP5BZQjpkHwUHqKj0em7g4rT909C',
    host: 'Shared Google Drive folder',
    fileCount: '11 files · view-only',
    summary:
      'Broader and more mixed than the Higher Chinese folder. The 理解问答 and composition guides are the strongest items, and 新闻话题总复习 is worth reading before a 议论文 paper. Also holds an English-to-Chinese translation glossary organised by topic. Note that the owner has set most files to view-only, so read them in the browser rather than expecting downloads.',
  },
  {
    id: 'siyavula',
    subject: 'Siyavula open textbooks',
    tag: 'Secondary · Maths & Sciences',
    url: 'https://www.siyavula.com/read',
    host: 'siyavula.com',
    fileCount: 'Full textbooks, free PDF',
    summary:
      'Openly licensed Creative Commons textbooks for Physical Sciences, Life Sciences and Mathematics. Written for the South African curriculum, so the exam framing is wrong for Singapore, but the physics, chemistry and maths content maps closely onto O-Level and the explanations are more thorough than any summary sheet. Useful when a topic has not clicked and you want it taught properly rather than condensed.',
  },
  {
    id: 'seab-syllabus',
    subject: 'SEAB syllabus documents',
    tag: 'Official · every subject',
    url: 'https://www.seab.gov.sg/gce-o-level/o-level-syllabuses-examined-for-school-candidates-2026/',
    host: 'seab.gov.sg',
    fileCount: 'One PDF per subject',
    summary:
      'Not notes, and the most under-used free resource in Singapore. Each syllabus states the exact paper structure, mark allocations and — for several subjects — the official marking rubrics the examiners work from. If you have ever wondered what a band descriptor actually says, this is where it is written down. Free, official, and updated every exam year.',
  },
];
