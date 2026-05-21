import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/attendance/bundle:
 *   get:
 *     tags: ["Suivi & Présences"]
 *     summary: Récupérer le pack complet pour check-in hors-ligne
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Pack de synchronisation }
 */
export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const ownerId = payload.ownerId;

    const guests = await Storage.getGuests(String(ownerId));
    const attendance = await Storage.getAttendance(String(ownerId));

    return createSuccessResponse({
      guests: guests.map((g: any) => ({ id: g.id, uuid: g.uuid, name: g.name, table: g.table })),
      attendance,
      timestamp: new Date().toISOString()
    }, "BUNDLE_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
