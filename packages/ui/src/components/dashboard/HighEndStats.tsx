"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserMinus, TrendingUp } from "lucide-react";
import { Language, translations } from "@backend/translations";

interface DashboardStatsProps {
  guests: any[];
  tables: any[];
  attendance: any[];
  lang: Language;
}

export function HighEndStats({ guests, attendance, lang }: DashboardStatsProps) {
  const t = translations[lang];

  const present = attendance.length;
  const pending = Math.max(0, guests.length - present);
  const rate = guests.length > 0 ? Math.round((present / guests.length) * 100) : 0;

  const stats = [
    { label: t.guests, value: guests.length, icon: Users, hint: "Total inscrits" },
    { label: "Présents", value: present, icon: UserCheck, hint: "Arrivés sur place", isPrimary: true },
    { label: "En attente", value: pending, icon: UserMinus, hint: "Pas encore arrivés" },
    { label: "Taux de présence", value: `${rate}%`, icon: TrendingUp, hint: "Présents / invités" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="es-card es-card--interactive es-kpi"
          >
            <div className="flex items-start justify-between mb-4">
              <span
                className="es-kpi__icon"
                style={stat.isPrimary ? { background: "var(--color-primary)", color: "#fff" } : undefined}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="es-badge es-badge--neutral">
                <span className="es-badge__dot es-badge__dot--pulse" style={{ color: "var(--color-primary)" }} />
                Temps réel
              </span>
            </div>
            <p className="es-kpi__label">{stat.label}</p>
            <p className="es-kpi__value mt-1">{stat.value}</p>
            <p className="es-hint mt-2">{stat.hint}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
