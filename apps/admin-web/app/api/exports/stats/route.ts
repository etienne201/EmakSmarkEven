import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/exports/stats:
 *   get:
 *     tags: ["Exports & Assets"]
 *     summary: Exporter les statistiques de l'événement (JSON)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Fichier JSON des stats }
 */
export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    const stats = await Storage.getEventStats(String(ownerId));
    
    return NextResponse.json(stats, {
      headers: {
        "Content-Disposition": `attachment; filename=stats_${ownerId}.json`
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
