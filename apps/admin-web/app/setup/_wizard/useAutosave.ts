import { useEffect, useRef } from "react";
import type { ApiError } from "./types";
import { useSetupStore } from "./store";

interface UseAutosaveOptions<T> {
  value: T;
  /** Whether the current value is valid enough to persist. */
  enabled: boolean;
  save: (value: T) => Promise<unknown>;
  delay?: number;
}

// Intelligent autosave: debounced, silent, and never blocking. Errors are
// surfaced via the store's saveError indicator but do not interrupt the user.
export function useAutosave<T>({
  value,
  enabled,
  save,
  delay = 1500,
}: UseAutosaveOptions<T>) {
  const setSaving = useSetupStore((s) => s.setSaving);
  const setSaved = useSetupStore((s) => s.setSaved);
  const setSaveError = useSetupStore((s) => s.setSaveError);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSerialized = useRef<string | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const serialized = JSON.stringify(value);

    // Skip the initial hydration render.
    if (firstRun.current) {
      firstRun.current = false;
      lastSerialized.current = serialized;
      return;
    }
    if (!enabled || serialized === lastSerialized.current) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      lastSerialized.current = serialized;
      setSaving(true);
      try {
        await save(value);
        setSaved();
      } catch (e) {
        const err = e as ApiError;
        setSaveError(err.message || "Échec de la sauvegarde automatique.");
      }
    }, delay);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, enabled, save, delay, setSaving, setSaved, setSaveError]);
}
