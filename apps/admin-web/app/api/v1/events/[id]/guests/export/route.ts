import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/guests/export:
 *   post:
 *     summary: Export guests list
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Exported guest list
 */
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const guests = await prisma.guest.findMany({ where: { eventId: params.id } });
    return NextResponse.json({ success: true, data: guests });
  });
});
