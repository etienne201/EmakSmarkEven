import { GuestSchema } from "@backend/validations";
import { GuestService } from "@backend/services/guest.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";
import { paginate } from "@backend/utils/pagination";

/**
 * @swagger
 * /api/guests:
 *   get:
 *     tags: ["Invités - Gestion"]
 *     summary: Liste paginée des invités
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: ownerId
 *         required: false
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des invités récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Guest' }
 *   post:
 *     tags: ["Invités - Gestion"]
 *     summary: Ajouter un invité
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Guest' }
 *     responses:
 *       201:
 *         description: Invité créé avec succès
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Guest' }
 *   delete:
 *     tags: ["Invités - Gestion"]
 *     summary: Supprimer tous les invités
 *     description: Nécessite le paramètre query 'all=true'.
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: all
 *         required: true
 *         schema: { type: string, enum: [true] }
 *     responses:
 *       200: { description: Tous les invités supprimés }
 */
export async function GET(request: Request) {
  try {
    const payload = await AuthGuard.staff(request);
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId") || payload.ownerId;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search")?.toLowerCase();

    // Security check: only Super Admin can view other owner's guests
    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    let guests = await GuestService.getGuests(String(ownerId));

    // Map database fields to the format expected by the frontend
    const mappedGuests = guests.map((g: any) => ({
      id: g.id,
      title: g.title || "M.", // Fallback title
      name: g.fullName,
      table: (g.table as any)?.number || 0,
      tableName: g.table?.name || "Non assignée",
      lang: g.language,
      email: g.email,
      phone: g.phone,
      rsvpStatus: g.rsvpStatus,
      checkinStatus: g.checkinStatus,
      invitationUrl: g.invitationUrl,
      token: g.token
    }));

    let filtered = mappedGuests;
    if (search) {
      filtered = mappedGuests.filter((g: any) =>
        g.name.toLowerCase().includes(search) ||
        g.tableName.toLowerCase().includes(search)
      );
    }

    const paginated = paginate(filtered, { page, limit });
    return createSuccessResponse(paginated, "GUESTS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const body = await request.json();
    
    // Validation Zod
    const guestData = GuestSchema.parse(body);
    const ownerId = guestData.ownerId || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError(`Forbidden: ownerId mismatch. Payload: ${payload.ownerId}, Request: ${ownerId}`, 403);
    }

    const saved: any = await GuestService.saveGuest(guestData, String(ownerId));
    await Storage.saveLog(String(ownerId), "GUEST_ADD", { fullName: saved.fullName });

    // Map to frontend format
    const mapped = {
      id: saved.id,
      title: saved.title || "M.",
      name: saved.fullName,
      table: (saved.table as any)?.number || 0,
      tableName: saved.table?.name || "Non assignée",
      lang: saved.language,
      email: saved.email,
      phone: saved.phone,
      rsvpStatus: saved.rsvpStatus,
      checkinStatus: saved.checkinStatus,
      invitationUrl: saved.invitationUrl,
      token: saved.token
    };

    return createSuccessResponse(mapped, "GUEST_CREATED", "Guest added successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    const ownerId = searchParams.get("ownerId") || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    if (all === "true") {
      await GuestService.clearAll(String(ownerId));
      await Storage.saveLog(String(ownerId), "GUESTS_CLEAR_ALL");
      return createSuccessResponse(null, "GUESTS_CLEARED", "All guests removed");
    }

    throw new AppError("Method not allowed without 'all' parameter on collection", 405);
  } catch (error) {
    return handleApiError(error);
  }
}
