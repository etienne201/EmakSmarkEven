"use client";
import { EventConfig } from "@backend/eventConfig";
import { Globe, Users, Lock, UserCheck } from "lucide-react";
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
    { label: "Utilisateurs", value: (globalStats as any)?.totalAdmins ?? 0, icon: Users, color: "text-amber-400" },
    { label: "Connectés", value: (globalStats as any)?.activeAdmins ?? globalStats?.activePasses ?? 0, icon: UserCheck, color: "text-[#28A745]" },
    { label: "Événements", value: globalStats?.totalEvents ?? events.length, icon: Globe, color: "text-[#3B3B6D]" },
    { label: "Audience", value: globalStats?.globalAudience ?? events.reduce((acc, e) => acc + (e.stats?.totalGuests || 0), 0), icon: Users, color: "text-white" },
    { label: "Check-ins", value: globalStats?.totalCheckins ?? events.reduce((acc, e) => acc + (e.stats?.presentCount || 0), 0), icon: Lock, color: "text-[#3B3B6D]" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {stats.map(({ label, value, icon: Icon, color }, i) => (
        <motion.div 
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-black border border-white/5 p-6 rounded-[28px] shadow-2xl relative overflow-hidden group hover:border-[#3B3B6D]/30 transition-all"
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon className="w-20 h-20 text-white" />
          </div>
          <div className={`flex items-center gap-2 ${color} mb-3`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
          </div>
          <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
        </motion.div>
      ))}
    </div>
  );
}
