import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/qr/scan:
 *   post:
 *     summary: Scan a QR code and record the scan
 *     tags: [QR]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Scan recorded
 */
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const { eventId, guestId, deviceInfo, location } = await req.json();
    const scan = await prisma.qRScan.create({ data: { eventId, guestId, scannedById: user.id, scanType: 'checkin', deviceInfo, location } });
    return NextResponse.json({ success: true, data: scan });
  });
});
