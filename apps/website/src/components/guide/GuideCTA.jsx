import { MATCH_TIME, TUTOR_COUNT_LABEL } from '@/data/promises';
import Link from 'next/link';
import { Users, Clock, Wallet } from 'lucide-react';
import { ICON_STROKE } from './constants';

/**
 * The closing conversion block for a subject guide: the request-tutor CTA
 * with the standard trust facts and a quiet WhatsApp fallback.
 *
 * Uses the fill orange (#D9691C) with a bold 20px label so the white label
 * clears WCAG large-text contrast — never the bright #F17720 (DESIGN.md).
 *
 * @param {string} title
 * @param {string} description
 * @param {string} buttonText - request-tutor label
 * @param {string} whatsappHref - prefilled wa.me link
 * @param {string} [whatsappLabel]
 */
export default function GuideCTA({
  title,
  description,
  buttonText,
  whatsappHref,
  whatsappLabel = 'Or message us on WhatsApp',
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 sm:p-10 text-center">
      <h2 className="text-2xl! sm:text-3xl! font-bold text-gray-900 tracking-tight mb-3 text-balance">
        {title}
      </h2>
      <p className="text-gray-700 max-w-xl mx-auto mb-6 text-pretty">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
          {TUTOR_COUNT_LABEL}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
          Matched in {MATCH_TIME}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="h-4 w-4 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
          No agency fee
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/request-tutor"
          className="inline-block bg-[#D9691C] text-white px-7 py-3 rounded-full font-bold text-xl shadow-md hover:bg-[#C15E12] hover:shadow-lg transition-all duration-200 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C15E12] focus-visible:ring-offset-2"
        >
          {buttonText}
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-gray-300 hover:border-primary bg-white text-gray-600 hover:text-primary font-medium px-5 py-3 rounded-full text-sm shadow-sm hover:shadow transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm5.4 14.2c-.23.64-1.34 1.22-1.85 1.26-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.9-4.64-4.08-.13-.18-1.1-1.46-1.1-2.79 0-1.32.7-1.97.94-2.24.24-.27.52-.34.7-.34l.5.01c.16 0 .38-.06.59.45.23.55.77 1.9.84 2.04.07.14.11.3.02.48-.09.18-.13.29-.27.45l-.4.46c-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.27.14.42.11.58-.07.16-.18.66-.78.84-1.04.18-.27.36-.22.59-.13.23.09 1.48.7 1.74.82.27.13.44.2.5.31.07.11.07.64-.16 1.27Z" />
          </svg>
          <span>{whatsappLabel}</span>
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
