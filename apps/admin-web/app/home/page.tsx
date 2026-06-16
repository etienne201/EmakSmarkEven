"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { 
  Settings, Sparkles, LayoutDashboard, UserCheck, 
  Table as TableIcon, BarChart3, ChevronRight, Search, 
  Plus, User, LogOut 
} from "lucide-react";

// Components
import { DashboardWrapper } from "@frontend/components/dashboard/DashboardWrapper";
import { HighEndStats } from "@frontend/components/dashboard/HighEndStats";
import { GuestsView } from "@frontend/components/dashboard/GuestsView";
import { PresenceView } from "@frontend/components/dashboard/PresenceView";
import { TablesView } from "@frontend/components/dashboard/TablesView";
import { AnalyticsView } from "@frontend/components/dashboard/AnalyticsView";
import { LoadingScreen } from "@frontend/components/LoadingScreen";
import { QRCodeModal } from "@frontend/components/QRCodeModal";
import { ConfirmModal } from "@frontend/components/ConfirmModal";
import { FloatingDecorations } from "@frontend/components/FloatingDecorations";

// Hooks
import { useEvent } from "@frontend/hooks/useEvent";
import { useAuthGuard } from "@frontend/hooks/useAuthGuard";
import { useToast } from "@frontend/hooks/useToast";
import { useAuth } from "@frontend/context/AuthContext";
import { translations } from "@backend/translations";

import { createGuest, deleteGuest, getStoredEventId } from "@frontend/utils/event-api";
import { Suspense } from "react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReady = useAuthGuard();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const {
    eventConfig: cfg,
    guests: rawGuests,
    setGuests,
    attendance: rawAttendance,
    customTables: rawTables,
    updateTables,
    appLang,
    setAppLang,
    isSyncing,
    ownerId,
    refresh
  } = useEvent();

  // Defensive array checks
  const guests = Array.isArray(rawGuests) ? rawGuests : [];
  const attendance = Array.isArray(rawAttendance) ? rawAttendance : [];
  const tables = Array.isArray(rawTables) ? rawTables : [];

  // Local UI State - Sync with URL view param if available
  const viewParam = searchParams.get("view") as any;
  const [currentView, setCurrentView] = useState<"guests" | "presence" | "tables" | "analytics">(viewParam || "guests");
  
  const [view, setView] = useState<"list" | "form" | "qr">("list");
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [deleteGuestId, setDeleteGuestId] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTable, setSelectedTable] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const t = translations[appLang];
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Update internal state if URL changes
  useEffect(() => {
    if (viewParam && ["guests", "presence", "tables", "analytics"].includes(viewParam)) {
      setCurrentView(viewParam);
    }
  }, [viewParam]);

  // View transition helper
  const handleViewChange = (newView: any) => {
    setCurrentView(newView);
    setView("list");
    // Update URL without full reload
    const url = new URL(window.location.href);
    url.searchParams.set("view", newView);
    window.history.pushState({}, "", url.toString());
  };

  // Filter & Search Logic
  const filteredGuests = useMemo(() => {
    let filtered = guests.filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.tableName.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedTable !== "all") {
      filtered = filtered.filter(g => g.tableName === selectedTable || g.table?.toString() === selectedTable);
    }
    return filtered.sort((a, b) => (a.table !== b.table ? a.table - b.table : a.name.localeCompare(b.name)));
  }, [guests, search, selectedTable]);

  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGuests, currentPage]);

  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);
  useEffect(() => { setCurrentPage(1); }, [search, selectedTable]);

  const handleLogout = () => {
    Cookies.remove("auth-token");
    localStorage.removeItem("event-config");
    router.push("/login");
  };

  const handleSaveGuest = async (title: string, name: string, table: number, tableName: string, lang: any) => {
    const eventId = getStoredEventId();
    if (!eventId) {
      showToast(t.toasts.connError, "error");
      return;
    }
    const guestData = {
      title,
      fullName: name,
      name,
      table,
      tableName,
      lang,
    };
    try {
      const { data, error } = await createGuest(eventId, guestData);
      if (data && !error) {
        const savedGuest = (data as Record<string, unknown>) || { ...guestData, id: editId ? String(editId) : crypto.randomUUID() };
        setGuests(prev => {
          const arr = Array.isArray(prev) ? prev : [];
          return editId ? arr.map(g => g.id === editId ? savedGuest as typeof g : g) : [...arr, savedGuest as typeof arr[0]];
        });
        showToast(editId ? t.toasts.successUpdate : t.toasts.successAdd, "success");
        setView("list");
        setEditId(null);
      } else {
        showToast(t.toasts.connError, "error");
      }
    } catch { showToast(t.toasts.connError, "error"); }
  };

  const handleDeleteGuest = async (id: string | number) => {
    try {
      const { error } = await deleteGuest(String(id));
      if (!error) {
        setGuests(prev => Array.isArray(prev) ? prev.filter(g => g.id !== id) : []);
        showToast(t.toasts.successDelete, "info");
      }
    } catch { showToast(t.toasts.deleteError, "error"); }
  };

  // Render Logic
  // Get dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <DashboardWrapper>
      <div className="space-y-8">
        {/* Header: greeting + primary action */}
        <header>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="es-h1">
                {getGreeting()}, <span style={{ color: 'var(--color-primary)' }}>{user?.name || (ownerId === 'system' ? 'Organisateur' : ownerId)}</span>
              </h1>
              <p className="es-subtle mt-2">
                Voici l&apos;état actuel de votre événement <span className="font-semibold text-[color:var(--text-primary)]">« {cfg?.eventName} »</span>.
              </p>
            </div>

            <button
              onClick={() => router.push("/reglage")}
              className="es-btn es-btn--secondary es-focusable"
            >
              <Settings className="w-4 h-4" />
              Modifier l&apos;événement
            </button>
          </motion.div>
        </header>

        <HighEndStats guests={guests} tables={tables} attendance={attendance} lang={appLang} />

        <AnimatePresence mode="wait">
          {currentView === "guests" && (
            <motion.div key="guests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GuestsView 
                view={view} setView={setView} search={search} setSearch={setSearch}
                selectedTable={selectedTable} setSelectedTable={setSelectedTable}
                filteredGuests={filteredGuests} paginatedGuests={paginatedGuests}
                customTables={tables} editId={editId} setEditId={setEditId}
                handleSaveGuest={handleSaveGuest} handleDeleteGuest={handleDeleteGuest}
                setIsClearModalOpen={setIsClearModalOpen} setIsTableModalOpen={() => {}}
                currentPage={currentPage} setCurrentPage={setCurrentPage}
                totalPages={totalPages} appLang={appLang} origin={origin}
                ownerId={ownerId} eventConfig={cfg} setSelectedGuest={setSelectedGuest}
                setDeleteGuestId={setDeleteGuestId} guests={guests}
              />
            </motion.div>
          )}

          {currentView === "presence" && (
            <motion.div key="presence" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PresenceView appLang={appLang} onClose={() => handleViewChange("guests")} />
            </motion.div>
          )}

          {currentView === "tables" && (
            <motion.div key="tables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TablesView customTables={tables} updateTables={updateTables} appLang={appLang} onClose={() => handleViewChange("guests")} />
            </motion.div>
          )}

          {currentView === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AnalyticsView guests={guests} attendance={attendance} appLang={appLang} eventConfig={cfg} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals & Overlays */}
        {selectedGuest && <QRCodeModal isOpen={view === "qr"} onClose={() => setView("list")} guest={selectedGuest} origin={origin} lang={appLang} eventConfig={cfg} />}
        <ConfirmModal isOpen={!!deleteGuestId} onClose={() => setDeleteGuestId(null)} onConfirm={() => deleteGuestId && handleDeleteGuest(deleteGuestId)} message={t.confirm.deleteGuest} lang={appLang} />
        <ConfirmModal isOpen={isClearModalOpen} onClose={() => setIsClearModalOpen(false)} onConfirm={() => {}} message={t.confirm.clearAllConfirm} lang={appLang} />
      </div>
    </DashboardWrapper>
  );
}

export default function UnifiedDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-light border-t-emerald rounded-full animate-spin" />
        <p className="text-emerald font-medium animate-pulse">Chargement / Loading...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
