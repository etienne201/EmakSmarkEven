import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/guests/{guestId}/invite-link:
 *   get:
 *     tags: ["Invités - Gestion"]
 *     summary: Générer le lien d'invitation pour un invité
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lien d'invitation }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { guestId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://invitation.smartevent.com";
    const inviteLink = `${baseUrl}/guest?id=${guestId}&event=${ownerId}`;

    return createSuccessResponse({ inviteLink }, "INVITE_LINK_GENERATED");
  } catch (error) {
    return handleApiError(error);
  }
}
