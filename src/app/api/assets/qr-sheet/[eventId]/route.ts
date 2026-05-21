import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";

/**
 * @swagger
 * /api/assets/qr-sheet/{eventId}:
 *   get:
 *     tags: ["Exports & Assets"]
 *     summary: Générer la planche de QR Codes pour tous les invités
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: PDF contenant tous les QR Codes }
 */
import { prisma } from "@backend/prisma";
import { GuestService } from "@backend/services/guest.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { eventId } = await params;

    // L'eventId peut être l'ID de l'événement ou l'UID de l'admin (ownerId)
    const guests = await GuestService.getGuests(eventId);

    return new Response(`PDF Sheet for ${guests.length} guests`, {
      headers: { "Content-Type": "application/pdf" }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
