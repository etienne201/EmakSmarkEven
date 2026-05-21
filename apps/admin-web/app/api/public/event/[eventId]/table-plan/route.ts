import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/public/event/{eventId}/table-plan:
 *   get:
 *     tags: ["Public - Accès Invités"]
 *     summary: Récupérer le plan de table public
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *         description: UUID de l'événement ou adminId
 *     responses:
 *       200: { description: Plan de table }
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

    // Find the event first so we can scope the tables query safely
    const whereClause = isValidUUID(eventId)
      ? { OR: [{ id: eventId }, { adminId: eventId }] }
      : { adminId: eventId };

    const event = await prisma.event.findFirst({
      where: whereClause,
      select: { id: true },
    });

    if (!event) throw new AppError("Event not found", 404);

    const tables = await prisma.table.findMany({
      where: { eventId: event.id },
      include: {
        guests: {
          select: { fullName: true, id: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return createSuccessResponse(tables, "TABLE_PLAN_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
