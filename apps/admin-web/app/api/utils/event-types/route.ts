import { NextResponse } from "next/server";
import { EVENT_TYPES } from "@backend/eventConfig";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/event-types:
 *   get:
 *     tags: ["Utilitaires & Système"]
 *     summary: Liste des types d'événements supportés
 *     responses:
 *       200: { description: Liste des types }
 */
export async function GET() {
  return createSuccessResponse(EVENT_TYPES, "EVENT_TYPES_FETCHED");
}
