import React from 'react';
import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const TITLE = 'Contact LionCity Tutors | Singapore Tuition Agency';
const DESCRIPTION =
  'Contact LionCity Tutors — WhatsApp or email about finding a tutor, an open tuition assignment or an existing match. We are open 9am to 9pm, Monday to Sunday.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/contact-us',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/contact-us',
  },
};

export default function ContactUs() {
  return (
  <>
  <main>
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-7">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        We'd love to hear from you! Reach out via any of the methods below and our team will get back to you as soon as possible.
      </p>

      <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">📞 Phone / WhatsApp</h2>
          <p className="text-gray-700 text-lg">+65 8870 1152</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">📧 Email</h2>
          <p className="text-gray-700 text-lg">admin@lioncitytutors.com</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">🕒 Operating Hours</h2>
          <p className="text-gray-700 text-lg">Monday – Sunday: 9:00 AM – 9:00 PM</p>
        </div>

      </div>
    </div>
    </main>
    </>
  );
}
