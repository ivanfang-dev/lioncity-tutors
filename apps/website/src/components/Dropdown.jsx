"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Dropdown({ label, items, open, onToggle, isMobile = false }) {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    if (!open) {
      setActiveSubmenu(null);
    }
  }, [open]);

  const handleSubmenuToggle = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === path ? null : path);
  };

  const dropdownId = `dropdown-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={dropdownId}
        className={
          isMobile
            ? 'w-full justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-1 whitespace-nowrap'
            : 'text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 whitespace-nowrap'
        }
      >
        <span>{label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu — always rendered so every link is in the crawlable HTML;
          visibility is toggled with CSS (not unmounting) and hidden items are
          taken out of tab order so keyboard nav still skips them when closed. */}
      <div
        id={dropdownId}
        aria-hidden={!open}
        className={`${
          isMobile
            ? "bg-gray-50 border-t border-gray-100"
            : "absolute left-0 pt-2 z-20"
        } ${open ? "" : "hidden"} animate-fadeIn`}
      >
        <div className={`${isMobile ? "" : "bg-white rounded-md shadow-lg py-1 min-w-[220px]"}`}>
          {items.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = activeSubmenu === item.path;

            if (hasSubmenu) {
              return (
                <div key={item.path} className="relative">
                  <div className="flex">
                    <Link
                      href={item.path}
                      tabIndex={open ? 0 : -1}
                      className={`flex-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                        isMobile
                          ? 'px-8 py-3 text-gray-600 hover:text-gray-800'
                          : 'px-4 py-2'
                      }`}
                    >
                      {item.name}
                    </Link>

                    <button
                      onClick={(e) => handleSubmenuToggle(e, item.path)}
                      tabIndex={open ? 0 : -1}
                      className={`text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                        isMobile
                          ? 'px-4 py-3 border-l border-gray-200'
                          : 'px-2 py-2 border-l border-gray-200'
                      }`}
                      aria-label={`Toggle ${item.name} submenu`}
                      aria-expanded={isSubmenuOpen}
                    >
                      <ChevronRight size={16} className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                  <div
                    aria-hidden={!isSubmenuOpen}
                    className={`${
                      isMobile
                        ? "bg-gray-100 border-t border-gray-200"
                        : "absolute left-full -top-1 bg-white rounded-md shadow-lg py-1 min-w-[180px]"
                    } ${isSubmenuOpen ? "" : "hidden"}`}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        tabIndex={open && isSubmenuOpen ? 0 : -1}
                        className={`block text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                          isMobile
                            ? 'px-12 py-3 text-gray-500 hover:text-gray-700'
                            : 'px-4 py-2'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                tabIndex={open ? 0 : -1}
                className={`block text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                  isMobile
                    ? 'px-8 py-3 text-gray-600 hover:text-gray-800'
                    : 'px-4 py-2'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}