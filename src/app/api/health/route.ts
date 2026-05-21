import { NextResponse } from "next/server";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: ["Utilitaires & Système"]
 *     summary: Vérification de l'état du système
 *     responses:
 *       200: { description: Système opérationnel }
 */
export async function GET() {
  return createSuccessResponse({
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  }, "HEALTH_CHECK_OK");
}
