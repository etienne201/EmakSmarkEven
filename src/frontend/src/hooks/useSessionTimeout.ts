"use client";

import { useEffect, useRef, useCallback } from "react";

/** Duration of inactivity (in ms) before the session expires. */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/** Key used in localStorage to synchronise the last-activity timestamp across tabs. */
const LAST_ACTIVITY_KEY = "session-last-activity";

/**
 * User-activity events that reset the inactivity timer.
 * Covers mouse, keyboard, touch, scroll and navigation interactions.
 */
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
  "wheel",
  "resize",
  "focus",
];

interface UseSessionTimeoutOptions {
  /** Whether the session tracker should be active. Typically `isAuthenticated`. */
  enabled: boolean;
  /** Callback to invoke when the session expires (e.g. `logout`). */
  onExpire: () => void;
  /** Optional custom timeout in ms (defaults to 30 min). */
  timeoutMs?: number;
}

/**
 * Hook that monitors user activity and triggers `onExpire` after a period
 * of inactivity.  Activity on *any* open tab resets the timer thanks to
 * cross-tab synchronisation via `localStorage`.
 *
 * The timer is cleaned up automatically on unmount or when disabled.
 */
export function useSessionTimeout({
  enabled,
  onExpire,
  timeoutMs = SESSION_TIMEOUT_MS,
}: UseSessionTimeoutOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onExpireRef = useRef(onExpire);

  // Keep the callback reference up-to-date without restarting timers.
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  /** Persist the current timestamp and (re)start the countdown. */
  const resetTimer = useCallback(() => {
    // Persist across tabs
    try {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    } catch {
      // localStorage may be unavailable in rare edge-cases; ignore.
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onExpireRef.current();
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (!enabled) {
      // Clean up if hook becomes disabled (e.g. after logout).
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // ── On mount: check if the session has already expired ──────────
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      if (elapsed >= timeoutMs) {
        // Session expired while the tab was closed / in the background.
        onExpireRef.current();
        return;
      }
    }

    // ── Start the initial timer ────────────────────────────────────
    resetTimer();

    // ── Attach activity listeners ──────────────────────────────────
    const handleActivity = () => resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    // ── Cross-tab synchronisation ──────────────────────────────────
    // When another tab records activity in localStorage, reset our timer too.
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        resetTimer();
      }
    };
    window.addEventListener("storage", handleStorage);

    // ── Visibility-change check ────────────────────────────────────
    // When the user returns to a background tab, verify the session hasn't
    // expired in the meantime.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const ts = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (ts && Date.now() - parseInt(ts, 10) >= timeoutMs) {
          onExpireRef.current();
        } else {
          resetTimer();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, timeoutMs, resetTimer]);
}

/**
 * Utility to manually signal activity from non-UI code (e.g. API calls).
 * Can be called from anywhere – it simply updates the shared timestamp
 * which will trigger the `storage` event in other tabs.
 */
export function signalActivity() {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    // Dispatch a synthetic storage event for the *current* tab
    // (the native storage event only fires in *other* tabs).
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: LAST_ACTIVITY_KEY,
        newValue: Date.now().toString(),
      })
    );
  } catch {
    // Silently ignore if localStorage is unavailable.
  }
}
