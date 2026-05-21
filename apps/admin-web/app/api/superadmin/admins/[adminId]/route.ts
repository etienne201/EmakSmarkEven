import { NextResponse } from "next/server";
import { AdminService } from "@backend/services/admin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/superadmin/admins/{adminId}:
 *   get:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Récupérer un administrateur spécifique
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Détails de l'administrateur }
 *   patch:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Mettre à jour un administrateur
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Administrateur mis à jour }
 *   delete:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Supprimer un administrateur
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Administrateur supprimé }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { adminId } = await params;
    const admin = await prisma.admins.findUnique({
      where: { id: adminId },
      include: { event: true }
    });

    if (!admin) throw new AppError("Admin not found", 404);

    // Sanitize sensitive fields
    const { passwordHash, ...safeAdmin } = admin as any;

    return createSuccessResponse(safeAdmin, "ADMIN_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { adminId } = await params;
    const data = await request.json();

    // Remove sensitive, immutable or non-existent fields
    const { id, role, password, eventId, ...updateData } = data;
    
    if (password) {
      (updateData as any).passwordHash = password;
    }

    const updatedAdmin = await prisma.admins.update({
      where: { id: adminId },
      data: updateData
    });

    // Sanitize
    const { passwordHash, ...safeAdmin } = updatedAdmin as any;

    return createSuccessResponse(safeAdmin, "ADMIN_UPDATED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { adminId } = await params;

    // We use a transaction or manual delete to ensure all related data is handled if needed
    // For now, simple delete (cascading should be handled in Prisma schema)
    await prisma.admins.delete({
      where: { id: adminId }
    });

    return createSuccessResponse(null, "ADMIN_DELETED", "Admin deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
