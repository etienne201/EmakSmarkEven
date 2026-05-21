import { NextResponse } from "next/server";
import { TableService } from "@backend/services/table.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/tables/{tableId}:
 *   get:
 *     tags: [" Tables & Plan de salle"]
 *     summary: Récupérer une table spécifique
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Détails de la table }
 *   patch:
 *     tags: [" Tables & Plan de salle"]
 *     summary: Mettre à jour une table
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Table mise à jour }
 *   delete:
 *     tags: [" Tables & Plan de salle"]
 *     summary: Supprimer une table
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Table supprimée }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || "default";

    const tables = await TableService.getTables(String(ownerId));
    const table = tables.find((t: any) => t.id === tableId);

    if (!table) throw new AppError("Table not found", 404);

    return createSuccessResponse(table, "TABLE_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { tableId } = await params;
    const data = await request.json();
    const ownerId = data.ownerId || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const updated = await TableService.updateTable(String(ownerId), tableId, data);
    await Storage.saveLog(String(ownerId), "TABLE_UPDATE", { tableId });

    return createSuccessResponse(updated, "TABLE_UPDATED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { tableId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    await TableService.deleteTable(String(ownerId), tableId);
    await Storage.saveLog(String(ownerId), "TABLE_DELETE", { tableId });

    return createSuccessResponse(null, "TABLE_DELETED");
  } catch (error) {
    return handleApiError(error);
  }
}
