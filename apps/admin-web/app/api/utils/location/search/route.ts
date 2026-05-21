import { NextResponse } from "next/server";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/location/search:
 *   get:
 *     tags: ["Utilitaires & Système"]
 *     summary: Recherche d'adresses (Autocomplétion)
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste d'adresses }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  // Mock results for now
  const results = [
    { name: "Mairie de Paris", address: "Place de l'Hôtel de Ville, 75004 Paris" },
    { name: "Château de Versailles", address: "Place d'Armes, 78000 Versailles" }
  ].filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()));

  return createSuccessResponse(results, "LOCATIONS_FOUND");
}
