"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  BarChart3, 
  Table as TableIcon, 
  UserCheck, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Calendar,
  MapPin,
  Globe,
  ShieldAlert
} from "lucide-react";
import { Language, translations } from "@backend/translations";
import { EventConfig } from "@backend/eventConfig";
import { useAuth } from "@frontend/context/AuthContext";

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
  const isStaff = user?.role === "staff";
  const isSuperAdmin = user?.role === "super-admin";

  const menuItems = [
    { id: "guests", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "presence", label: t.nav.presence, icon: UserCheck },
    ...(isStaff ? [] : [
      { id: "tables", label: t.nav.tables, icon: TableIcon },
      { id: "analytics", label: t.nav.analytics, icon: BarChart3 },
    ]),
  ];

  const initials = eventConfig?.hostInitials || eventConfig?.eventName?.substring(0, 2).toUpperCase() || "E";

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Brand Area */}
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="w-12 h-12 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg"
            style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 10px 15px -3px var(--color-primary)' }}
          >
            {initials}
          </div>
          <div>
            <h2 className="font-black text-gray-900 leading-tight">EVENT</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>Dashboard</p>
          </div>
        </div>

        {/* Event Context Card */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{eventConfig?.eventType === 'wedding' ? 'Wedding' : 'Event'}</p>
          <h3 className="text-sm font-black text-gray-900 mb-2 truncate">{eventConfig?.eventName}</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{eventConfig?.eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{eventConfig?.eventLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                  ? "text-white shadow-lg" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={isActive ? { backgroundColor: 'var(--color-primary)', boxShadow: '0 10px 15px -3px var(--color-primary)' } : undefined}
            >
              {(() => {
                const Icon = item.icon as any;
                return <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-emerald"}`} />;
              })()}
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
              {isActive && (
                <motion.div 
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

        <div className={`grid ${isSuperAdmin ? 'grid-cols-3' : isStaff ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {isSuperAdmin && (
            <button 
              onClick={() => window.location.href = "/superadmin"}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-900 text-blue-400 hover:bg-slate-800 transition-all border border-slate-800"
              title="Portail Super Admin"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
            </button>
          )}
          {!isStaff && (
            <button 
              onClick={() => window.location.href = "/reglage"}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-emerald/5 hover:text-emerald transition-all border border-gray-100"
            >
              <Settings className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Settings</span>
            </button>
          )}
          <button 
            onClick={onLogout}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-red-50 text-red-400 hover:bg-red-100 transition-all border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
