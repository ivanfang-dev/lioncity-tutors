const TITLE = 'Free Test Papers: O-Level, JC & PSLE | LionCity Tutors';
const DESCRIPTION =
  'Download free test papers for PSLE, O-Level and JC — over 100 school prelim and past year papers from 40+ Singapore schools, sorted by level and subject.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'free test papers Singapore',
    'free exam papers',
    'o level prelim papers',
    'o level test papers',
    'secondary free exam papers',
    'jc test papers',
    'past year papers',
    'PSLE papers'
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/free-test-papers',
    type: 'website',
  },
  alternates: {
    canonical: "https://www.lioncitytutors.com/free-test-papers"
  }
};

export default function FreeTestPapersLayout({ children }) {
  return children;
}
