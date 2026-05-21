import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/superadmin/admins/{adminId}/reset-password:
 *   post:
 *     tags: ["Super Admin - Gestion Comptes"]
 *     summary: Réinitialiser le mot de passe d'un administrateur
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
 *             required: [password]
 *             properties:
 *               password: { type: string }
 *     responses:
 *       200: { description: Mot de passe réinitialisé }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    await AuthGuard.superAdmin(request);
    const { adminId } = await params;
    const { password } = await request.json();

    if (!password || password.length < 6) {
      throw new AppError("Password too weak", 400);
    }

    const updatedAdmin = await prisma.admins.update({
      where: { id: adminId },
      data: { passwordHash: password } // Using plain text to match existing login implementation
    });

    return createSuccessResponse(updatedAdmin, "PASSWORD_RESET", "Password reset successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
