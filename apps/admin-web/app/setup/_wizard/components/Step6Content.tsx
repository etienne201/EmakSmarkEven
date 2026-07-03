"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Calendar, Clock } from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { StepFooter } from "./StepFooter";

const contentSchema = z.object({
  description: z.string().max(5000, "La description ne doit pas dépasser 5000 caractères."),
  agenda: z.string().optional().or(z.literal("")),
  extraText: z.string().optional().or(z.literal("")),
});

type ContentValues = z.infer<typeof contentSchema>;

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

export function Step6Content({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored1 = useRef(useSetupStore.getState().data.step1).current;
  const stored6 = useRef(useSetupStore.getState().data.step6).current;
  const updateStep1 = useSetupStore((s) => s.updateStep1);
  const updateStep6 = useSetupStore((s) => s.updateStep6);
  const markCompleted = useSetupStore((s) => s.markCompleted);

  const { register, watch, handleSubmit, formState: { errors } } = useForm<ContentValues>({
    resolver: zodResolver(contentSchema),
    mode: "onChange",
    defaultValues: {
      description: stored1.description ?? stored6.description ?? "",
      agenda: stored6.agenda ?? "",
      extraText: stored6.extraText ?? "",
    },
  });

  const values = watch();

  useEffect(() => {
    const sub = watch((v) => {
      updateStep1({ description: v.description });
      updateStep6({
        description: v.description || "",
        agenda: v.agenda || "",
        extraText: v.extraText || "",
      });
    });
    return () => sub.unsubscribe();
  }, [watch, updateStep1, updateStep6]);

  useAutosave({
    value: values,
    enabled: Boolean(eventId),
    save: async (v: any) => {
      // Save description to Step 1 backend data
      await setupApi.saveStep(eventId as string, 1, {
        ...stored1,
        description: v.description,
      } as any);
    },
  });

  const onNext = handleSubmit(async (data) => {
    if (!eventId) return;
    try {
      await setupApi.saveStep(eventId, 1, {
        ...stored1,
        description: data.description,
      } as any);
      markCompleted(6);
      onCompleted();
    } catch (e) {
      console.error("Error saving content:", e);
    }
  });

  return (
    <div className="es-wizard-step es-animate-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="es-field">
        <label className="es-label" htmlFor="description">
          Description principale de l&apos;événement
        </label>
        <textarea
          id="description"
          className="es-textarea"
          rows={6}
          placeholder="Décrivez votre événement en détail. Ce texte sera visible sur la page d'accueil de vos invités..."
          {...register("description")}
        />
        {errors.description && <p className="es-error-text">{errors.description.message}</p>}
      </div>

      <div className="es-field">
        <label className="es-label" htmlFor="agenda">
          Programme / Agenda (Optionnel)
        </label>
        <textarea
          id="agenda"
          className="es-textarea"
          rows={4}
          placeholder="Déroulement de l'événement (ex: 18h00 Accueil, 19h30 Dîner, 21h30 Soirée...)"
          {...register("agenda")}
        />
      </div>

      <div className="es-field">
        <label className="es-label" htmlFor="extraText">
          Informations pratiques (Optionnel)
        </label>
        <textarea
          id="extraText"
          className="es-textarea"
          rows={3}
          placeholder="Code vestimentaire, parking, hébergement, consignes particulières..."
          {...register("extraText")}
        />
      </div>

      <StepFooter onBack={onBack} onNext={onNext} optional onSkip={onNext} />
    </div>
  );
}
