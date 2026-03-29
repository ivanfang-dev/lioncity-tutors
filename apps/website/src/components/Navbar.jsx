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
  const [scrolled, setScrolled] = useState(false);

  const navLinkStyle = (path) =>
    `text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap ${
      pathname === path ? "bg-gray-100 text-primary font-semibold" : "text-gray-700"
    }`;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navRef = useRef(null);

  // Sticky scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 w-full px-4 lg:px-6 py-3 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60"
          : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
        <Image src="/favicon.png" alt="LionCity Logo" width={32} height={32} priority />
        <span className="text-lg font-bold text-primary whitespace-nowrap">LionCity Tutors</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-1 ml-auto">
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
        <Dropdown
          label="For Tutors"
          items={forTutors}
          open={openDropdown === "tutors"}
          onToggle={() => toggleDropdown("tutors")}
        />

        <Link href="/tuition-rates" className={navLinkStyle("/tuition-rates")}>Tuition Rates</Link>

        <Link
          href="/request-tutor"
          className="bg-[#F17720] text-white px-5 py-2.5 rounded-full hover:bg-[#d9691c] shadow-sm hover:shadow-md transition-all font-semibold whitespace-nowrap ml-3 text-sm"
        >
          Get Free Tutor Matching
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="lg:hidden text-gray-600 p-1" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-100 flex flex-col z-50 animate-slideDown"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CTA Button */}
          <div className="px-5 py-4 border-b border-gray-100">
            <Link
              href="/request-tutor"
              onClick={() => setMenuOpen(false)}
              className="bg-[#F17720] text-white text-sm px-6 py-3 rounded-full hover:bg-[#d9691c] shadow-sm font-semibold block text-center transition-all"
            >
              Get Free Tutor Matching
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="py-1">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`block px-5 py-3.5 text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-primary/5 text-primary"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
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
              className={`block px-5 py-3.5 text-sm font-medium transition-colors ${
                pathname === "/tuition-rates"
                  ? "bg-primary/5 text-primary"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Tuition Rates
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
