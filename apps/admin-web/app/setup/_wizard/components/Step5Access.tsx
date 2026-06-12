"use client";

import { useState } from "react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { TagInput } from "./TagInput";
import { StepFooter } from "./StepFooter";

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

const GUEST_SUGGESTIONS = ["Famille", "Amis", "VIP", "Partenaires", "Presse"];
const STAFF_SUGGESTIONS = ["Accueil", "Sécurité", "Coordination", "Technique"];

export function Step5Access({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored = useSetupStore((s) => s.data.step5);
  const updateStep5 = useSetupStore((s) => s.updateStep5);
  const markCompleted = useSetupStore((s) => s.markCompleted);

  const [guestCategories, setGuestCategories] = useState<string[]>(
    stored.guestCategories ?? [],
  );
  const [staffCategories, setStaffCategories] = useState<string[]>(
    stored.staffCategories ?? [],
  );

  const value = { guestCategories, staffCategories };

  useAutosave({
    value,
    enabled: Boolean(eventId),
    save: (v) => setupApi.saveStep(eventId as string, 5, v),
  });

  const onNext = () => {
    updateStep5(value);
    markCompleted(5);
    onCompleted();
  };

  return (
    <div className="es-wizard-step es-animate-in">
      <div className="es-field">
        <label className="es-label" htmlFor="guestCategories">
          Catégories d&apos;invités
        </label>
        <p className="es-hint">
          Regroupez vos invités (ex : Famille, VIP) pour faciliter la gestion.
        </p>
        <TagInput
          id="guestCategories"
          values={guestCategories}
          onChange={(v) => {
            setGuestCategories(v);
            updateStep5({ guestCategories: v });
          }}
          placeholder="Ajouter une catégorie d'invités…"
          suggestions={GUEST_SUGGESTIONS}
        />
      </div>

      <div className="es-field">
        <label className="es-label" htmlFor="staffCategories">
          Catégories de staff
        </label>
        <p className="es-hint">
          Définissez les rôles opérationnels (ex : Accueil, Sécurité).
        </p>
        <TagInput
          id="staffCategories"
          values={staffCategories}
          onChange={(v) => {
            setStaffCategories(v);
            updateStep5({ staffCategories: v });
          }}
          placeholder="Ajouter une catégorie de staff…"
          suggestions={STAFF_SUGGESTIONS}
        />
      </div>

      <StepFooter onBack={onBack} onNext={onNext} optional onSkip={onNext} />
    </div>
  );
}
