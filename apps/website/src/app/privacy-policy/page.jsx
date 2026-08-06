import React from 'react';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
    title: 'Privacy Policy | LionCity Tutors',
    description: 'Privacy Policy',
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: 'Privacy Policy | LionCity Tutors',
      description: 'Privacy Policy of LionCity Tutors.',
      url: 'https://www.lioncitytutors.com/privacy-policy',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.lioncitytutors.com/privacy-policy',
    },
  };

export default function PrivacyPolicy(){
    return (
        <main>
            <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold text-center text-blue-700 mb-7">Privacy Policy</h1>
            <p>
                We respect your privacy and are committed to protecting your personal data.
                When you submit your information through this form, we collect your data for the purpose of matching you with tuition opportunities.

                Your information will be:

                Used only for tutor recruitment and matching purposes

                Stored securely

                Not shared with third parties without your consent

                If you have any questions about how your data is used, please contact us at admin@lioncitytutors.com.
                </p>
            </div>
        </main>
    );
}