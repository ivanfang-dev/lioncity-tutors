import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
const TITLE = 'Free Study Notes: PSLE, O-Level, A-Level | LionCity Tutors';
const DESCRIPTION =
  'Free revision notes to download, no account needed: O-Level and IGCSE Chemistry, PSLE Science, N(T)-Level Science, O-Level A-Math and E-Math, and A-Level General Paper infopacks.';

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
    'secondary school notes',
    'PSLE notes',
    'primary school notes',
    'o level a math notes',
    'o level e math notes',
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
