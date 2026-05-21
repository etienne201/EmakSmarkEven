import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import prisma from '../../../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/public/events/{slug}/sessions:
 *   get:
 *     summary: Get public event sessions
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event sessions
 */
export const GET = apiHandler(async (req: NextRequest, params: { slug: string }) => {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } });
  if (!event || event.status !== 'published') throw new NotFoundError('Event not found');
  const sessions = await prisma.eventSession.findMany({ where: { eventId: event.id }, orderBy: { startAt: 'asc' } });
  return NextResponse.json({ success: true, data: sessions });
});
