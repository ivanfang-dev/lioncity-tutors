import { FaWhatsapp } from "react-icons/fa"
import React from 'react';
import Link from 'next/link';

export default function Whatsapp(){
  return(
    // `safe-bottom` / `safe-right` keep the button clear of the iPhone home
    // indicator and Safari's bottom bar, which otherwise sit on top of it — this
    // control lives exactly in that band.
    <div className="floating-chrome fixed safe-bottom safe-right sm:right-8 z-40 group">
      <Link
        href="https://wa.me/6588701152"
        className="bg-green-500 hover:bg-green-600 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp">
        <FaWhatsapp size={24} aria-hidden="true" />
      </Link>
      {/* Hover-only, so it never appears on touch — which is correct: the
          aria-label already names the control for anyone who needs it. Pinned
          to the right edge rather than centred, because a centre-anchored
          tooltip on a button this close to the viewport edge hangs off-screen. */}
      <div className="pointer-events-none absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        WhatsApp Us
      </div>
    </div>
  )
}

