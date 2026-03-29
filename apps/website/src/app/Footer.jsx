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
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">For Students & Parents</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/request-tutor" className="text-gray-600 hover:text-primary transition-colors">Request A Tutor</Link></li>
              <li><Link href="/tuition-rates" className="text-gray-600 hover:text-primary transition-colors">Tuition Rates</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">Our Blog</Link></li>
              <li><Link href="/free-test-papers" className="text-gray-600 hover:text-primary transition-colors">Free Test Papers</Link></li>
              <li><Link href="/free-notes" className="text-gray-600 hover:text-primary transition-colors">Free Notes</Link></li>
            </ul>
          </div>

          {/* Column 3: For Tutors */}
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">For Tutors</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/register-tutor" className="text-gray-600 hover:text-primary transition-colors">Become a Tutor</Link></li>
              <li><Link href="/tuition-assignments" className="text-gray-600 hover:text-primary transition-colors">Tuition Assignments</Link></li>
              <li><Link href="/terms-and-conditions-for-tutors" className="text-gray-600 hover:text-primary transition-colors">Tutor T&Cs</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://wa.me/6588701152" className="text-gray-600 hover:text-primary transition-colors">
                  WhatsApp: +65 8870 1152
                </a>
              </li>
              <li>
                <a href="mailto:admin@lioncitytutors.com" className="text-gray-600 hover:text-primary transition-colors">
                  admin@lioncitytutors.com
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.instagram.com/lioncitytutors/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/LionCityTutors/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://www.carousell.sg/u/lioncity_tutors/" target="_blank" rel="noopener noreferrer" aria-label="Carousell" className="text-gray-400 hover:text-primary transition-colors">
                <img src="/carousell_fixed.svg" alt="Carousell" className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} LionCity Tutors. All Rights Reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <Link href="/terms-and-conditions-for-clients" className="hover:text-primary transition-colors">Client T&Cs</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
