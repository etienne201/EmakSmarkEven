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
    const checkins = await prisma.guestCheckin.findMany({ where: { guest: { eventId: params.id } }, include: { guest: true }, orderBy: { scannedAt: 'desc' } });
    return NextResponse.json({ success: true, data: checkins });
  });
});
