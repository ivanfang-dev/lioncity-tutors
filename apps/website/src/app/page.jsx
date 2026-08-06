import { MATCH_TIME } from '@/data/promises';
// app/page.jsx
export const metadata = {
  title: 'LionCity Tutors – MOE-Certified PSLE, O-Level & JC Tutors',
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
    title: "Singapore's #1 Home Tuition Agency | LionCity Tutors",
    description: `Connect with MOE-certified tutors for PSLE, O-Level & A-Level. Free for parents, matched in ${MATCH_TIME}.`,
    images: [
      {
        url: 'https://www.lioncitytutors.com/final.png',
        alt: 'LionCity Tutors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singapore Home Tuition Agency | LionCity Tutors',
    description: 'Find MOE-certified tutors for PSLE, O-Level & A-Level. Free for parents.',
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

export default function HomePage(props) {
  return (
    <>
      <HomePageClient {...props} />
      
      {/* Combined and optimized JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "EducationalOrganization"],
              "name": "LionCity Tutors",
              "description": "Singapore's premier home tuition agency connecting parents with MOE-certified tutors for PSLE, O-Level, A-Level and IB subjects",
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
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "13",
                "bestRating": "5",
                "worstRating": "3"
              },
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
              "review": [
                {
                  "@type": "Review",
                  "author": { "@type": "Person", "name": "Sharon T." },
                  "reviewRating": { 
                    "@type": "Rating", 
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "reviewBody": "Matched excellent O-Level Math tutor within a day. Professional service with clear updates throughout."
                },
                {
                  "@type": "Review",
                  "author": { "@type": "Person", "name": "Mr David Lim" },
                  "reviewRating": { 
                    "@type": "Rating", 
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "reviewBody": "No fees for parents and incredibly fast response. My son's PSLE Math improved significantly."
                }
              ],
              "sameAs": [
                "https://www.facebook.com/lioncitytutors",
                "https://www.instagram.com/lioncitytutors"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does it cost to request a tutor?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our matching service is completely free! You only pay the tutor's rate directly to them after the lessons begin."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How quickly will I receive tutor profiles?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `We typically send you tutor profiles within ${MATCH_TIME} of your request. Our team works 7 days a week to ensure fast matching.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "What qualifications do your tutors have?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our tutors range from university undergraduates to MOE teachers. All tutors are carefully vetted and have proven academic excellence."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I try a lesson before committing?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! We offer trial lessons so you can ensure the tutor is the right fit for your child before making a long-term commitment."
                  }
                }
              ]
            }
          ])
        }}
      />
    </>
  );
}