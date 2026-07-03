"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Cake, Mic, Crown, Sparkles } from "lucide-react";
import { PremiumLogo } from "./PremiumLogo";
import type { PremiumLogoVariant } from "./PremiumLogo";

interface LoadingScreenProps {
  isLoading: boolean;
  title?: string;
  images?: string[];
  eventType?: "wedding" | "birthday" | "conference" | "gala" | "other" | string;
  logoUrl?: string | null;
  initials?: string;
  variant?: PremiumLogoVariant;
}

type EventKey = "wedding" | "birthday" | "conference" | "gala" | "other";

const PHASES_FR = [
  "Sécurisation de la liaison…",
  "Chargement du design system…",
  "Préparation de votre espace…",
  "Synchronisation des données…",
  "Prêt",
];

const EVENT_TYPE_ICONS: Record<EventKey, React.ComponentType<{ className?: string }>> = {
  wedding: Heart,
  birthday: Cake,
  conference: Mic,
  gala: Crown,
  other: Sparkles,
};

const EVENT_VARIANT: Record<EventKey, PremiumLogoVariant> = {
  wedding: "gold",
  birthday: "emerald",
  conference: "blue",
  gala: "gold",
  other: "emerald",
};

export function LoadingScreen({
  isLoading,
  title,
  images = [],
  eventType,
  logoUrl: propLogoUrl,
  initials: propInitials,
  variant: propVariant,
}: LoadingScreenProps) {
  const type = (eventType?.toLowerCase() || "other") as EventKey;
  const [phase, setPhase] = useState(0);

  // Resolve logo from props or localStorage fallback
  const resolvedLogo = React.useMemo(() => {
    if (propLogoUrl) return propLogoUrl;
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("event-config");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.logoUrl || null;
      }
    } catch { /* ignore */ }
    return null;
  }, [propLogoUrl]);

  const resolvedInitials = React.useMemo(() => {
    if (propInitials) return propInitials;
    if (typeof window === "undefined") return "E";
    try {
      const stored = localStorage.getItem("event-config");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.hostInitials || parsed?.eventName?.substring(0, 2).toUpperCase() || "E";
      }
    } catch { /* ignore */ }
    return "E";
  }, [propInitials]);

  const resolvedVariant = propVariant || EVENT_VARIANT[type] || "emerald";
  const EventIcon = EVENT_TYPE_ICONS[type] || Sparkles;

  // Progress micro-phase cycling
  useEffect(() => {
    if (!isLoading) return;
    const durations = [1200, 1600, 1400, 1800, 2000];
    let timeoutId: ReturnType<typeof setTimeout>;
    let current = 0;

    const advance = () => {
      current = Math.min(current + 1, PHASES_FR.length - 1);
      setPhase(current);
      if (current < PHASES_FR.length - 1) {
        timeoutId = setTimeout(advance, durations[current] || 1500);
      }
    };

    timeoutId = setTimeout(advance, durations[0]);
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // Reset phase when loading starts
  useEffect(() => {
    if (isLoading) setPhase(0);
  }, [isLoading]);

  /* ── Color palettes aligned with the EMAK design-system tokens ───── */
  const backgroundClass: Record<EventKey, string> = {
    wedding: "from-[#0c1a14] via-[#0f2a1d] to-[#081410]",
    birthday: "from-[#1e1b4b] via-[#2d1854] to-[#1a0928]",
    conference: "from-[#020617] via-[#0f172a] to-[#020617]",
    gala: "from-[#09090b] via-[#18181b] to-[#09090b]",
    other: "from-[#0c1a14] via-[#0f2a1d] to-[#081410]",
  };

  const accentColor: Record<EventKey, string> = {
    wedding: "#d4af37",
    birthday: "#f472b6",
    conference: "#22d3ee",
    gala: "#f59e0b",
    other: "#34d399",
  };

  const textLightClass: Record<EventKey, string> = {
    wedding: "text-amber-100/90 font-serif italic",
    birthday: "text-rose-100 font-sans tracking-wide font-medium",
    conference: "text-slate-100 font-mono tracking-wider uppercase",
    gala: "text-amber-100 font-serif tracking-widest uppercase font-semibold",
    other: "text-emerald-100 font-sans tracking-normal",
  };

  const progressBg: Record<EventKey, string> = {
    wedding: "via-[#d4af37]",
    birthday: "via-rose-400",
    conference: "via-cyan-400",
    gala: "via-amber-500",
    other: "via-emerald-400",
  };

  const accent = accentColor[type] || accentColor.other;
  const bg = backgroundClass[type] || backgroundClass.other;
  const textClass = textLightClass[type] || textLightClass.other;
  const progressClass = progressBg[type] || progressBg.other;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
          className={`fixed inset-0 z-[200] bg-gradient-to-br ${bg} flex flex-col items-center justify-center p-6 overflow-hidden`}
        >
          {/* ── Animated Background Images (if provided) ────────────────── */}
          {images.map((img, idx) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, scale: 0.8, x: idx % 2 === 0 ? -100 : 100, y: idx === 0 ? -100 : 100 }}
              animate={{
                opacity: 0.08,
                scale: 1.05,
                x: idx % 2 === 0 ? [-100, -80, -100] : [100, 80, 100],
                y: idx === 0 ? [-100, -120, -100] : [100, 120, 100],
                rotate: idx === 0 ? [-5, 5, -5] : [5, -5, 5]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-auto shadow-2xl rounded-2xl overflow-hidden border border-white/5 pointer-events-none grayscale opacity-10"
            >
              <img src={img || undefined} alt="" className="w-full h-auto" />
            </motion.div>
          ))}

          {/* ── Primary ambient aura (large pulsing glow) ───────────────── */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.12, 0.25, 0.12],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />

          {/* ── Secondary floating accent orbs ──────────────────────────── */}
          <motion.div
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -30, 50, 0],
              scale: [0.8, 1.1, 0.9, 0.8],
              opacity: [0.08, 0.18, 0.06, 0.08],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[15%] w-[250px] h-[250px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accent}20 0%, transparent 60%)`,
              filter: "blur(60px)",
            }}
          />
          <motion.div
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 0.7, 1.15, 1],
              opacity: [0.06, 0.14, 0.04, 0.06],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accent}18 0%, transparent 55%)`,
              filter: "blur(70px)",
            }}
          />

          {/* ── Subtle particle dots ────────────────────────────────────── */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{
                background: accent,
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.8,
                delay: i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* ── Main content ────────────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col items-center">

            {/* ── Orbit rings around the logo ─────────────────────────── */}
            <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
              {/* Outer dashed orbit ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                  <circle
                    cx="80" cy="80" r="76"
                    stroke={accent}
                    strokeWidth="1"
                    strokeDasharray="4 10"
                    opacity="0.25"
                  />
                </svg>
              </motion.div>

              {/* Inner accent orbit ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3"
              >
                <svg viewBox="0 0 136 136" className="w-full h-full" fill="none">
                  <motion.circle
                    cx="68" cy="68" r="64"
                    stroke={accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.15 }}
                    animate={{ pathLength: [0.15, 0.6, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    opacity="0.5"
                  />
                </svg>
              </motion.div>

              {/* Accent dot orbiter */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: accent,
                    top: "0px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: `0 0 12px 3px ${accent}60`,
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Central logo with PremiumLogo component */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.04, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PremiumLogo
                    src={resolvedLogo}
                    fallbackIcon={EventIcon}
                    initials={resolvedInitials}
                    size="xxl"
                    variant={resolvedVariant}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ── Title with animated shimmer gradient ────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-4 max-w-lg"
            >
              {title && (
                <motion.h2
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className={`text-3xl md:text-4xl tracking-tight mb-3 bg-clip-text text-transparent bg-[length:200%_auto] ${textClass}`}
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${accent}cc, #ffffff, ${accent}cc)`,
                  }}
                >
                  {title}
                </motion.h2>
              )}

              {/* Brand badge separator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 36 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${accent}40)` }}
                />
                <span
                  className="text-[9px] uppercase tracking-[0.4em] font-bold"
                  style={{ color: `${accent}80` }}
                >
                  EMAK Smart Event
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 36 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="h-px"
                  style={{ background: `linear-gradient(to left, transparent, ${accent}40)` }}
                />
              </motion.div>
            </motion.div>

            {/* ── Micro-phase progress status ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated progress bar */}
              <div className="w-56 h-[3px] rounded-full overflow-hidden relative"
                style={{ background: `${accent}10` }}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent ${progressClass} to-transparent`}
                />
                {/* Static fill progress based on phase */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accent}60, ${accent})` }}
                  animate={{ width: `${(phase / (PHASES_FR.length - 1)) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Phase micro-copy */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="text-[11px] font-medium tracking-wider"
                  style={{ color: `${accent}90` }}
                >
                  {PHASES_FR[phase]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
