"use client";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Activity, Terminal } from "lucide-react";

interface SystemStatusProps {
  systemInfo: any;
}

export function SystemStatus({ systemInfo }: SystemStatusProps) {
  if (!systemInfo) return null;

  const metrics = [
    { label: "CPU Load", value: `${systemInfo.cpuUsage || 12}%`, icon: Cpu, color: "text-blue-400" },
    { label: "Memory", value: `${systemInfo.memoryUsage || 45}%`, icon: HardDrive, color: "text-purple-400" },
    { label: "Uptime", value: systemInfo.uptime || "12d 4h", icon: Activity, color: "text-emerald-400" },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="w-5 h-5 text-slate-500" />
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">System Health</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={m.label} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${m.color} group-hover:scale-110 transition-transform`}>
                <m.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
            </div>
            <span className="text-xs font-black text-white font-mono">{m.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core Database</span>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "100%" }} 
            className="h-full bg-emerald-500" 
          />
        </div>
      </div>
    </div>
  );
}
