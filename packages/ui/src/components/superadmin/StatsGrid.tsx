"use client";
import { EventConfig } from "@backend/eventConfig";
import { Globe, Users, UserCheck, Activity, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

interface StatsGridProps {
  events: EventConfig[];
  globalStats?: {
    totalEvents: number;
    activePasses: number;
    globalAudience: number;
    totalCheckins: number;
  } | null;
}

export function StatsGrid({ events, globalStats }: StatsGridProps) {
  const stats = [
    { label: "Administrateurs", value: (globalStats as any)?.totalAdmins ?? 0, icon: Users },
    { label: "Connectés", value: (globalStats as any)?.activeAdmins ?? globalStats?.activePasses ?? 0, icon: Activity },
    { label: "Événements", value: globalStats?.totalEvents ?? events.length, icon: Globe },
    { label: "Audience totale", value: globalStats?.globalAudience ?? events.reduce((acc, e) => acc + (e.stats?.totalGuests || 0), 0), icon: UserCheck },
    { label: "Check-ins", value: globalStats?.totalCheckins ?? events.reduce((acc, e) => acc + (e.stats?.presentCount || 0), 0), icon: ScanLine },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(({ label, value, icon: Icon }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="es-card es-card--interactive es-kpi !p-5"
        >
          <span className="es-kpi__icon mb-3">
            <Icon className="w-5 h-5" />
          </span>
          <p className="es-kpi__value" style={{ fontSize: "var(--text-3xl)" }}>{value}</p>
          <p className="es-kpi__label mt-1">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}
