/** Normalise les layers d'un DesignTemplate vers le format Fabric JSON. */
export function normalizeTemplateLayers(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return {
      version: "7.4.0",
      objects: [],
      background: "#0d0f12",
    };
  }

  const layers = raw as Record<string, unknown>;

  if (Array.isArray(layers.objects)) {
    return layers;
  }

  const bg =
    typeof layers.background === "string"
      ? layers.background
      : (layers.background as { color?: string })?.color ?? "#0d0f12";

  const elements = Array.isArray(layers.elements) ? layers.elements : [];
  const objects = elements.map((el: Record<string, unknown>) => {
    if (el.type === "text") {
      return {
        type: "i-text",
        text: el.text || "",
        left: el.left ?? 100,
        top: el.top ?? 100,
        fontSize: el.fontSize ?? 40,
        fill: el.fill ?? "#ffffff",
        fontFamily: "Outfit, sans-serif",
        version: "7.4.0",
      };
    }
    if (el.type === "rect") {
      return {
        type: "rect",
        left: el.left ?? 100,
        top: el.top ?? 100,
        width: el.width ?? 200,
        height: el.height ?? 120,
        fill: el.fill ?? "#6c63ff",
        rx: el.rx ?? 8,
        ry: el.ry ?? 8,
        version: "7.4.0",
      };
    }
    if (el.type === "circle") {
      return {
        type: "circle",
        left: el.left ?? 100,
        top: el.top ?? 100,
        radius: el.radius ?? 80,
        fill: el.fill ?? "#22c55e",
        version: "7.4.0",
      };
    }
    return el;
  });

  return {
    version: "7.4.0",
    objects,
    background: bg,
  };
}

export function blankDesignLayers(bg = "#0d0f12"): Record<string, unknown> {
  return normalizeTemplateLayers({ background: { color: bg }, elements: [] });
}
