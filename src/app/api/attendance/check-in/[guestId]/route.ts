import { NextResponse } from "next/server";
import { CheckinService } from "@backend/services/checkin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/attendance/check-in/{guestId}:
 *   delete:
 *     tags: ["Suivi & Présences"]
 *     summary: Annuler une présence (Check-in)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: ownerId
 *         schema: { type: string }
 *     responses:
 *       200: { description: Check-in annulé }
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const payload = await AuthGuard.staff(request);
    const { guestId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    await CheckinService.cancelCheckIn(String(ownerId), guestId);
    return createSuccessResponse(null, "CHECKIN_CANCELLED");
  } catch (error) {
    return handleApiError(error);
  }
}
