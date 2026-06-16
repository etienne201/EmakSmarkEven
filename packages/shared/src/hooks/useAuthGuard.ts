"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { isSuperAdminRole } from "@frontend/utils/api-config";
import {
  ensureEventId,
  getSetupStatus,
  isEventConfigured,
} from "@frontend/utils/event-api";

/**
 * Auth guard hook: ensures the user is logged in and has an event configured.
 * - No auth-token → redirect to /login
 * - No event-config → redirect to /setup
 *
 * Returns `isReady` which is `true` only once the guard has passed.
 */
export function useAuthGuard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("auth-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (isSuperAdminRole(payload.role) || payload.ownerId === "system") {
          setIsReady(true);
          return;
        }

        const eventId = await ensureEventId(token);
        if (!eventId) {
          if (!window.location.pathname.startsWith("/setup")) {
            router.replace("/setup");
          }
          return;
        }

        const configured = await isEventConfigured(eventId, token);
        const status = await getSetupStatus(eventId, token);

        if (!configured && !window.location.pathname.startsWith("/setup")) {
          router.replace(`/setup?eventId=${eventId}`);
          return;
        }

        if (configured && window.location.pathname === "/setup") {
          router.replace("/home");
          return;
        }

        if (status && !configured && window.location.pathname.startsWith("/setup")) {
          setIsReady(true);
          return;
        }

        setIsReady(true);
      } catch (err) {
        console.error("Auth guard error:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return isReady;
}
