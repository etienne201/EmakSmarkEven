"use client";
import { EventConfig } from "@backend/eventConfig";
import { Lock, Unlock, Settings, ExternalLink, Trash2, Users, UserCheck } from "lucide-react";

const EVENT_ICON: Record<string, string> = {
  wedding: "💍", birthday: "🎂", conference: "🎤", gala: "👑", other: "✨",
};

interface EventsTableProps {
  events: EventConfig[];
  onView: (event: EventConfig) => void;
  onEdit: (event: EventConfig) => void;
  onToggleBlock: (ownerId: string, isBlocked: boolean) => void;
  onDelete: (ownerId: string) => void;
}

export function EventsTable({ events, onView, onEdit, onToggleBlock, onDelete }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-black border border-white/5 rounded-3xl p-20 text-center">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Système vide — En attente de données</p>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-[0.2em]">Entité / ID</th>
              <th className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-[0.2em]">Accès</th>
              <th className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-[0.2em]">Performance</th>
              <th className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-[0.2em]">Statut</th>
              <th className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-[0.2em] text-right">Contrôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr key={event.ownerId} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/5 group-hover:border-[#3B3B6D]/30 transition-colors">
                      {EVENT_ICON[event.eventType] ?? "✨"}
                    </div>
                    <div>
                      <p className="font-black text-white leading-tight uppercase text-xs tracking-tight">{event.eventName}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">{event.ownerId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Lock className="w-3 h-3 text-[#3B3B6D]" />
                    <span className="font-mono tracking-tighter">{event.adminPassword ? "••••••••" : "Non sécurisé"}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-tight">
                      <Users className="w-3 h-3 text-[#3B3B6D]" />
                      <span>{event.stats?.totalGuests ?? 0} PAX</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#28A745] uppercase tracking-tight">
                      <UserCheck className="w-3 h-3" />
                      <span>{event.stats?.presentCount ?? 0} IN</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {event.isBlocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20">
                      SUSPENDU
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#28A745]/10 text-[#28A745] text-[9px] font-black uppercase tracking-widest border border-[#28A745]/20">
                      OPÉRATIONNEL
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onView(event)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Dashboard">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onEdit(event)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#3B3B6D] hover:bg-[#3B3B6D]/10 rounded-lg transition-all" title="Éditer">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onToggleBlock(event.ownerId!, !!event.isBlocked)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${event.isBlocked ? "text-[#28A745] hover:bg-[#28A745]/10" : "text-amber-500 hover:bg-amber-500/10"}`} title={event.isBlocked ? "Débloquer" : "Suspendre"}>
                      {event.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => onDelete(event.ownerId!)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Détruire">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
