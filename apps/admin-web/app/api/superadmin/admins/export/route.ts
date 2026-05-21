import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/superadmin/admins/export:
 *   get:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Exporter la liste des administrateurs (JSON)
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Fichier JSON des admins }
 */
export async function GET(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const admins = await prisma.admins.findMany({
      include: { event: true }
    });

    return NextResponse.json(admins, {
      headers: {
        "Content-Disposition": "attachment; filename=admins.json"
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
