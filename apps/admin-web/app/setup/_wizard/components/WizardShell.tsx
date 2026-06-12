"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { StepperHeader } from "./StepperHeader";
import { SaveIndicator } from "./SaveIndicator";
import { STEPS } from "../steps.config";

interface WizardShellProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  children: ReactNode;
}

export function WizardShell({
  currentStep,
  completedSteps,
  onStepClick,
  children,
}: WizardShellProps) {
  const meta = STEPS.find((s) => s.id === currentStep) ?? STEPS[0];
  const progress = Math.round((completedSteps.length / STEPS.length) * 100);

  return (
    <div className="es-app es-wizard">
      <div className="es-wizard-container">
        <header className="es-wizard-topbar">
          <div className="es-wizard-brand">
            <span className="es-wizard-brand-mark">
              <Sparkles className="w-4 h-4" aria-hidden />
            </span>
            <div>
              <span className="es-eyebrow">Configuration de l&apos;événement</span>
              <h1 className="es-wizard-brand-title">Setup Wizard</h1>
            </div>
          </div>
          <SaveIndicator />
        </header>

        <StepperHeader
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={onStepClick}
        />

        <div className="es-wizard-progress" aria-hidden>
          <span className="es-wizard-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <section className="es-card es-card--pad es-wizard-panel">
          <div className="es-wizard-panel-head">
            <h2 className="es-h2">{meta.title}</h2>
            <p className="es-subtle">{meta.subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
