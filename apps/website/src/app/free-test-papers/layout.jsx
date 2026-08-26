import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import { paperCountBand, papersWithAnswers } from './stats';

// The page ranks ~8th for "free test papers" on ~1,900 impressions a month but
// earns 0.6% of them, against 2-3% typical at that position: the ranking is fine,
// the snippet is not. The old title was a bare category label competing with
// freetestpapers.com, and the description undersold the shelf by half ("over 100"
// against 196). Both numbers now come from the papers themselves, like the rest of
// the page's copy — the counts are the differentiator, so they cannot be stale.
//
// The brand suffix is gone. "free test papers" is not a brand query, Google appends
// the site name to the result anyway, and those 18 characters buy the paper count.
const TITLE = `Free Test Papers: ${paperCountBand}+ PSLE, O-Level & JC Prelim Papers`;
const DESCRIPTION =
  `Download ${paperCountBand}+ free prelim and past-year papers from Singapore schools — PSLE, O-Level and JC, mostly 2024 and 2025, and ${papersWithAnswers} of them with worked answers.`;

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
    images: [DEFAULT_OG_IMAGE],
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
