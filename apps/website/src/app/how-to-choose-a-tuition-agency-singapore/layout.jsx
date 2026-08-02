// Phase 1 title formula: front-loaded, under 60 characters.
const TITLE = 'How to Choose a Tuition Agency in Singapore | LionCity';
const DESCRIPTION =
  'Agency, tuition centre or independent tutor — what each costs, how agencies charge, and the warning signs to check before you commit. No agency fee here.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how to choose a tuition agency singapore',
    'best tuition agency singapore',
    'tuition agency vs tuition centre',
    'tuition agency fees singapore',
    'is a tuition agency worth it',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/how-to-choose-a-tuition-agency-singapore',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-choose-a-tuition-agency-singapore',
  },
};

export default function ChooseAgencyLayout({ children }) {
  return children;
}
