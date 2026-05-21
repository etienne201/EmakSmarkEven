import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";

/**
 * @swagger
 * /api/exports/guests:
 *   get:
 *     tags: ["Invités - Import/Export"]
 *     summary: Exporter la liste des invités (CSV/JSON)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [csv, json], default: csv }
 *     responses:
 *       200: { description: Fichier d'export }
 */
import { ExportFilterSchema } from "@backend/validations";

import { GuestService } from "@backend/services/guest.service";

export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { searchParams } = new URL(request.url);
    
    // Validation Zod des Query Params
    const { ownerId, format } = ExportFilterSchema.parse({
      ownerId: searchParams.get("ownerId") || payload.ownerId,
      format: searchParams.get("format") || "csv"
    });

    const guests = await GuestService.getGuests(String(ownerId));

    if (format === "json") {
      return NextResponse.json(guests);
    }

    // Basic CSV generation
    const header = "ID,Nom,Table,Statut RSVP,Check-in\n";
    const rows = guests.map((g: any) => `${g.id},${g.name},${g.tableId || ""},${g.rsvpStatus},${g.checkinStatus}`).join("\n");
    const csv = header + rows;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=guests_${ownerId}.csv`
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
