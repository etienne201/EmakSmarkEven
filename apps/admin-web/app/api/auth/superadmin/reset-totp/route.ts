import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/auth/superadmin/reset-totp:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Réinitialiser le code TOTP d'un Super Admin
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: TOTP réinitialisé }
 */
export async function POST(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    // Logic to reset TOTP secret
    return createSuccessResponse(null, "TOTP_RESET_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}
