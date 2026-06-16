import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/public/guest/{guestId}:
 *   get:
 *     tags: ["Public - Accès Invités"]
 *     summary: Récupérer les informations d'un invité via son token ou ID
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *         description: UUID de l'invité ou son token unique
 *     responses:
 *       200:
 *         description: Informations publiques de l'invité récupérées
 *       404:
 *         description: Invité non trouvé
 */

// Simple UUID v4 validation helper
function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const { guestId } = await params;

    let guest: any = null;

    // Try by UUID first, then fall back to token lookup
    if (isValidUUID(guestId)) {
      guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: {
          table: true,
          event: {
            include: { design: true }
          }
        },
      });
    }

    // If not found by ID, try by unique token
    if (!guest) {
      guest = await prisma.guest.findUnique({
        where: { token: guestId },
        include: {
          table: true,
          event: {
            include: { design: true }
          }
        },
      });
    }

    if (!guest) throw new AppError("Guest not found", 404);

    // Return only non-sensitive info for public access
    return createSuccessResponse(
      {
        id: guest.id,
        title: guest.title,
        name: guest.fullName,
        fullName: guest.fullName,
        table: guest.tableId, // Fallback for old UI
        tableId: guest.tableId,
        tableName: guest.table?.name ?? null,
        lang: guest.language, // Fallback for old UI
        language: guest.language,
        rsvpStatus: guest.rsvpStatus,
        checkinStatus: guest.checkinStatus,
        eventId: guest.eventId,
        ownerId: guest.event?.createdById, // Helpful if available
        smartDesign: guest.event?.design?.smartDesign ?? null,
        layoutElements: guest.event?.design?.layoutElements ?? null,
      },
      "GUEST_FETCHED"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
