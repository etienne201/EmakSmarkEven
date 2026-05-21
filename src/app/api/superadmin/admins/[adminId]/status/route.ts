import { prisma } from "@backend/prisma";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
/**
 * @swagger
 * /api/superadmin/admins/{adminId}/status:
 *   patch:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Changer le statut d'un administrateur
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, blocked] }
 *     responses:
 *       200: { description: Statut mis à jour }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { adminId } = await params;
    const { status } = await request.json();

    if (!["active", "blocked"].includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    const updatedAdmin = await prisma.admins.update({
      where: { id: adminId },
      data: { status: status as any }
    });

    return createSuccessResponse(updatedAdmin, "STATUS_UPDATED");
  } catch (error) {
    return handleApiError(error);
  }
}

