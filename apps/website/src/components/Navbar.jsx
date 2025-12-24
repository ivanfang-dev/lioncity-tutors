"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

  const mobileNavLinkStyle = (path) =>
    `text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition whitespace-nowrap text-center w-full ${
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
      <div className="w-full bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 text-red-700 text-sm py-3 px-6 flex justify-center sm:justify-between items-center">
          <div className="hidden sm:flex items-center gap-2">
          <span className="text-red-500">✉️</span>
          <a href="mailto:admin@lioncitytutors.com" className="font-medium hover:text-red-600">
          admin@lioncitytutors.com
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-500">📞</span>
          <a href="tel:+6588701152" className="font-medium hover:text-red-600">
            +65 8870 1152
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

        {/* MODIFIED: FULL Mobile Nav Code with new structure */}
        {menuOpen && (
          <div 
            className="mobile-menu absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-stretch py-4 z-50"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="px-4 pb-2">
              <Link
                href="/request-tutor"
                onClick={() => setMenuOpen(false)}
                className="bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 shadow-md font-semibold block text-center"
              >
                📚 Get Free Tutor Matching
              </Link>
            </div>

            <Link href="/" onClick={() => setMenuOpen(false)} className={mobileNavLinkStyle("/")}>
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
              label="Resources"
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

            <Link href="/tuition-rates" onClick={() => setMenuOpen(false)} className={mobileNavLinkStyle("/tuition-rates")}>
              Tuition Rates
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}