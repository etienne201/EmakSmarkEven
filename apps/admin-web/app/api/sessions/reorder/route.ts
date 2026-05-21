import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";
import { SessionReorderSchema } from "@backend/validations";

export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const body = await request.json();
    
    // Validation Zod
    const { sessions, ownerId = payload.ownerId } = SessionReorderSchema.parse(body);

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const config = await Storage.getEventConfig(String(ownerId));
    if (!config) throw new AppError("Event not found", 404);

    // Extraction des IDs pour la réorganisation
    const sessionIds = sessions.map(s => s.id);

    const reordered = sessionIds.map((id: string) =>
      config.ceremonies.find((s: any) => s.id === id)
    ).filter(Boolean);

    config.ceremonies = reordered;
    await Storage.saveEventConfig(config);

    return createSuccessResponse(reordered, "SESSIONS_REORDERED");
  } catch (error) {
    return handleApiError(error);
  }
}
