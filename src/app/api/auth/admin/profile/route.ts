import { NextResponse } from "next/server";
import { AdminService } from "@backend/services/admin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/auth/admin/profile:
 *   get:
 *     tags: ["Admin - Profil"]
 *     summary: Récupérer son propre profil
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: ownerId
 *         schema: { type: string }
 *         description: Optionnel. ID de l'admin (si non fourni, utilise l'ID du token)
 *     responses:
 *       200: { description: Profil récupéré }
 *   put:
 *     tags: ["Admin - Profil"]
 *     summary: Mettre à jour son propre profil
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Profil mis à jour }
 */
export async function GET(req: Request) {
  try {
    const payload = await AuthGuard.admin(req);
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId") || payload.uid;

    // Enforce that a regular admin can only see their own profile
    if (payload.role !== "super-admin" && ownerId !== payload.uid) {
      throw new AppError("Access denied: You can only view your own profile", 403);
    }

    const admin = await AdminService.getAdminById(ownerId);

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    // Sanitize
    const { passwordHash, ...safeAdmin } = admin as any;

    return createSuccessResponse(safeAdmin, "PROFILE_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const payload = await AuthGuard.admin(req);
    const body = await req.json();
    const { ownerId = payload.uid, name, email, phone, password } = body;

    // Enforce that a regular admin can only update their own profile
    if (payload.role !== "super-admin" && ownerId !== payload.uid) {
      throw new AppError("Access denied: You can only update your own profile", 403);
    }

    const updated = await AdminService.updateAdminProfile(ownerId, { name, email, phone, password });

    return createSuccessResponse(updated, "PROFILE_UPDATE_SUCCESS", "Profile updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
