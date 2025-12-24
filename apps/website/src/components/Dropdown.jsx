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
        className={`text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition flex items-center gap-1 whitespace-nowrap ${isMobile ? 'w-full justify-center' : ''}`}
      >
        {label}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={`${isMobile ? "bg-gray-50 py-2 w-full" : "absolute left-0 pt-2 z-20"} animate-fadeIn`}
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
                        className={`flex-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isMobile ? 'text-center' : 'text-left'}`}
                      >
                        {item.name}
                      </Link>
                      
                      <button
                        onClick={(e) => handleSubmenuToggle(e, item.path)}
                        className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 border-l border-gray-200"
                        aria-label={`Toggle ${item.name} submenu`}
                      >
                        <ChevronRight size={16} className={`transition-transform ${isSubmenuOpen ? "rotate-90" : ""}`} />
                      </button>
                    </div>

                    {isSubmenuOpen && (
                      <div className={isMobile ? "pl-4 bg-gray-100" : "absolute left-full -top-1 bg-white rounded-md shadow-lg py-1 min-w-[180px]"}>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isMobile ? 'text-center' : ''}`}
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
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isMobile ? 'text-center' : ''}`}
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