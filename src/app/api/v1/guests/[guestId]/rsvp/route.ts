import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import prisma from '../../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/guests/{guestId}/rsvp:
 *   post:
 *     summary: RSVP for a guest (confirm or decline)
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: RSVP recorded
 */
export const POST = apiHandler(async (req: NextRequest, params: { guestId: string }) => {
  const body = await req.json();
  const guest = await prisma.guest.findUnique({ where: { id: params.guestId } });
  if (!guest) throw new NotFoundError('Guest not found');
  const status = body.attending ? 'confirmed' : 'declined';
  const updated = await prisma.guest.update({ where: { id: params.guestId }, data: { status } });
  return NextResponse.json({ success: true, data: updated });
});
