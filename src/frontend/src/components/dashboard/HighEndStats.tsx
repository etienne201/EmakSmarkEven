"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserMinus, Hash, TrendingUp } from "lucide-react";
import { Language, translations } from "@backend/translations";

interface DashboardStatsProps {
  guests: any[];
  tables: any[];
  attendance: any[];
  lang: Language;
}

export function HighEndStats({ guests, tables, attendance, lang }: DashboardStatsProps) {
  const t = translations[lang];
  
  const present = attendance.length;
  const pending = Math.max(0, guests.length - present);
  const rate = guests.length > 0 ? Math.round((present / guests.length) * 100) : 0;

  const stats = [
    { label: t.guests, value: guests.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Présents", value: present, icon: UserCheck, color: "", bg: "", isPrimary: true },
    { label: "Attendu", value: pending, icon: UserMinus, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Taux RSVP", value: `${rate}%`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className={`p-4 rounded-3xl transition-transform group-hover:scale-110 duration-500 ${(stat as any).isPrimary ? '' : `${stat.bg} ${stat.color}`}`}
              style={(stat as any).isPrimary ? { backgroundColor: 'var(--color-primary)', color: 'white', opacity: 0.9 } : undefined}
            >
              {(() => {
                const Icon = stat.icon as any;
                return <Icon className="w-6 h-6" />;
              })()}
            </div>
            <div className="bg-gray-50 px-3 py-1 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest">
              Live Update
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</h4>
            <div className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
