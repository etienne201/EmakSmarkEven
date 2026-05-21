import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/superadmin/events/{eventId}/tables:
 *   get:
 *     tags: [" Super Admin - Supervision"]
 *     summary: Liste des tables d'un événement spécifique
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des tables }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { eventId } = await params;
    const tables = await Storage.getTables(eventId);

    return createSuccessResponse(tables, "EVENT_TABLES_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
