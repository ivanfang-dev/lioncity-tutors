// Free-text subject recognition: the words people actually type for a subject, mapped to its
// canonical name. Kept model-free so the formatters can use it too — tutorMatcher pulls in the
// Tutor model, which a message formatter has no business loading.

// Alias (lowercase) → canonical subject name or array of names
// Sorted longest-first at use time so "H2 Maths" matches before "Maths", "A Maths" before "Maths"
export const TITLE_ALIASES = {
  // JC H-level subjects
  'h1 mathematics': 'H1 Mathematics', 'h2 mathematics': 'H2 Mathematics', 'h3 mathematics': 'H3 Mathematics',
  'h1 maths': 'H1 Mathematics', 'h2 maths': 'H2 Mathematics', 'h3 maths': 'H3 Mathematics',
  'h1 physics': 'H1 Physics', 'h2 physics': 'H2 Physics', 'h3 physics': 'H3 Physics',
  'h1 chemistry': 'H1 Chemistry', 'h2 chemistry': 'H2 Chemistry', 'h3 chemistry': 'H3 Chemistry',
  'h1 biology': 'H1 Biology', 'h2 biology': 'H2 Biology', 'h3 biology': 'H3 Biology',
  'h1 economics': 'H1 Economics', 'h2 economics': 'H2 Economics', 'h3 economics': 'H3 Economics',
  'h1 history': 'H1 History', 'h2 history': 'H2 History', 'h3 history': 'H3 History',
  'h1 geography': 'H1 Geography', 'h2 geography': 'H2 Geography', 'h3 geography': 'H3 Geography',
  'h2 computing': 'H2 Computing',
  'h2 literature': 'H2 Literature in English', 'h3 literature': 'H3 Literature in English',
  'general paper': 'General Paper',
  // Secondary-specific
  'additional mathematics': 'Additional Mathematics', 'additional maths': 'Additional Mathematics',
  'add maths': 'Additional Mathematics', 'a maths': 'Additional Mathematics',
  'elementary mathematics': 'Elementary Mathematics', 'elementary maths': 'Elementary Mathematics',
  'elem maths': 'Elementary Mathematics', 'e maths': 'Elementary Mathematics',
  // Combined Science → both variants (title won't say which combination)
  'combined science': ['Combined Science (Physics/Chemistry)', 'Combined Science (Chemistry/Biology)'],
  'combined': ['Combined Science (Physics/Chemistry)', 'Combined Science (Chemistry/Biology)'],
  'principles of accounts': 'Principles of Accounts',
  'literature in english': 'Literature in English',
  'design and technology': 'Design and Technology',
  // Common abbreviations
  'english language': 'English Language',
  'english': 'English Language',
  'mathematics': 'Mathematics', 'maths': 'Mathematics', 'math': 'Mathematics',
  'physics': 'Physics', 'phy': 'Physics',
  'chemistry': 'Chemistry', 'chem': 'Chemistry',
  'biology': 'Biology', 'bio': 'Biology',
  'science': 'Science', 'sci': 'Science',
  'economics': 'Economics', 'econs': 'Economics',
  'geography': 'Geography', 'geo': 'Geography',
  'history': 'History',
  'literature': 'Literature in English', 'lit': 'Literature in English',
  'accounts': 'Principles of Accounts', 'poa': 'Principles of Accounts',
  'computing': 'Computing',
  'chinese': 'Chinese',
  'malay': 'Malay',
  'tamil': 'Tamil',
  'art': 'Art',
  'music': 'Music',
  'gp': 'General Paper',
};

// Sort aliases longest-first once at module load
const SORTED_ALIASES = Object.keys(TITLE_ALIASES).sort((a, b) => b.length - a.length);

// Every subject a free-text title mentions, as { subject, text }: the canonical name, and the words
// the title actually used for it ("Maths", "A Math"). Longest alias first with each match consumed,
// so "A Maths" wins over "Maths" and neither is counted twice. Order follows alias length, not
// position in the title.
export function subjectMentions(title) {
  // Strip (NA), (Express), (IP), (Foundation) etc. — streams, not subjects.
  let remaining = (title || '').replace(/\([^)]*\)/g, ' ');
  const mentions = [];

  for (const alias of SORTED_ALIASES) {
    const regex = aliasRegex(alias);
    const found = remaining.match(regex);
    if (!found) continue;
    const value = TITLE_ALIASES[alias];
    for (const canonical of Array.isArray(value) ? value : [value]) {
      mentions.push({ subject: canonical, text: found[0] });
    }
    // Remove the matched text so shorter aliases don't double-match
    remaining = remaining.replace(regex, ' ');
  }
  return mentions;
}

// A subject alias as a whole-word regex — the guards stop "math" matching inside "mathematics".
export function aliasRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i');
}
