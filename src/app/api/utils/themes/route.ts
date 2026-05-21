import { NextResponse } from "next/server";
import { PRESET_PALETTES } from "@backend/eventConfig";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/themes:
 *   get:
 *     tags: ["Utilitaires & Système"]
 *     summary: Liste des palettes de couleurs prédéfinies
 *     responses:
 *       200: { description: Liste des thèmes }
 */
export async function GET() {
  return createSuccessResponse(PRESET_PALETTES, "THEMES_FETCHED");
}
