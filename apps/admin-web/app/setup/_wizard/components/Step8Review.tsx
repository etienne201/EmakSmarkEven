"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, Loader2, Eye, Layout, RefreshCw } from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { step1Schema, step2Schema } from "../schemas";
import { EVENT_TYPE_LABELS, MODULE_LABELS } from "../lib";
import { StepFooter } from "./StepFooter";

interface Props {
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onCompleted: () => void;
}

export function Step8Review({ onBack, onGoToStep, onCompleted }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const data = useSetupStore((s) => s.data);
  const markCompleted = useSetupStore((s) => s.markCompleted);

  const [design, setDesign] = useState<any>(null);
  const [loadingDesign, setLoadingDesign] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDesign() {
      if (!eventId) return;
      try {
        setLoadingDesign(true);
        const designs = await setupApi.getEventDesigns(eventId);
        if (designs && designs.length > 0) {
          setDesign(designs[0]);
        }
      } catch (err) {
        console.error("Error loading design for review:", err);
      } finally {
        setLoadingDesign(false);
      }
    }
    loadDesign();
  }, [eventId]);

  const step1Valid = step1Schema.safeParse(data.step1).success;

  const getBgColor = () => {
    if (!design || !design.layersData) return "#0d0f12";
    const bg = design.layersData.background;
    if (bg) {
      if (typeof bg === "string") return bg;
      if (typeof bg === "object" && bg.color) return bg.color;
    }
    return "#0d0f12";
  };

  const getFirstText = () => {
    if (!design || !design.layersData) return "Flyer";
    const layers = design.layersData;
    if (layers.elements && layers.elements.length > 0) {
      return layers.elements[0].text || "Flyer";
    }
    if (layers.objects && layers.objects.length > 0) {
      const textObj = layers.objects.find(
        (o: any) => o.type === "i-text" || o.type === "textbox" || o.type === "text",
      );
      return textObj ? textObj.text || "Flyer" : "Flyer";
    }
    return "Flyer";
  };

  const getFirstColor = () => {
    if (!design || !design.layersData) return "var(--accent)";
    const layers = design.layersData;
    if (layers.elements && layers.elements.length > 0) {
      return layers.elements[0].fill || "var(--accent)";
    }
    if (layers.objects && layers.objects.length > 0) {
      const textObj = layers.objects.find(
        (o: any) => o.type === "i-text" || o.type === "textbox" || o.type === "text",
      );
      return textObj ? textObj.fill || "var(--accent)" : "var(--accent)";
    }
    return "var(--accent)";
  };
  const step2Valid = step2Schema.safeParse({
    ...data.step2,
    // Keep original local input value; schema will validate via Date parsing.
    startDate: (data.step2 as any)?.startDate ?? "",
  }).success;

  const blocking = useMemo(() => {
    const items: string[] = [];
    if (!step1Valid) items.push("Infos de base incomplètes.");
    if (!step2Valid) items.push("Dates ou lieu invalides.");
    return items;
  }, [step1Valid, step2Valid]);

  const warnings = useMemo(() => {
    const items: string[] = [];
    const activeModules = Object.entries(data.step3.modules).filter(
      ([, v]) => v,
    ).length;

    if (!design) items.push("Aucun flyer configuré — vous pourrez en créer un plus tard.");
    if (activeModules <= 1) items.push("Aucun module optionnel activé.");
    if (!data.step4.theme) items.push("Aucun thème de branding choisi.");
    if (design?.status === "draft") {
      items.push("Le design du flyer est encore à l'état de brouillon.");
    }

    return items;
  }, [data.step3.modules, data.step4.theme, design]);

  const enabledModules = Object.entries(data.step3.modules)
    .filter(([, v]) => v)
    .map(([k]) => MODULE_LABELS[k]?.label ?? k);

  const finalize = async () => {
    if (!eventId || blocking.length > 0) return;
    setBusy(true);
    setError(null);
    try {
      await setupApi.finalize(eventId);
      markCompleted(8);

      // Refresh store so Step9 can rely on an up-to-date backend state.
      const status = await setupApi.getStatus(eventId);
      useSetupStore.getState().hydrate(status);

      onCompleted();
    } catch (e) {
      setError((e as { message?: string }).message ?? "Échec de la validation.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="es-wizard-step es-animate-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {blocking.length > 0 && (
        <div className="es-alert es-alert--danger">
          <AlertTriangle className="w-4 h-4" />
          <div>
            <strong>Validation bloquée : Informations requises manquantes</strong>
            <ul style={{ fontSize: "12px", marginTop: "4px", paddingLeft: "16px" }}>
              {blocking.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="es-alert es-alert--warning">
          <Info className="w-4 h-4" />
          <div>
            <strong>Recommandations d&apos;amélioration</strong>
            <ul style={{ fontSize: "12px", marginTop: "4px", paddingLeft: "16px" }}>
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Review Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
        {/* Left Side: Summary Check */}
        <div className="es-summary" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <SummaryRow
            step={1}
            ok={step1Valid && step2Valid}
            title="Infos de base"
            onEdit={() => onGoToStep(1)}
          >
            {data.step1.title || "—"}
            {data.step1.eventType
              ? ` · ${EVENT_TYPE_LABELS[data.step1.eventType] ?? data.step1.eventType}`
              : ""}
            {data.step2.city ? ` · ${data.step2.city}` : ""}
          </SummaryRow>

          <SummaryRow
            step={2}
            ok={true}
            title="Modules"
            onEdit={() => onGoToStep(2)}
          >
            {enabledModules.join(", ") || "Aucun (Invités uniquement)"}
          </SummaryRow>

          <SummaryRow
            step="3 & 4"
            ok={!!design}
            title="Templates & Éditeur de flyer"
            onEdit={() => onGoToStep(4)}
          >
            {design ? (
              <span style={{ color: design.status === "final" ? "var(--success)" : "var(--warning)" }}>
                {design.name} ({design.status === "final" ? "Validé" : "Brouillon"})
              </span>
            ) : (
              "Aucun design configuré"
            )}
          </SummaryRow>

          <SummaryRow
            step={5}
            ok={true}
            title="Branding & Design"
            onEdit={() => onGoToStep(5)}
          >
            {data.step4.theme || "Thème par défaut"}
          </SummaryRow>

          <SummaryRow
            step={6}
            ok={true}
            title="Contenu additionnel"
            onEdit={() => onGoToStep(6)}
          >
            {data.step6.description ? "Description rédigée" : "Aucun contenu personnalisé"}
          </SummaryRow>

          <SummaryRow
            step={7}
            ok={true}
            title="Invités & Accès"
            onEdit={() => onGoToStep(7)}
          >
            {(data.step5.guestCategories ?? []).length} catégorie(s) d&apos;invités ·{" "}
            {(data.step5.staffCategories ?? []).length} rôle(s) de staff
          </SummaryRow>

        </div>

        {/* Right Side: Mandatory Design Preview Panel */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <span className="es-eyebrow" style={{ alignSelf: "flex-start" }}>Aperçu du Flyer</span>

          {loadingDesign ? (
            <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Loader2 className="w-6 h-6 es-spin" />
            </div>
          ) : design ? (
            <>
              {/* Thumbnail representation */}
              <div
                style={{
                  width: "180px",
                  height: "240px",
                  background: getBgColor(),
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* UX-03 FIX: Priorité thumbnailUrl (URL serveur) > thumbnail (base64) > fallback explicite */}
                {(design.layersData?.thumbnailUrl || design.layersData?.thumbnail) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={design.layersData.thumbnailUrl ?? design.layersData.thumbnail}
                    alt="Aperçu du flyer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "12px",
                      gap: "8px",
                      textAlign: "center",
                    }}
                  >
                    <RefreshCw className="w-5 h-5" style={{ color: "var(--text3)" }} />
                    <div style={{ fontSize: "10px", color: "var(--text3)", lineHeight: 1.4 }}>
                      Aperçu non disponible.
                      <br />
                      Retournez dans l&apos;éditeur (Étape 4) et sauvegardez pour le générer.
                    </div>
                    <button
                      type="button"
                      className="es-btn es-btn--ghost es-btn--sm"
                      onClick={() => onGoToStep(4)}
                      style={{ fontSize: "10px" }}
                    >
                      Ouvrir l&apos;éditeur
                    </button>
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    background: design.status === "final" ? "var(--successbg)" : "var(--warnbg)",
                    color: design.status === "final" ? "var(--success)" : "var(--warning)",
                    fontSize: "9px",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: design.status === "final" ? "1px solid var(--success)" : "1px solid var(--warning)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                >
                  {design.status === "final" ? "FINALISÉ" : "BROUILLON"}
                </span>
              </div>

              <button
                type="button"
                className="es-btn es-btn--secondary es-btn--sm w-full"
                onClick={() => setShowPreviewModal(true)}
              >
                <Eye className="w-4 h-4" /> Agrandir l&apos;aperçu
              </button>
            </>
          ) : (
            <div style={{ height: "240px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--text3)" }}>
              <Layout className="w-8 h-8" />
              <span style={{ fontSize: "12px", textAlign: "center" }}>Aucun flyer n&apos;a été configuré.</span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Modal for Preview */}
      {showPreviewModal && design && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            style={{
              background: getBgColor(),
              width: "450px",
              height: "600px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "40px",
              textAlign: "center",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(design.layersData?.thumbnailUrl || design.layersData?.thumbnail) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={design.layersData.thumbnailUrl ?? design.layersData.thumbnail}
                alt="Aperçu du flyer"
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "4px" }}
              />
            ) : (
              <>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Invitation Officielle</span>
                  <h2 className="es-h2" style={{ marginTop: "24px", color: getFirstColor() }}>
                    {getFirstText()}
                  </h2>
                </div>
                
                <div style={{ borderTop: "1px solid var(--border)", width: "100%", paddingTop: "20px" }}>
                  <p style={{ fontSize: "14px", color: "var(--text2)" }}>{data.step1.title}</p>
                  <p style={{ fontSize: "12px", color: "var(--text3)", marginTop: "6px" }}>{data.step2.location} · {data.step2.city}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="es-error-text">{error}</p>}

      <StepFooter
        onBack={onBack}
        onNext={finalize}
        disabled={blocking.length > 0 || busy}
        busy={busy}
        nextLabel="Valider et continuer"
      />
    </div>
  );
}

function SummaryRow({
  step,
  ok,
  title,
  onEdit,
  children,
}: {
  step: number | string;
  ok: boolean;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="es-summary-row" style={{ display: "flex", alignItems: "center", padding: "12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
      <span className="es-summary-icon" data-ok={ok} style={{ marginRight: "12px" }}>
        {ok ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-danger" />
        )}
      </span>
      <div className="es-summary-content" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <span className="es-summary-title" style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase" }}>
          Étape {step} · {title}
        </span>
        <span className="es-summary-value" style={{ fontSize: "13px", color: "var(--text)", marginTop: "2px" }}>{children}</span>
      </div>
      <button type="button" className="es-btn es-btn--ghost es-btn--sm" onClick={onEdit}>
        Modifier
      </button>
    </div>
  );
}
