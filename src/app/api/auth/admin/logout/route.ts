import { NextResponse } from "next/server";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { validateRequest } from "@backend/auth";

/**
 * @swagger
 * /api/auth/admin/logout:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Déconnexion Admin
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 */
export async function POST(request: Request) {
  try {
    // Try to get payload but don't fail if unauthenticated
    const payload = await validateRequest(request);
    
    // Logic to invalidate token could go here if using a store
    return createSuccessResponse(null, "LOGOUT_SUCCESS", "Logged out successfully");
  } catch (error) {
    // Even if there's an error, we return success because the client is trying to clear state
    return createSuccessResponse(null, "LOGOUT_SUCCESS", "Logged out successfully");
  }
}
