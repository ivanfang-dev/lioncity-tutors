import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
const TITLE = 'Free Study Notes: A-Level General Paper | LionCity Tutors';
const DESCRIPTION =
  'Free study notes to download for JC and secondary students — A-Level General Paper infopacks on media, science and social issues, with more subjects coming.';

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
