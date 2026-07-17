import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/stats/rsvp:
 *   get:
 *     tags: ["Suivi & Présences"]
 *     summary: Statistiques RSVP détaillées
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Statistiques RSVP }
 */
import { prisma } from "@backend/prisma";

export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    const [total, confirmed, declined, pending] = await Promise.all([
      prisma.guest.count({ where: { event: { createdById: String(ownerId) } } }),
      prisma.guest.count({ where: { event: { createdById: String(ownerId) }, rsvpStatus: 'confirmed' } }),
      prisma.guest.count({ where: { event: { createdById: String(ownerId) }, rsvpStatus: 'declined' } }),
      prisma.guest.count({ where: { event: { createdById: String(ownerId) }, rsvpStatus: 'pending' } }),
    ]);

    const stats = { total, confirmed, declined, pending };

    return createSuccessResponse(stats, "RSVP_STATS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
