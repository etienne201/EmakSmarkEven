"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { HighEndStats } from "./HighEndStats";
import { FloatingDecorations } from "../FloatingDecorations";
import { LoadingScreen } from "../LoadingScreen";
import { useEvent } from "@frontend/hooks/useEvent";
import { useAuthGuard } from "@frontend/hooks/useAuthGuard";
import { useAuth } from "@frontend/context/AuthContext";
import { canViewAnalytics } from "@frontend/utils/api-config";
import { useEffect } from "react";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isReady = useAuthGuard();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const isRestrictedPath = pathname.includes("/analytics") || pathname.includes("/table");
      if (isRestrictedPath && !canViewAnalytics(user.role)) {
        router.replace("/home");
      }
    }
  }, [user, pathname, router]);
  
  const {
    eventConfig: cfg,
    guests,
    attendance,
    customTables: tables,
    appLang,
    setAppLang,
    isSyncing,
    lastUpdated,
  } = useEvent();

  const handleLogout = () => {
    router.push("/logout");
  };

  const handleViewChange = (view: string) => {
    const routeMap: Record<string, string> = {
      guests: "/home",
      presence: "/present",
      tables: "/table",
      analytics: "/analytics",
      settings: "/reglage"
    };
    router.push(routeMap[view] || "/home");
  };

  const VIEW_LABELS: Record<string, string> = {
    guests: "Invités",
    presence: "Présences",
    tables: "Plan de table",
    analytics: "Statistiques",
    settings: "Paramètres",
  };

  const currentView = () => {
    if (pathname.includes("/home")) return "guests";
    if (pathname.includes("/present")) return "presence";
    if (pathname.includes("/table")) return "tables";
    if (pathname.includes("/analytics")) return "analytics";
    if (pathname.includes("/reglage")) return "settings";
    return "guests";
  };

  const view = currentView();
  const isHome = pathname.includes("/home");

  if (!isReady || isSyncing) return <LoadingScreen isLoading={true} title={cfg?.eventName || "Chargement..."} logoUrl={cfg?.logoUrl} eventType={cfg?.eventType} initials={cfg?.hostInitials} />;

  if (cfg?.isBlocked) {
    return (
      <div className="es-app min-h-screen flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="es-card es-card--pad max-w-md w-full">
          <div className="es-empty__icon mx-auto mb-2" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="es-h2 mb-2">Accès suspendu</h2>
          <p className="es-subtle">L&apos;accès à cet événement a été restreint par l&apos;administrateur. Contactez le support pour le rétablir.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#FDFDFD] flex font-sans"
      style={{
        '--color-primary': cfg?.palette?.primary || '#10b981',
        '--color-secondary': cfg?.palette?.secondary || '#059669',
      } as React.CSSProperties}
    >
      <Sidebar 
        currentView={currentView()} 
        onViewChange={handleViewChange}
        lang={appLang} 
        onLanguageChange={setAppLang} 
        eventConfig={cfg} 
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-72 min-h-screen p-8 lg:p-12 overflow-y-auto es-scroll">
        {/* Top bar: breadcrumb + live sync status */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <nav className="es-breadcrumb" aria-label="Fil d'ariane">
            <span>{cfg?.eventName || "Événement"}</span>
            <ChevronRight />
            <span aria-current="page">{VIEW_LABELS[view] || "Tableau de bord"}</span>
          </nav>
          <div
            className="es-badge es-badge--neutral"
            role="status"
            title={isSyncing ? "Synchronisation en cours" : "Données à jour"}
          >
            <span
              className={`es-badge__dot ${isSyncing ? "es-badge__dot--pulse" : ""}`}
              style={{ color: isSyncing ? "var(--warning)" : "var(--color-primary)" }}
            />
            {isSyncing
              ? "Synchronisation…"
              : lastUpdated
                ? `Sauvegardé à ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Connecté"}
          </div>
        </div>

        {!isHome && (
          <HighEndStats
            guests={guests || []}
            tables={tables || []}
            attendance={attendance || []}
            lang={appLang}
          />
        )}

        <div className={isHome ? "" : "mt-10"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <FloatingDecorations type={cfg?.decorationType} />
      </main>
    </div>
  );
}
