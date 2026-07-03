"use client";

import { Check, Loader2, AlertTriangle, Cloud } from "lucide-react";
import { useSetupStore } from "../store";

// Visual autosave indicator. Refactored into a high-end micro-badge.
export function SaveIndicator() {
  const isSaving = useSetupStore((s) => s.isSaving);
  const saveError = useSetupStore((s) => s.saveError);
  const lastSavedAt = useSetupStore((s) => s.lastSavedAt);

  if (isSaving) {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/5 border border-cyan-500/20 rounded-full text-xs font-semibold text-cyan-400 shadow-sm shadow-cyan-500/5"
        data-state="saving"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
        <span>Enregistrement…</span>
      </span>
    );
  }

  if (saveError) {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/5 border border-rose-500/20 rounded-full text-xs font-semibold text-rose-400 shadow-sm shadow-rose-500/5"
        data-state="error" 
        title={saveError}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" aria-hidden />
        <span>Sauvegarde différée</span>
      </span>
    );
  }

  if (lastSavedAt) {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400 shadow-sm shadow-emerald-500/5"
        data-state="saved"
      >
        {/* Small glowing green indicator dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <Check className="w-3 h-3" aria-hidden />
        <span>Enregistré</span>
      </span>
    );
  }

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/40 border border-slate-800 rounded-full text-xs font-medium text-slate-400"
      data-state="idle"
    >
      <Cloud className="w-3.5 h-3.5 text-slate-500" aria-hidden />
      <span>Sauvegarde automatique</span>
    </span>
  );
}
