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

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={`dropdown-${label}`}
        className={
          isMobile 
            ? 'w-full justify-between px-6 py-4 text-base font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition flex items-center gap-1 whitespace-nowrap' 
            : 'text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition flex items-center gap-1 whitespace-nowrap'
        }
      >
        <span>{label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={`${
            isMobile 
              ? "bg-gray-50 border-t border-gray-100" 
              : "absolute left-0 pt-2 z-20"
          } animate-fadeIn`}
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
                        className={`text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                          isMobile 
                            ? 'px-4 py-3 border-l border-gray-200' 
                            : 'px-2 py-2 border-l border-gray-200'
                        }`}
                        aria-label={`Toggle ${item.name} submenu`}
                      >
                        <ChevronRight size={16} className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-90" : ""}`} />
                      </button>
                    </div>

                    {isSubmenuOpen && (
                      <div className={
                        isMobile 
                          ? "bg-gray-100 border-t border-gray-200" 
                          : "absolute left-full -top-1 bg-white rounded-md shadow-lg py-1 min-w-[180px]"
                      }>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
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
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  href={item.path}
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
      )}
    </div>
  );
}