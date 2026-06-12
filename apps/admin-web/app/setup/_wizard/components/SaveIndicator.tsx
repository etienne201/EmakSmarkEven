"use client";

import { Check, Loader2, AlertTriangle, Cloud } from "lucide-react";
import { useSetupStore } from "../store";

// Visual autosave indicator. Autosave errors are shown but never block the user.
export function SaveIndicator() {
  const isSaving = useSetupStore((s) => s.isSaving);
  const saveError = useSetupStore((s) => s.saveError);
  const lastSavedAt = useSetupStore((s) => s.lastSavedAt);

  if (isSaving) {
    return (
      <span className="es-save-indicator" data-state="saving">
        <Loader2 className="w-3.5 h-3.5 es-spin" aria-hidden />
        Enregistrement…
      </span>
    );
  }
  if (saveError) {
    return (
      <span className="es-save-indicator" data-state="error" title={saveError}>
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
        Sauvegarde différée
      </span>
    );
  }
  if (lastSavedAt) {
    return (
      <span className="es-save-indicator" data-state="saved">
        <Check className="w-3.5 h-3.5" aria-hidden />
        Enregistré
      </span>
    );
  }
  return (
    <span className="es-save-indicator" data-state="idle">
      <Cloud className="w-3.5 h-3.5" aria-hidden />
      Sauvegarde automatique
    </span>
  );
}
