import { NextResponse } from "next/server";
import { CheckinService } from "@backend/services/checkin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     tags: ["Suivi & Présences"]
 *     summary: Enregistrer une présence via scan QR Code
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guestId]
 *             properties:
 *               guestId: { type: string }
 *               ownerId: { type: string }
 *               status: { type: string, default: "Présent" }
 *     responses:
 *       200: { description: Présence enregistrée }
 */
export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.staff(request);
    const { guestId, ownerId = payload.ownerId, status = "Présent" } = await request.json();

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const entry = await CheckinService.checkIn(ownerId, guestId, status);
    return createSuccessResponse(entry, "CHECKIN_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}
