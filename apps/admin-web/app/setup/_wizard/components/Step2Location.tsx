"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Values } from "../schemas";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { localInputToIso } from "../lib";
import { StepFooter } from "./StepFooter";
import type { Step2Data } from "../types";

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

function toPayload(v: Step2Values): Step2Data {
  return {
    location: v.location || undefined,
    city: v.city || undefined,
    country: v.country || undefined,
    timezone: v.timezone || undefined,
    startDate: localInputToIso(v.startDate) as string,
    endDate: localInputToIso(v.endDate),
  };
}

export function Step2Location({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored = useRef(useSetupStore.getState().data.step2).current;
  const updateStep2 = useSetupStore((s) => s.updateStep2);
  const markCompleted = useSetupStore((s) => s.markCompleted);
  const setSaving = useSetupStore((s) => s.setSaving);
  const setSaved = useSetupStore((s) => s.setSaved);
  const setSaveError = useSetupStore((s) => s.setSaveError);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      location: stored.location ?? "",
      city: stored.city ?? "",
      country: stored.country ?? "",
      timezone:
        stored.timezone ||
        (typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : ""),
      startDate: stored.startDate ?? "",
      endDate: stored.endDate ?? "",
    },
  });

  const values = watch();

  useEffect(() => {
    const sub = watch((v) => updateStep2(v as Partial<Step2Data>));
    return () => sub.unsubscribe();
  }, [watch, updateStep2]);

  const valid = step2Schema.safeParse(values).success;

  useAutosave({
    value: values,
    enabled: Boolean(eventId) && valid,
    save: (v) => setupApi.saveStep(eventId as string, 2, toPayload(v as Step2Values)),
  });

  const onNext = handleSubmit(async (data) => {
    if (!eventId) return;
    setSaving(true);
    try {
      await setupApi.saveStep(eventId, 2, toPayload(data));
      setSaved();
      markCompleted(2);
      onCompleted();
    } catch (e) {
      setSaveError((e as { message?: string }).message ?? "Échec de l'enregistrement.");
    }
  });

  return (
    <div className="es-wizard-step es-animate-in">
      <div className="es-field">
        <label className="es-label" htmlFor="location">
          Lieu
        </label>
        <input
          id="location"
          className="es-input"
          placeholder="ex : Palais des Congrès"
          {...register("location")}
        />
      </div>

      <div className="es-grid-2">
        <div className="es-field">
          <label className="es-label" htmlFor="city">
            Ville
          </label>
          <input id="city" className="es-input" placeholder="Paris" {...register("city")} />
        </div>
        <div className="es-field">
          <label className="es-label" htmlFor="country">
            Pays
          </label>
          <input id="country" className="es-input" placeholder="France" {...register("country")} />
        </div>
      </div>

      <div className="es-field">
        <label className="es-label" htmlFor="timezone">
          Fuseau horaire
        </label>
        <input
          id="timezone"
          className="es-input es-mono"
          placeholder="Europe/Paris"
          {...register("timezone")}
        />
      </div>

      <div className="es-grid-2">
        <div className="es-field">
          <label className="es-label" htmlFor="startDate">
            Date de début <span className="es-req">*</span>
          </label>
          <input
            id="startDate"
            type="datetime-local"
            className="es-input"
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="es-error-text">{errors.startDate.message}</p>
          )}
        </div>
        <div className="es-field">
          <label className="es-label" htmlFor="endDate">
            Date de fin
          </label>
          <input
            id="endDate"
            type="datetime-local"
            className="es-input"
            {...register("endDate")}
          />
          {errors.endDate && (
            <p className="es-error-text">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} busy={isSubmitting} />
    </div>
  );
}
