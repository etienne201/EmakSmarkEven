import { NextResponse } from "next/server";
import { GuestService } from "@backend/services/guest.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/guests/{guestId}:
 *   get:
 *     tags: ["Invités - Gestion"]
 *     summary: Récupérer un invité spécifique
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Détails de l'invité }
 *   patch:
 *     tags: ["Invités - Gestion"]
 *     summary: Mettre à jour un invité
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Invité mis à jour }
 *   delete:
 *     tags: ["Invités - Gestion"]
 *     summary: Supprimer un invité
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Invité supprimé }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const payload = await AuthGuard.guest(request);
    const { guestId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    const guest = await GuestService.getGuestById(guestId, String(ownerId));
    if (!guest) throw new AppError("Guest not found", 404);

    return createSuccessResponse(guest, "GUEST_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { guestId } = await params;
    const data = await request.json();
    const ownerId = data.ownerId || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const saved = await GuestService.saveGuest({ ...data, id: guestId }, String(ownerId));
    return createSuccessResponse(saved, "GUEST_UPDATED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { guestId } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const guest = await GuestService.getGuestById(guestId, String(ownerId));
    await GuestService.deleteGuest(guestId, String(ownerId));
    
    if (guest) {
      await Storage.saveLog(String(ownerId), "GUEST_DELETE", { 
        fullName: guest.fullName,
        guestId 
      });
    }

    return createSuccessResponse(null, "GUEST_DELETED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const payload = await AuthGuard.admin(request);
    const { guestId } = await params;
    const { action, ownerId = payload.ownerId } = await request.json();

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    if (action === "regenerate-qr") {
      const guest = await GuestService.getGuestById(guestId, String(ownerId));
      if (!guest) throw new AppError("Guest not found", 404);
      
      // Update token to regenerate QR
      const updated = await prisma.guest.update({
        where: { id: guestId },
        data: { token: Math.random().toString(36).substring(2, 10).toUpperCase() }
      });
      
      return createSuccessResponse(updated, "QR_REGENERATED");
    }

    if (action === "send-invite") {
      // Logic for sending invite (mock for now)
      return createSuccessResponse(null, "INVITE_SENT_SUCCESS");
    }

    throw new AppError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

