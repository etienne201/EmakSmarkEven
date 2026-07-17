"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Hash, Settings, Heart, Cake, Mic, Crown, Sparkles, BarChart3, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@frontend/context/AuthContext";
import { useLocalStorage } from "@frontend/hooks/useLocalStorage";
import { Language, translations } from "@backend/translations";
import { EventConfig, EventType } from "@backend/eventConfig";
import { PremiumLogo } from "./PremiumLogo";

const EVENT_TYPE_ICONS: Record<EventType, React.ComponentType<{ className?: string }>> = {
  wedding: Heart,
  birthday: Cake,
  conference: Mic,
  gala: Crown,
  other: Sparkles,
};

export function AdminNavbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [appLang] = useLocalStorage<Language>("mariage-app-lang", "fr");
  const [eventConfig] = useLocalStorage<EventConfig | null>("event-config", null);
  const t = translations[appLang];

  // Hide the admin navbar on the login, guest invitation, and admin pages
  const hidePaths = ["/login", "/superadmin", "/guest", "/setup", "/api-docs"];
  if (hidePaths.some(p => pathname === p || pathname.startsWith(p + "/"))) return null;

  const EventIcon = eventConfig ? EVENT_TYPE_ICONS[eventConfig.eventType] : Heart;
  const eventName = eventConfig?.eventName || "Event Manager";
  const initials = eventConfig?.hostInitials || "EM";

  const navItems = [
    { href: "/", label: t.nav.dashboard, icon: LayoutDashboard, show: true },
    { href: "/present", label: t.nav.presence, icon: Users, show: eventConfig?.rsvpEnabled !== false },
    { href: "/table", label: t.nav.tables, icon: Hash, show: eventConfig?.seatingPlanEnabled !== false },
    { href: "/analytics", label: t.nav.analytics, icon: BarChart3, show: true },
  ].filter(item => item.show);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel !rounded-none border-b border-gold/20 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <PremiumLogo
            src={eventConfig?.logoUrl}
            fallbackIcon={EventIcon}
            size="sm"
            variant="gold"
          />
          <span className="font-serif font-bold text-gray-900 tracking-tight hidden sm:block">
            {eventName}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "text-gold bg-gold/5" 
                    : "text-gray-500 hover:text-gold hover:bg-gold/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-gray-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Settings link */}
          <Link
            href="/setup"
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-gray-500 hover:text-gold hover:bg-gold/5`}
            title={t.nav.settings}
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </Link>

          <button 
            onClick={logout}
            className="flex items-center gap-2 p-1.5 text-gray-400 hover:text-red-500 transition-all"
            title="Déconnexion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-light/30 flex items-center justify-center text-gold text-xs font-bold border border-gold-light/20">
                {initials}
            </div>
        </div>
      </div>
    </nav>
  );
}
