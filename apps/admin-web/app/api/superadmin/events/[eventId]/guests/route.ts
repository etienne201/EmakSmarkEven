import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";
import { paginate } from "@backend/utils/pagination";

/**
 * @swagger
 * /api/superadmin/events/{eventId}/guests:
 *   get:
 *     tags: [" Super Admin - Supervision"]
 *     summary: Liste des invités d'un événement spécifique
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Liste des invités }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const guests = await Storage.getGuests(eventId);
    const paginated = paginate(guests, { page, limit });

    return createSuccessResponse(paginated, "EVENT_GUESTS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
