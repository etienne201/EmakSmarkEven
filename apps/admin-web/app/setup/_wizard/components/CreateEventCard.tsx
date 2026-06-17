"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Loader2, ArrowRight, PartyPopper } from "lucide-react";
import { setupApi } from "../api";
import { slugify, EVENT_TYPE_LABELS } from "../lib";
import { EVENT_TYPES } from "../schemas";
import type { EventTypeKey } from "../types";

interface Props {
  onCreated: (eventId: string) => void;
}

// Entry point when the wizard is opened without an event yet: create the event,
// then continue into the wizard (mirrors "after creation -> Setup Wizard").
export function CreateEventCard({ onCreated }: Props) {
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "true";

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventTypeKey | "">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (title.trim().length < 3 || !eventType) {
      setError("Renseignez un titre (3+ caractères) et un type d'événement.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await setupApi.createEvent({
        title: title.trim(),
        slug: slugify(title),
        eventType,
        startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      onCreated(created.id);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Création impossible.");
      setBusy(false);
    }
  };

  return (
    <div className="es-app es-wizard">
      <div className="es-wizard-container es-wizard-container--narrow">
        {/* Welcome banner for newly created admin accounts */}
        {isWelcome && (
          <section className="es-card es-card--pad es-animate-in" style={{ marginBottom: '1.5rem', background: 'var(--surface-success, rgba(16,185,129,0.08))', borderLeft: '4px solid var(--color-primary, #10b981)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <PartyPopper className="w-6 h-6" style={{ color: 'var(--color-primary, #10b981)', flexShrink: 0, marginTop: '2px' }} aria-hidden />
              <div>
                <h2 className="es-h3" style={{ margin: 0 }}>Bienvenue sur EMAKO Smart Event ! 🎉</h2>
                <p className="es-subtle" style={{ marginTop: '0.5rem' }}>
                  Votre compte organisateur a été créé avec succès.
                  Pour accéder à votre <strong>tableau de bord</strong>, commencez par créer et configurer votre premier événement en <strong>3 minutes</strong>.
                </p>
                <p className="es-subtle" style={{ marginTop: '0.25rem', fontSize: '0.8rem', opacity: 0.7 }}>
                  Créer l&apos;événement → Configurer (6 étapes) → Accéder au dashboard
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="es-card es-card--pad es-animate-in">
          <div className="es-wizard-brand">
            <span className="es-wizard-brand-mark">
              <Sparkles className="w-4 h-4" aria-hidden />
            </span>
            <div>
              <span className="es-eyebrow">Nouvel événement</span>
              <h1 className="es-wizard-brand-title">Créons votre événement</h1>
            </div>
          </div>
          <p className="es-subtle es-mt-2">
            Donnez un titre et un type pour démarrer. Vous configurerez tout le
            reste dans les étapes suivantes.
          </p>

          <div className="es-field es-mt-4">
            <label className="es-label" htmlFor="newTitle">
              Titre de l&apos;événement
            </label>
            <input
              id="newTitle"
              className="es-input"
              value={title}
              placeholder="ex : Mariage Awa & Karim"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="es-field">
            <label className="es-label" htmlFor="newType">
              Type d&apos;événement
            </label>
            <select
              id="newType"
              className="es-select"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventTypeKey)}
            >
              <option value="">Sélectionner…</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EVENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="es-error-text">{error}</p>}

          <button
            type="button"
            className="es-btn es-btn--primary es-btn--block es-btn--lg es-mt-2"
            onClick={submit}
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="w-4 h-4 es-spin" aria-hidden />
            ) : (
              <>
                Démarrer la configuration
                <ArrowRight className="w-4 h-4" aria-hidden />
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
}

