import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Guest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fullName:
 *           type: string
 *           example: "Junior Ndzi"
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           example: "+237690000000"
 *         language:
 *           type: string
 *           enum: [fr, en]
 *           default: fr
 *         tableId:
 *           type: string
 *           format: uuid
 *         notes:
 *           type: string
 *         rsvpStatus:
 *           type: string
 *           enum: [pending, confirmed, declined]
 *         checkinStatus:
 *           type: string
 *           enum: [not_arrived, arrived]
 *         checkinSource:
 *           type: string
 *           enum: [qr_scan, manual, offline_sync]
 *
 *     Table:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Table d'Honneur"
 *         capacity:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         eventId:
 *           type: string
 *           format: uuid
 */

export const GuestSchema = z.object({
  id: z.string().optional(),
  uuid: z.string().uuid().optional(),
  ownerId: z.string().optional(),
  // Contractual field name per Firestore schema
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  language: z.enum(["fr", "en"]).default("fr"),
  lang: z.string().optional(), // Alias for language used in some public routes
  tableId: z.string().optional().nullable(),
  tableName: z.string().optional(),
  notes: z.string().max(300).optional(),
  dietaryRequirements: z.string().max(300).optional(),
  rsvpStatus: z.enum(["pending", "confirmed", "declined"]).default("pending"),
  checkinStatus: z.enum(["not_arrived", "arrived"]).default("not_arrived"),
  checkinSource: z.enum(["qr_scan", "manual", "offline_sync"]).optional(),
}).passthrough(); // Allow extra fields during import without losing them on save

export const CheckInSchema = z.object({
  guestId: z.string().uuid(),
  source: z.enum(["qr_scan", "manual", "offline_sync"]).default("manual")
});

export const RsvpSchema = z.object({
  status: z.enum(["confirmed", "declined"]),
  eventId: z.string().min(1, "L'ID de l'événement est requis"),
  dietaryRequirements: z.string().max(300).optional()
});

export const BulkGuestSchema = z.array(GuestSchema);

export const BulkGuestActionSchema = z.object({
  guestIds: z.array(z.string().uuid().or(z.string().min(1))), // Support UUID or legacy IDs
  data: z.any().optional(),
  ownerId: z.string().optional()
});

export const ExportFilterSchema = z.object({
  ownerId: z.string().min(1),
  format: z.enum(["csv", "json"]).default("csv")
});

export const ManualCheckInSchema = z.object({
  guestId: z.string().uuid(),
  ownerId: z.string().optional(),
  status: z.string().default("Présent"),
  reason: z.string().optional()
});

export const CheckInRequestSchema = z.object({
  guestId: z.string().uuid(),
  ownerId: z.string().optional(),
  status: z.string().default("Présent")
});

export const ClearAttendanceSchema = z.object({
  ownerId: z.string().optional()
});

export const PublicCheckInSchema = z.object({
  guestId: z.string().uuid()
});

export const SyncRecordSchema = z.object({
  guestId: z.string().uuid(),
  timestamp: z.string()
});

export const AttendanceSyncSchema = z.object({
  records: z.array(SyncRecordSchema),
  ownerId: z.string().optional()
});

export const GuestActionSchema = z.object({
  action: z.enum(["regenerate-qr"]),
  ownerId: z.string().optional()
});

export const GuestImportSchema = z.object({
  guests: z.array(GuestSchema.partial().passthrough()),
  ownerId: z.string().optional()
});

export type GuestInput = z.infer<typeof GuestSchema>;

