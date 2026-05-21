import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/guests/{guestId}:
 *   get:
 *     summary: Get guest by ID
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Guest data
 *   put:
 *     summary: Update guest
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Guest updated
 *   delete:
 *     summary: Delete guest
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
export const GET = apiHandler(async (req: NextRequest, params: { guestId: string }) => {
  return withAuth(req, async () => {
    const g = await prisma.guest.findUnique({ where: { id: params.guestId }, include: { event: true } });
    if (!g) throw new NotFoundError('Guest not found');
    return NextResponse.json({ success: true, data: g });
  });
});
export const PUT = apiHandler(async (req: NextRequest, params: { guestId: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const g = await prisma.guest.update({ where: { id: params.guestId }, data: { fullName: body.fullName, email: body.email, phone: body.phone, status: body.status } });
    return NextResponse.json({ success: true, data: g });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { guestId: string }) => {
  return withAuth(req, async () => {
    await prisma.guest.delete({ where: { id: params.guestId } });
    return new NextResponse(null, { status: 204 });
  });
});
