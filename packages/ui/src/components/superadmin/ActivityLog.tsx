"use client";
import { Lock, Settings, RefreshCw, Activity } from "lucide-react";
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

const ACTION_STYLES: Record<string, { bg: string; text: string; accent: string }> = {
  DELETE: { bg: "bg-red-500/10", text: "text-red-500", accent: "border-red-500/20" },
  CREATE: { bg: "bg-[#28A745]/10", text: "text-[#28A745]", accent: "border-[#28A745]/20" },
  LOGIN:  { bg: "bg-[#3B3B6D]/10", text: "text-[#3B3B6D]", accent: "border-[#3B3B6D]/20" },
  UPDATE: { bg: "bg-white/10", text: "text-white", accent: "border-white/20" },
  BLOCK:  { bg: "bg-red-500/10", text: "text-red-500", accent: "border-red-500/20" },
  DEFAULT:{ bg: "bg-slate-900/50", text: "text-slate-500", accent: "border-slate-800" },
};

function getActionStyle(action: string) {
  for (const key of Object.keys(ACTION_STYLES)) {
    if (action.includes(key)) return ACTION_STYLES[key];
  }
  return ACTION_STYLES.DEFAULT;
}

export function ActivityLog({ logs, onRefresh }: ActivityLogProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3B3B6D] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B3B6D]/20">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Flux d'activité</h3>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="bg-black border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {logs.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto opacity-20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Aucune donnée système détectée</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {logs.map((log, i) => {
                const style = getActionStyle(log.action);
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 hover:bg-white/[0.02] transition-all flex items-start gap-4 border-l-2 border-transparent hover:border-[#3B3B6D]"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${style.accent} ${style.bg} ${style.text}`}>
                      {log.action.includes("LOGIN") ? <Lock className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-black text-[10px] uppercase tracking-wider ${style.text}`}>{log.action}</p>
                        <span className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">
                          {new Date(log.timestamp).toLocaleTimeString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        ID: <span className="text-white font-black">{log.ownerId}</span>
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-2 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                           <p className="text-[9px] text-slate-500 font-mono leading-relaxed truncate">
                             {JSON.stringify(log.details).replace(/[{}"]/g, '')}
                           </p>
                        </div>
                      )}
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
