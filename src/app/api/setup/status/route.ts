import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";
import { AuthGuard } from "@backend/middleware/auth-guard";

/**
 * GET /api/setup/status
 * Vérifie si l'utilisateur actuel a déjà configuré son événement.
 */
export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    
    // On cherche un événement appartenant à cet ownerId
    const event = await prisma.event.findFirst({
      where: { adminId: payload.ownerId },
      select: { id: true, title: true, setupCompleted: true }
    });

    return createSuccessResponse({
      isConfigured: !!event && event.setupCompleted === true,
      eventId: event?.id || null,
      eventName: event?.title || null
    }, "SETUP_STATUS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
