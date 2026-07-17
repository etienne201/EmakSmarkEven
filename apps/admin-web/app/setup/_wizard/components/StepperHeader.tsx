"use client";

import { Check, Lock } from "lucide-react";
import { STEPS } from "../steps.config";

interface StepperHeaderProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

/**
 * UX-01 FIX: Navigation restreinte aux étapes accessibles.
 * - Étape active : toujours accessible.
 * - Étapes complétées : cliquables (l'utilisateur peut y retourner modifier).
 * - Étapes futures (ni active, ni complétée) : désactivées visuellement.
 *
 * L'ancienne implémentation permettait de naviguer vers n'importe quelle étape
 * dans onStepClick(), y compris des étapes futures non encore atteintes.
 */
export function StepperHeader({
  currentStep,
  completedSteps,
  onStepClick,
}: StepperHeaderProps) {
  return (
    <nav className="es-stepper es-wizard-stepper-nav" aria-label="Étapes de configuration">
      <ol className="es-stepper-list">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = step.id === currentStep;
          const isAccessible = isActive || isCompleted;
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
                onClick={() => isAccessible && onStepClick(step.id)}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={!isAccessible}
                title={isAccessible ? step.title : `${step.title} (non encore accessible)`}
                style={{
                  cursor: isAccessible ? "pointer" : "not-allowed",
                  opacity: isAccessible ? 1 : 0.45,
                }}
              >
                <span className="es-stepper-dot">
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4" aria-hidden />
                  ) : !isAccessible ? (
                    <Lock className="w-3.5 h-3.5" aria-hidden />
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
