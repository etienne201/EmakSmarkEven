import { AdminLoginSchema } from "@backend/validations";
import { AdminService } from "@backend/services/admin.service";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     tags: ["Authentification"]
 *     summary: Connexion Admin (Organisateur)
 *     description: Authentification via event_id et mot de passe de l'événement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event_id, password]
 *             properties:
 *               event_id: { type: string, example: "UserEven" }
 *               password: { type: string, example: "User123@" }
 *     responses:
 *       200:
 *         description: Succès de la connexion. Retourne les tokens JWT.
 *       401:
 *         description: Identifiants invalides.
 *       404:
 *         description: Événement non trouvé.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation Zod
    const validatedData = AdminLoginSchema.parse(body);
    const identifier = validatedData.event_id || validatedData.email;

    const tokens = await AdminService.adminLogin(identifier!, validatedData.password);

    return createSuccessResponse({
      ...tokens,
      accessToken: tokens.token
    }, "AUTH_SUCCESS", "Admin logged in successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
