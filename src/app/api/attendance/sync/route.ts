import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/attendance/sync:
 *   post:
 *     tags: ["Suivi & Présences"]
 *     summary: Synchroniser les présences collectées hors-ligne
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [records]
 *             properties:
 *               records: { type: array, items: { type: object } }
 *               ownerId: { type: string }
 *     responses:
 *       200: { description: Synchronisation réussie }
 */
export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { records, ownerId = payload.ownerId } = await request.json();

    const attendance = await Storage.getAttendance(ownerId);
    // Simple merge logic
    const merged = [...attendance];
    records.forEach((rec: any) => {
      if (!merged.find(m => m.guestId === rec.guestId && m.timestamp === rec.timestamp)) {
        merged.push(rec);
      }
    });

    await Storage.saveAttendance(merged, ownerId);
    await Storage.saveLog(ownerId, "ATTENDANCE_SYNC", { count: records.length });

    return createSuccessResponse(null, "SYNC_SUCCESS", `${records.length} records synchronized`);
  } catch (error) {
    return handleApiError(error);
  }
}
