import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import prisma from '../../../../backend/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * @openapi
 * /api/v1/checkins:
 *   options:
 *     summary: CORS preflight
 *     tags: [Checkins]
 *     responses:
 *       204:
 *         description: No Content
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * @openapi
 * /api/v1/checkins:
 *   post:
 *     summary: Check in a guest (public — no auth required)
 *     tags: [Checkins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guestId]
 *             properties:
 *               guestId: { type: string }
 *               status: { type: string, enum: ["Présent", "Absent", "Honoré", "Hors horaire"] }
 *               location: { type: string }
 *               device: { type: string }
 *     responses:
 *       201:
 *         description: Guest checked in
 */
export const POST = apiHandler(async (req: NextRequest) => {
  const { guestId, location, device, status } = await req.json();

  if (!guestId) {
    return NextResponse.json({ success: false, error: 'guestId is required' }, { status: 400, headers: corsHeaders });
  }

  const statusValue = status || 'Présent';

  // For "Absent" status, don't mark as checked_in
  const guestStatus = statusValue === 'Absent' ? 'declined' : 'checked_in';

  const checkin = await prisma.guestCheckin.create({
    data: {
      guestId,
      location,
      device,
      metadata: { status: statusValue }
    }
  });
  await prisma.guest.update({ where: { id: guestId }, data: { status: guestStatus } });
  return NextResponse.json({ success: true, data: checkin }, { status: 201, headers: corsHeaders });
});
