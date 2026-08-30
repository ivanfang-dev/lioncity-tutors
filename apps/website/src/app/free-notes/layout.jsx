import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
const TITLE = 'Free Study Notes: PSLE, O-Level, A-Level | LionCity Tutors';
const DESCRIPTION =
  'Free revision notes to download, no account needed: H2 Physics for both syllabuses, Chemistry H2 to IGCSE, H2 and PSLE Maths, O-Level Physics, English and GP.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'free study notes Singapore',
    'general paper a level notes',
    'gp notes a level',
    'general paper notes',
    'JC notes',
    'junior college notes',
    'O level notes',
    'o level english notes',
    'o level english 1184',
    'secondary school notes',
    'PSLE notes',
    'psle english notes',
    'psle english 0001',
    'primary school notes',
    'o level a math notes',
    'o level e math notes',
    'h2 chemistry notes',
    'h1 chemistry notes',
    'o level physics notes',
    'psle maths notes',
    'h2 maths notes',
    'h2 physics notes',
    'h2 physics 9478',
    'a level maths notes',
    'a level chemistry notes',
    'o level chemistry notes',
    'igcse chemistry notes',
    'psle science notes',
    'n level science notes',
    'free revision notes'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/free-notes',
    type: 'website',
  },
  alternates: {
    canonical: "https://www.lioncitytutors.com/free-notes"
  }
};

export default function FreeNotesLayout({ children }) {
  return children;
}
