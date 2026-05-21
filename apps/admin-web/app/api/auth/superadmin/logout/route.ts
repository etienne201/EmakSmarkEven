import { NextResponse } from "next/server";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";

/**
 * @swagger
 * /api/auth/superadmin/logout:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Déconnexion Super Admin
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 */
export async function POST(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    return createSuccessResponse(null, "LOGOUT_SUCCESS", "Logged out successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
