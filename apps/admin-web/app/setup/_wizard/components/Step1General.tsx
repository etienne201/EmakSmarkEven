"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart,
  Cake,
  Mic,
  Sparkles,
  Music,
  Compass,
  Building,
  Users,
  Award,
  Layers,
  HelpCircle
} from "lucide-react";
import { step1Schema, type Step1Values, EVENT_TYPES, VISIBILITIES } from "../schemas";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { slugify, EVENT_TYPE_LABELS, VISIBILITY_LABELS } from "../lib";
import { StepFooter } from "./StepFooter";
import type { Step1Data, EventTypeKey } from "../types";

const EVENT_TYPE_ICONS: Record<EventTypeKey, any> = {
  wedding: Heart,
  birthday: Cake,
  conference: Mic,
  festival: Sparkles,
  concert: Music,
  expo: Compass,
  corporate: Building,
  networking: Users,
  church: Compass,
  gala: Award,
  hybrid: Layers,
  vip: Award,
  other: HelpCircle,
};

interface Props {
  onCompleted: () => void;
}

export function Step1General({ onCompleted }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored = useRef(useSetupStore.getState().data.step1).current;
  const updateStep1 = useSetupStore((s) => s.updateStep1);
  const markCompleted = useSetupStore((s) => s.markCompleted);
  const setSaving = useSetupStore((s) => s.setSaving);
  const setSaved = useSetupStore((s) => s.setSaved);
  const setSaveError = useSetupStore((s) => s.setSaveError);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      title: stored.title ?? "",
      slug: stored.slug ?? "",
      description: stored.description ?? "",
      eventType: stored.eventType,
      language: stored.language ?? "fr",
      visibility: stored.visibility ?? "private",
    },
  });

  const values = watch();
  const slugTouched = useRef(Boolean(stored.slug));

  // Auto-derive slug from title until the user edits the slug manually.
  useEffect(() => {
    if (!slugTouched.current && values.title) {
      setValue("slug", slugify(values.title), { shouldValidate: true });
    }
  }, [values.title, setValue]);

  // Sync into the store via a watch subscription so our own writes never
  // trigger a re-render of this form (avoids an update loop).
  useEffect(() => {
    const sub = watch((v) => updateStep1(v as Partial<Step1Data>));
    return () => sub.unsubscribe();
  }, [watch, updateStep1]);

  const valid = step1Schema.safeParse(values).success;

  useAutosave({
    value: values,
    enabled: Boolean(eventId) && valid,
    save: (v) => setupApi.saveStep(eventId as string, 1, v as Step1Data),
  });

  const onNext = handleSubmit(async (data) => {
    if (!eventId) return;
    setSaving(true);
    try {
      await setupApi.saveStep(eventId, 1, data as Step1Data);
      setSaved();
      markCompleted(1);
      onCompleted();
    } catch (e) {
      setSaveError((e as { message?: string }).message ?? "Échec de l'enregistrement.");
    }
  });

  return (
    <div className="es-wizard-step es-animate-in">
      <div className="es-field">
        <label className="es-label" htmlFor="title">
          Titre de l&apos;événement <span className="es-req">*</span>
        </label>
        <input
          id="title"
          className="es-input"
          placeholder="ex : Mariage Awa & Karim"
          {...register("title")}
        />
        {errors.title && <p className="es-error-text">{errors.title.message}</p>}
      </div>

      <div className="es-grid-2">
        <div className="es-field">
          <label className="es-label" htmlFor="slug">
            Slug (URL) <span className="es-req">*</span>
          </label>
          <input
            id="slug"
            className="es-input es-mono"
            placeholder="mariage-awa-karim"
            {...register("slug", {
              onChange: () => {
                slugTouched.current = true;
              },
            })}
          />
          {errors.slug ? (
            <p className="es-error-text">{errors.slug.message}</p>
          ) : (
            <p className="es-hint">Identifiant unique dans l&apos;URL publique.</p>
          )}
        </div>

        <div className="es-field">
          <label className="es-label">
            Type d&apos;événement <span className="es-req">*</span>
          </label>
          <input type="hidden" {...register("eventType")} />
          <div className="es-type-grid">
            {EVENT_TYPES.map((t) => {
              const Icon = EVENT_TYPE_ICONS[t] || HelpCircle;
              const isSelected = values.eventType === t;
              return (
                <div
                  key={t}
                  className="es-type-card"
                  data-selected={isSelected}
                  onClick={() => setValue("eventType", t, { shouldValidate: true })}
                >
                  <Icon />
                  <span>{EVENT_TYPE_LABELS[t]}</span>
                </div>
              );
            })}
          </div>
          {errors.eventType && (
            <p className="es-error-text">{errors.eventType.message}</p>
          )}
        </div>
      </div>

      <div className="es-grid-2">
        <div className="es-field">
          <label className="es-label" htmlFor="visibility">
            Visibilité
          </label>
          <select id="visibility" className="es-select" {...register("visibility")}>
            {VISIBILITIES.map((v) => (
              <option key={v} value={v}>
                {VISIBILITY_LABELS[v]}
              </option>
            ))}
          </select>
        </div>
        <div className="es-field">
          <label className="es-label" htmlFor="language">
            Langue
          </label>
          <select id="language" className="es-select" {...register("language")}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="es-field">
        <label className="es-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="es-textarea"
          rows={3}
          placeholder="Décrivez votre événement en quelques mots…"
          {...register("description")}
        />
      </div>

      <StepFooter
        hideBack
        onNext={onNext}
        busy={isSubmitting}
        nextLabel="Continuer"
      />
    </div>
  );
}
