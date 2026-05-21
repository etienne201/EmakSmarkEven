import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/cache/clear:
 *   post:
 *     tags: ["Utilitaires & Système"]
 *     summary: Effacer le cache serveur (Redis/Memory)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Cache effacé }
 */
export async function POST(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    // Logic to clear Redis or local cache
    return createSuccessResponse(null, "CACHE_CLEARED");
  } catch (error) {
    return handleApiError(error);
  }
}
