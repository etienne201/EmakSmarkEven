"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Loader2,
  Plus,
  Type,
  Square,
  Circle,
  Trash2,
  CheckCircle2,
  Save,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Copy,
  Download,

} from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import { StepFooter } from "./StepFooter";

/* ------------------------------------------------------------------ */
/*  Fabric v7 types (runtime is v7, @types/fabric is v5 – unusable)   */
/* ------------------------------------------------------------------ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricCanvas = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricObject = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricModule = any;

interface Props {
  onCompleted: () => void;
  onBack: () => void;
}

export function Step4FlyerEditor({ onCompleted, onBack }: Props) {
  const eventId = useSetupStore((s) => s.eventId);
  const markCompleted = useSetupStore((s) => s.markCompleted);
  const setSaving = useSetupStore((s) => s.setSaving);
  const setSaved = useSetupStore((s) => s.setSaved);
  const setSaveError = useSetupStore((s) => s.setSaveError);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<FabricCanvas>(null);
  const [fabricRef, setFabricRef] = useState<FabricModule>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject>(null);
  const [bgColor, setBgColor] = useState("#0d0f12");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(32);
  const [designStatus, setDesignStatus] = useState<"draft" | "final">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [objectCount, setObjectCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasInstanceRef = useRef<FabricCanvas>(null);

  const baseWidth = 1080;
  const baseHeight = 1440;
  const zoomFactor = 0.35;

  /* ---------------------------------------------------------------- */
  /*  Helper: update object count after any mutation                   */
  /* ---------------------------------------------------------------- */
  const syncObjectCount = useCallback((fc: FabricCanvas) => {
    if (fc) {
      setObjectCount(fc.getObjects?.()?.length ?? 0);
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Dropzone – Image upload (Fabric v7: fromURL returns Promise)    */
  /* ---------------------------------------------------------------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file || !canvas || !fabricRef) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          // Fabric v7: Image.fromURL is async (Promise-based)
          const image = await fabricRef.Image.fromURL(dataUrl, { crossOrigin: "anonymous" });
          image.set({ left: 100, top: 100 });
          if (image.width && image.width > 200) {
            image.scaleToWidth(200);
          }
          canvas.add(image);
          canvas.setActiveObject(image);
          canvas.renderAll();
          syncObjectCount(canvas);
        } catch (err) {
          console.error("Error adding image to canvas:", err);
        }
      };
      reader.readAsDataURL(file);
    },
  });

  /* ---------------------------------------------------------------- */
  /*  Canvas initialization                                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    let disposed = false;
    let activeCanvas: FabricCanvas = null;

    async function initEditor() {
      if (!eventId) return;
      try {
        setLoading(true);
        setError(null);

        // Load event designs
        const designs = await setupApi.getEventDesigns(eventId);
        let design = designs?.[0];

        if (!design) {
          design = await setupApi.createDesign(eventId, {
            name: "Flyer de l'événement",
            sourceType: "blank",
            layersData: { background: { color: "#0d0f12" }, elements: [] },
          });
        }

        // Normalize layersData if it comes from database template with `{ elements }` format
        let normalizedLayers = design.layersData;
        if (normalizedLayers && normalizedLayers.elements && !normalizedLayers.objects) {
          const objects = normalizedLayers.elements.map((el: any) => {
            if (el.type === "text") {
              return {
                type: "i-text",
                text: el.text || "",
                left: el.left || 100,
                top: el.top || 100,
                fontSize: el.fontSize || 40,
                fill: el.fill || "#ffffff",
                fontFamily: "Outfit, sans-serif",
                version: "7.4.0",
              };
            }
            if (el.type === "rect") {
              return {
                type: "rect",
                left: el.left || 100,
                top: el.top || 100,
                width: el.width || 200,
                height: el.height || 120,
                fill: el.fill || "#6c63ff",
                rx: el.rx || 8,
                ry: el.ry || 8,
                version: "7.4.0",
              };
            }
            if (el.type === "circle") {
              return {
                type: "circle",
                left: el.left || 100,
                top: el.top || 100,
                radius: el.radius || 80,
                fill: el.fill || "#22c55e",
                version: "7.4.0",
              };
            }
            return el;
          });
          normalizedLayers = {
            version: "7.4.0",
            objects,
            background: normalizedLayers.background?.color || "#0d0f12",
          };
        }

        if (disposed) return;

        setDesignId(design.id);
        setDesignStatus(design.status ?? "draft");
        const initialBg = normalizedLayers?.background || "#0d0f12";
        setBgColor(initialBg);

        // Dynamically import fabric on client side
        const fabric = await import("fabric");
        if (disposed) return;

        setFabricRef(fabric);

        if (canvasRef.current) {
          const fc = new fabric.Canvas(canvasRef.current, {
            backgroundColor: initialBg,
            width: baseWidth * zoomFactor,
            height: baseHeight * zoomFactor,
          });

          fc.setZoom(zoomFactor);

          // Fabric v7: loadFromJSON is Promise-based
          if (normalizedLayers && normalizedLayers.objects) {
            // Traverse objects to inject crossOrigin = 'anonymous' for Image types
            normalizedLayers.objects.forEach((obj: any) => {
              if (obj.type === "Image" || obj.type === "image") {
                obj.crossOrigin = "anonymous";
              }
            });
            await fc.loadFromJSON(normalizedLayers);
            fc.renderAll();
          }

          // Handle object selections
          fc.on("selection:created", (e: { selected?: FabricObject[] }) => {
            const obj = e.selected?.[0];
            setSelectedObject(obj ?? null);
            if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
              setTextColor(obj.fill as string);
              setFontSize(obj.fontSize as number);
            }
          });

          fc.on("selection:updated", (e: { selected?: FabricObject[] }) => {
            const obj = e.selected?.[0];
            setSelectedObject(obj ?? null);
            if (obj && (obj.type === "i-text" || obj.type === "textbox")) {
              setTextColor(obj.fill as string);
              setFontSize(obj.fontSize as number);
            }
          });

          fc.on("selection:cleared", () => {
            setSelectedObject(null);
          });

          // Track mutations
          fc.on("object:added", () => syncObjectCount(fc));
          fc.on("object:removed", () => syncObjectCount(fc));

          activeCanvas = fc;
          canvasInstanceRef.current = fc;
          setCanvas(fc);
          syncObjectCount(fc);
        }
      } catch (err) {
        console.error("Error initializing canvas editor:", err);
        if (!disposed) {
          setError("Impossible d'initialiser l'éditeur. Veuillez rafraîchir la page.");
        }
      } finally {
        if (!disposed) {
          setLoading(false);
        }
      }
    }

    initEditor();

    return () => {
      disposed = true;
      if (activeCanvas) {
        activeCanvas.dispose();
        canvasInstanceRef.current = null;
      }
    };
  }, [eventId, syncObjectCount]);

  /* ---------------------------------------------------------------- */
  /*  Save design                                                     */
  /* ---------------------------------------------------------------- */
  const saveDesign = async (statusOverride?: "draft" | "final") => {
    if (!canvas || !designId) return;
    setSubmitting(true);
    setSaving(true);
    try {
      const json = canvas.toJSON();
      // Store background color in our custom structure for reloading
      json.background = bgColor;

      // Generate a small thumbnail (e.g. width 216px) for review step and previewing
      try {
        const currentZoom = canvas.getZoom();
        canvas.setZoom(1);
        canvas.setDimensions({ width: baseWidth, height: baseHeight });
        
        const thumbnailDataUrl = canvas.toDataURL({
          format: "jpeg",
          quality: 0.8,
          multiplier: 0.2, // 1080 * 0.2 = 216px width
        });
        
        // Restore canvas zoom/dimensions
        canvas.setZoom(currentZoom);
        canvas.setDimensions({
          width: baseWidth * zoomFactor,
          height: baseHeight * zoomFactor,
        });
        canvas.renderAll();
        
        json.thumbnail = thumbnailDataUrl;
      } catch (thumbErr) {
        console.error("Error generating flyer thumbnail:", thumbErr);
      }

      const finalStatus = statusOverride || designStatus;
      await setupApi.updateDesign(designId, {
        layersData: json,
        status: finalStatus,
      });

      setDesignStatus(finalStatus);
      setSaved();
    } catch (err) {
      console.error("Error saving design layers:", err);
      setSaveError("Échec de la sauvegarde du design.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (canvas && designId) {
      await saveDesign();
      markCompleted(4);
      onCompleted();
    } else {
      // Allow skipping if no canvas
      markCompleted(4);
      onCompleted();
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Add canvas elements                                             */
  /* ---------------------------------------------------------------- */
  const addText = async () => {
    if (!canvas || !fabricRef) return;
    const text = new fabricRef.IText("Double clic pour éditer", {
      left: 100,
      top: 100,
      fontFamily: "Outfit, sans-serif",
      fill: textColor,
      fontSize: 48,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addRect = async () => {
    if (!canvas || !fabricRef) return;
    const rect = new fabricRef.Rect({
      left: 150,
      top: 150,
      fill: "#6c63ff",
      width: 200,
      height: 120,
      rx: 8,
      ry: 8,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = async () => {
    if (!canvas || !fabricRef) return;
    const circle = new fabricRef.Circle({
      left: 150,
      top: 150,
      fill: "#22c55e",
      radius: 80,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
  };

  const duplicateSelected = () => {
    if (!canvas || !selectedObject || !fabricRef) return;
    selectedObject.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (selectedObject.left || 0) + 20,
        top: (selectedObject.top || 0) + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  /* ---------------------------------------------------------------- */
  /*  Background color – Fabric v7: direct property, no callback      */
  /* ---------------------------------------------------------------- */
  const updateBgColor = (color: string) => {
    setBgColor(color);
    if (canvas) {
      // Fabric v7: set backgroundColor as a direct property
      canvas.backgroundColor = color;
      canvas.renderAll();
    }
  };

  const updateTextColor = (color: string) => {
    setTextColor(color);
    if (selectedObject && (selectedObject.type === "i-text" || selectedObject.type === "textbox")) {
      selectedObject.set("fill", color);
      canvas?.renderAll();
    }
  };

  const updateFontSize = (size: number) => {
    setFontSize(size);
    if (selectedObject && (selectedObject.type === "i-text" || selectedObject.type === "textbox")) {
      selectedObject.set("fontSize", size);
      canvas?.renderAll();
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Layer ordering – Fabric v7: canvas methods, not object methods  */
  /* ---------------------------------------------------------------- */
  const moveForward = () => {
    if (canvas && selectedObject) {
      // Fabric v7: layer control is on the canvas, not on the object
      canvas.bringObjectForward(selectedObject);
      canvas.renderAll();
    }
  };

  const moveBackward = () => {
    if (canvas && selectedObject) {
      // Fabric v7: layer control is on the canvas, not on the object
      canvas.sendObjectBackwards(selectedObject);
      canvas.renderAll();
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Export canvas as PNG (client-side download)                     */
  /* ---------------------------------------------------------------- */
  const exportAsPng = () => {
    if (!canvas) return;
    // Temporarily reset zoom for full-res export
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);
    canvas.setDimensions({ width: baseWidth, height: baseHeight });

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    // Restore zoom
    canvas.setZoom(currentZoom);
    canvas.setDimensions({
      width: baseWidth * zoomFactor,
      height: baseHeight * zoomFactor,
    });
    canvas.renderAll();

    // Trigger download
    const link = document.createElement("a");
    link.download = "flyer-design.png";
    link.href = dataUrl;
    link.click();
  };

  /* ---------------------------------------------------------------- */
  /*  Render states                                                   */
  /* ---------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="es-wizard-step es-wizard-center">
        <Loader2 className="w-6 h-6 es-spin" aria-hidden />
        <p className="es-subtle">Chargement de l&apos;éditeur visuel…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="es-wizard-step es-wizard-center">
        <p style={{ color: "var(--danger)", textAlign: "center" }}>{error}</p>
        <button
          type="button"
          className="es-btn es-btn--secondary"
          onClick={() => window.location.reload()}
          style={{ marginTop: "12px" }}
        >
          Rafraîchir la page
        </button>
      </div>
    );
  }

  return (
    <div
      className="es-wizard-step es-animate-in"
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* Editor Controls Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "12px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" className="es-btn es-btn--secondary" onClick={addText}>
            <Type className="w-4 h-4" /> Texte
          </button>
          <button type="button" className="es-btn es-btn--secondary" onClick={addRect}>
            <Square className="w-4 h-4" /> Carré
          </button>
          <button type="button" className="es-btn es-btn--secondary" onClick={addCircle}>
            <Circle className="w-4 h-4" /> Cercle
          </button>
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "var(--border)",
              alignSelf: "center",
            }}
          />
          <button
            type="button"
            className="es-btn es-btn--secondary"
            onClick={exportAsPng}
            title="Exporter en PNG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="es-btn es-btn--secondary"
            onClick={() => saveDesign("draft")}
            disabled={submitting}
          >
            <Save className="w-4 h-4" /> Brouillon
          </button>
          <button
            type="button"
            className="es-btn"
            style={{
              background: designStatus === "final" ? "var(--successbg)" : "var(--accent)",
              color: "#fff",
              border: designStatus === "final" ? "1px solid var(--success)" : "none",
            }}
            onClick={() => saveDesign("final")}
            disabled={submitting}
          >
            <CheckCircle2 className="w-4 h-4" />{" "}
            {designStatus === "final" ? "Finalisé ✓" : "Valider"}
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          gap: "20px",
          minHeight: "550px",
        }}
      >
        {/* Left Toolbar */}
        <div
          style={{
            background: "var(--bg2)",
            borderRadius: "var(--radius)",
            padding: "16px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}
        >
          <h3
            className="es-h3"
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text2)",
              margin: 0,
            }}
          >
            Toile
          </h3>

          <div className="es-field">
            <label className="es-label">Couleur de fond</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => updateBgColor(e.target.value)}
                style={{
                  width: "36px",
                  height: "36px",
                  padding: "2px",
                  borderRadius: "6px",
                  background: "none",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              />
              <span className="es-mono" style={{ fontSize: "12px", color: "var(--text2)" }}>
                {bgColor}
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "11px", color: "var(--text2)", marginBottom: "4px" }}>
              Dimensions
            </h4>
            <div
              className="es-mono"
              style={{
                fontSize: "11px",
                background: "var(--surface)",
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              {baseWidth} × {baseHeight} px
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "11px", color: "var(--text2)", marginBottom: "4px" }}>
              Objets
            </h4>
            <div
              className="es-mono"
              style={{
                fontSize: "11px",
                background: "var(--surface)",
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              {objectCount} élément{objectCount !== 1 ? "s" : ""}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "16px",
            }}
          >
            <label className="es-label" style={{ marginBottom: "8px", display: "block" }}>
              Importer Image
            </label>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                background: isDragActive ? "var(--accentbg)" : "transparent",
                borderColor: isDragActive ? "var(--accent)" : "var(--border)",
                transition: "all 0.2s ease",
              }}
            >
              <input {...getInputProps()} />
              <ImageIcon
                className="w-5 h-5"
                style={{
                  margin: "0 auto 8px",
                  color: "var(--accent)",
                  display: "block",
                }}
              />
              <span style={{ fontSize: "11px", color: "var(--text2)" }}>
                {isDragActive ? "Déposez ici..." : "Glissez ou cliquez"}
              </span>
            </div>
          </div>
        </div>

        {/* Canvas Display */}
        <div
          ref={containerRef}
          style={{
            background: "var(--bg3)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflow: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              boxShadow: "0 10px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Right Properties Panel */}
        <div
          style={{
            background: "var(--bg2)",
            borderRadius: "var(--radius)",
            padding: "16px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}
        >
          <h3
            className="es-h3"
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text2)",
              margin: 0,
            }}
          >
            Propriétés
          </h3>

          {selectedObject ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span
                style={{
                  fontSize: "11px",
                  background: "var(--accentbg)",
                  color: "var(--accent)",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  alignSelf: "flex-start",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {selectedObject.type}
              </span>

              {(selectedObject.type === "i-text" || selectedObject.type === "textbox") && (
                <>
                  <div className="es-field">
                    <label className="es-label">Couleur de police</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => updateTextColor(e.target.value)}
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: "2px",
                          borderRadius: "6px",
                          background: "none",
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                        }}
                      />
                      <span className="es-mono" style={{ fontSize: "12px", color: "var(--text2)" }}>
                        {textColor}
                      </span>
                    </div>
                  </div>

                  <div className="es-field">
                    <label className="es-label">
                      Taille ({fontSize}px)
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => updateFontSize(parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "var(--accent)" }}
                    />
                  </div>
                </>
              )}

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <label className="es-label">Calque</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    className="es-btn es-btn--secondary es-btn--sm"
                    onClick={moveForward}
                  >
                    <ChevronUp className="w-3.5 h-3.5" /> Monter
                  </button>
                  <button
                    type="button"
                    className="es-btn es-btn--secondary es-btn--sm"
                    onClick={moveBackward}
                  >
                    <ChevronDown className="w-3.5 h-3.5" /> Descendre
                  </button>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "12px",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  className="es-btn es-btn--secondary es-btn--sm"
                  onClick={duplicateSelected}
                  title="Dupliquer"
                  style={{ flex: 1 }}
                >
                  <Copy className="w-3.5 h-3.5" /> Dupliquer
                </button>
                <button
                  type="button"
                  className="es-btn es-btn--sm"
                  style={{
                    background: "var(--dangerbg)",
                    color: "var(--danger)",
                    border: "1px solid var(--danger)",
                    flex: 1,
                  }}
                  onClick={deleteSelected}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                gap: "8px",
                padding: "24px 0",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus className="w-5 h-5" style={{ color: "var(--text2)" }} />
              </div>
              <p
                className="es-subtle"
                style={{ fontSize: "12px", textAlign: "center", maxWidth: "180px" }}
              >
                Sélectionnez un élément sur le flyer pour modifier ses propriétés
              </p>
            </div>
          )}
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={handleNext} nextLabel="Sauvegarder et continuer" />
    </div>
  );
}
