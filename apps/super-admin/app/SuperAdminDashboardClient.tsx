"use client";

import { useState, useEffect, useMemo, type ComponentType } from "react";
import { ShieldCheck, Plus, Search, Loader2, LayoutDashboard, ChevronRight } from "lucide-react";
import { LoadingScreen } from "@frontend/components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { EventConfig } from "@backend/eventConfig";
import { useToast } from "@frontend/hooks/useToast";
import { useAuth } from "@frontend/context/AuthContext";
import { fetchApi, parseApiJson } from "@frontend/utils/api";
import { isSuperAdminRole } from "@frontend/utils/api-config";
import { PremiumLogo } from "@frontend/components/PremiumLogo";

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

const LayoutIcon = LayoutDashboard as unknown as any;
const ChevronRightIcon = ChevronRight as unknown as any;
const SearchIcon = Search as unknown as any;
const PlusIcon = Plus as unknown as any;

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function apiFetch(url: string, token: string, options: RequestInit = {}) {
  return fetchApi(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

async function readJson<T>(res: Response): Promise<T | null> {
  const { data } = await parseApiJson<T>(res);
  return data ?? null;
}

export interface SuperAdminDashboardClientProps {
  defaultTab?: Tab;
  defaultAction?: "createEvent";
}

export default function SuperAdminDashboardClient({ defaultTab, defaultAction }: SuperAdminDashboardClientProps) {
  const { showToast } = useToast();

  // Auth from global context
  const { user, token, loading: authLoading, logout: globalLogout } = useAuth();
  const isAuthenticated = !!user && isSuperAdminRole(user.role);

  // Data
  const [events,  setEvents]  = useState<EventConfig[]>([]);
  const [admins,  setAdmins]  = useState<any[]>([]);
  const [logs,    setLogs]    = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ name: "Super Admin" });

  // UI
  const [activeTab,  setActiveTab]  = useState<Tab>(defaultTab || "events");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent,       setEditingEvent]       = useState<EventConfig | null>(null);
  const [isCreateModalOpen,  setIsCreateModalOpen]  = useState(defaultAction === "createEvent");
  const [isEditModalOpen,    setIsEditModalOpen]    = useState(false);
  const [isCreateAdminOpen,  setIsCreateAdminOpen]  = useState(false);

  const [stats,   setStats]   = useState<any>(null);
  const [system,  setSystem]  = useState<any>(null);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const refreshAll = (authToken: string) => {
    const fetchEvents = async (t: string) => {
      const res = await apiFetch("/api/v1/events", t);
      if (res.ok) {
        const data = await readJson<unknown[]>(res);
        setEvents(Array.isArray(data) ? (data as EventConfig[]) : []);
      }
    };
    const fetchAdmins = async (t: string) => {
      const res = await apiFetch("/api/v1/super-admin/admins", t);
      if (res.ok) {
        const data = await readJson<unknown[]>(res);
        setAdmins(Array.isArray(data) ? data : []);
      }
    };
    const fetchLogs = async (t: string) => {
      const res = await apiFetch("/api/v1/super-admin/logs", t);
      if (res.ok) {
        const data = await readJson<unknown[]>(res);
        setLogs(Array.isArray(data) ? data : []);
      }
    };
    const fetchStats = async (t: string) => {
      const res = await apiFetch("/api/v1/super-admin/stats", t);
      if (res.ok) {
        const data = await readJson<Record<string, unknown>>(res);
        setStats(data);
      }
    };
    const fetchSystem = async (t: string) => {
      const res = await apiFetch("/api/v1/platform/health", t);
      if (res.ok) {
        const data = await readJson<Record<string, unknown>>(res);
        setSystem(data);
      }
    };
    const fetchProfile = async (t: string) => {
      const res = await apiFetch("/api/v1/users/profile", t);
      if (res.ok) {
        const data = await readJson<Record<string, unknown>>(res);
        if (data) {
          setProfile({
            name: data.fullName ?? data.name ?? "Super Admin",
            email: data.email,
            avatarUrl: data.avatarUrl,
          });
        }
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
      const res = await apiFetch(`/api/v1/users/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
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

  const handleResetAdminPassword = async (adminId: string) => {
    if (!token) return;
    showToast(`Réinitialisation mot de passe (${adminId}) : endpoint backend à venir`, "info");
  };

  // ── Event actions ──────────────────────────────────────────────────────────
  const getToken = () => token || "";

  const handleToggleBlock = async (ownerId: string, _isBlocked: boolean) => {
    if (!token) return;
    await apiFetch(`/api/v1/super-admin/organizations/${ownerId}/block`, token, { method: "PATCH" });
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
      const res = await apiFetch(`/api/v1/users/${adminToDelete.id}`, token, { method: "DELETE" });
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
    await apiFetch(`/api/v1/events/${ownerId}`, token, { method: "DELETE" });
    refreshAll(token);
  };

  const handleViewEvent = (event: EventConfig) => { 
    const evId = event.id || event.eventId || event.ownerId;
    localStorage.setItem("event-config", JSON.stringify(event)); 
    // In dev, the user service is usually on port 3000
    const targetUrl = window.location.port === "3002" 
      ? `http://${window.location.hostname}:3000/home?eventId=${evId}` 
      : `/home?eventId=${evId}`;
    window.location.href = targetUrl;
  };
  const handleEditClick = (event: EventConfig) => { setEditingEvent(event); setIsEditModalOpen(true); };

  const handleSaveProfile = async (data: { name: string; avatarUrl?: string }) => {
    if (!token) return;
    await apiFetch("/api/v1/users/profile", token, {
      method: "PUT",
      body: JSON.stringify({ fullName: data.name, avatarUrl: data.avatarUrl }),
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
      <LoadingScreen
        isLoading={true}
        title="Console Super Admin"
        eventType="conference"
        variant="blue"
      />
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
            <PremiumLogo
              fallbackIcon={ShieldCheck}
              size="md"
              variant="blue"
            />
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
              <LayoutIcon className="w-3.5 h-3.5" />
              <p className="text-xs text-[#28A745] font-semibold">Administrateur global</p>
            </button>

            <div className="relative group">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[color:var(--bg-subtle)] border border-[color:var(--border)] p-0.5 group-hover:border-[#3B3B6D] transition-all cursor-pointer">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
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
                <span>Console</span><ChevronRightIcon /><span aria-current="page">Événements</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="es-h2">Gestion des événements</h2>
                  <p className="es-subtle">Supervisez et contrôlez tous les événements de la plateforme.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="es-input-group w-64">
                    <SearchIcon />
                    <input type="text" aria-label="Rechercher un événement" placeholder="Rechercher un événement…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="es-input" />
                  </div>
                  <button onClick={() => setIsCreateModalOpen(true)} className="es-btn es-btn--primary es-focusable">
                    <PlusIcon className="w-4 h-4" /> Nouvel événement
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
                <span>Console</span><ChevronRightIcon /><span aria-current="page">Utilisateurs</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="es-h2">Gestion des comptes</h2>
                  <p className="es-subtle">Administrateurs système et propriétaires d&apos;événements.</p>
                </div>
                <button onClick={() => setIsCreateAdminOpen(true)} className="es-btn es-btn--primary es-focusable">
                  <PlusIcon className="w-4 h-4" /> Nouvel administrateur
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
