import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/checkins:
 *   get:
 *     summary: List checkins for an event
 *     tags: [Checkins]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of checkins
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const checkins = await prisma.guestCheckin.findMany({
      where: { guest: { eventId: params.id } },
      include: { guest: true },
      orderBy: { scannedAt: 'desc' }
    });

    const mapped = checkins.map((c) => {
      const g = c.guest;
      const meta = typeof g.metadata === 'object' && g.metadata ? (g.metadata as Record<string, any>) : {};
      const checkinMeta = typeof c.metadata === 'object' && c.metadata ? (c.metadata as Record<string, any>) : {};

      return {
        guestId: c.guestId,
        name: meta.name || g.fullName || "",
        status: checkinMeta.status || "Présent",
        tableNumber: meta.table || 0,
        tableName: meta.tableName || (meta.table ? `Table ${meta.table}` : "Non assigné"),
        timestamp: c.scannedAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  });
});

