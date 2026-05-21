import { NextResponse } from "next/server";
import { SetupService } from "@backend/services/setup.service";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { validateRequest } from "@backend/auth";

/**
 * @swagger
 * /api/setup/finalize:
 *   post:
 *     tags: ["Configuration & Setup"]
 *     summary: Finaliser la configuration et créer l'événement
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Configuration terminée }
 */
export async function POST(request: Request) {
  try {
    const payload = await validateRequest(request);
    const ownerId = payload?.ownerId || "default";
    const config = await SetupService.finalize(String(ownerId));

    return createSuccessResponse(config, "SETUP_FINALIZED", "Event configuration finalized");
  } catch (error) {
    return handleApiError(error);
  }
}
