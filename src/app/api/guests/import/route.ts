import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/guests/import:
 *   post:
 *     tags: ["Invités - Import/Export"]
 *     summary: Importer des invités en masse (JSON)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guests]
 *             properties:
 *               guests: { type: array, items: { type: object } }
 *               ownerId: { type: string }
 *     responses:
 *       200: { description: Import réussi }
 */
export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { guests, ownerId = payload.ownerId } = await request.json();

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const currentGuests = await Storage.getGuests(ownerId);
    // Basic deduplication or merging logic
    const updatedGuests = [...currentGuests, ...guests.map((g: any, i: number) => ({
      ...g,
      id: currentGuests.length + i + 1,
      uuid: crypto.randomUUID()
    }))];

    await Storage.saveGuests(updatedGuests, ownerId);
    await Storage.saveLog(ownerId, "GUESTS_IMPORT_MASSIVE", { count: guests.length });

    return createSuccessResponse(null, "GUESTS_IMPORTED", `${guests.length} guests imported successfully`);
  } catch (error) {
    return handleApiError(error);
  }
}
