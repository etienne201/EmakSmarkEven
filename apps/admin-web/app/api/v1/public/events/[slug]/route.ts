import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import prisma from '../../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/public/events/{slug}:
 *   get:
 *     summary: Get public event info by slug
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Public event data
 */
export const GET = apiHandler(async (req: NextRequest, params: { slug: string }) => {
  const event = await prisma.event.findUnique({ where: { slug: params.slug }, include: { themes: true } });
  if (!event || event.status !== 'published') throw new NotFoundError('Event not found');
  return NextResponse.json({ success: true, data: event });
});
