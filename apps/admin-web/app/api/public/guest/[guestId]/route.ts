import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { prisma } from "@backend/prisma";

/**
 * @swagger
 * /api/public/guest/{guestId}:
 *   get:
 *     tags: ["Public - Accès Invités"]
 *     summary: Récupérer les informations complètes d'un invité (invitation, programme, options de présence)
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *         description: UUID de l'invité
 *     responses:
 *       200:
 *         description: Informations publiques de l'invité avec programme et options de présence
 *       404:
 *         description: Invité non trouvé
 */

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const { guestId } = await params;

    let guest: any = null;

    if (isValidUUID(guestId)) {
      guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: {
          event: {
            include: {
              designs: {
                orderBy: { updatedAt: 'desc' },
                take: 1,
              },
              themes: true,
              sessions: {
                orderBy: { startAt: 'asc' },
              },
            }
          },
          checkins: {
            orderBy: { scannedAt: 'desc' },
            take: 1,
          }
        },
      });
    }

    if (!guest) throw new AppError("Guest not found", 404);

    const themes = guest.event?.themes || [];
    const themeTokens = (themes[0]?.tokens as any) || {};
    const logoUrl = themeTokens.logoUrl || null;

    const guestMeta = typeof guest.metadata === 'object' && guest.metadata ? (guest.metadata as Record<string, any>) : {};
    const eventMeta = typeof guest.event?.metadata === 'object' && guest.event?.metadata ? (guest.event?.metadata as Record<string, any>) : {};
    
    const tableVal = guestMeta.table || 0;
    const tableNameVal = guestMeta.tableName || (guestMeta.table ? `Table ${guestMeta.table}` : null);
    const langVal = guestMeta.lang || "fr";

    const hasCheckedIn = guest.status === 'checked_in' || guest.checkins.length > 0;
    const checkinStatusVal = hasCheckedIn ? 'arrived' : null;

    const latestCheckinStatus = guest.checkins[0] 
      ? (typeof guest.checkins[0].metadata === 'object' && guest.checkins[0].metadata 
          ? (guest.checkins[0].metadata as any).status 
          : "Présent")
      : null;

    // Build event sessions / programme
    const eventSessions = (guest.event?.sessions || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      venue: s.venue,
      startAt: s.startAt?.toISOString?.() || s.startAt,
      endAt: s.endAt?.toISOString?.() || s.endAt,
      capacity: s.capacity,
      metadata: s.metadata,
    }));

    // Build ceremonies from event metadata
    const ceremonies = eventMeta.ceremonies || [];

    // Build sessions from event metadata (admin-configured programme phases)
    const configSessions = eventMeta.sessions || [];

    // Attendance options configured by admin (defaults if not set)
    const defaultAttendanceOptions = [
      { id: "present", enabled: true },
      { id: "absent", enabled: true },
      { id: "honored", enabled: false },
      { id: "outOfSchedule", enabled: false },
    ];
    const attendanceOptions = eventMeta.attendanceOptions || defaultAttendanceOptions;

    // Event info for the programme
    const eventInfo = {
      title: guest.event?.title || "",
      eventType: guest.event?.eventType || "wedding",
      startDate: guest.event?.startDate?.toISOString?.() || guest.event?.startDate,
      endDate: guest.event?.endDate?.toISOString?.() || guest.event?.endDate,
      location: guest.event?.location || "",
      city: guest.event?.city || "",
      description: guest.event?.description || "",
    };

    return createSuccessResponse(
      {
        id: guest.id,
        title: guestMeta.title || "M./Mme",
        name: guest.fullName,
        fullName: guest.fullName,
        table: tableVal,
        tableId: tableVal,
        tableName: tableNameVal,
        lang: langVal,
        language: langVal,
        rsvpStatus: guest.status,
        checkinStatus: checkinStatusVal,
        attendanceStatus: latestCheckinStatus,
        eventId: guest.eventId,
        ownerId: guest.event?.createdById,
        logoUrl: logoUrl,
        smartDesign: eventMeta.smartDesign || null,
        layoutElements: eventMeta.layoutElements || null,
        // NEW: Event programme data
        eventInfo,
        eventSessions,
        ceremonies,
        configSessions,
        attendanceOptions,
      },
      "GUEST_FETCHED"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
