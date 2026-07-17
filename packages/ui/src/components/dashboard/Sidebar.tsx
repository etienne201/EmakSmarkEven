"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Table as TableIcon, 
  UserCheck, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  ShieldAlert,
  Heart,
  Cake,
  Mic,
  Crown,
  Sparkles
} from "lucide-react";
import { Language, translations } from "@backend/translations";
import { EventConfig, EventType } from "@backend/eventConfig";
import { useAuth } from "@frontend/context/AuthContext";
import { hasWriteAccess, canViewAnalytics } from "@frontend/utils/api-config";
import { PremiumLogo } from "../PremiumLogo";

const EVENT_TYPE_ICONS: Record<EventType, React.ComponentType<{ className?: string }>> = {
  wedding: Heart,
  birthday: Cake,
  conference: Mic,
  gala: Crown,
  other: Sparkles,
};

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  eventConfig: EventConfig;
  onLogout: () => void;
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  lang, 
  onLanguageChange, 
  eventConfig,
  onLogout 
}: SidebarProps) {
  const { user } = useAuth();
  const t = translations[lang];
  const isSuperAdmin = user?.role === "super-admin";
  const canEdit = hasWriteAccess(user?.role);
  const viewAnalytics = canViewAnalytics(user?.role);

  const menuItems = [
    { id: "guests", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "presence", label: t.nav.presence, icon: UserCheck },
    ...(viewAnalytics ? [
      { id: "tables", label: t.nav.tables, icon: TableIcon },
      { id: "analytics", label: t.nav.analytics, icon: BarChart3 },
    ] : []),
  ];

  const initials = eventConfig?.hostInitials || eventConfig?.eventName?.substring(0, 2).toUpperCase() || "E";
  const EventIcon = eventConfig ? EVENT_TYPE_ICONS[eventConfig.eventType] : Heart;

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[color:var(--bg-surface)] border-r border-[color:var(--border)] flex flex-col z-50">
      {/* Brand Area */}
      <div className="p-6">
        <div className="flex items-center gap-3.5 mb-6">
          <PremiumLogo
            src={eventConfig?.logoUrl}
            fallbackIcon={EventIcon}
            initials={initials}
            size="md"
            variant="emerald"
          />
          <div className="min-w-0">
            <h2 className="font-bold text-[color:var(--text-primary)] leading-tight truncate">EMAK Event</h2>
            <p className="es-eyebrow" style={{ color: 'var(--color-primary)' }}>Espace organisateur</p>
          </div>
        </div>

        {/* Event Context Card */}
        <div className="es-card es-card--pad !p-4">
          <p className="es-eyebrow mb-2">{eventConfig?.eventType === 'wedding' ? 'Mariage' : 'Événement'}</p>
          <h3 className="text-sm font-bold text-[color:var(--text-primary)] mb-3 truncate">{eventConfig?.eventName}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--text-secondary)]">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{eventConfig?.eventDate || "Date à définir"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--text-secondary)]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{eventConfig?.eventLocation || "Lieu à définir"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1" aria-label="Navigation principale">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`es-focusable w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "text-white font-semibold"
                  : "text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)]"
              }`}
              style={isActive ? { backgroundColor: 'var(--color-primary)', boxShadow: '0 8px 16px -6px var(--color-primary)' } : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium tracking-tight">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-50 space-y-4">
        {/* Language Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => onLanguageChange("fr")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all ${
              lang === "fr" ? "bg-white shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
            style={lang === "fr" ? { color: 'var(--color-primary)' } : undefined}
          >
            FR
          </button>
          <button
            onClick={() => onLanguageChange("en")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all ${
              lang === "en" ? "bg-white shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
            style={lang === "en" ? { color: 'var(--color-primary)' } : undefined}
          >
            EN
          </button>
        </div>

        <div className={`grid ${isSuperAdmin ? 'grid-cols-3' : canEdit ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
          {isSuperAdmin && (
            <button
              onClick={() => window.location.href = "/superadmin"}
              className="es-focusable flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-all border border-[color:var(--border)]"
              title="Portail Super Admin"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Admin</span>
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => window.location.href = "/reglage"}
              className="es-focusable flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-all border border-[color:var(--border)]"
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Paramètres</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="es-focusable flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl text-[color:var(--danger)] transition-all border border-[color:var(--danger-border)] hover:bg-[color:var(--danger-bg)]"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
