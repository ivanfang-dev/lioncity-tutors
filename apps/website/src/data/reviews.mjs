/**
 * Real customer reviews, quoted verbatim.
 *
 * Every quote here must be a real review a real person left on a real platform,
 * copied exactly — including its original capitalisation and punctuation. Do not
 * tidy the prose: cleaned-up reviews read as written-by-the-business, which is
 * the opposite of the point. Never add an entry that is not traceable to one of
 * REVIEW_SOURCES below.
 *
 * Why this file exists: the site previously carried invented testimonials and
 * invented student results. They were removed. Anything that replaces them has
 * to be verifiable by a reader who follows the source link.
 *
 * Note on markup: do NOT wrap these in AggregateRating/Review JSON-LD. Google
 * does not show stars for self-serving review markup on your own site — stars
 * come via the Google Business Profile — and that markup was deliberately
 * stripped from the homepage. These are for human trust, not for a rich result.
 */

/** Human-readable review date, shown wherever the counts surface. */
export const REVIEWS_REVIEWED = 'August 2026';

/** The rating shown as the headline figure. Google is the public, third-party
 *  verifiable one, so it is the star rating the site quotes. */
export const HEADLINE_SOURCE = 'google';

export const REVIEW_SOURCES = {
  google: {
    name: 'Google',
    // Business Profile on Maps. NOTE: the g.page URL ending "/review" opens the
    // leave-a-review form — that one belongs in the parent review-ask flow, not
    // here, where a visitor expects to read reviews.
    url: 'https://maps.app.goo.gl/mTchEQQaKCCoaxTeA',
    count: 27,
    rating: 4.8,
  },
  carousell: {
    name: 'Carousell',
    // Public seller profile, reviews tab. Deliberately carries no rating: the
    // site quotes one star figure, Google's, so two competing averages never
    // appear side by side.
    url: 'https://www.carousell.sg/u/lioncity_tutors/?tab=reviews',
    count: 37,
    rating: null,
  },
};

/** The leave-a-review link, for the parent review-ask flow (not for display). */
export const GOOGLE_REVIEW_LINK = 'https://g.page/r/CXP-Cmt7Q8MmEAE/review';

// Quoted exactly as written, including the original capitalisation, spacing and
// emoji. The stray space in "friendly , responsive" is in the source review and
// is intentionally preserved — silently editing someone's words to look tidier
// is how a real review starts reading like a written one.
//
// `truncated: true` means Google itself collapses the review behind a "More"
// link and the rest could not be read. Those render with a trailing ellipsis so
// a reader can see the quote is partial rather than assuming it is the whole
// review. Never pad a truncated quote with invented wording.
export const REVIEWS = [
  {
    quote: 'I would like to express my sincere appreciation for Ivan’s prompt and efficient assistance in sourcing a Biology tutor. His swift response made the entire process seamless and reassuring.',
    author: 'Sha',
    source: 'google',
    truncated: true,
  },
  {
    quote: 'The agency made alot of effort to ensure my expectations and preferred choice of tutoring style aligned to whom they chose for my daughter to do a trial lesson. Happy to say they made a right selection and my daughter learns while enjoying the lesson with the tutor.',
    author: 'M Rahmad',
    source: 'google',
  },
  {
    quote: 'Found this agency from carousel! Met our amazing tutor Mr Junaith. It’s been an amazing month, and we’re so happy with the sessions that he conducted, very professional, very supportive teacher towards his students!',
    author: 'Amanda MB',
    source: 'google',
  },
  {
    quote: 'lioncity tutor did a great job in finding us a suitable tutor. they were always contactable and replied fast to our request! highly recommended!!',
    author: 'shan',
    source: 'carousell',
  },
  {
    quote: 'Really happy with this experience with this tuition agency. I was a little unsure about finding the right tutor at first, but the process was easier than expected. The coordinator was friendly , responsive and helpful in finding the right tutor for me. Overall would definitely recommend this agency!! 💯',
    author: 'Karis',
    source: 'carousell',
  },
  {
    quote: 'The agency was very efficient in helping me find a tutor quickly. Communication and arrangements were smooth, and the overall experience was pleasant and hassle-free',
    author: 'mannabelle',
    source: 'carousell',
  },
];

/** Reviews from one platform, or all of them when source is omitted. */
export const reviewsFrom = (source) =>
  source ? REVIEWS.filter((r) => r.source === source) : REVIEWS;

/** "4.78 from 37 reviews" / "27 reviews" when no average is recorded. */
export const sourceSummary = (key) => {
  const s = REVIEW_SOURCES[key];
  if (!s) return null;
  return s.rating ? `${s.rating} from ${s.count} reviews` : `${s.count} reviews`;
};
