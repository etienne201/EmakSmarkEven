import { NextResponse } from "next/server";
import { EventService } from "@backend/services/event.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { Storage } from "@backend/storage/storage";

/**
 * @swagger
 * /api/event-config:
 *   get:
 *     tags: ["Configuration & Setup"]
 *     summary: Récupérer la configuration complète de l'événement
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: ownerId
 *         schema: { type: string }
 *     responses:
 *       200: { description: Configuration récupérée }
 *   post:
 *     tags: ["Configuration & Setup"]
 *     summary: Sauvegarder la configuration complète de l'événement
 *     security: [{ BearerAuth: [] }]
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let ownerId = searchParams.get("ownerId");

    // Get auth token payload if header is present
    let payload = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      try {
        payload = await AuthGuard.admin(request);
      } catch {
        // Ignore auth validation errors if ownerId is already supplied (e.g., public guest page)
      }
    }

    // NEW: If ownerId is provided in query, we allow public access (for guest page)
    // Otherwise, we require admin authentication to get the ownerId from the token
    if (!ownerId) {
      if (!payload) {
        payload = await AuthGuard.admin(request);
      }
      ownerId = payload.ownerId;
    } else {
      // If ownerId is provided in query, verify role/access if authenticated
      if (payload && payload.role !== "super-admin" && payload.ownerId !== ownerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Optional: Verify if the admin is blocked even for public views
      const isBlocked = await EventService.isBlocked(String(ownerId));
      if (isBlocked) {
        return NextResponse.json({ error: "Service suspended", isBlocked: true }, { status: 403 });
      }
    }

    const config = await EventService.getConfig(String(ownerId));
    if (!config) {
      return createSuccessResponse(null, "EVENT_NOT_CONFIGURED", "No configuration found for this event");
    }

    return createSuccessResponse(config, "EVENT_CONFIG_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    const data = await request.json();
    const ownerId = data.ownerId || payload.ownerId;

    if (ownerId !== payload.ownerId && payload.role !== "super-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await EventService.saveConfig(data, String(ownerId));
    
    // Activity Logging
    await Storage.saveLog(String(ownerId), "CONFIG_UPDATE", { 
      eventName: data.eventName,
      isFinalizing: !!data.isFinalizing 
    });

    if (data.isFinalizing) {
       await EventService.finalizeSetup(String(ownerId));
    }

    return createSuccessResponse(event, "EVENT_CONFIG_SAVED");
  } catch (error) {
    return handleApiError(error);
  }
}
