import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/attendance/clear:
 *   post:
 *     tags: ["Suivi & Présences"]
 *     summary: Réinitialiser toutes les présences d'un événement
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ownerId]
 *             properties:
 *               ownerId: { type: string }
 *     responses:
 *       200: { description: Présences effacées }
 */
export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { ownerId = payload.ownerId } = await request.json();

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    await Storage.saveAttendance([], String(ownerId));
    await Storage.saveLog(String(ownerId), "ATTENDANCE_CLEAR_ALL");

    return createSuccessResponse(null, "ATTENDANCE_CLEARED");
  } catch (error) {
    return handleApiError(error);
  }
}
