import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
const TITLE = 'Free Study Notes: PSLE, O-Level, A-Level | LionCity Tutors';
const DESCRIPTION =
  'Free revision notes to download, no account needed: O-Level A-Math and E-Math sets and A-Level General Paper infopacks today, with PSLE subjects on the way.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'free study notes Singapore',
    'general paper a level notes',
    'gp notes a level',
    'general paper notes',
    'JC notes',
    'O level notes',
    'PSLE notes',
    'o level a math notes',
    'o level e math notes',
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
