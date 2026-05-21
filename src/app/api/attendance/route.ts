import { NextResponse } from "next/server";
import { CheckinService } from "@backend/services/checkin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { paginate } from "@backend/utils/pagination";

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     tags: ["Suivi & Présences"]
 *     summary: Liste de toutes les présences enregistrées
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: ownerId
 *         required: false
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200: { description: Liste des présences }
 */
export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const attendance = await CheckinService.getAttendance(String(ownerId));
    
    // Map database fields to the format expected by the frontend AttendanceList
    const mappedAttendance = attendance.map(rec => ({
      guestId: rec.id,
      name: rec.fullName,
      status: "Présent", // Default since it's in the attendance list
      tableNumber: (rec.table as any)?.number,
      tableName: rec.table?.name,
      timestamp: rec.checkedInAt?.toISOString() || new Date().toISOString()
    }));

    const paginated = paginate(mappedAttendance, { page, limit });
    return createSuccessResponse(paginated, "ATTENDANCE_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestId } = body;

    if (!guestId) {
      throw new AppError("Guest ID is required", 400);
    }

    // We use GuestService.checkIn which only needs the guestId (public-safe)
    const { GuestService } = await import("@backend/services/guest.service");
    const updatedGuest = await GuestService.checkIn(guestId, "manual");

    return createSuccessResponse(
      {
        id: updatedGuest.id,
        fullName: updatedGuest.fullName,
        checkinStatus: updatedGuest.checkinStatus,
        checkedInAt: updatedGuest.checkedInAt
      },
      "CHECKIN_SUCCESS",
      "Presence recorded successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
