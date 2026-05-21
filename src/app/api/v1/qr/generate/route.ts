import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
/**
 * @openapi
 * /api/v1/qr/generate:
 *   post:
 *     summary: Generate a QR code for a guest
 *     tags: [QR]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: QR code generated
 */
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req) => {
    const { guestId, eventId } = await req.json();
    const qrData = JSON.stringify({ guestId, eventId, ts: Date.now() });
    // TODO: Generate actual QR image with qrcode library
    return NextResponse.json({ success: true, data: { qrPayload: qrData } });
  });
});
