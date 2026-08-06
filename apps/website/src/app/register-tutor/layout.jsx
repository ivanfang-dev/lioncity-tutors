import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { SectionHeading } from '@/components/guide';
import { REGISTER_TUTOR_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const TITLE = 'Become a Tutor in Singapore | LionCity Tutors';
const DESCRIPTION =
  'Register as a tutor with LionCity Tutors: tell us your subjects, levels and availability, then apply to open tuition assignments across Singapore. Free to join.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'become a tutor Singapore',
    'register as a tutor',
    'tutor jobs Singapore',
    'private tutor registration',
    'home tutor application',
    'part time tutor Singapore'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/register-tutor',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/register-tutor',
  },
};

/**
 * The FAQ lives in the layout rather than the page because the page is one
 * long client-side registration form. A layout is a server component, so the
 * answers and the JSON-LD land in the HTML without splitting the form apart.
 */
export default function RegisterTutorLayout({ children }) {
  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Become a Tutor', url: '/register-tutor' },
        ]}
        faqs={REGISTER_TUTOR_FAQS}
      />

      {children}

      <section aria-labelledby="tutor-faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <SectionHeading id="tutor-faq" icon={HelpCircle}>
          Registering as a tutor: common questions
        </SectionHeading>
        <div className="space-y-6">
          {REGISTER_TUTOR_FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-gray-700 leading-relaxed">
          Already registered? Browse{' '}
          <Link href="/tuition-assignments" className="font-semibold text-[#0474BA] underline underline-offset-2">
            open tuition assignments
          </Link>
          . The{' '}
          <Link href="/terms-and-conditions-for-tutors" className="font-semibold text-[#0474BA] underline underline-offset-2">
            tutor terms
          </Link>{' '}
          cover commission in full, and{' '}
          <Link href="/tuition-rates" className="font-semibold text-[#0474BA] underline underline-offset-2">
            tuition rates in Singapore
          </Link>{' '}
          shows what parents pay by level.
        </p>
      </section>
    </>
  );
}
