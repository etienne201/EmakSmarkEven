import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/system/uptime:
 *   get:
 *     tags: ["Utilitaires & Système"]
 *     summary: Récupérer l'uptime du serveur
 *     responses:
 *       200: { description: Uptime en secondes }
 */
export async function GET() {
  return createSuccessResponse({ uptime: process.uptime() }, "UPTIME_FETCHED");
}
