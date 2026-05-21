import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/guests:
 *   get:
 *     summary: List guests for an event
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of guests
 *   post:
 *     summary: Add a guest to an event
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Guest added
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const guests = await prisma.guest.findMany({ where: { eventId: params.id }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: guests });
  });
});
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const guest = await prisma.guest.create({ data: { eventId: params.id, fullName: body.fullName, email: body.email, phone: body.phone } });
    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  });
});
