import { NextResponse } from "next/server";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/mairie/search:
 *   get:
 *     tags: ["Utilitaires & Système"]
 *     summary: Recherche de mairies (France)
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des mairies }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  // Simulation of a public API call (e.g. etablissements-publics.api.gouv.fr)
  const results = [
    { name: `Mairie de ${city || "Paris"}`, phone: "01 00 00 00 00", email: `contact@${city || "paris"}.fr` }
  ];

  return createSuccessResponse(results, "MAIRIES_FOUND");
}
