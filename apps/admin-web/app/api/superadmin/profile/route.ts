import { prisma } from "@backend/prisma";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/superadmin/profile:
 *   get:
 *     tags: ["Super Admin - Profil"]
 *     summary: Récupère le profil du Super Admin système
 *     description: |
 *       Retourne les informations d'identité du compte Super Admin root.
 *       Nécessite un jeton Bearer valide avec le rôle `super-admin`.
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Succès - Profil récupéré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Non autorisé - Jeton manquant ou invalide.
 *       403:
 *         description: Accès refusé - Rôle insuffisant.
 *   patch:
 *     tags: ["Super Admin - Profil"]
 *     summary: Met à jour les informations du Super Admin
 *     description: Permet de modifier le pseudonyme et l'image de profil du compte système.
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: 
 *                 type: string
 *                 example: "EMAKO Master"
 *               avatarUrl: 
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *     responses:
 *       200:
 *         description: Succès - Profil mis à jour.
 *       400:
 *         description: Erreur - Données invalides.
 */

export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.superAdmin(request);
    
    let profile = await prisma.superAdmin.findUnique({
      where: { id: payload.uid }
    });

    if (!profile) {
      // Create default profile if not exists
      profile = await prisma.superAdmin.create({
        data: {
          id: payload.uid,
          email: payload.email || "superadmin@smartevent.com",
          name: "Super Administrateur",
          passwordHash: "managed-in-env", // Placeholder
          isActive: true
        } as any
      });
    }

    return createSuccessResponse({
      name: (profile as any).name,
      email: (profile as any).email,
      avatarUrl: (profile as any).photoURL,
      role: "super-admin"
    }, "PROFILE_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await AuthGuard.superAdmin(request);
    const body = await request.json();
    
    const updated = await prisma.superAdmin.update({
      where: { id: payload.uid },
      data: {
        name: body.name,
        photoURL: body.avatarUrl
      } as any
    });

    await Storage.saveLog("system", "SUPERADMIN_PROFILE_UPDATE", { 
      name: body.name,
      actor: payload.email 
    });

    return createSuccessResponse({
      name: (updated as any).name,
      avatarUrl: (updated as any).photoURL
    }, "PROFILE_UPDATED");
  } catch (error) {
    return handleApiError(error);
  }
}
