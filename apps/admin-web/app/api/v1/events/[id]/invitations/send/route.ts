import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../../backend/middlewares/auth';
/**
 * @openapi
 * /api/v1/events/{id}/invitations/send:
 *   post:
 *     summary: Send an invitation to a single guest
 *     tags: [Invitations]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Invitation sent
 */
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const { guestId } = await req.json();
    // TODO: Generate invitation, send email/SMS
    return NextResponse.json({ success: true, message: 'Invitation sent', data: { eventId: params.id, guestId } });
  });
});
