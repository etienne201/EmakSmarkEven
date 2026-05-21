import { EventService } from "@backend/services/event.service";
import { AdminService } from "@backend/services/admin.service";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

export async function GET(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const events = await EventService.getAllEvents();
    return createSuccessResponse(events, "EVENTS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    const { ownerId, adminPassword, eventName, eventType } = await request.json();

    // 1. Create or sync Admin
    const admin = await AdminService.createAdmin({
      id: ownerId,
      email: `${ownerId.toLowerCase()}@example.com`, // Mock email if not provided
      name: eventName,
      password: adminPassword
    });

    // 2. Initialise Event
    const event = await EventService.saveConfig({
      adminId: admin.id,
      name: eventName,
      eventType: eventType || "wedding",
      date: new Date().toISOString().split('T')[0], // Today as default
      startTime: "18:00",
      city: "Unknown",
      venue: "Unknown",
      status: "draft",
      language: "fr"
    }, admin.id);

    return createSuccessResponse({ admin, event }, "EVENT_CREATED", "Event and Admin created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

