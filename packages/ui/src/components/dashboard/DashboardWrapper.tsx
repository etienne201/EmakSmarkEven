"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { HighEndStats } from "./HighEndStats";
import { FloatingDecorations } from "../FloatingDecorations";
import { LoadingScreen } from "../LoadingScreen";
import { useEvent } from "@frontend/hooks/useEvent";
import { useAuthGuard } from "@frontend/hooks/useAuthGuard";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isReady = useAuthGuard();
  
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

  const currentView = () => {
    if (pathname.includes("/home")) return "guests";
    if (pathname.includes("/present")) return "presence";
    if (pathname.includes("/table")) return "tables";
    if (pathname.includes("/analytics")) return "analytics";
    if (pathname.includes("/reglage")) return "settings";
    return "guests";
  };

  if (!isReady || isSyncing) return <LoadingScreen isLoading={true} title={cfg?.eventName || "Chargement..."} />;

  if (cfg?.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white border border-red-100 p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Compte Suspendu</h2>
          <p className="text-gray-500 text-sm mb-8">L&apos;accès à cet événement a été restreint par l&apos;administrateur.</p>
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

      <main className="flex-1 ml-72 min-h-screen p-12 overflow-y-auto">
        <HighEndStats 
          guests={guests || []} 
          tables={tables || []} 
          attendance={attendance || []} 
          lang={appLang} 
        />

        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div 
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-end items-center mb-6 gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : ''}`} style={!isSyncing ? { backgroundColor: 'var(--color-primary)' } : undefined} />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {isSyncing ? 'Synchronisation...' : lastUpdated ? `Sauvegardé à ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Connecté'}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <FloatingDecorations type={cfg?.decorationType} />
      </main>
    </div>
  );
}
