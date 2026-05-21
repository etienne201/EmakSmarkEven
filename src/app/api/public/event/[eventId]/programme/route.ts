import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/public/event/{eventId}/programme:
 *   get:
 *     tags: ["Public - Accès Invités"]
 *     summary: Récupérer le programme de l'événement
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *         description: UUID de l'événement ou adminId
 *     responses:
 *       200: { description: Programme de l'événement }
 *       404: { description: Événement non trouvé }
 */

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    if (!eventId || eventId.length < 3) {
      throw new AppError("Invalid event ID", 400);
    }

    const whereClause = isValidUUID(eventId)
      ? { OR: [{ id: eventId }, { adminId: eventId }] }
      : { adminId: eventId };

    const event = await prisma.event.findFirst({
      where: whereClause,
      include: {
        sessions: {
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!event) throw new AppError("Event not found", 404);

    return createSuccessResponse(
      {
        programme: event.sessions,
        eventName: event.title,
        date: event.date,
      },
      "PROGRAMME_FETCHED"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
