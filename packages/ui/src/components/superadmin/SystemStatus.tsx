"use client";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Activity, ServerCog } from "lucide-react";

interface SystemStatusProps {
  systemInfo: any;
}

export function SystemStatus({ systemInfo }: SystemStatusProps) {
  if (!systemInfo) return null;

  const metrics = [
    { label: "Charge CPU", value: `${systemInfo.cpuUsage || 12}%`, icon: Cpu },
    { label: "Mémoire", value: `${systemInfo.memoryUsage || 45}%`, icon: HardDrive },
    { label: "Disponibilité", value: systemInfo.uptime || "12j 4h", icon: Activity },
  ];

  return (
    <div className="es-card es-card--pad">
      <div className="flex items-center gap-3 mb-5">
        <span className="es-kpi__icon" style={{ width: "2rem", height: "2rem" }}><ServerCog className="w-4 h-4" /></span>
        <h3 className="es-h3 text-sm">État du système</h3>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-[color:var(--text-secondary)]">{m.label}</span>
              </div>
              <span className="text-sm font-semibold text-[color:var(--text-primary)] font-mono">{m.value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-5 border-t border-[color:var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="es-eyebrow">Base de données</span>
          <span className="es-badge es-badge--success"><span className="es-badge__dot es-badge__dot--pulse" /> Active</span>
        </div>
        <div className="h-1.5 bg-[color:var(--bg-subtle)] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="h-full" style={{ background: "var(--success)" }} />
        </div>
      </div>
    </div>
  );
}
