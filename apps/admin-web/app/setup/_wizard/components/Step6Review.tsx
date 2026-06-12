"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Rocket,
  PartyPopper,
  Loader2,
} from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { step1Schema, step2Schema } from "../schemas";
import { localInputToIso, EVENT_TYPE_LABELS, MODULE_LABELS } from "../lib";
import { STEPS } from "../steps.config";
import { StepFooter } from "./StepFooter";

interface Props {
  onBack: () => void;
  onGoToStep: (step: number) => void;
}

export function Step6Review({ onBack, onGoToStep }: Props) {
  const router = useRouter();
  const eventId = useSetupStore((s) => s.eventId);
  const data = useSetupStore((s) => s.data);
  const setupCompleted = useSetupStore((s) => s.setupCompleted);

  const [phase, setPhase] = useState<"review" | "finalized">(
    setupCompleted ? "finalized" : "review",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step1Valid = step1Schema.safeParse(data.step1).success;
  const step2Valid = step2Schema.safeParse({
    ...data.step2,
    startDate: localInputToIso(data.step2.startDate) ? data.step2.startDate : "",
  }).success;

  const blocking = useMemo(() => {
    const items: string[] = [];
    if (!step1Valid) items.push("Étape 1 — Informations générales incomplètes.");
    if (!step2Valid) items.push("Étape 2 — Lieu & dates incomplets ou invalides.");
    return items;
  }, [step1Valid, step2Valid]);

  const warnings = useMemo(() => {
    const items: string[] = [];
    const activeModules = Object.entries(data.step3.modules).filter(
      ([, v]) => v,
    ).length;
    if (activeModules <= 1) items.push("Aucun module optionnel activé (étape 3).");
    if (!data.step4.theme) items.push("Aucun thème de branding choisi (étape 4).");
    if ((data.step5.guestCategories ?? []).length === 0)
      items.push("Aucune catégorie d'invités définie (étape 5).");
    return items;
  }, [data]);

  const enabledModules = Object.entries(data.step3.modules)
    .filter(([, v]) => v)
    .map(([k]) => MODULE_LABELS[k]?.label ?? k);

  const finalize = async () => {
    if (!eventId || blocking.length > 0) return;
    setBusy(true);
    setError(null);
    try {
      await setupApi.finalize(eventId);
      setPhase("finalized");
    } catch (e) {
      setError((e as { message?: string }).message ?? "Échec de la finalisation.");
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!eventId) return;
    setBusy(true);
    setError(null);
    try {
      await setupApi.submitForReview(eventId);
      await setupApi.publish(eventId);
      router.push("/home");
    } catch (e) {
      setError((e as { message?: string }).message ?? "Échec de la publication.");
    } finally {
      setBusy(false);
    }
  };

  if (phase === "finalized") {
    return (
      <div className="es-wizard-step es-animate-in">
        <div className="es-finalize-hero">
          <span className="es-finalize-badge">
            <PartyPopper className="w-7 h-7" aria-hidden />
          </span>
          <h2 className="es-h2">Configuration terminée</h2>
          <p className="es-subtle">
            Votre événement est prêt. Publiez-le pour le rendre accessible, ou
            accédez au tableau de bord pour le gérer.
          </p>
          {error && <p className="es-error-text">{error}</p>}
          <div className="es-finalize-actions">
            <button
              type="button"
              className="es-btn es-btn--ghost"
              onClick={() => router.push("/home")}
              disabled={busy}
            >
              Aller au tableau de bord
            </button>
            <button
              type="button"
              className="es-btn es-btn--primary"
              onClick={publish}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="w-4 h-4 es-spin" aria-hidden />
              ) : (
                <>
                  <Rocket className="w-4 h-4" aria-hidden /> Publier l&apos;événement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="es-wizard-step es-animate-in">
      {blocking.length > 0 && (
        <div className="es-alert es-alert--danger">
          <AlertTriangle className="w-4 h-4" aria-hidden />
          <div>
            <strong>Étapes obligatoires à compléter</strong>
            <ul>
              {blocking.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="es-alert es-alert--warning">
          <Info className="w-4 h-4" aria-hidden />
          <div>
            <strong>Recommandations (non bloquant)</strong>
            <ul>
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="es-summary">
        <SummaryRow
          step={1}
          ok={step1Valid}
          title={STEPS[0].title}
          onEdit={() => onGoToStep(1)}
        >
          {data.step1.title || "—"}
          {data.step1.eventType
            ? ` · ${EVENT_TYPE_LABELS[data.step1.eventType] ?? data.step1.eventType}`
            : ""}
        </SummaryRow>
        <SummaryRow
          step={2}
          ok={step2Valid}
          title={STEPS[1].title}
          onEdit={() => onGoToStep(2)}
        >
          {[data.step2.location, data.step2.city].filter(Boolean).join(", ") || "—"}
          {data.step2.startDate ? ` · ${data.step2.startDate.replace("T", " ")}` : ""}
        </SummaryRow>
        <SummaryRow
          step={3}
          ok
          title={STEPS[2].title}
          onEdit={() => onGoToStep(3)}
        >
          {enabledModules.join(", ") || "Invités uniquement"}
        </SummaryRow>
        <SummaryRow
          step={4}
          ok
          title={STEPS[3].title}
          onEdit={() => onGoToStep(4)}
        >
          {data.step4.theme || "Thème par défaut"}
        </SummaryRow>
        <SummaryRow
          step={5}
          ok
          title={STEPS[4].title}
          onEdit={() => onGoToStep(5)}
        >
          {(data.step5.guestCategories ?? []).length} catégorie(s) d&apos;invités ·{" "}
          {(data.step5.staffCategories ?? []).length} de staff
        </SummaryRow>
      </div>

      {error && <p className="es-error-text">{error}</p>}

      <StepFooter
        onBack={onBack}
        onNext={finalize}
        busy={busy}
        nextLabel="Finaliser la configuration"
      />
    </div>
  );
}

function SummaryRow({
  step,
  ok,
  title,
  onEdit,
  children,
}: {
  step: number;
  ok: boolean;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="es-summary-row">
      <span className="es-summary-icon" data-ok={ok}>
        {ok ? (
          <CheckCircle2 className="w-4 h-4" aria-hidden />
        ) : (
          <AlertTriangle className="w-4 h-4" aria-hidden />
        )}
      </span>
      <div className="es-summary-content">
        <span className="es-summary-title">
          Étape {step} · {title}
        </span>
        <span className="es-summary-value">{children}</span>
      </div>
      <button type="button" className="es-btn es-btn--ghost es-btn--sm" onClick={onEdit}>
        Modifier
      </button>
    </div>
  );
}
