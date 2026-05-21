import { prisma } from "@backend/prisma";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
export async function GET(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    
    const [totalAdmins, activeAdmins, totalEvents, totalGuests, arrivedGuests] = await Promise.all([
      prisma.admins.count(),
      prisma.admins.count({ where: { lastLoginAt: { not: null }, status: 'active' } }),
      prisma.event.count(),
      prisma.guest.count(),
      prisma.guest.count({ where: { checkinStatus: 'arrived' } })
    ]);

    const stats = {
      totalAdmins,
      activeAdmins,
      totalEvents,
      activePasses: activeAdmins,
      globalAudience: totalGuests,
      totalCheckins: arrivedGuests,
      checkinRate: totalGuests > 0 ? (arrivedGuests / totalGuests * 100).toFixed(2) : 0
    };

    return createSuccessResponse(stats, "STATS_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

