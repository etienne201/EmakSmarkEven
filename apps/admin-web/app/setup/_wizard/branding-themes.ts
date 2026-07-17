import type { EventTypeKey } from "./types";

export interface BrandingTheme {
  id: string;
  label: string;
  primary: string;
}

const UNIVERSAL: BrandingTheme[] = [
  { id: "elegant-gold", label: "Élégant Or", primary: "#bfa14a" },
  { id: "emerald", label: "Émeraude", primary: "#2d6a4f" },
  { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  { id: "rose", label: "Rose", primary: "#be185d" },
  { id: "slate", label: "Ardoise", primary: "#334155" },
];

const BY_TYPE: Partial<Record<EventTypeKey, BrandingTheme[]>> = {
  wedding: [
    { id: "elegant-gold", label: "Or & Ivoire", primary: "#bfa14a" },
    { id: "rose-blush", label: "Rose Poudré", primary: "#d4a5a5" },
    { id: "sage", label: "Vert Sauge", primary: "#6b8f71" },
    { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  ],
  birthday: [
    { id: "party-pink", label: "Fête Rose", primary: "#ff4081" },
    { id: "sunshine", label: "Soleil", primary: "#f59e0b" },
    { id: "emerald", label: "Émeraude", primary: "#10b981" },
    { id: "violet-pop", label: "Violet Pop", primary: "#8b5cf6" },
  ],
  conference: [
    { id: "corporate-blue", label: "Corporate Bleu", primary: "#2563eb" },
    { id: "tech-indigo", label: "Tech Indigo", primary: "#6c63ff" },
    { id: "slate", label: "Ardoise", primary: "#334155" },
    { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  ],
  concert: [
    { id: "rock-red", label: "Rock Rouge", primary: "#ef4444" },
    { id: "neon-purple", label: "Néon Violet", primary: "#a855f7" },
    { id: "stage-black", label: "Scène Noire", primary: "#18181b" },
    { id: "electric-cyan", label: "Cyan Électrique", primary: "#06b6d4" },
  ],
  festival: [
    { id: "summer-cyan", label: "Été Cyan", primary: "#00f2fe" },
    { id: "sunset-orange", label: "Coucher de Soleil", primary: "#f97316" },
    { id: "grass-green", label: "Pelouse", primary: "#22c55e" },
    { id: "party-pink", label: "Fête", primary: "#ec4899" },
  ],
  gala: [
    { id: "prestige-gold", label: "Prestige Or", primary: "#e5c158" },
    { id: "elegant-gold", label: "Élégant Or", primary: "#bfa14a" },
    { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
    { id: "burgundy", label: "Bordeaux", primary: "#881337" },
  ],
  corporate: [
    { id: "corporate-blue", label: "Corporate Bleu", primary: "#1d4ed8" },
    { id: "slate", label: "Ardoise Pro", primary: "#475569" },
    { id: "emerald", label: "Émeraude", primary: "#059669" },
    { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  ],
  church: [
    { id: "sacred-gold", label: "Or Sacré", primary: "#ca8a04" },
    { id: "sage", label: "Vert Sauge", primary: "#6b8f71" },
    { id: "ivory", label: "Ivoire", primary: "#d6d3d1" },
    { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  ],
  vip: [
    { id: "prestige-gold", label: "Or VIP", primary: "#eab308" },
    { id: "luxury-black", label: "Noir Luxe", primary: "#0f0f0f" },
    { id: "burgundy", label: "Bordeaux", primary: "#881337" },
    { id: "midnight", label: "Minuit", primary: "#1e3a8a" },
  ],
};

export function getBrandingThemesForEventType(
  eventType?: EventTypeKey,
): BrandingTheme[] {
  if (eventType && BY_TYPE[eventType]?.length) {
    return BY_TYPE[eventType]!;
  }
  return UNIVERSAL;
}
