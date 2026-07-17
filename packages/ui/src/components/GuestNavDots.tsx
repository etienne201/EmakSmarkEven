"use client";

import React from "react";
import { motion } from "framer-motion";

interface GuestNavDotsProps {
  sections: { id: string; label: string; icon: React.ReactNode }[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export function GuestNavDots({ sections, activeIndex, onNavigate }: GuestNavDotsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] pointer-events-none">
      <div className="max-w-md mx-auto pb-6 px-4 pointer-events-auto">
        {/* Glass bar */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] px-3 py-2.5 flex items-center justify-center gap-1">
          {sections.map((section, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(i)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-500 ${
                  isActive 
                    ? "bg-emerald text-white shadow-lg shadow-emerald/20" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-emerald rounded-2xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={`text-sm transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                    {section.icon}
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden"
                    >
                      {section.label}
                    </motion.span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
