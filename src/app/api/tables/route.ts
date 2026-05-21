import { TableSchema, TablesUpdateSchema } from "@backend/validations";
import { TableService } from "@backend/services/table.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/tables:
 *   get:
 *     tags: [" Tables & Plan de salle"]
 *     summary: Liste des tables d'un événement
 *     responses:
 *       200: { description: Liste des tables récupérée }
 *   post:
 *     tags: [" Tables & Plan de salle"]
 *     summary: Mettre à jour les tables (Bulk ou Individuel)
 *     security: [{ BearerAuth: [] }]
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || "default";

    // Public access allowed for guest seating plan
    const tables = await TableService.getTables(ownerId);
    return createSuccessResponse(tables, "TABLES_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const body = await request.json();
    
    // Validation Zod - Can be a single table or a bulk update
    let ownerId: string;
    let tables: any[];

    if (body.tables) {
       const validated = TablesUpdateSchema.parse(body);
       ownerId = validated.ownerId;
       tables = validated.tables;
    } else {
       const validated = TableSchema.parse(body);
       ownerId = payload.ownerId;
       tables = [validated];
    }

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const saved = await TableService.saveTables(String(ownerId), tables);
    await Storage.saveLog(String(ownerId), "TABLES_UPDATE", { count: saved.length });

    return createSuccessResponse(saved, "TABLES_UPDATED");
  } catch (error) {
    return handleApiError(error);
  }
}
