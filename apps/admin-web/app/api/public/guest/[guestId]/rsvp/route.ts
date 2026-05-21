import { NextResponse } from "next/server";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/public/guest/{guestId}/rsvp:
 *   post:
 *     tags: ["Public - Accès Invités"]
 *     summary: Enregistrer la réponse RSVP d'un invité
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, eventId]
 *             properties:
 *               status: { type: string, enum: [confirmed, declined] }
 *               eventId: { type: string }
 *               dietaryRequirements: { type: string }
 *     responses:
 *       200: { description: RSVP enregistré }
 */
import { RsvpSchema } from "@backend/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const { guestId } = await params;
    const body = await request.json();
    
    // Validation Zod (Remplace les checks manuels de status, eventId, etc.)
    const { status, eventId, dietaryRequirements } = RsvpSchema.parse(body);

    // Utilisation de Prisma pour mettre à jour l'invité
    const updatedGuest = await prisma.guest.update({
      where: { 
        id: guestId,
        eventId: eventId // Sécurité supplémentaire
      },
      data: {
        rsvpStatus: status as any,
        dietaryRequirements: dietaryRequirements,
        rsvpUpdatedAt: new Date()
      }
    });

    return createSuccessResponse(updatedGuest, "RSVP_SAVED", "RSVP recorded successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
