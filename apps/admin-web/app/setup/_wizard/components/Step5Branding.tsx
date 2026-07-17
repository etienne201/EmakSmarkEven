"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MapPin, UploadCloud, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
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

export function Step5Branding({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const stored = useRef(useSetupStore.getState().data.step4).current;
  const title = useSetupStore((s) => s.data.step1.title);
  const city = useSetupStore((s) => s.data.step2.city);
  const updateStep4 = useSetupStore((s) => s.updateStep4);
  const markCompleted = useSetupStore((s) => s.markCompleted);

  // BUG-06 FIX: État local pour le chargement des uploads d'images
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<Step4Values>({
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

  /**
   * BUG-06 FIX: Upload l'image via l'API et stocke l'URL (pas le base64).
   * Si l'upload échoue (endpoint absent), fallback temporaire sur le data URL
   * avec un avertissement visuel.
   */
  const onLogoDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploadError(null);
    setLogoUploading(true);
    try {
      const { url } = await setupApi.uploadImage(file, `logo-${file.name}`);
      setValue("logoUrl", url, { shouldValidate: true });
    } catch {
      // Fallback gracieux : utiliser le data URL si l'API upload n'existe pas encore.
      const reader = new FileReader();
      reader.onload = (e) => {
        setValue("logoUrl", e.target?.result as string, { shouldValidate: true });
        setUploadError("Upload serveur indisponible — image stockée temporairement en local. Pensez à configurer l'endpoint /uploads.");
      };
      reader.readAsDataURL(file);
    } finally {
      setLogoUploading(false);
    }
  }, [setValue]);

  const onBannerDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploadError(null);
    setBannerUploading(true);
    try {
      const { url } = await setupApi.uploadImage(file, `banner-${file.name}`);
      setValue("bannerUrl", url, { shouldValidate: true });
    } catch {
      // Fallback gracieux
      const reader = new FileReader();
      reader.onload = (e) => {
        setValue("bannerUrl", e.target?.result as string, { shouldValidate: true });
        setUploadError("Upload serveur indisponible — image stockée temporairement en local. Pensez à configurer l'endpoint /uploads.");
      };
      reader.readAsDataURL(file);
    } finally {
      setBannerUploading(false);
    }
  }, [setValue]);

  const logoDropzone = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: onLogoDrop,
  });

  const bannerDropzone = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: onBannerDrop,
  });

  useEffect(() => {
    const sub = watch((v) => updateStep4(toPayload(v as Step4Values)));
    return () => sub.unsubscribe();
  }, [watch, updateStep4]);

  useAutosave({
    value: values,
    enabled: Boolean(eventId) && step4Schema.safeParse(values).success,
    save: (v) => setupApi.saveStep(eventId as string, 4, toPayload(v as Step4Values)),
  });

  const onNext = handleSubmit(async (data) => {
    if (eventId) {
      try {
        await setupApi.saveStep(eventId, 4, toPayload(data));
      } catch (e) {
        console.error("Erreur sauvegarde branding:", e);
      }
    }
    markCompleted(5);
    onCompleted();
  });

  return (
    <div className="es-wizard-step es-animate-in">
      {uploadError && (
        <div className="es-alert es-alert--warning" style={{ marginBottom: "16px", fontSize: "12px" }}>
          <AlertCircle className="w-4 h-4" style={{ flexShrink: 0 }} />
          <span>{uploadError}</span>
        </div>
      )}
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
            <label className="es-label">Logo de l&apos;événement</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "stretch", marginBottom: "8px" }}>
              <div
                {...logoDropzone.getRootProps()}
                style={{
                  flexGrow: 1,
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  textAlign: "center",
                  cursor: logoUploading ? "wait" : "pointer",
                  background: logoDropzone.isDragActive ? "var(--accentbg)" : "transparent",
                  borderColor: logoDropzone.isDragActive ? "var(--accent)" : "var(--border)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "80px",
                }}
              >
                <input {...logoDropzone.getInputProps()} disabled={logoUploading} />
                {logoUploading ? (
                  <Loader2 className="w-5 h-5 es-spin text-accent" style={{ marginBottom: "4px" }} />
                ) : (
                  <UploadCloud className="w-5 h-5 text-accent" style={{ marginBottom: "4px" }} />
                )}
                <span style={{ fontSize: "11px", color: "var(--text2)" }}>
                  {logoUploading ? "Upload en cours…" : logoDropzone.isDragActive ? "Déposez ici..." : "Glissez un logo ou cliquez"}
                </span>
              </div>
              {values.logoUrl && (
                <button
                  type="button"
                  className="es-btn"
                  style={{
                    background: "var(--dangerbg)",
                    color: "var(--danger)",
                    border: "1px solid var(--danger)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                  }}
                  onClick={() => setValue("logoUrl", "", { shouldValidate: true })}
                  title="Supprimer le logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <label className="es-label" htmlFor="logoUrl" style={{ fontSize: "10px", color: "var(--text3)", display: "block", marginBottom: "4px" }}>
                Ou saisir une URL de logo
              </label>
              <input
                id="logoUrl"
                className="es-input"
                placeholder="https://…/logo.png"
                {...register("logoUrl")}
              />
              {errors.logoUrl && (
                <p style={{ color: "var(--danger)", fontSize: "11px", marginTop: "4px" }}>
                  {errors.logoUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="es-field">
            <label className="es-label">Bannière de l&apos;événement</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "stretch", marginBottom: "8px" }}>
              <div
                {...bannerDropzone.getRootProps()}
                style={{
                  flexGrow: 1,
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  textAlign: "center",
                  cursor: bannerUploading ? "wait" : "pointer",
                  background: bannerDropzone.isDragActive ? "var(--accentbg)" : "transparent",
                  borderColor: bannerDropzone.isDragActive ? "var(--accent)" : "var(--border)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "80px",
                }}
              >
                <input {...bannerDropzone.getInputProps()} disabled={bannerUploading} />
                {bannerUploading ? (
                  <Loader2 className="w-5 h-5 es-spin text-accent" style={{ marginBottom: "4px" }} />
                ) : (
                  <UploadCloud className="w-5 h-5 text-accent" style={{ marginBottom: "4px" }} />
                )}
                <span style={{ fontSize: "11px", color: "var(--text2)" }}>
                  {bannerUploading ? "Upload en cours…" : bannerDropzone.isDragActive ? "Déposez ici..." : "Glissez une bannière ou cliquez"}
                </span>
              </div>
              {values.bannerUrl && (
                <button
                  type="button"
                  className="es-btn"
                  style={{
                    background: "var(--dangerbg)",
                    color: "var(--danger)",
                    border: "1px solid var(--danger)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                  }}
                  onClick={() => setValue("bannerUrl", "", { shouldValidate: true })}
                  title="Supprimer la bannière"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <label className="es-label" htmlFor="bannerUrl" style={{ fontSize: "10px", color: "var(--text3)", display: "block", marginBottom: "4px" }}>
                Ou saisir une URL de bannière
              </label>
              <input
                id="bannerUrl"
                className="es-input"
                placeholder="https://…/banner.jpg"
                {...register("bannerUrl")}
              />
              {errors.bannerUrl && (
                <p style={{ color: "var(--danger)", fontSize: "11px", marginTop: "4px" }}>
                  {errors.bannerUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="es-branding-preview" aria-label="Prévisualisation">
          <span className="es-eyebrow">Prévisualisation du Thème</span>
          <div
            className="es-preview-card"
            style={{ ["--es-preview-accent" as string]: primary }}
          >
            <div
              className="es-preview-banner"
              style={
                values.bannerUrl
                  ? { backgroundImage: `url("${values.bannerUrl}")` }
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
