'use client';

import { usePathname } from 'next/navigation';
import MobileCTABar from './MobileCTABar';

/**
 * The mobile conversion path for every long-form page that isn't the home page.
 *
 * The subject guides rank and then dead-end: /a-level-chemistry runs 25 phone
 * screens and its first CTA sits on screen 24, so a parent reading on a phone
 * had nothing to act on for the whole read. The navbar CTA is `hidden lg:flex`,
 * which is exactly the gap MobileCTABar was built to close on the home page.
 */

// Pages that must not carry the bar: the home page mounts its own (wired to its
// form), the request and contact pages are where the bar sends people, and
// register-tutor is the tutor-side form, not the parent path.
const EXCLUDED = new Set([
  '/',
  '/request-tutor',
  '/contact-us',
  '/register-tutor',
  '/privacy-policy',
  '/terms-and-conditions-for-clients',
  '/terms-and-conditions-for-tutors',
]);

/** "a-level-chemistry" reads back as "A Level Chemistry" in the prefilled message. */
function labelFromPath(pathname) {
  const slug = pathname.split('/').filter(Boolean).pop();
  if (!slug) return null;
  return slug
    .split('-')
    .map((word) => (word.length <= 2 ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)))
    .join(' ');
}

export default function GuideMobileCTA() {
  const pathname = usePathname();
  if (!pathname || EXCLUDED.has(pathname)) return null;

  const topic = labelFromPath(pathname);
  const message = `Hi LionCity Tutors! I was reading your ${topic} page and I'd like help finding a tutor.

Student level:
Subject:
Location:
Preferred days & timing: `;

  return (
    <MobileCTABar
      href="/request-tutor"
      whatsappHref={`https://wa.me/6588701152?text=${encodeURIComponent(message)}`}
    />
  );
}
