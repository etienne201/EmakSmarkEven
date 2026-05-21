import { NextResponse } from "next/server";
import { AuthService } from "@backend/services/auth.service";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/auth/admin/refresh:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Rafraîchir le token d'accès
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Nouveaux tokens }
 */
export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    const tokens = await AuthService.refreshTokens(refreshToken);
    return createSuccessResponse(tokens, "TOKEN_REFRESHED");
  } catch (error) {
    return handleApiError(error);
  }
}
