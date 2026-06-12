"use client";
import { Lock, Settings, RefreshCw, Activity, Trash2, Plus, LogIn } from "lucide-react";
import { motion } from "framer-motion";

interface LogEntry {
  timestamp: string;
  ownerId: string;
  action: string;
  details?: Record<string, unknown>;
}

interface ActivityLogProps {
  logs: LogEntry[];
  onRefresh?: () => void;
}

const ACTION_META: Record<string, { variant: string; Icon: any }> = {
  DELETE: { variant: "es-badge--danger", Icon: Trash2 },
  CREATE: { variant: "es-badge--success", Icon: Plus },
  LOGIN:  { variant: "es-badge--info", Icon: LogIn },
  UPDATE: { variant: "es-badge--neutral", Icon: Settings },
  BLOCK:  { variant: "es-badge--warning", Icon: Lock },
};

function getMeta(action: string) {
  for (const key of Object.keys(ACTION_META)) {
    if (action.includes(key)) return ACTION_META[key];
  }
  return { variant: "es-badge--neutral", Icon: Activity };
}

export function ActivityLog({ logs, onRefresh }: ActivityLogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="es-kpi__icon" style={{ width: "2rem", height: "2rem" }}><Activity className="w-4 h-4" /></span>
          <h3 className="es-h3 text-sm">Journal d&apos;activité</h3>
        </div>
        {onRefresh && (
          <button onClick={onRefresh} className="es-icon-btn es-focusable" title="Actualiser" aria-label="Actualiser le journal">
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="es-card overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto es-scroll">
          {logs.length === 0 ? (
            <div className="es-empty">
              <span className="es-empty__icon"><Activity className="w-7 h-7" /></span>
              <p className="es-empty__title">Aucune activité</p>
              <p className="es-empty__text">Les actions réalisées sur la plateforme s&apos;afficheront ici en temps réel.</p>
            </div>
          ) : (
            <div className="divide-y divide-[color:var(--border)]">
              {logs.map((log, i) => {
                const { variant, Icon } = getMeta(log.action);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    className="p-4 hover:bg-[color:var(--bg-subtle)] transition-colors flex items-start gap-3"
                  >
                    <span className={`es-badge ${variant} shrink-0`} style={{ width: "1.75rem", height: "1.75rem", padding: 0, justifyContent: "center" }}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="font-semibold text-xs text-[color:var(--text-primary)]">{log.action}</p>
                        <span className="text-[color:var(--text-muted)] text-xs shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-[color:var(--text-secondary)] truncate">
                        Compte&nbsp;: <span className="font-medium text-[color:var(--text-primary)]">{log.ownerId}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
