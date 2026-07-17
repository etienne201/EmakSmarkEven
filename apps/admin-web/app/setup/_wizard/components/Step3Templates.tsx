"use client";

import { useEffect, useState, useCallback } from "react";
import { LayoutTemplate, Loader2, AlertCircle, FilePlus, ChevronRight, Check } from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { StepFooter } from "./StepFooter";

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  eventType?: string;
  style?: string;
  previewUrl: string;
  layersData: any;
  isPremium: boolean;
}

// BUG-03 FIX: Séparer "sélection" (highlight) et "validation" (save + navigate).
// L'ancienne implémentation appelait onCompleted() directement dans handleSelect(),
// ce qui éjectait l'utilisateur vers l'étape 4 dès le premier clic sur un template,
// sans lui laisser le temps de comparer les options ou de cliquer "Valider".

export function Step3Templates({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const eventType = useSetupStore((s) => s.data.step1.eventType);
  const markCompleted = useSetupStore((s) => s.markCompleted);
  const setSaving = useSetupStore((s) => s.setSaving);
  const setSaved = useSetupStore((s) => s.setSaved);
  const setSaveError = useSetupStore((s) => s.setSaveError);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingDesignId, setExistingDesignId] = useState<string | null>(null);
  // selectedId : l'ID visuellement sélectionné (highlight uniquement)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // pendingTemplate : la valeur à sauvegarder quand l'utilisateur clique "Valider et continuer"
  const [pendingTemplate, setPendingTemplate] = useState<Template | "blank" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Lightbox UX-04 : afficher l'aperçu en plein écran
  const [lightboxTemplate, setLightboxTemplate] = useState<Template | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!eventId) return;
      try {
        setLoading(true);
        const tmps = await setupApi.getDesignTemplates(eventType);
        setTemplates(tmps || []);

        const designs = await setupApi.getEventDesigns(eventId);
        if (designs && designs.length > 0) {
          setExistingDesignId(designs[0].id);
          if (designs[0].baseTemplateId) {
            setSelectedId(designs[0].baseTemplateId);
            // Tenter de retrouver le template correspondant pour pendingTemplate
            // (sera remplacé dès que l'utilisateur interagit)
          } else {
            setSelectedId("blank");
            setPendingTemplate("blank");
          }
        }
      } catch (err) {
        console.error("Error loading templates:", err);
        setError("Impossible de charger les modèles de design.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [eventId, eventType]);

  // Mise à jour de pendingTemplate une fois les templates chargés, si un design existant est détecté
  useEffect(() => {
    if (selectedId && selectedId !== "blank" && templates.length > 0 && pendingTemplate === null) {
      const found = templates.find((t) => t.id === selectedId);
      if (found) setPendingTemplate(found);
    }
  }, [selectedId, templates, pendingTemplate]);

  /**
   * handleSelect — met à jour le highlight uniquement, ne sauvegarde pas, ne navigue pas.
   */
  const handleSelect = (template: Template | "blank") => {
    const id = template === "blank" ? "blank" : template.id;
    setSelectedId(id);
    setPendingTemplate(template);
  };

  /**
   * doSave — sauvegarde le template sélectionné via l'API.
   * Appelé uniquement depuis handleNext().
   */
  const doSave = useCallback(async (template: Template | "blank") => {
    if (!eventId) return;
    setSubmitting(true);
    setSaving(true);
    try {
      const layers =
        template === "blank"
          ? { background: { color: "#0d0f12" }, elements: [] }
          : template.layersData;
      const name = template === "blank" ? "Design Vierge" : template.name;

      if (existingDesignId) {
        await setupApi.updateDesign(existingDesignId, { name, layersData: layers });
      } else {
        const res = await setupApi.createDesign(eventId, {
          name,
          sourceType: template === "blank" ? "blank" : "template",
          layersData: layers,
          baseTemplateId: template === "blank" ? undefined : template.id,
        });
        setExistingDesignId(res.id);
      }
      setSaved();
    } catch (err) {
      console.error("Error saving design template choice:", err);
      setSaveError("Échec de l'association du modèle.");
      throw err; // Remonter pour que handleNext ne navigue pas
    } finally {
      setSubmitting(false);
    }
  }, [eventId, existingDesignId, setSaving, setSaved, setSaveError]);

  /**
   * handleNext — sauvegarde et navigue. C'est l'UNIQUE point de navigation.
   */
  const handleNext = async () => {
    if (!pendingTemplate) return;
    try {
      await doSave(pendingTemplate);
      markCompleted(3);
      onCompleted();
    } catch {
      // Erreur déjà gérée dans doSave (setSaveError). Ne pas naviguer.
    }
  };

  if (loading) {
    return (
      <div className="es-wizard-step es-wizard-center">
        <Loader2 className="w-6 h-6 es-spin" aria-hidden />
        <p className="es-subtle">Chargement des modèles graphiques…</p>
      </div>
    );
  }

  return (
    <div className="es-wizard-step es-animate-in">
      {error && (
        <div className="es-alert es-alert--warning" style={{ marginBottom: "20px" }}>
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {existingDesignId && (
        <div className="es-alert es-alert--info" style={{ marginBottom: "20px", background: "rgba(108, 99, 255, 0.08)", borderColor: "var(--accent)" }}>
          <LayoutTemplate className="w-4 h-4 text-accent" />
          <div>
            <strong>Design existant détecté</strong>
            <p className="es-subtle" style={{ fontSize: "12px", marginTop: "2px" }}>
              Vous avez déjà configuré un design pour cet événement. Choisir un nouveau modèle remplacera vos modifications actuelles dans l&apos;éditeur de flyer.
            </p>
          </div>
        </div>
      )}

      <div
        className="es-template-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px" }}
      >
        {/* Carte "Design Vierge" */}
        <div
          className="es-template-card"
          data-selected={selectedId === "blank"}
          onClick={() => handleSelect("blank")}
          style={{
            border: selectedId === "blank" ? "2px solid var(--accent)" : "1px dashed var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--bg2)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            position: "relative",
          }}
        >
          {selectedId === "blank" && (
            <span style={{ position: "absolute", top: "12px", right: "12px", background: "var(--accent)", color: "#fff", borderRadius: "50%", padding: "4px" }}>
              <Check className="w-3.5 h-3.5" />
            </span>
          )}
          <FilePlus className="w-10 h-10 text-accent" style={{ marginBottom: "16px" }} />
          <h3 className="es-h3" style={{ fontSize: "16px", marginBottom: "8px", textAlign: "center" }}>Créer à partir de zéro</h3>
          <p className="es-subtle" style={{ fontSize: "12px", textAlign: "center" }}>
            Commencez avec un canvas vierge 1080x1440 et concevez votre flyer vous-même.
          </p>
        </div>

        {/* Liste des templates */}
        {templates.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <div
              key={t.id}
              className="es-template-card"
              data-selected={isSelected}
              onClick={() => handleSelect(t)}
              style={{
                border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: "var(--radius)",
                background: "var(--bg2)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {isSelected && (
                <span style={{ position: "absolute", top: "12px", right: "12px", background: "var(--accent)", color: "#fff", borderRadius: "50%", padding: "4px", zIndex: 2 }}>
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}

              {/* Aperçu image */}
              <div
                style={{
                  height: "200px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${t.previewUrl})`,
                  backgroundColor: "var(--bg3)",
                  position: "relative",
                }}
              >
                {t.isPremium && (
                  <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "var(--gold)", color: "#000", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" }}>
                    PREMIUM
                  </span>
                )}
                {/* UX-04: Bouton aperçu plein écran (lightbox) */}
                {t.previewUrl && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setLightboxTemplate(t); }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "10px",
                      padding: "3px 7px",
                      cursor: "pointer",
                      zIndex: 2,
                      backdropFilter: "blur(4px)",
                    }}
                    title="Voir en plein écran"
                  >
                    🔍 Aperçu
                  </button>
                )}
              </div>
              <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 className="es-h3" style={{ fontSize: "15px", marginBottom: "4px" }}>{t.name}</h3>
                  <span className="es-subtle" style={{ fontSize: "11px", background: "var(--surface)", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>
                    {t.style || "Standard"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* UX-04: Lightbox aperçu plein écran */}
      {lightboxTemplate && (
        <div
          onClick={() => setLightboxTemplate(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.90)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              maxWidth: "600px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            }}
          >
            <img
              src={lightboxTemplate.previewUrl}
              alt={lightboxTemplate.name}
              style={{ width: "100%", display: "block" }}
            />
            <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: "bold", color: "var(--text)" }}>{lightboxTemplate.name}</p>
                <p className="es-subtle" style={{ fontSize: "12px" }}>{lightboxTemplate.style || "Standard"}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="es-btn es-btn--secondary"
                  onClick={() => setLightboxTemplate(null)}
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="es-btn es-btn--primary"
                  onClick={() => { handleSelect(lightboxTemplate); setLightboxTemplate(null); }}
                >
                  <Check className="w-4 h-4" /> Sélectionner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <StepFooter
        onBack={onBack}
        onNext={handleNext}
        disabled={!selectedId || submitting}
        busy={submitting}
        nextLabel="Valider et continuer"
      />
    </div>
  );
}
