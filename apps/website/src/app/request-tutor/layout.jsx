import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const TITLE = 'Request a Tutor in Singapore | LionCity Tutors';
// The old description claimed "Trusted by 100+ Parents", which is a number we
// cannot source. The two promises here are the ones stated site-wide.
const DESCRIPTION =
  `Tell us the level, subject and timing you need and we hand-match a vetted tutor, usually within ${MATCH_TIME}. Free for parents — you never pay us an agency fee.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/request-tutor',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/request-tutor',
  },
};

export default function RequestTutorLayout({ children }) {
  return children;
}
