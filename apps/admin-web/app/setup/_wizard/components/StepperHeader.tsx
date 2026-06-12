"use client";

import { Check } from "lucide-react";
import { STEPS } from "../steps.config";

interface StepperHeaderProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

// StepperHeader: Completed / Active / Inactive states.
// Free navigation is allowed to any completed step (or the active one).
export function StepperHeader({
  currentStep,
  completedSteps,
  onStepClick,
}: StepperHeaderProps) {
  return (
    <nav className="es-stepper" aria-label="Étapes de configuration">
      <ol className="es-stepper-list">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = step.id === currentStep;
          const isNavigable = isCompleted || isActive;
          const state = isActive
            ? "active"
            : isCompleted
              ? "completed"
              : "inactive";
          const Icon = step.icon;

          return (
            <li key={step.id} className="es-stepper-item" data-state={state}>
              {idx > 0 && (
                <span
                  className="es-stepper-line"
                  data-filled={isCompleted || isActive}
                  aria-hidden
                />
              )}
              <button
                type="button"
                className="es-stepper-node es-focusable"
                data-state={state}
                onClick={() => isNavigable && onStepClick(step.id)}
                disabled={!isNavigable}
                aria-current={isActive ? "step" : undefined}
                title={step.title}
              >
                <span className="es-stepper-dot">
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4" aria-hidden />
                  ) : (
                    <Icon className="w-4 h-4" aria-hidden />
                  )}
                </span>
                <span className="es-stepper-label">
                  <span className="es-stepper-index">Étape {step.id}</span>
                  <span className="es-stepper-title">{step.title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
