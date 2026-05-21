import { CreateAdminSchema } from "@backend/validations";
import { AdminService } from "@backend/services/admin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { paginate } from "@backend/utils/pagination";

/**
 * @swagger
 * /api/superadmin/admins:
 *   get:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Liste tous les administrateurs (organisateurs)
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste paginée des administrateurs.
 *   post:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Créer un nouvel administrateur
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, email, name, password]
 *             properties:
 *               id: { type: string, description: "Identifiant unique (ex: MariageJean)" }
 *               email: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [admin, staff], default: admin }
 *     responses:
 *       201:
 *         description: Administrateur créé.
 */
export async function GET(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const admins = await AdminService.getAdmins();
    const paginated = paginate(admins, { page, limit });

    // Sanitize sensitive fields
    paginated.items = paginated.items.map((admin: any) => {
      const { passwordHash, ...safeAdmin } = admin;
      return safeAdmin;
    });

    return createSuccessResponse(paginated, "ADMINS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const body = await request.json();
    
    // Validation Zod
    const adminData = CreateAdminSchema.parse(body);

    const newAdmin = await AdminService.createAdmin(adminData);

    return createSuccessResponse(newAdmin, "ADMIN_CREATED", "Admin created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
