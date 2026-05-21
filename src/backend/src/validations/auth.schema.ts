import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  totp: z.string().length(6).optional()
});

export const AdminLoginSchema = z.object({
  event_id: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(4, "Le mot de passe est trop court")
}).refine(data => data.event_id || data.email, {
  message: "L'identifiant (ID ou Email) est requis",
  path: ["event_id"]
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8, "Nouveau mot de passe trop court"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export const ChangePasswordAdminSchema = z.object({
  oldPassword: z.string().min(1, "L'ancien mot de passe est requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit faire au moins 8 caractères")
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Le refresh token est requis")
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type ChangePasswordAdminInput = z.infer<typeof ChangePasswordAdminSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

