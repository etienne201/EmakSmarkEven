import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";
import { paginate } from "@backend/utils/pagination";

/**
 * @swagger
 * /api/superadmin/users:
 *   get:
 *     tags: ["Super Admin - Hub Utilisateurs"]
 *     summary: Hub de gestion globale des utilisateurs (Admins & Super Admins)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [admin, super-admin] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200: { description: Liste globale des utilisateurs système }
 */
export async function GET(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let users: any[] = [];

    // Si on cherche des admins (ou tous)
    if (!role || role === "admin") {
      const admins = await prisma.admins.findMany({
        where: search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        include: {
          event: { select: { title: true, status: true } },
          _count: { select: { sessions: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      users = [...users, ...admins.map(u => ({ ...u, type: 'admin' }))];
    }

    // Si on cherche des super-admins (ou tous)
    if (!role || role === "super-admin") {
      const superAdmins = await prisma.superAdmin.findMany({
        where: search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        orderBy: { createdAt: 'desc' }
      });
      users = [...users, ...superAdmins.map(u => ({ ...u, type: 'super-admin' }))];
    }

    // Tri par date de création
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sanitisation
    const safeUsers = users.map(u => {
      const { passwordHash, totpSecret, ...safe } = u;
      return safe;
    });

    const paginated = paginate(safeUsers, { page, limit });

    return createSuccessResponse(paginated, "USERS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
