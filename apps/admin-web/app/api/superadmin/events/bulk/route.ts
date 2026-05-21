import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/superadmin/events/bulk:
 *   patch:
 *     tags: [" Super Admin - Supervision"]
 *     summary: Actions en masse sur les événements (Block/Unblock)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventIds, action]
 *             properties:
 *               eventIds: { type: array, items: { type: string } }
 *               action: { type: string, enum: [block, unblock] }
 *     responses:
 *       200: { description: Succès }
 *   delete:
 *     tags: [" Super Admin - Supervision"]
 *     summary: Suppression en masse des événements
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventIds]
 *     responses:
 *       200: { description: Suppression réussie }
 */
export async function PATCH(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const { eventIds, action } = await request.json();

    for (const id of eventIds) {
      const config = await Storage.getEventConfig(id);
      if (config) {
        config.isBlocked = action === "block";
        await Storage.saveEventConfig(config);
      }
    }

    return createSuccessResponse(null, "BULK_ACTION_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const { eventIds } = await request.json();

    for (const id of eventIds) {
      await Storage.deleteEvent(id);
    }

    return createSuccessResponse(null, "BULK_DELETE_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}
