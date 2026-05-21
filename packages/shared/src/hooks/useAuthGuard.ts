"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

/**
 * Auth guard hook: ensures the user is logged in and has an event configured.
 * - No auth-token → redirect to /login
 * - No event-config → redirect to /setup
 * 
 * Returns `isReady` which is `true` only once the guard has passed.
 * Render a loading screen while `isReady` is false.
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
        // Décodage du token pour vérifier le rôle
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "super-admin" || payload.ownerId === "system") {
          // Un super-admin peut naviguer librement (notamment pour l'impersonation d'événements)
          setIsReady(true);
          return;
        }

        // Vérifier le statut de configuration en base de données pour les organisateurs classiques
        const res = await fetch("/api/setup/status", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
          if (res.status === 401) {
            router.replace("/login");
          } else {
            router.replace("/setup");
          }
          return;
        }

        const { data } = await res.json();
        
        // Si l'événement n'est pas configuré et qu'on n'est pas déjà sur la page de setup
        if (!data.isConfigured && !window.location.pathname.startsWith("/setup")) {
          router.replace("/setup");
          return;
        }
        
        // Si l'événement EST configuré et qu'on tente d'aller sur /setup, on redirige vers /home
        if (data.isConfigured && window.location.pathname === "/setup") {
          router.replace("/home");
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
