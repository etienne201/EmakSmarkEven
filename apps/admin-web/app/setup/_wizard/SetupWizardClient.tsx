"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { useSetupStore } from "./store";
import { setupApi } from "./api";
import type { ApiError } from "./types";
import { WizardShell } from "./components/WizardShell";
import { CreateEventCard } from "./components/CreateEventCard";
import { Step1General } from "./components/Step1General";
import { Step2Location } from "./components/Step2Location";
import { Step3Modules } from "./components/Step3Modules";
import { Step4Branding } from "./components/Step4Branding";
import { Step5Access } from "./components/Step5Access";
import { Step6Review } from "./components/Step6Review";

export function SetupWizardClient() {
  const router = useRouter();
  const params = useSearchParams();
  const eventId = params.get("eventId");

  const currentStep = useSetupStore((s) => s.currentStep);
  const completedSteps = useSetupStore((s) => s.completedSteps);
  const hydrate = useSetupStore((s) => s.hydrate);
  const goToStep = useSetupStore((s) => s.goToStep);
  const setEventId = useSetupStore((s) => s.setEventId);

  const [phase, setPhase] = useState<"loading" | "create" | "ready" | "error">(
    eventId ? "loading" : "create",
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (id: string) => {
      setPhase("loading");
      try {
        const status = await setupApi.getStatus(id);
        hydrate(status);
        setPhase("ready");
      } catch (e) {
        const err = e as ApiError;
        if (err.status === 401) {
          router.replace("/login");
          return;
        }
        setError(err.message);
        setPhase("error");
      }
    },
    [hydrate, router],
  );

  useEffect(() => {
    if (eventId) {
      setEventId(eventId);
      load(eventId);
    } else {
      setPhase("create");
    }
  }, [eventId, load, setEventId]);

  if (phase === "create") {
    return (
      <CreateEventCard
        onCreated={(id) => {
          setEventId(id);
          router.replace(`/setup?eventId=${id}`);
        }}
      />
    );
  }

  if (phase === "loading") {
    return (
      <div className="es-app es-wizard es-wizard-center">
        <Loader2 className="w-6 h-6 es-spin" aria-hidden />
        <p className="es-subtle">Chargement de la configuration…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="es-app es-wizard es-wizard-center">
        <div className="es-empty">
          <AlertTriangle className="w-8 h-8" aria-hidden />
          <h2 className="es-h3">Impossible de charger l&apos;événement</h2>
          <p className="es-subtle">{error}</p>
          <button
            type="button"
            className="es-btn es-btn--primary"
            onClick={() => eventId && load(eventId)}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const goNext = () => goToStep(currentStep + 1);
  const goBack = () => goToStep(currentStep - 1);

  return (
    <WizardShell
      currentStep={currentStep}
      completedSteps={completedSteps}
      onStepClick={goToStep}
    >
      {currentStep === 1 && <Step1General onCompleted={goNext} />}
      {currentStep === 2 && <Step2Location onCompleted={goNext} onBack={goBack} />}
      {currentStep === 3 && <Step3Modules onCompleted={goNext} onBack={goBack} />}
      {currentStep === 4 && <Step4Branding onCompleted={goNext} onBack={goBack} />}
      {currentStep === 5 && <Step5Access onCompleted={goNext} onBack={goBack} />}
      {currentStep === 6 && <Step6Review onBack={goBack} onGoToStep={goToStep} />}
    </WizardShell>
  );
}
