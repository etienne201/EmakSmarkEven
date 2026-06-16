export interface ContentRule {
  maxCharacters?: number;
  minFontSize?: number;
  maxLines?: number;
  autoScale?: boolean;
  uppercase?: boolean;
}

export type ZoneType = "text" | "image" | "date" | "list" | "qrcode";

export interface DynamicZone {
  id: string;
  label: string; // The UI label for the generated form, e.g. "Nom du marié"
  type: ZoneType;
  role: string;
  x: number;
  y: number;
  width?: number;
  maxWidth?: number;
  maxHeight?: number;
  rotation?: number;
  stylePreset: {
    fontFamily?: string;
    fontSize?: number;
    fill?: string;
    align?: "left" | "center" | "right";
    letterSpacing?: number;
    lineHeight?: number;
  };
  rules?: ContentRule;
  defaultValue?: string | any;
}

export interface TemplateTheme {
  id: string;
  name: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: "wedding" | "birthday" | "corporate" | "gala" | "other";
  style: string;
  culture?: string;
  thumbnailUrl: string;
  backgroundUrl: string;
  width: number; // Base width for absolute coordinate calculations
  height: number; // Base height for absolute coordinate calculations
  themes: TemplateTheme[];
  dynamicZones: DynamicZone[];
  staticLayers?: any[]; // Fixed decorations, shapes, overlays
}
