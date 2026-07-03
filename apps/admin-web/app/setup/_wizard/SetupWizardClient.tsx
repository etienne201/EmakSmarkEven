"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { useSetupStore } from "./store";
import { setupApi } from "./api";
import type { ApiError } from "./types";
import { WizardShell } from "./components/WizardShell";
import { CreateEventCard } from "./components/CreateEventCard";
import { Step1BaseInfo } from "./components/Step1BaseInfo";
import { Step2Modules } from "./components/Step2Modules";
import { Step3Templates } from "./components/Step3Templates";
import { Step4FlyerEditor } from "./components/Step4FlyerEditor";
import { Step5Branding } from "./components/Step5Branding";
import { Step6Content } from "./components/Step6Content";
import { Step7Guests } from "./components/Step7Guests";
import { Step8Review } from "./components/Step8Review";
import { Step9Publish } from "./components/Step9Publish";

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
      {currentStep === 1 && <Step1BaseInfo onCompleted={goNext} />}
      {currentStep === 2 && <Step2Modules onCompleted={goNext} onBack={goBack} />}
      {currentStep === 3 && <Step3Templates onCompleted={goNext} onBack={goBack} />}
      {currentStep === 4 && <Step4FlyerEditor onCompleted={goNext} onBack={goBack} />}
      {currentStep === 5 && <Step5Branding onCompleted={goNext} onBack={goBack} />}
      {currentStep === 6 && <Step6Content onCompleted={goNext} onBack={goBack} />}
      {currentStep === 7 && <Step7Guests onCompleted={goNext} onBack={goBack} />}
      {currentStep === 8 && <Step8Review onCompleted={goNext} onBack={goBack} onGoToStep={goToStep} />}
      {currentStep === 9 && <Step9Publish onBack={goBack} />}
    </WizardShell>
  );
}
