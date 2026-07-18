import Image from 'next/image';

/**
 * The masthead for a subject guide: headline, byline, and hero image.
 * The byline folds onto two lines on mobile (author / meta) and sits inline
 * on desktop.
 *
 * @param {import('react').ReactNode} title
 * @param {string} author - e.g. "By the LionCity Tutors Chemistry Team"
 * @param {string} meta - e.g. "Updated June 14, 2025 · 18 min read"
 * @param {string} [imageSrc]
 * @param {string} [imageAlt]
 */
export default function GuideHeader({ title, author, meta, imageSrc, imageAlt }) {
  return (
    <header className="border-b border-gray-100 pb-8 mb-10">
      <h1 className="text-4xl! leading-tight! font-bold text-gray-900 tracking-tight mb-4 text-balance">
        {title}
      </h1>
      <p className="text-sm text-gray-500 tabular-nums">
        <span className="block sm:inline">{author}</span>
        <span className="hidden sm:inline"> · </span>
        <span className="block sm:inline">{meta}</span>
      </p>
      {imageSrc ? (
        <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      ) : null}
    </header>
  );
}
