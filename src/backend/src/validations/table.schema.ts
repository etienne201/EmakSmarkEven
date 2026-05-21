import { z } from "zod";

export const TableSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  number: z.number().optional().default(0),
  capacity: z.number().min(1).default(10),
});

export const TablesUpdateSchema = z.object({
  ownerId: z.string(),
  tables: z.array(TableSchema),
});

export const AssignTableSchema = z.object({
  guestId: z.string().min(1, "L'ID de l'invité est requis"),
  ownerId: z.string().optional()
});

export type TableInput = z.infer<typeof TableSchema>;
export type AssignTableInput = z.infer<typeof AssignTableSchema>;

