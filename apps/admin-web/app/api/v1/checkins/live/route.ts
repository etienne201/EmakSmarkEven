import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/checkins/live:
 *   get:
 *     summary: Get live checkin feed (last 50)
 *     tags: [Checkins]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Live checkin data
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async () => {
    const live = await prisma.guestCheckin.findMany({ take: 50, orderBy: { scannedAt: 'desc' }, include: { guest: true } });
    return NextResponse.json({ success: true, data: live });
  });
});
