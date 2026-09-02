import { MATCH_TIME, MATCH_HOURS } from '@/data/promises';
// app/page.jsx
export const metadata = {
  // Claim accuracy: MOE certifies teachers, not agencies, so "MOE-Certified
  // tutors" overstated what can be verified — and every competitor claims some
  // superlative anyway. The geo head term leads so the title matches the query;
  // the match-time promise follows, to differentiate from identical rivals.
  title: `Singapore Tuition Agency — Tutor Matched in ${MATCH_HOURS} Hours`,
  description: "LionCity Tutors hand-matches Singapore parents with vetted PSLE, O-Level and JC tutors, usually within 6 hours — 100% free, with no agency fee, ever paid.",
  keywords: [
    'home tuition singapore',
    'private tutor singapore',
    'PSLE tutor',
    'O level tutor',
    'A level tutor',
    'MOE teacher tutor',
    'singapore tuition agency',
    'home tutoring service singapore',
    'home tutor singapore',
    'tuition teacher',
    'math tutor',
    'english tutor',
    'science tutor',
    'PSLE tuition',
    'JC tuition',
    'primary school tuition',
    'secondary school tuition'
  ],
  alternates: {
    canonical: 'https://www.lioncitytutors.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.lioncitytutors.com/',
    title: `Singapore Tuition Agency — Tutor Matched in ${MATCH_HOURS} Hours`,
    description: `Hand-matched, vetted tutors for PSLE, O-Level & A-Level, usually within ${MATCH_TIME}. Free for parents — no agency fee, ever.`,
    images: [
      {
        url: 'https://www.lioncitytutors.com/final.png',
        alt: 'LionCity Tutors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Singapore Tuition Agency — Tutor Matched in ${MATCH_HOURS} Hours`,
    description: `Hand-matched, vetted tutors for PSLE, O-Level & A-Level in ${MATCH_TIME}. Free for parents.`,
    images: ['https://www.lioncitytutors.com/final.png'],
  },
  robots: 'index, follow',
  language: 'English',
  author: 'LionCity Tutors',
  geo: {
    region: 'SG',
    placename: 'Singapore',
  },
};

import HomePageClient from './HomePageClient';

// No props: taking them meant taking `searchParams`, which opts the route into
// dynamic rendering. That cost the home page every static-render benefit —
// Vercel served it `no-store` on a cache MISS while every other page was a HIT,
// and Lighthouse mobile scored it 73 against 96-99 elsewhere. HomePageClient
// has never declared a prop.
export default function HomePage() {
  return (
    <>
      <HomePageClient />
      
      {/* Combined and optimized JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "EducationalOrganization"],
              "name": "LionCity Tutors",
              "description": `Singapore home tuition agency hand-matching parents with vetted tutors for PSLE, O-Level, A-Level and IB subjects, usually within ${MATCH_TIME}. Free for parents, with no agency fee.`,
              "url": "https://www.lioncitytutors.com/",
              "telephone": "+65-8870-1152",
              "email": "admin@lioncitytutors.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Boon Lay Wy, Tradehub 21",
                "addressLocality": "Singapore",
                "postalCode": "609966",
                "addressCountry": "SG"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 1.33131,
                "longitude": 103.72747
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "09:00",
                  "closes": "21:00"
                }
              ],
              "areaServed": {
                "@type": "Country",
                "name": "Singapore"
              },
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 1.3521,
                  "longitude": 103.8198
                },
                "geoRadius": 50000
              },
              "priceRange": "Free for parents",
              // NOTE: aggregateRating and review were removed here deliberately.
              // Google does not show review stars for "self-serving" markup — a
              // business rating its own Organization/LocalBusiness — so these
              // earned no SERP feature while adding weight and some risk of a
              // spammy-structured-markup read. Real ratings belong on the Google
              // Business Profile, where they are third-party verifiable.
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Tuition Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Primary School Tuition",
                      "description": "Home tuition for Primary 1-6 students, including PSLE preparation"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Secondary School Tuition", 
                      "description": "Home tuition for Secondary 1-5 students, including O-Level preparation"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Junior College Tuition",
                      "description": "Home tuition for JC1-2 students, including A-Level preparation"
                    }
                  }
                ]
              },
              "makesOffer": {
                "@type": "Offer",
                "description": "Free tutor matching service - no agency fees",
                "price": "0",
                "priceCurrency": "SGD"
              },
              "sameAs": [
                "https://www.facebook.com/lioncitytutors",
                "https://www.instagram.com/lioncitytutors"
              ]
            }
            // NOTE: the homepage's FAQPage lives in <FAQSection>, which derives it
            // from the questions actually rendered on the page. A second, hand-kept
            // copy here meant two FAQPage blocks on one URL and two lists that could
            // drift apart. One page, one FAQPage — and the markup should describe
            // what a visitor can actually see.
          ])
        }}
      />
    </>
  );
}