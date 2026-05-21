import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";
import { EventIdParamSchema } from "@backend/validations";

/**
 * @swagger
 * /api/superadmin/events/{eventId}/stats:
 *   get:
 *     tags: [" Super Admin - Supervision"]
 *     summary: Statistiques d'un événement spécifique
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Statistiques de l'événement }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { eventId } = EventIdParamSchema.parse(await params);

    const stats = await Storage.getEventStats(eventId);
    return createSuccessResponse(stats, "EVENT_STATS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
