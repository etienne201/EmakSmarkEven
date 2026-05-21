"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DecorationType } from "@backend/eventConfig";

interface FloatingDecorationsProps {
  type: DecorationType | "traditional" | "civil";
}

// Map legacy types to new types
function resolveType(type: string): DecorationType {
  if (type === "traditional") return "floral";
  if (type === "civil") return "sparkle";
  return type as DecorationType;
}

const DECORATION_COLORS: Record<string, { a: string; b: string }> = {
  floral:    { a: "var(--gold-light, #fde68a)", b: "var(--emerald, #6ee7b7)" },
  sparkle:   { a: "var(--gold-light, #fde68a)", b: "var(--emerald, #6ee7b7)" },
  confetti:  { a: "var(--gold, #e11d48)",       b: "var(--gold-light, #7c3aed)" },
  minimal:   { a: "var(--gold-light, #e5e5e5)", b: "var(--gold-light, #d4d4d4)" },
  corporate: { a: "var(--gold-light, #dbeafe)", b: "var(--emerald, #0f766e)" },
};

const DEFAULT_COLORS = DECORATION_COLORS.floral;

export function FloatingDecorations({ type }: FloatingDecorationsProps) {
  const resolved = resolveType(type);
  const colors = DECORATION_COLORS[resolved] || DEFAULT_COLORS;
  const [elements, setElements] = useState<{ id: number; x: number; y: number; size: number; duration: number; colorIdx: number }[]>([]);

  useEffect(() => {
    const count = resolved === "minimal" ? 6 : resolved === "corporate" ? 8 : 15;
    const newElements = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (resolved === "confetti" ? 12 : 20) + 10,
      duration: Math.random() * 20 + 10,
      colorIdx: Math.random() > 0.5 ? 0 : 1,
    }));
    setElements(newElements);
  }, [resolved]);

  const renderShape = (el: typeof elements[0]) => {
    switch (resolved) {
      case "confetti":
        return (
          <div
            style={{
              width: el.size * 0.4,
              height: el.size,
              borderRadius: 2,
              background: el.colorIdx === 0 ? colors.a : colors.b,
              opacity: 0.5,
            }}
          />
        );
      case "corporate":
        return (
          <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="3"
              stroke={el.colorIdx === 0 ? colors.a : colors.b} strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        );
      case "minimal":
        return (
          <svg width={el.size * 0.5} height={el.size * 0.5} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4"
              fill={el.colorIdx === 0 ? colors.a : colors.b} fillOpacity="0.2" />
          </svg>
        );
      case "sparkle":
        return (
          <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10"
              stroke={el.colorIdx === 0 ? colors.a : colors.b} strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="12" cy="12" r="6"
              stroke={el.colorIdx === 0 ? colors.b : colors.a} strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>
        );
      case "floral":
      default:
        return (
          <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C12 21 20 16 20 9C20 4.5 16.5 2 12 2C7.5 2 4 4.5 4 9C4 16 12 21 12 21Z"
              fill={el.colorIdx === 0 ? colors.a : colors.b}
              fillOpacity="0.4"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{
            x: `${el.x}vw`,
            y: `${el.y}vh`,
            rotate: 0,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            y: ["-10vh", "110vh"],
            x: [`${el.x}vw`, `${el.x + (Math.random() * 20 - 10)}vw`],
            rotate: resolved === "confetti" ? 720 : 360,
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute"
        >
          {renderShape(el)}
        </motion.div>
      ))}
    </div>
  );
}
