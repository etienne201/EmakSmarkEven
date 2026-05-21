import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/tables/{tableId}/assign:
 *   post:
 *     tags: [" Tables & Plan de salle"]
 *     summary: Assigner un invité à une table
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema: { type: string }
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
 *     responses:
 *       200: { description: Assignation réussie }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { tableId } = await params;
    const { guestId, ownerId = payload.ownerId } = await request.json();

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    // Update guest record
    const guests = await Storage.getGuests(ownerId);
    const guestIndex = guests.findIndex((g: any) => g.id.toString() === guestId.toString());

    if (guestIndex === -1) throw new AppError("Guest not found", 404);

    const tables = await Storage.getTables(ownerId);
    const table = tables.find((t: any) => t.id === tableId);

    if (!table) throw new AppError("Table not found", 404);

    guests[guestIndex].table = parseInt(table.number);
    guests[guestIndex].tableName = table.name;

    await Storage.saveGuests(guests, ownerId);
    await Storage.saveLog(ownerId, "TABLE_ASSIGN", { guestId, tableId });

    return createSuccessResponse(guests[guestIndex], "GUEST_ASSIGNED");
  } catch (error) {
    return handleApiError(error);
  }
}
