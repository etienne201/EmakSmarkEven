import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/auth/admin/change-password:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Changer le mot de passe (Admin connecté)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Mot de passe changé }
 */
export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { oldPassword, newPassword } = await request.json();

    const config = await Storage.getEventConfig(String(payload.ownerId));
    if (!config) throw new AppError("Event not found", 404);

    if (config.adminPassword !== oldPassword) {
      throw new AppError("Incorrect old password", 401);
    }

    config.adminPassword = newPassword;
    await Storage.saveEventConfig(config);
    await Storage.saveLog(String(payload.ownerId), "PASSWORD_CHANGE");

    return createSuccessResponse(null, "PASSWORD_CHANGED");
  } catch (error) {
    return handleApiError(error);
  }
}
