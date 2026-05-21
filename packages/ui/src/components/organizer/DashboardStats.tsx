import { motion } from "framer-motion";
import { Users, UserCheck, UserMinus, Hash } from "lucide-react";
import { Language, translations } from "@backend/translations";

interface DashboardStatsProps {
  guests: any[];
  tables: any[];
  attendance: any[];
  lang: Language;
}

export function DashboardStats({ guests, tables, attendance, lang }: DashboardStatsProps) {
  const t = translations[lang];
  
  // Calculate stats using actual attendance records
  const present = attendance.length;
  const pending = Math.max(0, guests.length - present);

  const stats = [
    { label: t.guests, value: guests.length, icon: Users, color: "bg-blue-500" },
    { label: "Présents", value: present, icon: UserCheck, color: "bg-emerald-500" },
    { label: "Attendu", value: pending, icon: UserMinus, color: "bg-amber-500" },
    { label: "Tables", value: tables.length, icon: Hash, color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-4 rounded-2xl border border-gold-light/20 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-4 h-4 ${stat.color.replace("bg-", "text-")}`} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
