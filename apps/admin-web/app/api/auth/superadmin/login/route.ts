import { NextResponse } from "next/server";
import { AdminService } from "@backend/services/admin.service";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/auth/superadmin/login:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Connexion Super Admin
 *     description: Authentification via email, mot de passe et TOTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "superadmin@smartevent.com" }
 *               password: { type: string, example: "Superadmin123@" }
 *               totp: { type: string, description: "Code de double authentification" }
 *     responses:
 *       200:
 *         description: Succès de la connexion. Retourne les tokens JWT.
 *       401:
 *         description: Identifiants invalides.
 */
export async function POST(request: Request) {
  try {
    const { email, password, totp } = await request.json();
    const tokens = await AdminService.superAdminLogin(email, password, totp);

    return createSuccessResponse(tokens, "AUTH_SUCCESS", "Super Admin logged in successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
