import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
const TITLE = 'Free Study Notes: GP and O-Level Maths | LionCity Tutors';
const DESCRIPTION =
  'Free notes to download: A-Level General Paper infopacks plus O-Level A-Math and E-Math revision sets — formula references, worked examples and common errors.';

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
