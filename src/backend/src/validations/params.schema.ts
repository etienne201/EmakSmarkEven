import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.string().uuid("ID invalide (UUID attendu)")
});

export const EventIdParamSchema = z.object({
  eventId: z.string().min(1, "L'ID de l'événement est requis")
});

export const GuestIdParamSchema = z.object({
  guestId: z.string().min(1, "L'ID de l'invité est requis")
});
