import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/stats/timeline:
 *   get:
 *     tags: ["Suivi & Présences"]
 *     summary: Chronologie des arrivées (pour graphiques)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Données temporelles }
 */
import { prisma } from "@backend/prisma";

export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const ownerId = payload.ownerId;

    const arrivedGuests = await prisma.guest.findMany({
      where: {
        event: { createdById: String(ownerId) },
        checkinStatus: 'arrived',
        checkedInAt: { not: null }
      },
      select: { checkedInAt: true }
    });

    const timeline: Record<string, number> = {};
    arrivedGuests.forEach((g) => {
      if (g.checkedInAt) {
        const hour = g.checkedInAt.getHours();
        const label = `${hour}h`;
        timeline[label] = (timeline[label] || 0) + 1;
      }
    });

    return createSuccessResponse(timeline, "TIMELINE_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
