import * as z from "zod";

// Per-step Zod schemas mirroring the backend DTOs (event-setup.dto.ts).
// Used with react-hook-form's zodResolver for client-side validation.

export const EVENT_TYPES = [
  "wedding",
  "birthday",
  "conference",
  "festival",
  "concert",
  "expo",
  "corporate",
  "networking",
  "church",
  "gala",
  "hybrid",
  "vip",
  "other",
] as const;

export const VISIBILITIES = ["public", "private", "vip"] as const;

export const MODULE_KEYS = [
  "guests",
  "invitations",
  "qrCheckin",
  "tables",
  "seating",
  "analytics",
  "badges",
  "notifications",
] as const;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Étape 1 — Informations générales (obligatoire)
export const step1Schema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères.")
    .max(255, "Le titre est trop long (255 max)."),
  slug: z
    .string()
    .min(1, "Le slug est requis.")
    .regex(
      slugRegex,
      "Minuscules uniquement, sans espaces (lettres, chiffres, tirets).",
    ),
  description: z.string().max(5000).optional().or(z.literal("")),
  eventType: z.enum(EVENT_TYPES, {
    message: "Sélectionnez un type d'événement.",
  }),
  language: z.string().max(10).optional(),
  visibility: z.enum(VISIBILITIES).optional(),
});

// Étape 2 — Lieu & dates (obligatoire, validation croisée)
export const step2Schema = z
  .object({
    location: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    country: z.string().optional().or(z.literal("")),
    timezone: z.string().max(100).optional().or(z.literal("")),
    startDate: z.string().min(1, "La date de début est requise."),
    endDate: z.string().optional().or(z.literal("")),
  })
  .refine(
    (v) => !v.endDate || new Date(v.endDate) > new Date(v.startDate),
    {
      path: ["endDate"],
      message: "La date de fin doit être postérieure à la date de début.",
    },
  );

// Étape 3 — Modules (optionnel). Contraintes appliquées côté store + serveur.
export const step3Schema = z.object({
  modules: z.object({
    guests: z.boolean(),
    invitations: z.boolean(),
    qrCheckin: z.boolean(),
    tables: z.boolean(),
    seating: z.boolean(),
    analytics: z.boolean(),
    badges: z.boolean(),
    notifications: z.boolean(),
  }),
});

// Étape 4 — Design & branding (optionnel)
export const step4Schema = z.object({
  theme: z.string().optional().or(z.literal("")),
  colors: z.record(z.string(), z.string()).optional(),
  logoUrl: z
    .string()
    .url("URL de logo invalide.")
    .optional()
    .or(z.literal("")),
  bannerUrl: z
    .string()
    .url("URL de bannière invalide.")
    .optional()
    .or(z.literal("")),
});

// Étape 5 — Invités & accès (optionnel)
export const step5Schema = z.object({
  guestCategories: z.array(z.string()).optional(),
  staffCategories: z.array(z.string()).optional(),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type Step5Values = z.infer<typeof step5Schema>;
