import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/checkins:
 *   post:
 *     summary: Check in a guest
 *     tags: [Checkins]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Guest checked in
 */
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req) => {
    const { guestId, location, device } = await req.json();
    const checkin = await prisma.guestCheckin.create({ data: { guestId, location, device } });
    await prisma.guest.update({ where: { id: guestId }, data: { status: 'checked_in' } });
    return NextResponse.json({ success: true, data: checkin }, { status: 201 });
  });
});
