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

  // Hold the page still while the mobile panel is open. Without this the page
  // keeps scrolling behind an opaque full-width sheet, so a thumb-flick that was
  // meant to scan the menu silently moves the page underneath it instead — and
  // the visitor lands somewhere they never chose once they close it. The lock
  // goes on <html> because that is this document's scrolling element.
  useEffect(() => {
    if (!menuOpen) return;
    const { documentElement } = document;
    const previous = documentElement.style.overflow;
    documentElement.style.overflow = "hidden";
    return () => {
      documentElement.style.overflow = previous;
    };
  }, [menuOpen]);

  // Escape closes the panel, matching every other dismissible surface on the site.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
          className="bg-accent-fill text-white px-5 py-2.5 rounded-full hover:bg-accent-fill-hover shadow-sm hover:shadow-md transition-all font-semibold whitespace-nowrap ml-3 text-sm"
        >
          Get Free Tutor Matching
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-gray-600 -mr-2 flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>

      {/* Mobile menu — always rendered so every link is in the crawlable HTML;
          visibility is toggled with CSS (not unmounting) and hidden items are
          taken out of tab order so keyboard nav still skips them when closed.

          The height cap and `overflow-y-auto` are not polish. This panel is
          absolutely positioned inside a `sticky` nav, so it does not grow the
          page and the page cannot be scrolled to reach it: on an iPhone SE
          (375x667) opening "Subjects" made the panel 775px tall and the last
          three subject links sat permanently below the viewport with no way to
          get to them. `100dvh` (not `vh`) so the cap tracks Safari's collapsing
          address bar instead of assuming the taller layout viewport. */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`absolute top-full left-0 w-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-100 flex-col z-50 animate-slideDown pb-[env(safe-area-inset-bottom)] ${menuOpen ? "flex" : "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CTA Button */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Link
            href="/request-tutor"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className="bg-accent-fill text-white text-sm px-6 py-3 rounded-full hover:bg-accent-fill-hover shadow-sm font-semibold block text-center transition-all"
          >
            Get Free Tutor Matching
          </Link>

          {/* Free Test Papers is the single most-clicked page on the site and sat
              two taps deep, behind the Free Resources accordion — as did Free
              Notes. Everything else can stay categorised; these two earn a
              shortcut. */}
          <div className="mt-3 flex gap-2">
            {[
              { href: '/free-test-papers', label: 'Free Test Papers' },
              { href: '/free-notes', label: 'Free Notes' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                className={`flex min-h-11 flex-1 items-center justify-center rounded-full border px-3 text-center text-xs font-semibold transition-colors ${
                  pathname === href
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="py-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
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
            tabIndex={menuOpen ? 0 : -1}
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
    </nav>
  );
}
