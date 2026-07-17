"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  HelpCircle,
  Calendar,
  MapPin,
} from "lucide-react";
import { EVENT_TYPES, VISIBILITIES } from "../schemas";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { slugify, EVENT_TYPE_LABELS, VISIBILITY_LABELS, localInputToIso } from "../lib";
import { StepFooter } from "./StepFooter";
import type { Step1Data, Step2Data, EventTypeKey } from "../types";

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

const combinedSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères.")
    .max(255, "Le titre est trop long (255 max)."),
  slug: z
    .string()
    .min(1, "Le slug est requis.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Minuscules uniquement, sans espaces (lettres, chiffres, tirets)."
    ),
  description: z.string().max(5000).optional().or(z.literal("")),
  eventType: z.enum(EVENT_TYPES, {
    message: "Sélectionnez un type d'événement.",
  }),
  language: z.string().max(10).optional(),
  visibility: z.enum(VISIBILITIES).optional(),
  location: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  timezone: z.string().max(100).optional().or(z.literal("")),
  startDate: z.string().min(1, "La date de début est requise."),
  endDate: z.string().optional().or(z.literal("")),
}).refine(
  (v) => !v.endDate || new Date(v.endDate) > new Date(v.startDate),
  {
    path: ["endDate"],
    message: "La date de fin doit être postérieure à la date de début.",
  }
);

type CombinedValues = z.infer<typeof combinedSchema>;

interface Props {
  onCompleted: () => void;
}

export function Step1BaseInfo({ onCompleted }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored1 = useRef(useSetupStore.getState().data.step1).current;
  const stored2 = useRef(useSetupStore.getState().data.step2).current;
  const updateStep1 = useSetupStore((s) => s.updateStep1);
  const updateStep2 = useSetupStore((s) => s.updateStep2);
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
  } = useForm<CombinedValues>({
    resolver: zodResolver(combinedSchema),
    mode: "onChange",
    defaultValues: {
      title: stored1.title ?? "",
      slug: stored1.slug ?? "",
      description: stored1.description ?? "",
      eventType: stored1.eventType,
      language: stored1.language ?? "fr",
      visibility: stored1.visibility ?? "private",
      location: stored2.location ?? "",
      city: stored2.city ?? "",
      country: stored2.country ?? "",
      timezone:
        stored2.timezone ||
        (typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : ""),
      startDate: stored2.startDate ?? "",
      endDate: stored2.endDate ?? "",
    },
  });

  const values = watch();
  const slugTouched = useRef(Boolean(stored1.slug));

  useEffect(() => {
    if (!slugTouched.current && values.title) {
      setValue("slug", slugify(values.title), { shouldValidate: true });
    }
  }, [values.title, setValue]);

  useEffect(() => {
    const sub = watch((v) => {
      updateStep1({
        title: v.title,
        slug: v.slug,
        description: v.description,
        eventType: v.eventType,
        language: v.language,
        visibility: v.visibility,
      });
      updateStep2({
        location: v.location,
        city: v.city,
        country: v.country,
        timezone: v.timezone,
        startDate: v.startDate,
        endDate: v.endDate,
      });
    });
    return () => sub.unsubscribe();
  }, [watch, updateStep1, updateStep2]);

  const valid = combinedSchema.safeParse(values).success;

  // TECH-03 FIX: Wrapper save dans useCallback pour que la référence de la
  // fonction soit stable entre les renders. Sans ça, chaque frappe créait un
  // nouvel objet fonction → le tableau de dépendances de useEffect (useAutosave)
  // changeait à chaque render → le timer de debounce se réinitialisait.
  const save = useCallback(async (v: CombinedValues) => {
    if (!eventId) return;
    await setupApi.saveStep(eventId, 1, {
      title: v.title,
      slug: v.slug,
      description: v.description,
      eventType: v.eventType,
      language: v.language,
      visibility: v.visibility,
    } as Step1Data);
    await setupApi.saveStep(eventId, 2, {
      location: v.location,
      city: v.city,
      country: v.country,
      timezone: v.timezone,
      startDate: localInputToIso(v.startDate) as string,
      endDate: localInputToIso(v.endDate),
    } as Step2Data);
  }, [eventId]);

  useAutosave({
    value: values,
    enabled: Boolean(eventId) && valid,
    save,
  });

  const onNext = handleSubmit(async (data) => {
    if (!eventId) return;
    setSaving(true);
    try {
      await save(data);
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
          <div className="es-type-grid" style={{ maxHeight: "160px", overflowY: "auto", border: "1px solid var(--border)", padding: "10px", borderRadius: "var(--radius)" }}>
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

      <div className="es-grid-2">
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
