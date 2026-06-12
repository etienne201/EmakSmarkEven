"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MapPin } from "lucide-react";
import { step4Schema, type Step4Values } from "../schemas";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { useAutosave } from "../useAutosave";
import { StepFooter } from "./StepFooter";
import type { Step4Data } from "../types";

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

const THEMES = [
  { id: "elegant-gold", label: "Élégant Or", primary: "#bfa14a" },
  { id: "emerald", label: "Émeraude", primary: "#2d6a4f" },
  { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  { id: "rose", label: "Rose", primary: "#be185d" },
  { id: "slate", label: "Ardoise", primary: "#334155" },
];

function toPayload(v: Step4Values): Step4Data {
  return {
    theme: v.theme || undefined,
    colors: v.colors?.primary ? { primary: v.colors.primary } : undefined,
    logoUrl: v.logoUrl || undefined,
    bannerUrl: v.bannerUrl || undefined,
  };
}

export function Step4Branding({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored = useRef(useSetupStore.getState().data.step4).current;
  const title = useSetupStore((s) => s.data.step1.title);
  const city = useSetupStore((s) => s.data.step2.city);
  const updateStep4 = useSetupStore((s) => s.updateStep4);
  const markCompleted = useSetupStore((s) => s.markCompleted);

  const { register, watch, setValue, handleSubmit } = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    mode: "onChange",
    defaultValues: {
      theme: stored.theme ?? "elegant-gold",
      colors: { primary: stored.colors?.primary ?? "#bfa14a" },
      logoUrl: stored.logoUrl ?? "",
      bannerUrl: stored.bannerUrl ?? "",
    },
  });

  const values = watch();
  const primary = values.colors?.primary ?? "#bfa14a";

  useEffect(() => {
    const sub = watch((v) => updateStep4(toPayload(v as Step4Values)));
    return () => sub.unsubscribe();
  }, [watch, updateStep4]);

  useAutosave({
    value: values,
    enabled: Boolean(eventId) && step4Schema.safeParse(values).success,
    save: (v) => setupApi.saveStep(eventId as string, 4, toPayload(v as Step4Values)),
  });

  const onNext = handleSubmit(() => {
    markCompleted(4);
    onCompleted();
  });

  return (
    <div className="es-wizard-step es-animate-in">
      <div className="es-branding-layout">
        <div className="es-branding-form">
          <div className="es-field">
            <label className="es-label">Thème</label>
            <div className="es-theme-row">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="es-theme-chip es-focusable"
                  data-active={values.theme === t.id}
                  onClick={() => {
                    setValue("theme", t.id, { shouldValidate: true });
                    setValue("colors.primary", t.primary, { shouldValidate: true });
                  }}
                >
                  <span
                    className="es-theme-swatch"
                    style={{ background: t.primary }}
                    aria-hidden
                  />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="es-field">
            <label className="es-label" htmlFor="primary">
              Couleur principale
            </label>
            <div className="es-color-input">
              <input
                id="primary"
                type="color"
                className="es-color-swatch"
                {...register("colors.primary")}
              />
              <input
                className="es-input es-mono"
                value={primary}
                onChange={(e) =>
                  setValue("colors.primary", e.target.value, { shouldValidate: true })
                }
              />
            </div>
          </div>

          <div className="es-field">
            <label className="es-label" htmlFor="logoUrl">
              Logo (URL)
            </label>
            <input
              id="logoUrl"
              className="es-input"
              placeholder="https://…/logo.png"
              {...register("logoUrl")}
            />
          </div>

          <div className="es-field">
            <label className="es-label" htmlFor="bannerUrl">
              Bannière (URL)
            </label>
            <input
              id="bannerUrl"
              className="es-input"
              placeholder="https://…/banner.jpg"
              {...register("bannerUrl")}
            />
          </div>
        </div>

        <div className="es-branding-preview" aria-label="Prévisualisation">
          <span className="es-eyebrow">Prévisualisation</span>
          <div
            className="es-preview-card"
            style={{ ["--es-preview-accent" as string]: primary }}
          >
            <div
              className="es-preview-banner"
              style={
                values.bannerUrl
                  ? { backgroundImage: `url(${values.bannerUrl})` }
                  : { background: `linear-gradient(135deg, ${primary}, #11182722)` }
              }
            >
              {values.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.logoUrl} alt="" className="es-preview-logo" />
              ) : (
                <span className="es-preview-logo-fallback">LOGO</span>
              )}
            </div>
            <div className="es-preview-body">
              <h3 className="es-preview-title">{title || "Titre de l'événement"}</h3>
              <p className="es-preview-meta">
                <Calendar className="w-3.5 h-3.5" aria-hidden /> À venir
                <MapPin className="w-3.5 h-3.5" aria-hidden /> {city || "Lieu"}
              </p>
              <span className="es-preview-cta" style={{ background: primary }}>
                Répondre à l&apos;invitation
              </span>
            </div>
          </div>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} optional onSkip={onNext} />
    </div>
  );
}
