import { AdminService } from "@backend/services/admin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/auth/sync:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Synchronise l'utilisateur Firebase avec PostgreSQL
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Utilisateur synchronisé avec succès
 */
export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.guest(request); // Vérifie juste si le token est valide
    
    const syncedAdmin = await AdminService.syncFirebaseUser(
      payload.uid,
      payload.email,
      payload.name
    );

    return createSuccessResponse(syncedAdmin, "USER_SYNCED", "User profiles synchronized successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
