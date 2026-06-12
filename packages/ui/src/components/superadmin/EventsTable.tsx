"use client";
import { EventConfig } from "@backend/eventConfig";
import { Lock, Unlock, Settings, ExternalLink, Trash2, Users, UserCheck, CalendarRange } from "lucide-react";

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
      <div className="es-card">
        <div className="es-empty">
          <span className="es-empty__icon"><CalendarRange className="w-7 h-7" /></span>
          <p className="es-empty__title">Aucun événement</p>
          <p className="es-empty__text">Les événements créés sur la plateforme apparaîtront ici. Commencez par en créer un avec le bouton « Nouvel événement ».</p>
        </div>
      </div>
    );
  }

  return (
    <div className="es-table-wrap es-scroll">
      <div className="overflow-x-auto">
        <table className="es-table">
          <thead>
            <tr>
              <th>Événement</th>
              <th>Accès</th>
              <th>Affluence</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.ownerId}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-[color:var(--bg-subtle)] border border-[color:var(--border)]">
                      {EVENT_ICON[event.eventType] ?? "✨"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[color:var(--text-primary)] leading-tight truncate">{event.eventName}</p>
                      <p className="text-xs text-[color:var(--text-muted)] font-mono mt-0.5 truncate">{event.ownerId}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="font-mono">{event.adminPassword ? "Protégé" : "Non sécurisé"}</span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--text-secondary)]">
                      <Users className="w-3.5 h-3.5" /> {event.stats?.totalGuests ?? 0} invités
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#28A745]">
                      <UserCheck className="w-3.5 h-3.5" /> {event.stats?.presentCount ?? 0} présents
                    </span>
                  </div>
                </td>
                <td>
                  {event.isBlocked ? (
                    <span className="es-badge es-badge--danger"><span className="es-badge__dot" /> Suspendu</span>
                  ) : (
                    <span className="es-badge es-badge--success"><span className="es-badge__dot" /> Actif</span>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onView(event)} className="es-icon-btn es-focusable" title="Ouvrir le tableau de bord" aria-label="Ouvrir le tableau de bord">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(event)} className="es-icon-btn es-focusable" title="Modifier" aria-label="Modifier l'événement">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button onClick={() => onToggleBlock(event.ownerId!, !!event.isBlocked)} className="es-icon-btn es-focusable" title={event.isBlocked ? "Réactiver" : "Suspendre"} aria-label={event.isBlocked ? "Réactiver l'événement" : "Suspendre l'événement"}>
                      {event.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    <button onClick={() => onDelete(event.ownerId!)} className="es-icon-btn es-icon-btn--danger es-focusable" title="Supprimer" aria-label="Supprimer l'événement">
                      <Trash2 className="w-4 h-4" />
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
