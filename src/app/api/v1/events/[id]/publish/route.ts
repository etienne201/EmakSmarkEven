import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/publish:
 *   post:
 *     summary: Publish an event
 *     tags: [Publishing]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event published
 */
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.event.update({ where: { id: params.id }, data: { status: 'published' } });
    await prisma.eventPublish.upsert({ where: { eventId: params.id }, update: { publishedAt: new Date(), unpublishedAt: null }, create: { eventId: params.id, publishedAt: new Date() } });
    return NextResponse.json({ success: true, message: 'Event published' });
  });
});
