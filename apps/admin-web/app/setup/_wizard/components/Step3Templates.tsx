"use client";

import { useEffect, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!eventId) return;
      try {
        setLoading(true);
        // 1. Fetch templates
        const tmps = await setupApi.getDesignTemplates(eventType);
        setTemplates(tmps || []);

        // 2. Fetch existing designs to see if one exists
        const designs = await setupApi.getEventDesigns(eventId);
        if (designs && designs.length > 0) {
          setExistingDesignId(designs[0].id);
          if (designs[0].baseTemplateId) {
            setSelectedId(designs[0].baseTemplateId);
          } else {
            setSelectedId("blank");
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
  }, [eventId]);

  const handleSelect = async (template: Template | "blank") => {
    if (!eventId) return;
    setSubmitting(true);
    setSaving(true);
    try {
      if (existingDesignId) {
        // Update existing design
        const layers = template === "blank" ? { background: { color: "#0d0f12" }, elements: [] } : template.layersData;
        await setupApi.updateDesign(existingDesignId, {
          name: template === "blank" ? "Design Vierge" : template.name,
          layersData: layers,
        });
      } else {
        // Create new design
        const layers = template === "blank" ? { background: { color: "#0d0f12" }, elements: [] } : template.layersData;
        const res = await setupApi.createDesign(eventId, {
          name: template === "blank" ? "Design Vierge" : template.name,
          sourceType: template === "blank" ? "blank" : "template",
          layersData: layers,
          baseTemplateId: template === "blank" ? undefined : template.id,
        });
        setExistingDesignId(res.id);
      }
      setSelectedId(template === "blank" ? "blank" : template.id);
      setSaved();
      markCompleted(3);
      onCompleted();
    } catch (err) {
      console.error("Error saving design template choice:", err);
      setSaveError("Échec de l'association du modèle.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (selectedId) {
      markCompleted(3);
      onCompleted();
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

      <div className="es-template-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {/* Card for Blank Design */}
        <div
          className="es-template-card"
          data-selected={selectedId === "blank"}
          onClick={() => !submitting && handleSelect("blank")}
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
            position: "relative"
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

        {/* List of templates */}
        {templates.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <div
              key={t.id}
              className="es-template-card"
              data-selected={isSelected}
              onClick={() => !submitting && handleSelect(t)}
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
                position: "relative"
              }}
            >
              {isSelected && (
                <span style={{ position: "absolute", top: "12px", right: "12px", background: "var(--accent)", color: "#fff", borderRadius: "50%", padding: "4px", zIndex: 2 }}>
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
              <div
                style={{
                  height: "200px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${t.previewUrl})`,
                  backgroundColor: "var(--bg3)",
                  position: "relative"
                }}
              >
                {t.isPremium && (
                  <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "var(--gold)", color: "#000", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" }}>
                    PREMIUM
                  </span>
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
