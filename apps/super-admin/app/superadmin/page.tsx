"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Plus, Search, X, Lock, Eye, EyeOff, Loader2, AlertCircle, Mail, Fingerprint, ArrowRight, Layout, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EventConfig } from "@backend/eventConfig";
import { useToast } from "@frontend/hooks/useToast";
import { useAuth } from "@frontend/context/AuthContext";
import { apiRequest } from "@frontend/utils/api";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { StatsGrid }          from "@frontend/components/superadmin/StatsGrid";
import { EventsTable }        from "@frontend/components/superadmin/EventsTable";
import { ActivityLog }        from "@frontend/components/superadmin/ActivityLog";
import { ProfileSettings }    from "@frontend/components/superadmin/ProfileSettings";
import { CreateEventModal }   from "@frontend/components/superadmin/CreateEventModal";
import { EditEventModal }     from "@frontend/components/superadmin/EditEventModal";
import { SuperAdminLoginUI }  from "@frontend/components/superadmin/SuperAdminLoginUI";
import { SystemStatus }       from "@frontend/components/superadmin/SystemStatus";
import { AdminsTable }        from "@frontend/components/superadmin/AdminsTable";
import { CreateAdminModal }   from "@frontend/components/superadmin/CreateAdminModal";
import { DeleteConfirmModal } from "@frontend/components/superadmin/DeleteConfirmModal";
import { EditAdminModal }     from "@frontend/components/superadmin/EditAdminModal";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "events" | "users" | "logs" | "profile";

const TABS: { key: Tab; label: string }[] = [
  { key: "events",  label: "Événements" },
  { key: "users",   label: "Utilisateurs" },
  { key: "logs",    label: "Activité"   },
  { key: "profile", label: "Paramètres" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function apiFetch(url: string, token: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Auth from global context
  const { user, token, loading: authLoading, logout: globalLogout } = useAuth();
  const isAuthenticated = !!user && user.role === "super-admin";

  // Data
  const [events,  setEvents]  = useState<EventConfig[]>([]);
  const [admins,  setAdmins]  = useState<any[]>([]);
  const [logs,    setLogs]    = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ name: "Super Admin" });

  // UI
  const [activeTab,  setActiveTab]  = useState<Tab>("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent,       setEditingEvent]       = useState<EventConfig | null>(null);
  const [isCreateModalOpen,  setIsCreateModalOpen]  = useState(false);
  const [isEditModalOpen,    setIsEditModalOpen]    = useState(false);
  const [isCreateAdminOpen,  setIsCreateAdminOpen]  = useState(false);

  const [stats,   setStats]   = useState<any>(null);
  const [system,  setSystem]  = useState<any>(null);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const refreshAll = (authToken: string) => {
    const fetchEvents = async (t: string) => {
      const res = await apiFetch("/api/superadmin/events", t);
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : (data?.data || []));
      }
    };
    const fetchAdmins = async (t: string) => {
      const res = await apiFetch("/api/superadmin/admins", t);
      if (res.ok) {
        const json = await res.json();
        setAdmins(json.data?.items || json.data || []);
      }
    };
    const fetchLogs = async (t: string) => {
      const res = await apiFetch("/api/superadmin/logs", t);
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : (data?.data || []));
      }
    };
    const fetchStats = async (t: string) => {
      const res = await apiFetch("/api/superadmin/stats", t);
      if (res.ok) {
        const json = await res.json();
        setStats(json.data || json);
      }
    };
    const fetchSystem = async (t: string) => {
      const res = await apiFetch("/api/superadmin/system/info", t);
      if (res.ok) {
        const json = await res.json();
        setSystem(json.data || json);
      }
    };
    const fetchProfile = async (t: string) => {
      const res = await apiFetch("/api/superadmin/profile", t);
      if (res.ok) {
        const json = await res.json();
        setProfile(json.data || json);
      }
    };
    fetchEvents(authToken);
    fetchAdmins(authToken);
    fetchLogs(authToken);
    fetchStats(authToken);
    fetchSystem(authToken);
    fetchProfile(authToken);
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      refreshAll(token);
    }
    // Handle welcome message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("welcome")) {
      showToast("Bienvenue chez EMAK Smart Event", "success");
      // Clear param
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isAuthenticated, token]); // eslint-disable-line

  const handleLogout = () => globalLogout();

  // ── Admin actions ──────────────────────────────────────────────────────────
  const handleToggleAdminStatus = async (id: string, currentStatus: string) => {
    if (!token) return;
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      const res = await apiFetch(`/api/superadmin/admins/${id}/status`, token, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Compte ${newStatus === "active" ? "activé" : "bloqué"}`, "success");
        refreshAll(token);
      } else {
        showToast("Erreur lors du changement de statut", "error");
      }
    } catch (err) {
      showToast("Erreur réseau", "error");
    }
  };

  const handleResetAdminPassword = async (id: string) => {
    if (!token) return;
    const newPassword = Math.random().toString(36).slice(-10) + "A1!";
    if (!confirm(`Générer un nouveau mot de passe pour cet administrateur ?\nNouveau mot de passe : ${newPassword}`)) return;

    try {
      const res = await apiFetch(`/api/superadmin/admins/${id}/reset-password`, token, {
        method: "POST",
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        showToast("Mot de passe réinitialisé avec succès", "success");
        // Optionnel: copier dans le presse-papier
        navigator.clipboard.writeText(newPassword);
        showToast("Nouveau mot de passe copié dans le presse-papier", "info");
      } else {
        showToast("Erreur lors de la réinitialisation", "error");
      }
    } catch (err) {
      showToast("Erreur réseau", "error");
    }
  };

  // ── Event actions ──────────────────────────────────────────────────────────
  const getToken = () => token || "";

  const handleToggleBlock = async (ownerId: string, isBlocked: boolean) => {
    if (!token) return;
    await apiFetch(`/api/superadmin/events/${ownerId}`, token, { method: "PATCH", body: JSON.stringify({ isBlocked: !isBlocked }) });
    refreshAll(token);
  };

  const [adminToDelete,      setAdminToDelete]      = useState<any>(null);
  const [isDeleteModalOpen,  setIsDeleteModalOpen]  = useState(false);
  const [editingAdmin,       setEditingAdmin]       = useState<any>(null);
  const [isEditAdminOpen,    setIsEditAdminOpen]    = useState(false);

  // ── Admin actions ──────────────────────────────────────────────────────────
  const confirmAdminDelete = async () => {
    if (!adminToDelete || !token) return;
    try {
      const res = await apiFetch(`/api/superadmin/admins/${adminToDelete.id}`, token, { method: "DELETE" });
      if (res.ok) {
        showToast("Administrateur supprimé", "success");
        refreshAll(token);
      }
    } catch (err) { showToast("Erreur lors de la suppression", "error"); }
  };

  const handleAdminDelete = (id: string) => {
    const admin = admins.find(a => a.id === id);
    if (admin) {
      setAdminToDelete(admin);
      setIsDeleteModalOpen(true);
    }
  };

  const handleAdminEditClick = (admin: any) => {
    setEditingAdmin(admin);
    setIsEditAdminOpen(true);
  };

  const handleDelete = async (ownerId: string) => {
    if (!token) return;
    if (!confirm(`Supprimer définitivement l'événement "${ownerId}" ? Cette action est irréversible.`)) return;
    await apiFetch(`/api/superadmin/events/${ownerId}`, token, { method: "DELETE" });
    refreshAll(token);
  };

  const handleViewEvent = (event: EventConfig) => { 
    localStorage.setItem("event-config", JSON.stringify(event)); 
    // In dev, the user service is usually on port 3000
    const targetUrl = window.location.port === "3002" ? `http://${window.location.hostname}:3000/home` : "/home";
    window.location.href = targetUrl;
  };
  const handleEditClick = (event: EventConfig) => { setEditingEvent(event); setIsEditModalOpen(true); };

  const handleSaveProfile = async (data: { name: string; avatarUrl?: string }) => {
    if (!token) return;
    await apiFetch("/api/superadmin/profile", token, { 
      method: "PATCH", 
      body: JSON.stringify(data) 
    });
    setProfile((p: any) => ({ ...p, ...data }));
  };

  // ── Filtered events ────────────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter(e =>
      e.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ownerId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  // ── Loading or Auth Screen ────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="theme-dark es-app min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: "var(--brand-blue-600)" }}>
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Vérification des accès sécurisés…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SuperAdminLoginUI />;
  }

  return (
    <div className="theme-dark es-app min-h-screen selection:bg-[#28A745]/30">
      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-[#3B3B6D] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#3B3B6D]/20 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-base leading-tight text-[color:var(--text-primary)]">Console Super Admin</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#28A745] animate-pulse" />
                <p className="text-xs text-[color:var(--text-secondary)] font-medium">Système en ligne</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="hidden md:flex es-segment" role="tablist" aria-label="Sections">
            {TABS.map(({ key, label }) => (
              <button key={key} role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)}
                className="es-tab es-focusable">
                {label}
              </button>
            ))}
          </div>

          {/* Right — profile + logout */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                const targetUrl = window.location.port === "3002" ? `http://${window.location.hostname}:3000/home` : "/home";
                window.location.href = targetUrl;
              }}
              className="hidden lg:flex es-btn es-btn--secondary es-btn--sm es-focusable"
            >
              <Layout className="w-3.5 h-3.5" />
              Espace organisateur
            </button>

            <div className="w-px h-8 bg-[color:var(--border)] hidden sm:block" />

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[color:var(--text-primary)] leading-tight">{profile.name}</p>
              <p className="text-xs text-[#28A745] font-semibold">Administrateur global</p>
            </div>
            
            <div className="relative group">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[color:var(--bg-subtle)] border border-[color:var(--border)] p-0.5 group-hover:border-[#3B3B6D] transition-all cursor-pointer">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                  <div className="w-full h-full bg-[#3B3B6D] rounded-[14px] flex items-center justify-center text-xs font-black text-white">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div key="events" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-8">
              <nav className="es-breadcrumb" aria-label="Fil d'ariane">
                <span>Console</span><ChevronRight /><span aria-current="page">Événements</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="es-h2">Gestion des événements</h2>
                  <p className="es-subtle">Supervisez et contrôlez tous les événements de la plateforme.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="es-input-group w-64">
                    <Search />
                    <input type="text" aria-label="Rechercher un événement" placeholder="Rechercher un événement…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="es-input" />
                  </div>
                  <button onClick={() => setIsCreateModalOpen(true)} className="es-btn es-btn--primary es-focusable">
                    <Plus className="w-4 h-4" /> Nouvel événement
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                  <StatsGrid events={events} globalStats={stats} />
                  <EventsTable events={filteredEvents} onView={handleViewEvent} onEdit={handleEditClick} onToggleBlock={handleToggleBlock} onDelete={handleDelete} />
                </div>
                <div className="lg:col-span-1 space-y-8">
                  <SystemStatus systemInfo={system} />
                  <ActivityLog logs={logs} onRefresh={() => refreshAll(getToken())} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
              <nav className="es-breadcrumb" aria-label="Fil d'ariane">
                <span>Console</span><ChevronRight /><span aria-current="page">Utilisateurs</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="es-h2">Gestion des comptes</h2>
                  <p className="es-subtle">Administrateurs système et propriétaires d&apos;événements.</p>
                </div>
                <button onClick={() => setIsCreateAdminOpen(true)} className="es-btn es-btn--primary es-focusable">
                  <Plus className="w-4 h-4" /> Nouvel administrateur
                </button>
              </div>
              <AdminsTable 
                admins={admins} 
                onDelete={handleAdminDelete} 
                onEdit={handleAdminEditClick} 
                onToggleStatus={handleToggleAdminStatus}
                onResetPassword={handleResetAdminPassword}
              />
            </motion.div>
          )}

          {activeTab === "logs" && (
            <motion.div key="logs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ActivityLog logs={logs} onRefresh={() => refreshAll(getToken())} />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ProfileSettings profile={profile} onSave={handleSaveProfile} onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refreshAll(getToken())}
      />

      <EditEventModal
        isOpen={isEditModalOpen}
        event={editingEvent}
        onClose={() => { setIsEditModalOpen(false); setEditingEvent(null); }}
        onSuccess={() => refreshAll(getToken())}
      />

      <CreateAdminModal
        isOpen={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
        onSuccess={() => refreshAll(getToken())}
        token={getToken()}
      />

      <EditAdminModal
        isOpen={isEditAdminOpen}
        admin={editingAdmin}
        onClose={() => { setIsEditAdminOpen(false); setEditingAdmin(null); }}
        onSuccess={() => refreshAll(getToken())}
        token={getToken()}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setAdminToDelete(null); }}
        onConfirm={confirmAdminDelete}
        title={adminToDelete?.name || ""}
        confirmValue={adminToDelete?.id || ""}
      />
    </div>
  );
}
