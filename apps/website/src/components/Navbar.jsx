"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Dropdown from "./Dropdown";
import AnimatedBadge from "./AnimatedBadge";
import { subjects, levels, resources, forParents, forTutors } from "../data/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navLinkStyle = (path) =>
    `text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition whitespace-nowrap ${
      pathname === path ? "bg-gray-200 font-semibold" : ""
    }`;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navRef = useRef(null);
  
  useEffect(() => {
    setOpenDropdown(null);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
          setOpenDropdown(null);
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []); 
    
  return (
    <>
      {/* Contact Banner */}
      <div className="w-full bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 text-red-700">
        {/* Desktop Layout */}
        <div className="hidden sm:flex justify-between items-center py-2 px-6 text-xs">
          <a 
            href="mailto:admin@lioncitytutors.com" 
            className="flex items-center gap-1.5 font-medium hover:text-red-600 transition-colors"
          >
            <Mail size={12} className="text-red-500" />
            <span>admin@lioncitytutors.com</span>
          </a>
          <a 
            href="tel:+6588701152" 
            className="flex items-center gap-1.5 font-medium hover:text-red-600 transition-colors"
          >
            <Phone size={12} className="text-red-500" />
            <span>+65 8870 1152</span>
          </a>
        </div>
        
        {/* Mobile Layout - Single Line */}
        <div className="sm:hidden flex justify-center items-center px-4 text-sm">
          <a 
            href="tel:+6588701152" 
            className="flex items-center gap-1.5 font-medium hover:text-red-600 transition-colors"
          >
            <Phone size={12} className="text-red-500" />
            <span>+65 8870 1152</span>
          </a>
        </div>
      </div>

      <nav ref={navRef} className="w-full bg-white shadow-md px-4 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center text-xl font-bold text-red-500 flex-shrink-0">
          <Image src="/favicon.png" alt="LionCity Logo" width={40} height={40} priority />
          <span className="whitespace-nowrap">LionCity Tutors</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden sm:flex space-x-3 items-center ml-auto">
          <Link href="/" className={navLinkStyle("/")}>Home</Link>
          
          <Dropdown
            label="Levels & Exams"
            items={levels}
            open={openDropdown === "levels"}
            onToggle={() => toggleDropdown("levels")}
          />
          <Dropdown
            label="Subjects"
            items={subjects}
            open={openDropdown === "subjects"}
            onToggle={() => toggleDropdown("subjects")}
          />
          {/* Use the new resources data */}
          <div className="relative">
            <Dropdown
              label="Free Resources"
              items={resources}
              open={openDropdown === "resources"}
              onToggle={() => toggleDropdown("resources")}
            />
            <div className="absolute -top-2 -right-2">
              <AnimatedBadge text="Free" color="success" size="xs" icon="sparkles" />
            </div>
          </div>
          <Dropdown
            label="For Parents"
            items={forParents}
            open={openDropdown === "parents"}
            onToggle={() => toggleDropdown("parents")}
          />
          {/* Use the new forTutors data */}
          <Dropdown
            label="For Tutors"
            items={forTutors}
            open={openDropdown === "tutors"}
            onToggle={() => toggleDropdown("tutors")}
          />

          <Link href="/tuition-rates" className={navLinkStyle("/tuition-rates")}>Tuition Rates</Link>
          
          <Link
            href="/request-tutor"
            className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 shadow-md hover:shadow-lg transition font-semibold whitespace-nowrap ml-2"
          >
            📚 Get Free Tutor Matching
          </Link>
        </div>

        {/* Mobile Menu Button (No changes) */}
        <button className="sm:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {menuOpen && (
          <div 
            className="mobile-menu absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 flex flex-col z-50 animate-slideDown"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* CTA Button Section */}
            <div className="px-6 py-4 border-b border-gray-100">
              <Link
                href="/request-tutor"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-6 py-3 rounded-full hover:from-red-600 hover:to-red-700 shadow-lg font-semibold block text-center transition-all duration-200 transform hover:scale-[1.02]"
              >
                📚 Get Free Tutor Matching
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
              <Link 
                href="/" 
                onClick={() => setMenuOpen(false)} 
                className={`block px-6 py-4 text-base font-medium transition-colors duration-200 ${
                  pathname === "/" 
                    ? "bg-red-50 text-red-600 border-r-4 border-red-500" 
                    : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                Home
              </Link>

              <Dropdown
                label="Levels & Exams"
                items={levels}
                open={openDropdown === "levels"}
                onToggle={() => toggleDropdown("levels")}
                isMobile
              />
              
              <Dropdown
                label="Subjects"
                items={subjects}
                open={openDropdown === "subjects"}
                onToggle={() => toggleDropdown("subjects")}
                isMobile
              />
            
              <Dropdown
                label="Free Resources"
                items={resources}
                open={openDropdown === "resources"}
                onToggle={() => toggleDropdown("resources")}
                isMobile
              />
              
              <Dropdown
                label="For Parents"
                items={forParents}
                open={openDropdown === "parents"}
                onToggle={() => toggleDropdown("parents")}
                isMobile
              />
              
              <Dropdown
                label="For Tutors"
                items={forTutors}
                open={openDropdown === "tutors"}
                onToggle={() => toggleDropdown("tutors")}
                isMobile
              />

              <Link 
                href="/tuition-rates" 
                onClick={() => setMenuOpen(false)} 
                className={`block px-6 py-4 text-base font-medium transition-colors duration-200 ${
                  pathname === "/tuition-rates" 
                    ? "bg-red-50 text-red-600 border-r-4 border-red-500" 
                    : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                Tuition Rates
              </Link>
            </div>

            {/* Contact Info Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
              <a 
                href="tel:+6588701152" 
                className="flex items-center justify-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                <Phone size={16} className="text-red-500" />
                <span>+65 8870 1152</span>
              </a>
              <a 
                href="mailto:admin@lioncitytutors.com" 
                className="flex items-center justify-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                <Mail size={16} className="text-red-500" />
                <span>admin@lioncitytutors.com</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}