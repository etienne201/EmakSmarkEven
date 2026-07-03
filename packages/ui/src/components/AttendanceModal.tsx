"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Trophy, X, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Language, translations } from "@backend/translations";

interface AttendanceOption {
  id: string;
  enabled: boolean;
}

interface AttendanceScreenProps {
  onSelect: (status: string) => Promise<void>;
  guestName: string;
  lang: Language;
  currentStatus?: string | null;
  attendanceOptions?: AttendanceOption[];
}

const OPTION_CONFIG: Record<string, { icon: React.ReactNode; colorClass: string; bgClass: string; borderClass: string; shadowClass: string; tKey: string; badgeKey: string }> = {
  present: {
    icon: <UserCheck className="w-6 h-6" />,
    colorClass: "text-emerald",
    bgClass: "bg-emerald",
    borderClass: "border-emerald/20",
    shadowClass: "shadow-emerald/20",
    tKey: "present",
    badgeKey: "presentBadge",
  },
  absent: {
    icon: <X className="w-6 h-6" />,
    colorClass: "text-red-500",
    bgClass: "bg-red-500",
    borderClass: "border-red-200",
    shadowClass: "shadow-red-500/20",
    tKey: "absent",
    badgeKey: "absentBadge",
  },
  honored: {
    icon: <Trophy className="w-6 h-6" />,
    colorClass: "text-gold",
    bgClass: "bg-gold",
    borderClass: "border-gold/20",
    shadowClass: "shadow-gold/20",
    tKey: "honored",
    badgeKey: "honoredBadge",
  },
  outOfSchedule: {
    icon: <Clock className="w-6 h-6" />,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500",
    borderClass: "border-amber-200",
    shadowClass: "shadow-amber-500/20",
    tKey: "outOfSchedule",
    badgeKey: "outOfScheduleBadge",
  },
};

const STATUS_MAP: Record<string, string> = {
  present: "Présent",
  absent: "Absent",
  honored: "Honoré",
  outOfSchedule: "Hors horaire",
};

export function AttendanceScreen({
  onSelect,
  guestName,
  lang,
  currentStatus,
  attendanceOptions,
}: AttendanceScreenProps) {
  const t = translations[lang] || translations.fr;
  const a = t.attendance;
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(!!currentStatus);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(currentStatus || null);
  const [canChange, setCanChange] = useState(false);

  const defaultOptions: AttendanceOption[] = [
    { id: "present", enabled: true },
    { id: "absent", enabled: true },
    { id: "honored", enabled: false },
    { id: "outOfSchedule", enabled: false },
  ];

  const options = (attendanceOptions || defaultOptions).filter((option) => option.enabled);

  const handleSelect = async (optionId: string) => {
    const statusValue = STATUS_MAP[optionId] || "Présent";
    setLoading(optionId);
    try {
      await onSelect(statusValue);
      setSelectedStatus(statusValue);
      setConfirmed(true);
      setCanChange(false);
    } catch (error) {
      console.error("Attendance selection failed:", error);
    } finally {
      setLoading(null);
    }
  };

  const currentOptionId = Object.entries(STATUS_MAP).find(([, value]) => value === selectedStatus)?.[0];

  if (confirmed && !canChange) {
    const cfg = currentOptionId ? OPTION_CONFIG[currentOptionId] : OPTION_CONFIG.present;
    const badgeText = currentOptionId ? (a as any)[cfg.badgeKey] || selectedStatus : selectedStatus;
    return (
      <div className="flex flex-col items-center justify-center py-8 px-6 text-center bg-slate-950/5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`w-24 h-24 rounded-full ${cfg.bgClass}/10 flex items-center justify-center mb-8 border-2 ${cfg.borderClass}`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2 className={`w-12 h-12 ${cfg.colorClass}`} />
          </motion.div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-extrabold text-slate-900 mb-2"
        >
          {(a as any).confirmed || "Votre présence a bien été enregistrée"}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-sm text-slate-500 max-w-xs mx-auto"
        >
          {(a as any).confirmationHint || "Merci, nous avons bien noté votre statut pour l’événement."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`inline-flex items-center gap-3 mt-6 px-6 py-4 rounded-[1.75rem] ${cfg.bgClass}/10 border ${cfg.borderClass} shadow-lg`}
        >
          {cfg.icon}
          <span className={`font-bold text-base ${cfg.colorClass}`}>{badgeText}</span>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setCanChange(true)}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:bg-slate-50"
        >
          {(a as any).changeStatus || "Modifier mon statut"}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mx-auto mb-5"
        >
          <UserCheck className="w-8 h-8 text-gold" />
        </motion.div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2">{a.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed px-4">
          {(t as any).greeting}{" "}
          <span className="font-bold text-gold">{guestName}</span>.{" "}
          {a.prompt}
        </p>
      </div>

      {/* Options grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {options.map((option, i) => {
            const cfg = OPTION_CONFIG[option.id];
            if (!cfg) return null;
            const label = (a as any)[cfg.tKey] || option.id;
            const isLoading = loading === option.id;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleSelect(option.id)}
                type="button"
                disabled={!!loading}
                className={`w-full flex items-center gap-4 rounded-[2rem] border-2 px-5 py-5 transition-all duration-300 shadow-xl backdrop-blur-xl ${
                  isLoading
                    ? `${cfg.bgClass} text-white border-transparent ${cfg.shadowClass}`
                    : `bg-white/90 ${cfg.borderClass} hover:${cfg.bgClass}/10 hover:border-opacity-50`
                } ${loading && !isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${
                  isLoading ? "bg-white/15" : `${cfg.bgClass}/10`
                }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <span className={cfg.colorClass}>{cfg.icon}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className={`text-base font-semibold ${isLoading ? "text-white" : "text-slate-900"}`}>{label}</p>
                  <p className="text-xs text-slate-500 mt-1">{(a as any)[`${cfg.tKey}Description`] || "Enregistrez votre présence"}</p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Later button */}
      {canChange && (
        <button
          onClick={() => { setCanChange(false); setConfirmed(true); }}
          className="mt-6 w-full text-center text-gray-400 hover:text-gray-600 transition-colors text-xs font-bold uppercase tracking-widest py-3"
        >
          {a.later}
        </button>
      )}
    </div>
  );
}

// Keep backward-compatible export
export { AttendanceScreen as AttendanceModal };
