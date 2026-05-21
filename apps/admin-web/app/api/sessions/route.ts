import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     tags: ["Configuration & Setup"]
 *     summary: Liste des sessions de l'événement
 *     responses:
 *       200: { description: Liste des sessions }
 *   post:
 *     tags: ["Configuration & Setup"]
 *     summary: Ajouter une session
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Session créée }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || "default";

    const config = await Storage.getEventConfig(ownerId);
    return createSuccessResponse(config?.ceremonies || [], "SESSIONS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const data = await request.json();
    const ownerId = data.ownerId || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const config = await Storage.getEventConfig(ownerId);
    if (!config) throw new AppError("Event not found", 404);

    const newSession = { ...data, id: crypto.randomUUID() };
    config.ceremonies = [...(config.ceremonies || []), newSession];

    await Storage.saveEventConfig(config);
    await Storage.saveLog(ownerId, "SESSION_ADD", { name: newSession.title });

    return createSuccessResponse(newSession, "SESSION_CREATED");
  } catch (error) {
    return handleApiError(error);
  }
}
