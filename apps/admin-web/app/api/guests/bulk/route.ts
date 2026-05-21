import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";
import { BulkGuestActionSchema } from "@backend/validations";

export async function PATCH(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const body = await request.json();
    
    // Validation Zod
    const { guestIds, data, ownerId = payload.ownerId } = BulkGuestActionSchema.parse(body);

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const guests = await Storage.getGuests(String(ownerId));
    const updated = guests.map((g: any) =>
      guestIds.includes(g.id.toString()) ? { ...g, ...data } : g
    );

    await Storage.saveGuests(updated, String(ownerId));
    return createSuccessResponse(null, "BULK_UPDATE_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const body = await request.json();
    
    // Validation Zod
    const { guestIds, ownerId = payload.ownerId } = BulkGuestActionSchema.parse(body);

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      throw new AppError("Unauthorized", 401);
    }

    const guests = await Storage.getGuests(String(ownerId));
    const filtered = guests.filter((g: any) => !guestIds.includes(g.id.toString()));

    await Storage.saveGuests(filtered, String(ownerId));
    return createSuccessResponse(null, "BULK_DELETE_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}
