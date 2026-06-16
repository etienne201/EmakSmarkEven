import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";
import { AuthGuard } from "@backend/middleware/auth-guard";

/**
 * GET /api/setup/status
 * Vérifie si l'utilisateur actuel a déjà configuré son événement.
 */
export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const ownerId = String(payload.ownerId || "");
    const config = await Storage.getEventConfig(ownerId);

    const isConfigured = config?.status !== "draft" && config?.setupCompleted === true;
    const eventId = config?.id || ownerId;
    const eventName = config?.title || config?.eventName || null;

    return createSuccessResponse({
      isConfigured,
      eventId,
      eventName
    }, "SETUP_STATUS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
