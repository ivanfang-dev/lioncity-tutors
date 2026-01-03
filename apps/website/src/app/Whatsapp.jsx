import { FaWhatsapp } from "react-icons/fa"
import React from 'react';
import Link from 'next/link';

export default function Whatsapp(){
  return(
    <div className="fixed bottom-6 right-4 sm:right-8 z-40 group">
      <Link
        href="https://wa.me/6588701152" 
        className="bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp">
        <FaWhatsapp size={20} className="sm:w-6 sm:h-6" />
      </Link>
      <div className="absolute bottom-14 sm:bottom-15 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        WhatsApp Us
      </div>
    </div>
  )
}

