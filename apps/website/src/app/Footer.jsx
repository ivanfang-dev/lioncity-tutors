import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-14 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Column 1: Branding */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/favicon.png" alt="LionCity Tutors Logo" width={40} height={40} />
              <span className="text-lg font-bold text-primary">LionCity Tutors</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Singapore's trusted choice for qualified and dedicated tutors.
            </p>
          </div>

          {/* Column 2: For Students & Parents */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">For Students & Parents</h3>
            <ul className="text-sm">
              <li><Link href="/request-tutor" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Request A Tutor</Link></li>
              <li><Link href="/tuition-rates" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Tuition Rates</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Our Blog</Link></li>
              <li><Link href="/free-test-papers" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Free Test Papers</Link></li>
              <li><Link href="/free-notes" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Free Notes</Link></li>
            </ul>
          </div>

          {/* Column 3: For Tutors */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">For Tutors</h3>
            <ul className="text-sm">
              <li><Link href="/register-tutor" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Become a Tutor</Link></li>
              <li><Link href="/tuition-assignments" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Tuition Assignments</Link></li>
              <li><Link href="/terms-and-conditions-for-tutors" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">Tutor T&Cs</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="text-sm">
              <li>
                <Link href="/contact-us" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://wa.me/6588701152" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">
                  WhatsApp: +65 8870 1152
                </a>
              </li>
              <li>
                <a href="mailto:admin@lioncitytutors.com" className="text-gray-600 hover:text-primary transition-colors min-h-11 flex items-center">
                  admin@lioncitytutors.com
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-1 mt-6 -ml-3">
              <a href="https://www.instagram.com/lioncitytutors/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-tertiary hover:text-primary transition-colors p-3">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/LionCityTutors/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-tertiary hover:text-primary transition-colors p-3">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://www.carousell.sg/u/lioncity_tutors/" target="_blank" rel="noopener noreferrer" aria-label="Carousell" className="text-text-tertiary hover:text-primary transition-colors p-3">
                <img src="/carousell_fixed.svg" alt="Carousell" className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-center text-xs text-text-tertiary">
          <p>&copy; {new Date().getFullYear()} LionCity Tutors. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms-and-conditions-for-clients" className="text-text-secondary hover:text-primary transition-colors min-h-11 flex items-center">Client T&Cs</Link>
            <Link href="/privacy-policy" className="text-text-secondary hover:text-primary transition-colors min-h-11 flex items-center">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
