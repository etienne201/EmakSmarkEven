"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserX, BarChart3, PieChart, TrendingUp, LayoutDashboard } from "lucide-react";
import { Language, translations } from "@backend/translations";

interface AnalyticsViewProps {
  guests: any[];
  attendance: any[];
  appLang: Language;
  eventConfig: any;
}

export function AnalyticsView({ guests, attendance, appLang, eventConfig }: AnalyticsViewProps) {
  const t = translations[appLang];

  const totalGuests = guests.length;
  const presentCount = attendance.length;
  const pendingCount = Math.max(0, totalGuests - presentCount);
  const attendanceRate = totalGuests > 0 ? Math.round((presentCount / totalGuests) * 100) : 0;

  const frCount = guests.filter(g => g.lang === "fr").length;
  const enCount = guests.filter(g => g.lang === "en").length;

  const tableStats = guests.reduce((acc: Record<string, number>, guest) => {
    const key = guest.tableName || `Table ${guest.table}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedTables = Object.entries(tableStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const busiestTable = sortedTables[0]?.[0] || "N/A";

  return (
    <div className="space-y-8">
      {/* Smart Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-emerald/5 border border-emerald/10 p-6 rounded-[2rem] flex items-start gap-4">
          <div className="p-2 bg-emerald text-white rounded-lg"><TrendingUp className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-black text-emerald/60 uppercase tracking-[0.2em] mb-1">Taux de Remplissage</p>
            <p className="text-sm font-bold text-gray-900">
              {attendanceRate >= 80 ? "Excellent !" : attendanceRate >= 50 ? "En bonne voie" : "Début de soirée"}
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-start gap-4">
          <div className="p-2 bg-blue-500 text-white rounded-lg"><LayoutDashboard className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Table la plus active</p>
            <p className="text-sm font-bold text-gray-900">{busiestTable}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
          <div className="p-2 bg-amber-500 text-white rounded-lg"><Users className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Diversité Linguistique</p>
            <p className="text-sm font-bold text-gray-900">
              {frCount > enCount ? "Majorité Francophone" : enCount > frCount ? "Majorité Anglophone" : "Mixité Parfaite"}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Table Occupancy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald rounded-2xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            {t.stats.topTables}
          </h3>
          <div className="space-y-6">
            {sortedTables.length > 0 ? sortedTables.map(([name, count], i) => (
              <div key={name} className="space-y-3">
                <div className="flex justify-between text-sm font-black uppercase tracking-wider">
                  <span className="text-gray-500">{name}</span>
                  <span className="text-emerald">{count} / {eventConfig.maxGuestsPerTable}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / eventConfig.maxGuestsPerTable) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 1.5, ease: "circOut" }}
                    className="h-full bg-emerald rounded-full"
                  />
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-gray-300 italic font-bold">No data available</div>
            )}
          </div>
        </motion.div>

        {/* Language Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <PieChart className="w-6 h-6" />
            </div>
            {t.stats.languages}
          </h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 mb-8">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                {totalGuests > 0 && (
                  <circle 
                    cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" 
                    strokeDasharray={`${(frCount / totalGuests) * 100} ${100 - (frCount / totalGuests) * 100}`}
                    className="transition-all duration-1000"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900">{totalGuests}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald mb-2" />
                <span className="text-xs font-black text-gray-500 uppercase">Français</span>
                <span className="text-xl font-black text-gray-900">{frCount}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 mb-2" />
                <span className="text-xs font-black text-gray-500 uppercase">English</span>
                <span className="text-xl font-black text-gray-900">{enCount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
