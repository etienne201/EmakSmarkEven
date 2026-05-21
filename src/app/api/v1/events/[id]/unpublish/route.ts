import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/unpublish:
 *   post:
 *     summary: Unpublish an event
 *     tags: [Publishing]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event unpublished
 */
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.event.update({ where: { id: params.id }, data: { status: 'draft' } });
    await prisma.eventPublish.update({ where: { eventId: params.id }, data: { unpublishedAt: new Date() } });
    return NextResponse.json({ success: true, message: 'Event unpublished' });
  });
});
