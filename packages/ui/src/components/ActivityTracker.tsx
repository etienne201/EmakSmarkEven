"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { fetchApi } from "@frontend/utils/api";

/**
 * ActivityTracker: Monitors user activity (click, keydown, scroll)
 * and pings the server to refresh the sliding session.
 */
export function ActivityTracker() {
  const pathname = usePathname();

  const refreshSession = useCallback(async () => {
    const token = Cookies.get("auth-token");
    if (!token) return;

    // We just need to make a small authenticated request.
    // The middleware (proxy.ts) will detect this and refresh the cookie.
    try {
      await fetchApi("/api/v1/health", {
        headers: { "x-activity-ping": "true" },
      });
      console.log("[ActivityTracker] Session refreshed");
    } catch (e) {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    // Only track activity for non-public routes
    const publicRoutes = ["/login", "/guest"];
    if (publicRoutes.some(route => pathname.startsWith(route))) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleActivity = () => {
      // Debounce the refresh call to once every minute
      if (timeoutId) return;

      refreshSession();

      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, 60000); // 1 minute throttle
    };

    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname, refreshSession]);

  return null;
}
