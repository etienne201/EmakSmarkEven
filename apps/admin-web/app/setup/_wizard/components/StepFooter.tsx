"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface StepFooterProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  hideBack?: boolean;
  optional?: boolean;
  onSkip?: () => void;
}

export function StepFooter({
  onBack,
  onNext,
  nextLabel = "Continuer",
  busy = false,
  disabled = false,
  hideBack = false,
  optional = false,
  onSkip,
}: StepFooterProps) {
  return (
    <div className="es-wizard-footer">
      <div>
        {!hideBack && (
          <button
            type="button"
            className="es-btn es-btn--ghost"
            onClick={onBack}
            disabled={busy}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Retour
          </button>
        )}
      </div>
      <div className="es-wizard-footer-right">
        {optional && onSkip && (
          <button
            type="button"
            className="es-btn es-btn--ghost"
            onClick={onSkip}
            disabled={busy}
          >
            Passer
          </button>
        )}
        <button
          type="button"
          className="es-btn es-btn--primary"
          onClick={onNext}
          disabled={busy || disabled}
        >
          {busy ? (
            <Loader2 className="w-4 h-4 es-spin" aria-hidden />
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
