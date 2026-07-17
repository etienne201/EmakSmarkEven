"use client";

import { Lock } from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { MODULE_LABELS } from "../lib";
import { MODULE_KEYS } from "../schemas";
import { StepFooter } from "./StepFooter";
import type { ModuleKey } from "../types";

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

// guests is always locked on; qrCheckin & tables require guests (always met here).
const LOCKED: ModuleKey[] = ["guests"];

export function Step3Modules({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const modules = useSetupStore((s) => s.data.step3.modules);
  const updateModules = useSetupStore((s) => s.updateModules);
  const markCompleted = useSetupStore((s) => s.markCompleted);

  useAutosave({
    value: modules,
    enabled: Boolean(eventId),
    save: (m) => setupApi.saveStep(eventId as string, 3, { modules: m }),
  });

  const onNext = () => {
    markCompleted(3);
    onCompleted();
  };

  return (
    <div className="es-wizard-step es-animate-in">
      <div className="es-module-grid">
        {MODULE_KEYS.map((key) => {
          const meta = MODULE_LABELS[key];
          const locked = LOCKED.includes(key);
          const checked = modules[key];
          return (
            <label
              key={key}
              className="es-module-card"
              data-checked={checked}
              data-locked={locked}
            >
              <div className="es-module-card-head">
                <span className="es-module-card-title">{meta.label}</span>
                {locked ? (
                  <Lock className="w-4 h-4 es-module-lock" aria-hidden />
                ) : (
                  <span className="es-switch" data-on={checked}>
                    <input
                      type="checkbox"
                      className="es-switch-input"
                      checked={checked}
                      onChange={(e) => updateModules({ [key]: e.target.checked })}
                      aria-label={meta.label}
                    />
                    <span className="es-switch-track" aria-hidden>
                      <span className="es-switch-thumb" />
                    </span>
                  </span>
                )}
              </div>
              <p className="es-module-card-desc">{meta.description}</p>
            </label>
          );
        })}
      </div>

      <StepFooter onBack={onBack} onNext={onNext} optional onSkip={onNext} />
    </div>
  );
}
