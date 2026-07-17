import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     EventConfig:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         adminId: { type: string }
 *         name: { type: string, example: "Mariage de Marie & Jean" }
 *         eventType: { type: string, enum: [wedding, birthday, conference, gala, other] }
 *         date: { type: string, format: date }
 *         startTime: { type: string, example: "14:00" }
 *         city: { type: string }
 *         venue: { type: string }
 *         status: { type: string, enum: [draft, active, completed, archived] }
 *         language: { type: string, enum: [fr, en] }
 *         colorAccent: { type: string, example: "#FF5733" }
 */

const EventTypeEnum = z.enum(["wedding", "birthday", "conference", "gala", "other"]);

// Étape 1 : Informations de base
export const EventStep1Schema = z.object({
  title: z.string().min(2, "Le titre est requis").optional().or(z.string()),
  eventName: z.string().optional(),
  description: z.string().max(1000).optional().nullable(),
  eventType: EventTypeEnum,
  language: z.enum(["fr", "en"]).default("fr"),
  date: z.string().optional(),
  startTime: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().default("Cameroun"),
  location: z.string().optional().nullable(),
  venue: z.string().optional().nullable()
});

// Étape 2 : Programme & Sessions
export const SessionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  startTime: z.string(),
  venue: z.string().optional(),
  details: z.string().max(300).optional()
});

// Étape 2 : Programme & Champs Spécifiques
export const EventStep2Schema = z.object({
  sessions: z.array(SessionSchema).optional(),
  specificFields: z.record(z.string(), z.any()).optional()
});

// Étape 3 : Identité Visuelle & Media
export const SmartDesignSchema = z.object({
  personality: z.enum([
    "elegant-luxury",
    "modern-minimal",
    "floral-romantic",
    "gold-prestige",
    "afro-celebration",
    "corporate-clean",
    "night-party"
  ]).optional(),
  autoAlignEnabled: z.boolean().optional(),
  smartSpacingEnabled: z.boolean().optional(),
  colorHarmonyMode: z.enum(["strict", "adaptive", "free"]).optional(),
  typographyMode: z.enum(["auto-scale", "manual"]).optional(),
  templateId: z.string().optional().nullable(),
  dynamicValues: z.record(z.string(), z.any()).optional().nullable(),
});

export const EventDesignSchema = z.object({
  paletteType: z.enum(["predefined", "custom"]).default("predefined"),
  paletteId: z.string().optional().nullable(),
  colorAccent: z.string().optional().nullable(),
  colorBackground: z.string().optional().nullable(),
  colorButton: z.string().optional().nullable(),
  colorText: z.string().optional().nullable(),
  decorationStyle: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  backgroundUrl: z.string().optional().nullable(),
  galleryFileIds: z.array(z.string()).optional(),
  smartDesign: SmartDesignSchema.optional()
});

// Étape 4 : Logique & Paramètres
export const EventSettingsSchema = z.object({
  qrEnabled: z.boolean().default(true),
  qrType: z.string().default("check_in"),
  rsvpEnabled: z.boolean().default(true),
  seatingPlanEnabled: z.boolean().default(true),
  maxGuestsPerTable: z.number().int().default(10),
  showGuestNameOnCard: z.boolean().default(true),
  showTableNumberOnCard: z.boolean().default(true),
  hostInitials: z.string().max(4).optional().nullable()
});

// Étape 5 : Raffinement Expert
export const EventRefinementSchema = z.object({
  typography: z.string().default("sans"),
  fontSizeBase: z.number().int().default(15),
  fontSizeTitle: z.number().int().default(28),
  spacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
  borderRadius: z.enum(["sharp", "soft", "rounded", "pill"]).default("rounded"),
  glassmorphism: z.boolean().default(false),
  welcomeFr: z.string().optional().nullable(),
  welcomeEn: z.string().optional().nullable(),
  quoteFr: z.string().optional().nullable(),
  quoteEn: z.string().optional().nullable(),
  seatingLabelFr: z.string().default("Votre Table"),
  seatingLabelEn: z.string().default("Your Table"),
  smartDesign: SmartDesignSchema.optional(),
  layoutElements: z.array(z.any()).optional().nullable(),
});

// Unified schema for total configuration (72 fields)
export const EventConfigSchema = z.object({
  // Base info (Step 1)
  id: z.string().optional(),
  adminId: z.string().optional(),
  ownerId: z.string().optional(),
  title: z.string().optional(),
  eventName: z.string().optional(),
  description: z.string().optional().nullable(),
  eventType: EventTypeEnum.optional(),
  language: z.enum(["fr", "en"]).optional(),
  date: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional(),
  location: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "completed", "archived"]).optional(),

  // Program & Sessions (Step 2)
  sessions: z.array(SessionSchema).optional(),
  specificFields: z.record(z.string(), z.any()).optional(),

  // Design (Step 3)
  paletteType: z.enum(["predefined", "custom"]).optional(),
  paletteId: z.string().optional().nullable(),
  palette: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    background: z.string().optional(),
    button: z.string().optional(),
    textMain: z.string().optional(),
    textHeading: z.string().optional()
  }).optional(),
  colorAccent: z.string().optional().nullable(),
  colorBackground: z.string().optional().nullable(),
  colorButton: z.string().optional().nullable(),
  colorText: z.string().optional().nullable(),
  decorationStyle: z.string().optional().nullable(),
  decorationType: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  invitationBgUrl: z.string().optional().nullable(),
  backgroundUrl: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional(),
  galleryFileIds: z.array(z.string()).optional(),
  smartDesign: SmartDesignSchema.optional(),

  // Settings (Step 4)
  qrEnabled: z.boolean().optional(),
  qrType: z.string().optional(),
  enableQRCodes: z.boolean().optional(),
  qrCodeType: z.string().optional(),
  rsvpEnabled: z.boolean().optional(),
  enableAttendance: z.boolean().optional(),
  seatingPlanEnabled: z.boolean().optional(),
  enableSeatingPlan: z.boolean().optional(),
  maxGuestsPerTable: z.number().optional(),
  showGuestNameOnCard: z.boolean().optional(),
  showGuestNameOnInvitation: z.boolean().optional(),
  showTableNumberOnCard: z.boolean().optional(),
  showTableNumberOnInvitation: z.boolean().optional(),
  hostInitials: z.string().optional().nullable(),

  // Expert Refinement (Step 5)
  typography: z.string().optional(),
  fontSizeBase: z.number().optional(),
  fontSizeTitle: z.number().optional(),
  spacing: z.enum(["compact", "normal", "spacious"]).optional(),
  borderRadius: z.enum(["sharp", "soft", "rounded", "pill"]).optional(),
  glassmorphism: z.boolean().optional(),
  welcomeFr: z.string().optional().nullable(),
  welcomeEn: z.string().optional().nullable(),
  quoteFr: z.string().optional().nullable(),
  quoteEn: z.string().optional().nullable(),
  seatingLabelFr: z.string().optional(),
  seatingLabelEn: z.string().optional(),

  // Internal state
  setupCompleted: z.boolean().optional(),
  setupStep: z.number().optional(),
});

export const SessionReorderSchema = z.object({
  ownerId: z.string().optional(),
  sessions: z.array(z.object({
    id: z.string().min(1),
    position: z.number().int().min(0)
  }))
});

export const SessionRequestSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Le titre est requis").optional(),
  name: z.string().min(2, "Le nom est requis").optional(),
  startTime: z.string().min(1, "L'heure de début est requise"),
  venue: z.string().optional().nullable(),
  details: z.string().max(300).optional().nullable(),
  ownerId: z.string().optional()
}).passthrough();

export const createEventSchema = EventConfigSchema.pick({
  title: true,
  eventName: true,
  description: true,
  eventType: true,
  language: true,
  date: true,
  startTime: true,
  city: true,
  country: true,
  location: true,
  venue: true
});

export const updateEventSchema = EventConfigSchema.partial();

export type EventConfigInput = z.infer<typeof EventConfigSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type SessionInput = z.infer<typeof SessionSchema>;
export type SessionReorderInput = z.infer<typeof SessionReorderSchema>;
export type SessionRequestInput = z.infer<typeof SessionRequestSchema>;

