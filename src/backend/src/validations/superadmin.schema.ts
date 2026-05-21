import { z } from "zod";

export const CreateAdminSchema = z.object({
  id: z.string().min(3, "L'ID doit faire au moins 3 caractères"),
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe par défaut doit faire au moins 8 caractères").optional(),
  status: z.enum(["active", "blocked"]).default("active"),
  role: z.string().optional()
});

export const BlockAdminSchema = z.object({
  reason: z.string().min(5, "Une raison est requise pour bloquer un compte"),
  blockedBy: z.string()
});

export const BulkActionSchema = z.object({
  ids: z.array(z.string()),
  action: z.enum(["delete", "activate", "block"]),
  reason: z.string().optional()
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères")
});

export const UpdateAdminStatusSchema = z.object({
  status: z.enum(["active", "blocked"])
});

export const BulkEventActionSchema = z.object({
  eventIds: z.array(z.string().min(1)),
  action: z.enum(["block", "unblock"])
});

export const BulkEventDeleteSchema = z.object({
  eventIds: z.array(z.string().min(1))
});

export const SuperadminCreateEventSchema = z.object({
  ownerId: z.string().min(3, "L'ownerId doit faire au moins 3 caractères"),
  adminPassword: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  eventName: z.string().min(2, "Le nom de l'événement doit faire au moins 2 caractères"),
  eventType: z.enum(["wedding", "birthday", "conference", "gala", "other"]).default("wedding")
});

export const SuperadminProfileUpdateSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères").optional(),
  avatarUrl: z.string().optional()
});

export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;
export type BlockAdminInput = z.infer<typeof BlockAdminSchema>;

