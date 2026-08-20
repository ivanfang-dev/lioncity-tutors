import React from 'react';

/**
 * Wrapper for a table too wide to fit a phone.
 *
 * The site has a dozen of these — exam timetables, rate cards, the region
 * demand snapshot — and every one was a bare `<div className="overflow-x-auto">`.
 * That contains the table (the page itself never scrolls sideways, which is the
 * important part and was already right) but leaves two real problems on mobile:
 *
 *  - **Nothing says it scrolls.** A parent sees a table sliced off at the right
 *    edge and reads it as broken, not as scrollable. The fix here is CSS-only:
 *    two `background-attachment: local` gradients sit at the scroll extremes and
 *    two fixed ones paint the shadow over them, so a shadow appears on whichever
 *    side has content off-screen and vanishes at each end — no scroll listener,
 *    no JS, nothing to repaint per frame.
 *  - **A keyboard cannot reach it.** A scrollable region with no focusable child
 *    is a WCAG 2.1.1 trap: the content is simply unreachable without a pointer.
 *    `tabIndex={0}` plus `role="region"` and a name fixes that, and gives screen
 *    readers something to announce.
 */
export default function ScrollTable({ label, className = '', children }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={`overflow-x-auto overscroll-x-contain rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--color-background-default) 30%, transparent),
          linear-gradient(to left,  var(--color-background-default) 30%, transparent),
          linear-gradient(to right, rgba(0,0,0,0.10), transparent 12px),
          linear-gradient(to left,  rgba(0,0,0,0.10), transparent 12px)
        `,
        backgroundPosition: 'left center, right center, left center, right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '32px 100%, 32px 100%, 14px 100%, 14px 100%',
        backgroundAttachment: 'local, local, scroll, scroll',
      }}
    >
      {children}
    </div>
  );
}
